"use client";

import { fetchPoemComplex } from "@/lib/actions/poem.actions";
import { useAuth } from "@clerk/nextjs";
import { useCallback, useEffect, useState } from "react";

function Home() {
  const { userId } = useAuth();
  const [poems, setPoems] = useState<any[]>([]);
  const [toDisplay, setToDisplay] = useState({gotData: false, amount: 0});
  const [showData, setShowData] = useState({ show: true, display: 0, toDisplay: 1 });
  const [loading, setLoading] = useState(false);

  function showPoems() {
    if (!poems.length) return <p className="text-white my-5">Please stand by...</p>
    // console.log(">>>>>>>: ", poems);
    const poemsToDsiplay = poems.map((poem, i) => (
      <div key={i} className="my-40 p-4 pb-6 rounded-lg bg-dark-3 text-white">
        <h3 className="text-[22px] font-semibold">{poem.title}</h3>
        <h4 className="mb-4 italic opacity-80">{poem.type}</h4>
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
      {/* <p className="text-white">
        Zrobić funkcję do wyświetlania wierszy od danych autorów <br />
        Z 2 trybami w zależności czy user jest zalogowany czy nie. <br /><br />
        Jeśli user <span className="underline">nie</span> jest zalogowany to wyświetlić losowo tylko te wiersze, które są w udostępnionych folderach <br />
        Jeśli user jest zalogowany to:
      </p>
      <br />
      <ul className="text-white">
        <li>- Przede wszystkim śledzeni autorzy</li>
        <li>- Autorzy śledzeni przez śledzonych autorów</li>
        <li>- Wiersze autorów typu najbardziej lubianego przez usera</li>
      </ul> */}
      {/* 

       >>> Proste rozwiązanie (ale z odpowiednim działaniem):
        - wyświetlić najpierw jeden wiersz
        - na scroll wyświetlać kolejny (jeden)
        // wiersze tylko z udostępnionych folderów
        // wiersze tylko niezalogowanego usera

       */}
      {/* <Element z tymi wierszami /> */}
    </main>
  );
}

export default Home;