"use server";

import Notifs from "../models/notifs.models";
import Author from "../models/user.model";
import { connectToDB } from "../mongoose";
import { getUsersIds } from "./user.actions";

export async function countUnreadNotifs(currentUserId: string | null) {
  connectToDB();
  try {
    if (!currentUserId) return 0;
    if (currentUserId) {
      let ids = { _id: null };
      ids = await getUsersIds(currentUserId, "Clerk");
      if (ids == null) return -1;
    }
    const amountOfNotifs = await Notifs.countDocuments();
    const amountOfReadNotifs = await Author.findOne({ id: currentUserId }).select("readNotifs");
    const unread = amountOfNotifs - amountOfReadNotifs.readNotifs.length;
    return unread || 0;
  } catch (error: any) {
    throw new Error("New error occured in countUnreadNotifs: ", error.message);
  }
}

export async function handleNotifs(currentUserId: string): Promise<[any[], number]> {
  connectToDB();
  try {
    const unreadNotifs = await countUnreadNotifs(currentUserId);
    const notifs = await Notifs.find().sort({ createdAt: "desc" }).lean();

    if (unreadNotifs) {
      const unreadNotifsIds = await Notifs.find().select("_id").sort({ createdAt: "desc" }).limit(unreadNotifs).lean();
      const notifIds = unreadNotifsIds.map(notif => notif._id);
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