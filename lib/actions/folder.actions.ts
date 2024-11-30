"use server";

import { connectToDB } from "../mongoose";
import Author from "../models/user.model";
import Folder from "../models/folder.model";
import Poem from "../models/poem.model";
import { revalidatePath } from "next/cache";
import { PipelineStage } from "mongoose";

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

// export async function checkIfFolderExists(folderId: string) {
//   connectToDB();
//   try {
//     const exists = await Author.findById(folderId);
//     return true;
//   } catch (error) {
//     return false;
//   }
// }

export async function checkIfRightUser(folderId: string, userId: string) {
  connectToDB();
  try {
    const isAuthorRight = await Author.exists({ id: userId, folders: { $in: folderId } });
    return Boolean(isAuthorRight);
  } catch (error) {
    return false;
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

export async function checkWhatTypeOfFolder(folderId: string) {
  function findMostNumerousTags(typeCounts: { [tag: string]: number } ): string[] {
    const maxCount = Math.max(...Object.values(typeCounts));
    return Object.keys(typeCounts).filter((tag: string) => typeCounts[tag] === maxCount);
  }
  
  connectToDB();
  try {
    /*
    STH:  {
      _id: new ObjectId('661af2fffbed546a44689bff'),
      poems: [
        { _id: new ObjectId('662822bb81e45c9edcd9d560'), type: 'Limerick' },
        { _id: new ObjectId('6628211c81e45c9edcd9d548'), type: 'Limerick' },
        { _id: new ObjectId('66676a3ce52134571eef972d'), type: 'Limerick' }
      ]
    }
    */

    const typeAmount: { [type: string]: number } = {};
    const folderPoemInfo = await Folder.findById(folderId).select("poems").populate({path: "poems", model: "Poem", select: "type"}).exec();

    folderPoemInfo.poems?.map((poem: {_id: string, type: string}) => {
      if(!typeAmount[poem.type]) typeAmount[poem.type] = 1;
      else typeAmount[poem.type] += 1;
    });

    const mostNumerousTags = findMostNumerousTags(typeAmount);
    // console.log("typeAmount: ", typeAmount);
    // console.log("mostNumerousTags: ", mostNumerousTags);
    return mostNumerousTags;
  } catch (error) {
    throw new Error("Failed to check what kind of poems given folder has");
  }
}

export async function searchSimple(text: string) {
  connectToDB();
  try {
    const foundFolders = await Folder.find({ title: { $regex: text }, shared: true }).select("title authorId").populate({path: "authorId", select: "id"});
    const plainFolders = foundFolders.map(folder => JSON.parse(JSON.stringify(folder)));
    return plainFolders || [];
  } catch (error) {
    throw new Error("Failed to search for folders in searchSimple()");
  }
}

export async function searchComplex({text, sortOrder, page, dpp}: {text: string, sortOrder: string, page: number, dpp: number}): Promise<[any[], number]> { //dpp - display per page
  connectToDB();
  try {
    const amountToSkip = (page - 1) * dpp;

    type SortOption = Record<string, 1 | -1>;

    let sortOption: SortOption | null = null;
    if (sortOrder === 'max') {
      sortOption = { poemsCount: -1 };
    } else if (sortOrder === 'min') {
      sortOption = { poemsCount: 1 };
    }

    const pipeline: PipelineStage[] = [
      {
        $project: {
          title: 1,
          authorId: 1,
          shared: 1,
          poemsCount: { $size: '$poems' },
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
          authorId: 1,
          shared: 1,
          poemsCount: 1,
          'authorDetails.id': 1,
        },
      },
      {
        $match: {
          title: { $regex: text, $options: 'i' },
          shared: true,
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

    const folders = await Folder.aggregate(pipeline);
    const count = await Folder.countDocuments({ title: { $regex: text, $options: 'i' }, shared: true });

    const plainFolders = folders.map(folder => JSON.parse(JSON.stringify(folder)));
    
    return [plainFolders, count];
  } catch (error: any) {
    throw new Error("New error occured: ", error.message);
  }
}