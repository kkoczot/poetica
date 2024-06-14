"use server";

import { revalidatePath } from "next/cache";
import Author from "../models/user.model";
import { connectToDB } from "../mongoose";
import { createFolder } from "./folder.actions";

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
    const similarAuthors = await Author.find({ followers: { $nin: [currentUser._id] }, _id: { $ne: currentUser._id }}).limit(5);
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
    const followedAuthors = await Author.find({ followers: { $in: [currentUser._id] }, _id: { $ne: currentUser._id }}).limit(5);
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