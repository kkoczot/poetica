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

export async function updateUser({ userId, username, name, bio, image, path, }: Params): Promise<void> {
  connectToDB();

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
    // .populate({path: "", model: })
  } catch (error) {
    throw new Error("Filed to fetch user: ");
  }
}

// !!! potrzeba rozwinąć funkcję by lepiej wyszukiwała userów
export async function fetchSimilarAuthors(userId: string) { // funkcja do poprawy - poprawić stopień zaawansowania | na razie jest git
  const currentUser = await fetchUser(userId);
  // console.log("currentUser: ", currentUser);
  try {
    connectToDB();
    const similarAuthors = await Author.find({ followers: { $nin: [currentUser._id] }, _id: { $ne: currentUser._id } }).limit(5);
    // console.log("similarAuthors: ", similarAuthors);
    return similarAuthors;
  } catch (error) {
    throw new Error("Failes to retrieve suggested users!");
  }
  /*
    kilka opcji jak postąpić, jaki algorytm wypracować 
    #1 wybrać po prostu losowo 5 userów (których currentUser nie followuje) i przesłać ich dane
    #2 wybrać autorów, których wiersze są lubiane przez currentUser (i których nie followuje)
    
    ## wybrać autorów, których nie followuje currentUser, ale są followani przez autorów followanych przez currentUser
    ## i których wiersze są lubiane przez currentUser lub losowo 5 userów
  */
  return "";
}

export async function fetchFollowedAuthors(userId: string) {
  const currentUser = await fetchUser(userId);
  try {
    connectToDB();
    const followedAuthors = await Author.find({ followers: { $in: [currentUser._id] }, _id: { $ne: currentUser._id } }).limit(5);
    return followedAuthors;
  } catch (error) {
    throw new Error("Failes to retrieve followed users!");
  }
}

export async function checkUserFollow(authUserId: string, userId: string) { //authUserId - actual user's id; userId - checked user's id
  connectToDB();
  try {
    const searchedUserId = await Author.findOne({ id: userId }).select("_id");
    // console.log("searchedUserId: ", searchedUserId);
    const isFollowed = await Author.findOne({ id: authUserId, following: { $in: searchedUserId } }).exec();
    // console.log("isFollowed: ", isFollowed);
    return isFollowed ? true : false; // true - searchedUser is followed | false - searchedUser is not followed
  } catch (error) {
    throw new Error("Failed to check if user is followed");
  }
}

// !!! brakuje jedynie odświeżenia by user wiedział, że funkcja zadziałała
export async function handleUserFollow(authUserId: string, userId: string) {
  // Funkcja działa
  connectToDB();
  try {
    const isFollowed = await checkUserFollow(authUserId, userId);
    const searchedUserId = await Author.findOne({ id: userId }).select("_id followers");
    const authUser = await Author.findOne({ id: authUserId }).select("_id following");
    if (isFollowed && (searchedUserId._id !== authUser._id)) {
      // searchedUserId -> delete your id from this user's followers
      await Author.findByIdAndUpdate(searchedUserId._id, {
        $pull: { followers: authUser._id }
      });
      // you -> delete searchedUserId from your following
      await Author.findByIdAndUpdate(authUser._id, {
        $pull: { following: searchedUserId._id }
      })

    } else if (!isFollowed && (searchedUserId._id !== authUser._id)) {
      // searchedUserId -> add your id to this user's followers
      await Author.findByIdAndUpdate(searchedUserId._id, {
        $push: { followers: authUser._id }
      });
      // you -> add searchedUserId to your following
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

export async function suggestedAuthors( userId: string | undefined, condition: "fame" | "amount" | "similar" ) {
  function removeElements(firstArray: any[], secondArray: any[]) {
    return firstArray.filter(id => !secondArray.includes(id));
  };
  connectToDB();
  try {
    let ids = { _id: null };
    if (userId) {
      ids = await getUsersIds(userId, "Clerk");
    }
    if (condition === "amount") {
      // pobranie id folderów, które są udostępnione
      const folders = await Folder.find({ shared: true }).select("_id");
      const folderIds = folders.map(folder => folder._id);

      const skipAuthors = await Author.find({followers: { $in: [ids?._id] }}, "_id");
      console.log("skipAuthors: ", skipAuthors);

      // pobranie wszystkich wierszy
      const poems = await Poem.find({ _id: { $nin: folderIds}, authorId: { $nin: skipAuthors } }, "authorId");

      // forEach z wierszy, który dodaje nowe authorId jako klucze do authorsAndAmount i jako wartość daje ile razy dane authorId się powtarza
      interface AuthorsAndAmount {
        [key: string]: number; // or any other type you expect for the values
      };
      const authorsAndAmount: AuthorsAndAmount = {};
      poems.forEach((poem: any) => {
        if (!authorsAndAmount[String(poem.authorId)]) {
          authorsAndAmount[String(poem.authorId)] = 1;
        } else {
          authorsAndAmount[String(poem.authorId)] = authorsAndAmount[String(poem.authorId)] + 1
        }
      });

      // sortowanie authorsAndAmount względem największej ilości powtórzonych authorId i ograniczenie wyniku do 30 największych
      let entries = Object.entries(authorsAndAmount);
      entries.sort((a: any[], b: any[]) => b[1] - a[1]);
      entries = entries.slice(0, 29);
      const sortedAuthors = Object.fromEntries(entries);
      // console.log(sortedAuthors);

      // wyodrębnienie authorId (kluczy) czyli id autorów
      const idKeys = Object.keys(sortedAuthors);

      // wyodrębnione do array id (klucze) są mapowane i zwracane są większe dane o najlepszych autorach 
      const authorsDataRes = idKeys.map(async (idKey) => await Author.findOne({_id: idKey}, "username id image"));
      let authorData = await Promise.all(authorsDataRes);

      // do danych autorów dodawana jest informacja o ilości napisanych wierszy
      authorData = authorData.map((aData) => {
        const plainAData = aData.toObject();
        plainAData["poemsCount"] = sortedAuthors[String(aData._id)];
        return plainAData;
      });
      
      return authorData || [];
    }
    if (condition === "fame") {
      // top 30 the most famous authors
      console.log(ids);
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

      if (!followedAuthors.following.length) return [];
      // console.log("followedAuthors: ", followedAuthors);
      let authorsFollowedNext = followedAuthors.following.map( async (fAuthor: any) => await Author.findById(fAuthor, {following: 1, _id: 0}));
      authorsFollowedNext = await Promise.all(authorsFollowedNext);

      // 1) zalogować się jako slowacki      
      // pobrać id follołowanych autorów przez zalogowanego usera
      // zmapować id follołowanych autorów i pobrać array z id autorów, których oni follołują
      // stworzyć z tych id seta (te id mają się nie powtarzać i mają być inne od id autorów follołowanych przez zalogowanego usera )
      // zmapować tak otrzymane id aby mieć potrzebne info o podobnych autorach, których również warto follołować
      
      authorsFollowedNext = authorsFollowedNext.map((list: any) => list.following).flat();

      interface AuthorsAndAmount {
        [key: string]: number; // or any other type you expect for the values
      };
      const authorsFollowedNextAmount: AuthorsAndAmount = {};
      authorsFollowedNext.forEach((aFN: any) => {
        if (!authorsFollowedNextAmount[String(aFN)]) {
          authorsFollowedNextAmount[String(aFN)] = 1;
        } else {
          authorsFollowedNextAmount[String(aFN)] = authorsFollowedNextAmount[String(aFN)] + 1
        }
      });
      // console.log(authorsFollowedNextAmount);

      let toFollowKeys = Object.keys(authorsFollowedNextAmount);
      if (toFollowKeys.includes(userId.toString())) {
        toFollowKeys = removeElements(toFollowKeys, [userId.toString()]);
      }
      toFollowKeys = removeElements(toFollowKeys, followedAuthors.following.map((fId: any) => fId.toString()));

      const authorsDataRes = toFollowKeys.map(async (idKey) => await Author.findOne({_id: idKey}, "username id image"));
      authorsFollowedNext = await Promise.all(authorsDataRes);

      // console.log("authorsFollowedNext (before): ", authorsFollowedNext);
      // console.log("authorsFollowedNextAmount (before): ", authorsFollowedNextAmount);
      authorsFollowedNext = authorsFollowedNext.map((aData: any) => {
        const plainAData = aData.toObject();
        plainAData["similarAuthors"] = authorsFollowedNextAmount[String(aData._id)];
        return plainAData;
      }).slice(0, 29);
      // console.log("authorsFollowedNext (final): ", authorsFollowedNext);
      return authorsFollowedNext;
    }
  } catch (error: any) {
    throw new Error("Encountered a new error in the function suggestedAuthors(): ", error.message);
  }
}

export async function searchComplex({text, sortOrder, page, dpp}: {text: string, sortOrder: string, page: number, dpp: number}): Promise<[any[], number]> { //dpp - display per page
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