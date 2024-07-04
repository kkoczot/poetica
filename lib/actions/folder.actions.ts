"use server";

import { connectToDB } from "../mongoose";
import Author from "../models/user.model";
import Folder from "../models/folder.model";
import Poem from "../models/poem.model";
import { revalidatePath } from "next/cache";

interface Params {
  authorId: string,
  title: string,
  shared: boolean,
  description?: string,
  firstFolder?: boolean,
};

export async function createFolder({ authorId, title, description, firstFolder, shared }: Params) {
  connectToDB();
  try {
    const createdFolder = await Folder.create({
      authorId,
      title,
      description,
      shared,
      deletable: !firstFolder, //firstFolder - true - false - not deletable | false - true - deletable
    })

    await Author.findByIdAndUpdate(authorId, {
      $push: { folders: createdFolder._id },
    });

    revalidatePath("/profile/");
  } catch (error: any) {
    throw new Error(`Failed to create a folder: ${error.message}`);
  }
};

export async function editFolder({ folderId, title, description, shared }: { folderId: string, title: string, description: string, shared: boolean }) {
  connectToDB();

  try {
    await Folder.findOneAndUpdate(
      { _id: folderId },
      {
        $set: {
          title: title,
          description: description,
          shared: shared,
        }
      }
    );
    revalidatePath("/profile/");
  } catch (error: any) {
    throw new Error("Failed to edit folder");
  }
}

export async function deleteFolder(userId: string, folderId: string) {
  connectToDB();
  try {
    const workingFolder = await Author.findOne({ id: userId }).populate({ path: "folders", match: { deletable: false } }).exec();
    let poemsToWorkingFolder = await Poem.find({ folderId: folderId });
    poemsToWorkingFolder = poemsToWorkingFolder.map((p: any) => { return p._id });
    await Author.findOneAndUpdate({ userId }, {
      $pull: { folders: folderId }
    });
    await Folder.findByIdAndDelete(folderId);
    await Poem.updateMany({ folderId: folderId }, { $set: { folderId: workingFolder.folders[0]._id } });
    await Folder.findByIdAndUpdate(workingFolder.folders[0]._id, { $push: { poems: { $each: poemsToWorkingFolder } } })
    revalidatePath("/profile/");
  } catch (error: any) {
    throw new Error("Failed to drop folder X(");
  }
}

export async function fetchFolder(folderId: string) {
  connectToDB();
  try {
    const fethcedFolder = await Folder.findById(folderId);
    return fethcedFolder;
  } catch (error) {
    throw new Error("Failed to fetch folder data");
  }
};

export async function getAllUserFolders(userId: string) {
  connectToDB();
  try {
    const authorId = await Author.findOne({ id: userId }).select("_id").exec();
    return await Folder.find({ authorId });
  } catch (error) {
    throw new Error("Failed to reach all users folders");
  }
};

export async function searchSimple(text: string) {
  connectToDB();
  try {
    const foundFolders = await Folder.find({ title: { $regex: text } }).select("title").limit(5);
    return foundFolders || [];
  } catch (error) {
    throw new Error("Failed to search for folders in searchSimple()");
  }
}

export async function searchComplex() {
  return null;
}