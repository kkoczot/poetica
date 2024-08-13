"use client";

import { fetchPoemComplex } from "@/lib/actions/poem.actions";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

// TODO:
// - zrobić wygląd końcowy (taki jaki powinien być)
// - dodać działania typu linki

function Home() {
  const { userId } = useAuth();
  const [poems, setPoems] = useState<any[]>([]);
  const [toDisplay, setToDisplay] = useState({gotData: false, amount: 0});
  const [showData, setShowData] = useState({ show: true, display: 0, toDisplay: 1 });
  const [loading, setLoading] = useState(false);

  function showPoems() {
    if (!poems.length) return <p className="text-white my-5">Please stand by...</p>
    console.log(">>>>>>>: ", poems);
    const poemsToDsiplay = poems.map((poem, i) => (
      <div key={i} className="my-40 p-4 pb-6 rounded-lg bg-dark-3 text-white">
        <Link href={`/profile/${poem.authorId.id}/${poem.folderId._id}/${poem._id}`}><h3 className="text-[22px] font-semibold">{poem.title}</h3></Link>
        <div className="mb-4 italic opacity-80 flex flex-col cursor-default">
        <h4 className="self-start" title="Poem type">{poem.type}</h4>
        <Link href={`/profile/${poem.authorId.id}`}><h4 className="self-start" title="Author">@{poem.authorId.username}</h4></Link>
        <Link href={`/profile/${poem.authorId.id}/${poem.folderId._id}`}><h4 className="self-start" title="Folder">{poem.folderId.title}</h4></Link>
        </div>
        <p className="text-light-2 whitespace-break-spaces">{poem.content}</p>
      </div>
    ));
    return poemsToDsiplay;
  }

  const getPoemsDef = useCallback(async (action: "count" | "get", display?: number) => {
    async function getPoems(display: number) {
      setLoading(true);
      try {
        const res = await fetchPoemComplex(userId || null, "get", display, 1);
        setPoems(prev => [...prev, ...res]);
      } catch (error: any) {
        throw new Error("Failed to get fetchPoemComplex");
      } finally {
        setLoading(false);
      }
    };

    async function getPoemsAmount() {
      try {
        const res = await fetchPoemComplex(userId || null, "count");
        setToDisplay({gotData: true, amount: res});
      } catch (error) {
        throw new Error("Failed to get amount of poems from fetchPoemComplex");
      }
    }
    
    if (action === "count") getPoemsAmount();
    if (action === "get") getPoems(display!);
  }, []);

  useEffect(() => {
    if (!toDisplay.gotData) {
      getPoemsDef("count");
    }
    if (showData.show) {
      if ((toDisplay.gotData && (toDisplay.amount >= showData.toDisplay)) || !toDisplay.gotData) {
        getPoemsDef("get", showData.display);
        setShowData(prev => ({ show: false, display: prev.display + 1, toDisplay: prev.toDisplay + 1 }));
      }
    }
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
        <h1 className="head-text text-left mb-10">Poetica Home</h1>
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