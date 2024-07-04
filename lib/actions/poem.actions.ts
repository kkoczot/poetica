"use server";

import { connectToDB } from "../mongoose";
import Author from "../models/user.model";
import Folder from "../models/folder.model";
import Poem from "../models/poem.model";
import { revalidatePath } from "next/cache";
import { fetchUser, getUsersIds } from "./user.actions";
import mongoose from "mongoose";

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


export async function fetchPoem(poemId: string) {
  connectToDB();
  try {
    const res = await Poem.findById(poemId);
    return res;
  } catch (error: any) {
    throw new Error("Failed to fetch poem data");
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
  console.log("authUserId: ", authUserId);
  console.log("poemId: ", poemId);
  console.log("action: ", action);
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

export async function totalFetchLikedPoems(poemIds: string[]) { //użyć populate i chat GPT
  mongoose.set('strictPopulate', false);
  connectToDB();
  try {
    let results = poemIds.map(async (poemId) => {
      return await Poem.findById(poemId).populate({ path: "authorId", select: "username name image id" }).populate({ path: "folderId", select: "title shared" });
    });
    const data = await Promise.all(results);
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

export async function searchSimple(text: string) {
  connectToDB();
  try {
    const foundPoems = await Poem.find({ title: { $regex: text } }).select("title type content").limit(5);
    return foundPoems || [];
  } catch (error) {
    throw new Error("Failed to search for poems in searchSimple()");
  }
}

export async function searchComplex() {
  return null;
}