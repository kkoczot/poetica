"use server";
import { connectToDB } from "../mongoose";
import Author from "../models/user.model";
import Folder from "../models/folder.model";
import Poem from "../models/poem.model";
import { revalidatePath } from "next/cache";
import { fetchUser, getUsersIds } from "./user.actions";
import mongoose, { PipelineStage } from "mongoose";

interface Params {
  folderId: string,
  authorId: string,
  title: string,
  type: string,
  content: string,
  tag1: string,
  tag2: string,
  tag3: string,
}

export async function createPoem({ folderId, authorId, title, type, content, tag1, tag2, tag3 }: Params) {
  connectToDB();

  const tags = [tag1];
  if (tag2) tags.push(tag2);
  if (tag3) tags.push(tag3);

  try {
    const createdPoem = await Poem.create({
      authorId,
      folderId,
      title,
      type,
      content,
      tags,
    });

    await Folder.findByIdAndUpdate(folderId, {
      $push: { poems: createdPoem._id },
    });
    revalidatePath("/profile/");
  } catch (error) {
    throw new Error("Failed to create a folder");
  }
}

interface EditParams {
  poemId: string,
  title: string,
  content: string,
  type: string | undefined,
  folderDest: string | undefined,
  oldFolder: string,
  tag1: string,
  tag2: string,
  tag3: string,
}

export async function editPoem({ poemId, title, content, type, folderDest, oldFolder, tag1, tag2, tag3 }: EditParams) {
  connectToDB();

  const tags = [tag1];
  if (tag2) tags.push(tag2);
  if (tag3) tags.push(tag3);

  try {
    const fol = folderDest ? folderDest : oldFolder;
    await Poem.findByIdAndUpdate(
      poemId,
      {
        $set: {
          title: title,
          tags: tags,
          content: content,
          type: type,
          folderId: fol,
        }
      }
    );
    if (folderDest) {
      await Folder.findByIdAndUpdate(
        oldFolder,
        { $pull: { poems: poemId } }
      );
      await Folder.findByIdAndUpdate(
        folderDest,
        { $push: { poems: poemId } }
      )
    };
    revalidatePath("/profile/");
  } catch (error: any) {
    throw new Error("Failed to edit folder");
  }
}

export async function checkIfRightFolder(poemId: string, folderId: string) {
  connectToDB();
  try {
    const isFolderRight = await Folder.exists({ _id: folderId, poems: { $in: poemId } });
    return Boolean(isFolderRight);
  } catch (error) {
    return false;
  }
}

export async function fetchPoem(poemId: string) {
  connectToDB();
  try {
    const res = await Poem.findById(poemId);
    return res;
  } catch (error: any) {
    throw new Error("Failed to fetch poem data");
  }
}

export async function fetchPoemComplex(userId: string | null, action: "count" | "get", skip?: number, limit?: number) {
  connectToDB();
  try {
    let ids = { _id: null };
    if (userId) {
      ids = await getUsersIds(userId, "Clerk");
    }
    const folders = await Folder.find({ shared: true }).select("_id");
    const folderIds = folders.map(folder => folder._id);
    if (action === "count") {
      const amount = await Poem.countDocuments({ authorId: { $ne: ids._id }, folderId: { $in: folderIds } });
      return amount;
    }
    if (action === "get") {
      if (skip == 0) limit = 2;

      const poem = await Poem.find({ authorId: { $ne: ids._id }, folderId: { $in: folderIds } })
        .select("title type content")
        .skip(skip!)
        .limit(limit!)
        .populate({ path: "folderId", select: "title" })
        .populate({ path: "authorId", select: "id image username" })
        .lean().sort({ "_id": "desc" });
      return JSON.parse(JSON.stringify(poem));
    }
  } catch (error: any) {
    throw new Error("Error occured in fetchPoemComplex: ", error.message);
  }
}

export async function deletePoem(poemId: string) {
  connectToDB();
  try {
    const { folderId } = await fetchPoem(poemId);
    await Folder.findByIdAndUpdate(folderId, {
      $pull: { poems: poemId }
    });
    await Poem.findByIdAndDelete(poemId);
    await Author.updateMany({}, { $pull: { likes: poemId } });

    revalidatePath("/profile/");
  } catch (error: any) {
    throw new Error("Failed to delete folder");
  }
}

export async function handleLike(authUserId: string | undefined, poemId: string, action: "check" | "handle") { //Chyba git jest xd
  async function check() {
    const contains = await Author.findOne({ id: authUserId, likes: { $in: poemId } });
    return Boolean(contains);
  }

  connectToDB();
  if (!authUserId) return;
  // console.log("authUserId: ", authUserId);
  // console.log("poemId: ", poemId);
  // console.log("action: ", action);
  try {
    if (action === "check") {
      const contains = await check();
      return contains;
    }
    else if (action === "handle") {
      const contains = await check();
      const { _id } = await fetchUser(authUserId);
      if (contains) { /*Delete poemId from Author.likes && Delete Author._id from Poem.favourite*/
        await Author.findOneAndUpdate({ id: authUserId }, { $pull: { likes: poemId } });
        await Poem.findByIdAndUpdate(poemId, { $pull: { favourite: _id } });
      }
      else { /*Add poemId to Author.likes && Add Author._id to Poem.favourite*/
        await Author.findOneAndUpdate({ id: authUserId }, { $push: { likes: poemId } });
        await Poem.findByIdAndUpdate(poemId, { $push: { favourite: _id } });
      }
    }
  } catch (error: any) {
    throw new Error("Failed to handle action connected to likes!");
  } finally {
    revalidatePath(`/profile/${authUserId}/`)
  }
}

export async function totalFetchLikedPoems(authorId: string, poemIds: string[]) { //użyć populate i chat GPT
  mongoose.set('strictPopulate', false);
  connectToDB();
  try {
    let results = await Promise.all(
      poemIds.map(async (poemId) => {
        const poem = await Poem.findById(poemId)
          .populate({ path: "authorId", select: "username name image id" })
          .populate({ path: "folderId", select: "title shared" });

        if (poem?.folderId?.shared || poem?.authorId?.id === authorId) return poem;
        return null;
      }));
    const data = results.filter((poem: any[]) => poem !== null);
    // console.log("data: ", data);
    console.log(`
      -----------------------------------------------
      > Funkcja pobrania danych została wykonana!
      -----------------------------------------------
      `)
    return data || [];
  } catch (error) {
    return [];
  }
}

export async function everyTypeLikedCountPoems(authorId: string, poemIds: string[]) {
  connectToDB();
  try {
    let results = await Promise.all(
      poemIds.map(async (poemId) => {
        const poem = await Poem.findById(poemId)
          .select("title type")
          .populate({ path: "authorId", select: "id" })
          .populate({ path: "folderId", select: "shared" });

        if (poem?.folderId?.shared || poem?.authorId?.id == authorId) return poem;
        return null;
      }));

    const data = results.filter((poem: { _id: string, folderId: { _id: string, shared: boolean }, title: string, type: string }) => poem !== null);
    const count: { [type: string]: number } = {};
    data.map((poem: { _id: string, folderId: { _id: string, shared: boolean }, title: string, type: string }) => {
      if (!count[poem?.type]) count[poem.type] = 1;
      else count[poem.type] += 1;
    })
    // console.log("Data: ", data);
    // console.log("Count: ", count);
    return count;
  } catch (error) {
    return {};
  }
}

export async function getTopThreePoemsType(authorId: string) {
  function getTopThree(count: Record<string, number>): {[type: string]: number} {
    const entries = Object.entries(count);
  
    const sortedEntries = entries.sort((a, b) => b[1] - a[1]);
  
    const sortedEntriesMax = sortedEntries.slice(0, 3).map(([key]) => key);

    const limitedCount: { [type: string]: number} = {};

    sortedEntriesMax.map(entry => limitedCount[entry] = count[entry])

    return limitedCount;
  }
  
  connectToDB();
  try {
    const userData = await Author.findOne({ id: authorId }).select("folders")
      .populate({
        path: "folders",
        populate: {
          path: "poems",
          model: "Poem",
          select: "type",
        },
        select: "title",
      })
      .select("username folders");

    const poemsData = userData.folders.map((folder: any) => folder.poems).flat();
    const count: { [type: string]: number } = {};
    poemsData.map((poem: { _id: string, type: string }) => {
      if (!count[poem?.type]) count[poem.type] = 1;
      else count[poem.type] += 1;
    });

    return getTopThree(count);
  } catch (error) {
    return {}
  }
}

export async function searchSimple(text: string) {
  connectToDB();
  try {
    const folders = await Folder.find({ shared: true }).select("_id");
    const folderIds = folders.map(folder => folder._id);

    const foundPoems = await Poem
      .find({ title: { $regex: text }, folderId: { $in: folderIds } })
      .select("title type content authorId folderId")
      .limit(5)
      .populate({ path: "authorId", select: "id" });
    const plainPoems = foundPoems.map(poem => JSON.parse(JSON.stringify(poem)));
    return plainPoems || [];
  } catch (error) {
    throw new Error("Failed to search for poems in searchSimple()");
  }
}

export async function searchComplex(
  { text, poemType, userTags, sortOrder, page, dpp }:
    { text: string, poemType: string, userTags: string, sortOrder: string, page: number, dpp: number }
): Promise<[any[], number]> {
  connectToDB();

  try {
    const amountToSkip = (page - 1) * dpp;

    type SortOption = Record<string, 1 | -1>;

    let sortOption: SortOption | null = null;
    if (sortOrder === 'max') {
      sortOption = { favouritesCount: -1 };
    } else if (sortOrder === 'min') {
      sortOption = { favouritesCount: 1 };
    }
    const tagsArray: string[] = userTags.trim().split(" ").filter((tag: string) => tag.length > 3 && tag[0] == '#').map((tag: string) => tag.slice(1, tag.length));

    const folders = await Folder.find({ shared: true }).select("_id");
    const folderIds = folders.map(folder => folder._id);

    const pipeline: PipelineStage[] = [
      {
        $project: {
          title: 1,
          content: 1,
          authorId: 1,
          tags: 1,
          type: 1,
          folderId: 1,
          favouritesCount: { $size: '$favourite' },
        },
      },
      {
        $lookup: {
          from: 'authors',
          localField: 'authorId',
          foreignField: '_id',
          as: 'authorDetails',
        }
      },
      {
        $unwind: '$authorDetails',
      },
      {
        $project: {
          title: 1,
          content: 1,
          authorId: 1,
          tags: 1,
          type: 1,
          folderId: 1,
          favouritesCount: 1,
          'authorDetails.id': 1,
        },
      },
      {
        $match: {
          folderId: { $in: folderIds },
        },
      },
    ];

    if (text) {
      pipeline.push({
        $match: {
          title: { $regex: text, $options: 'i' },
        },
      })
    }

    if (poemType !== "any") {
      pipeline.push({
        $match: {
          type: poemType,
        },
      });
    }

    if (tagsArray.length) {
      pipeline.push({
        $match: {
          tags: { $in: tagsArray },
        },
      })
    }

    if (sortOption) {
      pipeline.push({ $sort: sortOption });
    }

    if (amountToSkip) {
      pipeline.push({ $skip: amountToSkip });
    }

    pipeline.push({ $limit: dpp });
    const poems = await Poem.aggregate(pipeline);
    const plainPoems = poems.map(poem => JSON.parse(JSON.stringify(poem)));

    let count = 0;
    if (poemType !== "any") {
      count = await Poem.countDocuments({ title: { $regex: text, $options: 'i' }, folderId: { $in: folderIds }, type: poemType });
    } else {
      count = await Poem.countDocuments({ title: { $regex: text, $options: 'i' }, folderId: { $in: folderIds } })
    }

    return [plainPoems, count];
  } catch (error: any) {
    throw new Error(`Error occured: `, error.message);
  }
}