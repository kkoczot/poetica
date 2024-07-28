"use server";

import Notifs from "../models/notifs.models";
import Author from "../models/user.model";
import { connectToDB } from "../mongoose";

export async function countUnreadNotifs(currentUserId: string | null) {
  connectToDB();
  try {
    if (!currentUserId) return 0;
    const amountOfNotifs = await Notifs.countDocuments();
    // console.log(" > amountOfNotifs: ", amountOfNotifs);
    const amountOfReadNotifs = await Author.findOne({ id: currentUserId }).select("readNotifs");
    // console.log(" > amountOfReadNotifs: ", amountOfReadNotifs);
    const unread = amountOfNotifs - amountOfReadNotifs.readNotifs.length;
    // console.log(" > unread: ", unread);
    return unread || 0;
  } catch (error: any) {
    throw new Error("New error occured in countUnreadNotifs: ", error.message);
  }
}

export async function handleNotifs(currentUserId: string): Promise<[any[], number]> {
  connectToDB();
  try {
    // console.log("---------------------------------------------------------");
    const unreadNotifs = await countUnreadNotifs(currentUserId);
    const notifs = await Notifs.find().sort({ createdAt: "desc" }).lean();
    // console.log(">>> unreadNotifs: ", unreadNotifs);
    // console.log(">>> notifs: ", notifs);

    // get the unread notifs' ids and push 'em into author's readnotifs field
    if (unreadNotifs) {
      const unreadNotifsIds = await Notifs.find().select("_id").sort({ createdAt: "desc" }).limit(unreadNotifs).lean();
      const notifIds = unreadNotifsIds.map(notif => notif._id); // Extracting _id from the array
      // console.log(" >>> !!! notifIds: ", notifIds);
      await Author.findOneAndUpdate(
        { id: currentUserId },
        { $push: { readNotifs: { $each: notifIds } } },
        { new: true }
      );
    }

    return [notifs, unreadNotifs];
  } catch (error: any) {
    throw new Error("New error occured in countUnreadNotifs: ", error.message);
  }
}