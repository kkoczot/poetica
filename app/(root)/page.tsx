"use client";

import { fetchPoemComplex } from "@/lib/actions/poem.actions";
import { useAuth } from "@clerk/nextjs";
import { useCallback, useEffect, useState } from "react";

function Home() {
  const { userId } = useAuth();
  const [poems, setPoems] = useState<any[]>([]);
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

  const getPoemsDef = useCallback(async (display: number) => {
    async function getPoems(display: number) {
      setLoading(true);
      try {
        const res = await fetchPoemComplex(userId || null, display, 1);
        // console.log(">>> res: ", res);
        setPoems(prev => [...prev, ...res]);
      } catch (error: any) {
        throw new Error("Failed to get fetchPoemComplex");
      } finally {
        setLoading(false);
      }
    }
    getPoems(display);
  }, [])

  // console.log(showData);
  useEffect(() => {
    if (showData.show) {
      // console.log("showData.show");
      // console.log(showData);
      getPoemsDef(showData.display);
      setShowData(prev => ({ show: false, display: prev.display + 1, toDisplay: prev.toDisplay + 1 }));
    }
  }, [showData.show]);

  useEffect(() => {
    const handleScroll = () => {
      // console.log(window.innerHeight);
      // console.log(document.documentElement.scrollTop);
      // console.log(document.documentElement.scrollHeight);
      // console.log(document.documentElement.offsetHeight);
      if (
        window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight
      )
        return;
      if (
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.scrollHeight
      ) setShowData(prev => ({ ...prev, show: true }));

      // Najwyżej:
      // window.innerHeight: 919
      // document.documentElement.scrollTop: 0
      // document.documentElement.offsetHeight: 0

      // Najniżej:
      // window.innerHeight: 919
      // document.documentElement.scrollTop: 797
      // document.documentElement.offsetHeight: 797

      // if (hasMore && !loading) {
      //   setPage((prevPage) => prevPage + 1);
      // }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading])
  // useEffect(() => {
  //   if (showData.show) {
  //     console.log("showData.show");
  //     console.log(showData);
  //     getPoemsDef();
  //     setShowData(prev => ({ show: false, display: prev.display + 1, toDisplay: prev.toDisplay + 1 }));
  //   }
  // }, [showData.show])

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