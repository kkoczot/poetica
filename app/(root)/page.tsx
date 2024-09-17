"use client";

import { poemTypes } from "@/constants";
import { ObjectId } from "mongoose";
import { fetchPoemComplex } from "@/lib/actions/poem.actions";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

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
  const [loading, setLoading] = useState(false);
  console.log("Home RE-RENDERED!");

  function showPoems() {
    if (!poems.length) return <p className="text-white text-3xl text-[24px] tracking-wider animate-pulse my-5">Please stand by...</p>
    // console.log(">>>>>>>: ", poems);
    const poemsToDsiplay = poems.map((poem: Poem) => {
      const poemType = poemTypes.filter(type => type.poemType.toLowerCase() === poem.type.toLowerCase())[0];
      return (
        <div key={poem._id.toString()} className="my-14 p-4 pb-6 rounded-lg bg-dark-3 text-white">
          <div className="flex flex-col items-start relative">
            <div title={'@' + poem.authorId.username} className="absolute top-2 right-2 h-11 w-11 rounded-full border-2 border-green-700 flex items-center overflow-hidden">
              <Link href={`/profile/${poem.authorId.id}`} >
                <Image src={poem.authorId.image} alt={'@'+poem.authorId.username} width={64} height={64} className="opacity-50" />
              </Link>
            </div>
            <Link href={`/profile/${poem.authorId.id}/${poem.folderId._id}/${poem._id}`}><h3 className="text-[22px] font-semibold">{poem.title}</h3></Link>
            <div className="mb-4 italic opacity-80 flex flex-col cursor-default items-start">
              <div className="flex">
                <div className="h-3 w-3 rounded-full self-center mr-1" style={{ backgroundColor: poemType.color }} />
                <h4 className="self-start" title="Poem type">{poem.type}</h4>
              </div>
              <Link href={`/profile/${poem.authorId.id}`}><h4 className="self-start" title="Author">@{poem.authorId.username}</h4></Link>
              <Link href={`/profile/${poem.authorId.id}/${poem.folderId._id}`}><h4 className="self-start" title="Folder">{poem.folderId.title}</h4></Link>
            </div>
          </div>
          <p className="text-light-2 whitespace-break-spaces">{poem.content}</p>
        </div>
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

      sleep(2000).then(() => {
        console.log("I'm in!");
        if (window.innerHeight === document.documentElement.scrollHeight) {
          console.log("I'm in a SLEEP func");
          setShowData(prev => ({ ...prev, show: true }));
        }
      })
    }

    async function getPoems(display: number) {
      setLoading(true);
      try {
        const res = await fetchPoemComplex(userId || null, "get", display, 1);
        setPoems(prev => removeDuplicates([...prev, ...res]));
      } catch (error: any) {
        throw new Error("Failed to get fetchPoemComplex");
      } finally {
        setLoading(false);
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
    // if (!showData.show){
    //   if (document.documentElement.scrollHeight !== showData.sh) setShowData(prev => ({ ...prev, show: true }));
    // }
  }, [showData.show]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight
      )
        return;
      if (
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.scrollHeight
      ) setShowData(prev => ({ ...prev, show: true }));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading]);

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