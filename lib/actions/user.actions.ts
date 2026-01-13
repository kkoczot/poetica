"use server";

import { revalidatePath } from "next/cache";
import Author from "../models/user.model";
import { connectToDB } from "../mongoose";
import { createFolder } from "./folder.actions";
import { PipelineStage } from "mongoose";
import Folder from "../models/folder.model";
import Poem from "../models/poem.model";

interface Params {
  userId: string,
  username: string,
  name: string,
  bio: string,
  image: string,
  path: string,
}

/*
jest jakiś błąd - gdzieś albo w funkcji updateUser, albo w /onboarding albo w AccountProfile
da się stworzyć użytkownika w Clerk, potem przechodzi do onboarding, ale tam nie działa kliknięcie continue
pomimo dobrego wypełnienia formularza

Co to może być:
- najpewniej jakiś błąd w funkcji poniżej, może upsert nie działa?

Co sprawdzić:
- sprawdzić czy już istniejący autor może aktualizować info na swoim profilu -> może

- tylko nowy user nie może zatwierdzić swoich danych
*/

export async function updateUser({ userId, username, name, bio, image, path, }: Params): Promise<void> {
  connectToDB();
  console.log(userId, "\n\n", username, "\n\n",name, "\n\n",bio, "\n\n",image, "\n\n",path)
  try {
    await Author.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      { upsert: true }
    )
    await checkIfNewUser(userId);
    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error("Failed to create/update author:", error.message);
  }

}

export async function checkIfNewUser(userId: string) {
  connectToDB();
  try {
    const user = await Author.findOne({ id: userId }).select("username folders").exec();
    if (user?.folders.length < 1) await createFolder({
      authorId: user._id.toString(),
      title: "Working",
      description: `This is your personal working folder. It cannot be deleted and it's work cannot be shared. Created automatically for ${user.username}.`,
      shared: false,
      firstFolder: true,
    });
  } catch (error) {
    throw new Error("Failed to create first folder");
  }
}

export async function checkIfUserExists(userId: string) {
  connectToDB();
  try {
    const exists = await Author.exists({ id: userId });
    return exists;
  } catch (error) {
    return false;
  }
}

export async function fetchUser(userId: string) {
  try {
    connectToDB();
    return await Author.findOne({ id: userId })
  } catch (error) {
    throw new Error("Filed to fetch user: ");
  }
}

export async function checkIfOnboarded(userId: string | null) {
  try {
    connectToDB();
    let ids = { _id: null };
    if (userId) {
      ids = await getUsersIds(userId, "Clerk");
      if (ids == null) return -1;
    }
    return 0;
  } catch (error) {
    throw new Error("Failed to check if user is onboarded");
  }
}

export async function fetchSimilarAuthors(userId: string) {
  const currentUser = await fetchUser(userId);
  try {
    connectToDB();
    const similarAuthors = await Author.find({ followers: { $nin: [currentUser._id] }, _id: { $ne: currentUser._id } }).limit(5);
    return similarAuthors;
  } catch (error) {
    throw new Error("Failes to retrieve suggested users!");
  }
}

export async function fetchFollowedAuthors(userId: string) {
  const currentUser = await fetchUser(userId);
  if (currentUser == null) return [];
  try {
    connectToDB();
    const followedAuthors = await Author.find({ followers: { $in: [currentUser._id] }, _id: { $ne: currentUser._id } }).limit(5);
    return followedAuthors;
  } catch (error) {
    throw new Error("Failes to retrieve followed users!");
  }
}

export async function checkUserFollow(authUserId: string, userId: string) {
  connectToDB();
  try {
    const searchedUserId = await Author.findOne({ id: userId }).select("_id");
    const isFollowed = await Author.findOne({ id: authUserId, following: { $in: searchedUserId } }).exec();
    return isFollowed ? true : false;
  } catch (error) {
    throw new Error("Failed to check if user is followed");
  }
}

export async function handleUserFollow(authUserId: string, userId: string) {
  connectToDB();
  try {
    const isFollowed = await checkUserFollow(authUserId, userId);
    const searchedUserId = await Author.findOne({ id: userId }).select("_id followers");
    const authUser = await Author.findOne({ id: authUserId }).select("_id following");
    if (isFollowed && (searchedUserId._id !== authUser._id)) {
      await Author.findByIdAndUpdate(searchedUserId._id, {
        $pull: { followers: authUser._id }
      });
      await Author.findByIdAndUpdate(authUser._id, {
        $pull: { following: searchedUserId._id }
      })

    } else if (!isFollowed && (searchedUserId._id !== authUser._id)) {
      await Author.findByIdAndUpdate(searchedUserId._id, {
        $push: { followers: authUser._id }
      });
      await Author.findByIdAndUpdate(authUser._id, {
        $push: { following: searchedUserId._id }
      })
    }
  } catch (error) {
    throw new Error("Failed to make a follower and followed state");
  }
}

export async function getUsersIds(id: string, convertFrom: "MongoDB" | "Clerk") {
  let idToReturn = null;
  if (convertFrom === "Clerk") {
    idToReturn = await Author.findOne({ id: id }).select("_id");
  } else {
    idToReturn = await Author.findOne({ _id: id }).select("id");
  }
  return idToReturn;
}

export async function searchSimple(text: string) {
  connectToDB();
  try {
    const foundAuthors = await Author.find({ username: { $regex: text } }).select("id image username").limit(5);
    const plainAuthors = foundAuthors.map(author => JSON.parse(JSON.stringify(author)));
    return plainAuthors || [];
  } catch (error) {
    throw new Error("Failed to search for authors in searchSimple()");
  }
}

export async function suggestedAuthors( userId: string | undefined, condition: "fame" | "amount" | "similar", limitSimilar?: number ) {
  function removeElements(firstArray: any[], secondArray: any[]) {
    return firstArray.filter(id => !secondArray.includes(id));
  };
  connectToDB();
  try {
    let ids = { _id: null };
    if (userId) {
      ids = await getUsersIds(userId, "Clerk");
      if (ids == null) return [];
    }
    if (condition === "amount") {
      const folders = await Folder.find({ shared: true }).select("_id");
      const folderIds = folders.map(folder => folder._id);

      const skipAuthors = await Author.find({followers: { $in: [ids?._id] }}, "_id");
      // console.log("skipAuthors: ", skipAuthors);

      // pobranie wszystkich wierszy
      const poems = await Poem.find({ _id: { $nin: folderIds}, authorId: { $nin: [...skipAuthors, ids?._id] } }, "authorId");

      interface AuthorsAndAmount {
        [key: string]: number;
      };
      const authorsAndAmount: AuthorsAndAmount = {};
      poems.forEach((poem: any) => {
        if (!authorsAndAmount[String(poem.authorId)]) {
          authorsAndAmount[String(poem.authorId)] = 1;
        } else {
          authorsAndAmount[String(poem.authorId)] = authorsAndAmount[String(poem.authorId)] + 1
        }
      });

      let entries = Object.entries(authorsAndAmount);
      entries.sort((a: any[], b: any[]) => b[1] - a[1]);
      entries = entries.slice(0, 29);
      const sortedAuthors = Object.fromEntries(entries);

      const idKeys = Object.keys(sortedAuthors);

      const authorsDataRes = idKeys.map(async (idKey) => await Author.findOne({_id: idKey}, "username id image"));
      let authorData = await Promise.all(authorsDataRes);

      authorData = authorData.map((aData) => {
        const plainAData = aData.toObject();
        plainAData["poemsCount"] = sortedAuthors[String(aData._id)];
        return plainAData;
      });
      
      return authorData || [];
    }
    if (condition === "fame") {
      // top 30 the most famous authors
      // console.log(ids);
      const authors = await Author.aggregate([
        {
          $match: {
            id: { $ne: userId },
            followers: { $nin: [ids?._id] }
          }
        },
        {
          $project: {
            id: 1,
            username: 1,
            image: 1,
            followersCount: { $size: "$followers" },
          },
        },
        {
          $sort: { followersCount: -1},
        },
        {
          $limit: 30,
        },
      ]);
      const plainAuthors = authors.map(author => JSON.parse(JSON.stringify(author)));
      return plainAuthors || [];
    }
    if (condition === "similar") {
      if (!userId) return [];
      const followedAuthors = await Author.findOne({id: userId}, {following: 1, _id: 0});

      if (!followedAuthors.following.length) {
        const topAuthors:any[] = await suggestedAuthors(userId, "fame");
        const authorsToDiscard = await Author.findOne({id: userId}).select("following");
        // console.log("authorsToDiscard: ", authorsToDiscard.following);
        // topAuthors.map((item: any) => console.log("item: ", item));
        const topAuthorsToFollow = topAuthors.filter((author: any) => !authorsToDiscard.following.includes(author.id) && author.id != userId);
        return topAuthorsToFollow;
      };
      // console.log("followedAuthors: ", followedAuthors);
      let authorsFollowedNext = followedAuthors.following.map( async (fAuthor: any) => await Author.findById(fAuthor, {following: 1, _id: 0}));
      authorsFollowedNext = await Promise.all(authorsFollowedNext);

      authorsFollowedNext = authorsFollowedNext.map((list: any) => list.following).flat();

      interface AuthorsAndAmount {
        [key: string]: number;
      };
      const authorsFollowedNextAmount: AuthorsAndAmount = {};
      authorsFollowedNext.forEach((aFN: any) => {
        if (!authorsFollowedNextAmount[String(aFN)]) {
          authorsFollowedNextAmount[String(aFN)] = 1;
        } else {
          authorsFollowedNextAmount[String(aFN)] = authorsFollowedNextAmount[String(aFN)] + 1
        }
      });

      let toFollowKeys = Object.keys(authorsFollowedNextAmount);
      const user_id = await getUsersIds(userId.toString(), "Clerk");
      if (toFollowKeys.includes(user_id?._id.toString())) {
        toFollowKeys = removeElements(toFollowKeys, [user_id._id.toString()]);
        if(!toFollowKeys.length) {
          const topAuthors:any[] = await suggestedAuthors(userId, "fame");
          const authorsToDiscard = await Author.findOne({id: userId}).select("following");
          const topAuthorsToFollow = topAuthors.filter((author: any) => !authorsToDiscard.following.includes(author.id) && author.id != userId);
          return topAuthorsToFollow || [];
        }
      }
      toFollowKeys = removeElements(toFollowKeys, followedAuthors.following.map((fId: any) => fId.toString()));

      const authorsDataRes = toFollowKeys.map(async (idKey) => await Author.findOne({_id: idKey}, "username id image"));
      authorsFollowedNext = await Promise.all(authorsDataRes);

      authorsFollowedNext = authorsFollowedNext.map((aData: any) => {
        const plainAData = aData.toObject();
        plainAData["similarAuthors"] = authorsFollowedNextAmount[String(aData._id)];
        return plainAData;
      }).slice(0, limitSimilar || 29);

      if(!authorsFollowedNext?.length) {
        authorsFollowedNext = await suggestedAuthors(userId, "fame");
        authorsFollowedNext.slice(0, limitSimilar || 29);
      }
      // console.log("authorsFollowedNext (final): ", authorsFollowedNext);
      return authorsFollowedNext;
    }
  } catch (error: any) {
    throw new Error("Encountered a new error in the function suggestedAuthors(): ", error.message);
  }
}

export async function searchComplex({text, sortOrder, page, dpp}: {text: string, sortOrder: string, page: number, dpp: number}): Promise<[any[], number]> {
  connectToDB();
  try {
    const amountToSkip = (page - 1) * dpp;

    type SortOption = Record<string, 1 | -1>;
    
    let sortOption: SortOption | null = null;
    if (sortOrder === 'max') {
      sortOption = { followersCount: -1 };
    } else if (sortOrder === 'min') {
      sortOption = { followersCount: 1 };
    }

    const pipeline: PipelineStage[] = [
      {
        $project: {
          username: 1,
          id: 1,
          image: 1,
          followersCount: { $size: '$followers' },
        },
      },
      {
        $match: {
          username: { $regex: text, $options: 'i' },
        },
      },
    ];

    if (sortOption) {
      pipeline.push({ $sort: sortOption });
    }
    if (amountToSkip) {
      pipeline.push({ $skip: amountToSkip });
    }
    pipeline.push({ $limit: dpp });

    const authors = await Author.aggregate(pipeline);
    const count = await Author.countDocuments({ username: { $regex: text, $options: 'i' } });

    const plainAuthors = authors.map(author => JSON.parse(JSON.stringify(author)));
    
    return [plainAuthors, count];
  } catch (error: any) {
    throw new Error("New error occured: ", error.message);
  }
}