"use client";

import { poemTypes } from "@/constants";
import { ObjectId } from "mongoose";
import { fetchPoemComplex } from "@/lib/actions/poem.actions";
import { useAuth } from "@clerk/nextjs";
import { useCallback, useEffect, useState } from "react";
import PoemPost from "@/components/cards/PoemPost";

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

// TODO:
// Napisać funkcję, która wyświetli odpowiednią ilość wierszy aby pojawił się scroll
// Pseudokod: (wykorzystać: [zapewne] useEffect )
// - wykonywać dopóki: po pobraniu i wyświetleniu danych wysokość strony jest mniejsza od wysokości ekranu
// - zmienić toDisplay, showData, poems aby wywołać re-render

function Home() {
  const { userId } = useAuth();
  const [poems, setPoems] = useState<any[]>([]);
  const [toDisplay, setToDisplay] = useState({ gotData: false, amount: 0 });
  const [showData, setShowData] = useState({ show: true, display: 0, toDisplay: 1 });

  function showPoems() {
    if (!poems.length) return <p className="text-white text-3xl text-[24px] tracking-wider animate-pulse my-5">Please stand by...</p>
    const poemsToDsiplay = poems.map((poem: Poem) => {
      const poemType = poemTypes.filter(type => type.poemType.toLowerCase() === poem.type.toLowerCase())[0];
      return (
        <PoemPost key={poem._id.toString()} poem={poem} poemType={poemType} />
      )
    });
    if (window.innerHeight === document.documentElement.scrollHeight) getPoemsDef("more");
    return poemsToDsiplay;
  }

  const getPoemsDef = useCallback(async (action: "count" | "get" | "more", display?: number) => {
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

    async function getMorePoems() {
      function sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }

      sleep(2500).then(() => {
        if (window.innerHeight === document.documentElement.scrollHeight) {
          setShowData(prev => ({ ...prev, show: true }));
        }
      })
    }

    async function getPoems(display: number) {
      try {
        const res = await fetchPoemComplex(userId || null, "get", display, 1);
        setPoems(prev => removeDuplicates([...prev, ...res]));
      } catch (error: any) {
        throw new Error("Failed to get fetchPoemComplex");
      } finally {
      }
    };

    async function getPoemsAmount() {
      try {
        const res = await fetchPoemComplex(userId || null, "count");
        setToDisplay({ gotData: true, amount: res });
      } catch (error) {
        throw new Error("Failed to get amount of poems from fetchPoemComplex");
      }
    }

    if (action === "count") getPoemsAmount();
    if (action === "get") getPoems(display!);
    if (action === "more") getMorePoems();
  }, []);

  useEffect(() => {
    if (!toDisplay.gotData) {
      getPoemsDef("count");
    }
    if (showData.show) {
      if ((toDisplay.gotData && (toDisplay.amount >= showData.toDisplay)) || !toDisplay.gotData) {
        getPoemsDef("get", showData.display);
        setShowData(prev => ({ ...prev, show: false, display: prev.display + 1, toDisplay: prev.toDisplay + 1 }));
      }
    }
  }, [showData.show]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop <
        document.documentElement.offsetHeight - 99
      )
        return;
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.scrollHeight - 99
      ) setShowData(prev => ({ ...prev, show: true }));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main>
      <div>
        <h1 className="head-text text-left mb-8">Poetica Home</h1>
      </div>
      <div>
        {
          showPoems()
        }
      </div>
    </main>
  );
}

export default Home;