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
}

export async function createPoem({ folderId, authorId, title, type, content }: Params) {
  connectToDB();
  try {
    const createdPoem = await Poem.create({
      authorId,
      folderId,
      title,
      type,
      content,
    })

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
  oldFolder: string
}

export async function editPoem({ poemId, title, content, type, folderDest, oldFolder }: EditParams) {
  connectToDB();

  try {
    const fol = folderDest ? folderDest : oldFolder;
    await Poem.findByIdAndUpdate(
      poemId,
      {
        $set: {
          title: title,
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
      .populate({path: "folderId", select: "title"})
      .populate({path: "authorId", select: "id image username"})
      .lean();
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

export async function handleLike(authUserId: string | undefined, poemId: string, action: "check" | "handle") {
  async function check() {
    const contains = await Author.findOne({ id: authUserId, likes: { $in: poemId } });
    return Boolean(contains);
  }

  connectToDB();
  if (!authUserId) return;
  try {
    if (action === "check") {
      const contains = await check();
      return contains;
    }
    else if (action === "handle") {
      const contains = await check();
      const { _id } = await fetchUser(authUserId);
      if (contains) {
        await Author.findOneAndUpdate({ id: authUserId }, { $pull: { likes: poemId } });
        await Poem.findByIdAndUpdate(poemId, { $pull: { favourite: _id } });
      }
      else {
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

export async function totalFetchLikedPoems(poemIds: string[]) {
  mongoose.set('strictPopulate', false);
  connectToDB();
  try {
    let results = poemIds.map(async (poemId) => {
      return await Poem.findById(poemId).populate({ path: "authorId", select: "username name image id" }).populate({ path: "folderId", select: "title shared" });
    });
    const data = await Promise.all(results);
    return data || [];
  } catch (error) {
    return [];
  }
}

export async function searchSimple(text: string) {
  connectToDB();
  try {
    const folders = await Folder.find({ shared: true }).select("_id");
    const folderIds = folders.map(folder => folder._id);

    const foundPoems = await Poem
      .find({ title: { $regex: text }, folderId: { $in: folderIds } })
      .select("title type content authorId")
      .limit(5)
      .populate({ path: "authorId", select: "id" });
    const plainPoems = foundPoems.map(poem => JSON.parse(JSON.stringify(poem)));
    return plainPoems || [];
  } catch (error) {
    throw new Error("Failed to search for poems in searchSimple()");
  }
}

export async function searchComplex(
  { text, poemType, sortOrder, page, dpp }:
    { text: string, poemType: string, sortOrder: string, page: number, dpp: number }
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

    const folders = await Folder.find({ shared: true }).select("_id");
    const folderIds = folders.map(folder => folder._id);

    const pipeline: PipelineStage[] = [
      {
        $project: {
          title: 1,
          content: 1,
          authorId: 1,
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
          type: 1,
          folderId: 1,
          favouritesCount: 1,
          'authorDetails.id': 1,
        },
      },
      {
        $match: {
          title: { $regex: text, $options: 'i' },
          folderId: { $in: folderIds },
        },
      },
    ];

    if (poemType !== "any") {
      pipeline.push({
        $match: {
          type: poemType,
        },
      });
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