"use client"

import PoemPost from "@/components/cards/PoemPost";
import { poemTypes } from "@/constants";
import { fetchPoemComplexV2 } from "@/lib/actions/poem.actions";
import { useAuth } from "@clerk/nextjs";
import { ObjectId } from "mongoose";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";


interface Author {
  _id: ObjectId;
  id: string;
  image: string;
  name: string;
  username: string;
}

interface Folder {
  _id: ObjectId;
  title: string;
  shared: boolean;
}

interface Poem {
  _id: ObjectId;
  authorId: Author;
  folderId: Folder;
  title: string;
  type: string;
  tags: string[];
  content: string;
  favourite: ObjectId[];
  comments: any[]; // Update this if you have a defined structure for comments
  __v: number;
}

function HO_GPT() {
  const { userId } = useAuth();
  const pathnameTag = usePathname().slice(6);
  const [loading, setLoading] = useState(false);
  const [poems, setPoems] = useState<any[]>([]);
  const [skip, setSkip] = useState(0);
  const limit = 3;
  const [hasMore, setHasMore] = useState(true);

  function removeDuplicates(arr: any[]) {
    const uniqueIds = new Set();
    return arr.filter((poem: any) => {
      if (!uniqueIds.has(poem._id)) {
        uniqueIds.add(poem._id);
        return true;
      }
      return false;
    })
  }

  useEffect(() => {
    const loadPoems = async () => {
      setLoading(true);
      const newPoems = await fetchPoemComplexV2(userId || null, skip, limit, pathnameTag);
      setPoems((prev) => removeDuplicates([...prev, ...newPoems]));
      setSkip(() => removeDuplicates([...poems, ...newPoems]).length);
      if (newPoems.length < limit) setHasMore(false);
      setLoading(false);
    };

    loadPoems();
  }, []);

  const handleScroll = async () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

    if (scrollTop + clientHeight >= scrollHeight && skip && hasMore) {
      setLoading(true);
      const newPoems = await fetchPoemComplexV2(userId || null, skip, limit, pathnameTag);
      setPoems((prev) => removeDuplicates([...prev, ...newPoems]));
      setSkip(() => removeDuplicates([...poems, ...newPoems]).length);
      if (newPoems.length < limit) setHasMore(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [skip]);

  return (
    <div>
      {poems.map((poem: Poem) => {
        const poemType = poemTypes.filter(type => type.poemType.toLowerCase() === poem.type.toLowerCase())[0];
        return (
          <div key={JSON.stringify(poem._id)}>
            <PoemPost poem={poem} poemType={poemType} />
          </div>
        )
      })}
      {loading && hasMore && <p className="text-center text-gray-500 animate-pulse">Loading...</p>}
      {!hasMore && <p className="text-center text-gray-500">No more poems</p>}
    </div>
  );
};

export default HO_GPT;