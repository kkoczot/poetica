"use client";

import { fetchPoemComplex } from "@/lib/actions/poem.actions";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";

function Home() {
  const { userId } = useAuth();
  const [poems, setPoems] = useState<any[]>([]);
  const [showData, setShowData] = useState({ show: true, display: 0, toDisplay: 1 });

  function showPoems() {
    if (!poems.length) return <p className="text-white my-5">Please stand by...</p>
    console.log(">>>>>>>: ", poems);
    const poemsToDsiplay = poems.map((poem, i) => (
      <div key={i} className="my-6 bg-dark-3 text-white">
        <h3>{poem.title}</h3>
        <h4>{poem.type}</h4>
        <p>{poem.content}</p>
      </div>
    ));
    return poemsToDsiplay;
  }

  console.log(showData);
  useEffect(() => {
    async function getPoems() {
      try {
        const res = await fetchPoemComplex(userId || null, showData.display, 1);
        console.log(">>> res: ", res);
        setPoems(prev => [...prev, ...res]);
      } catch (error: any) {
        throw new Error("Failed to get fetchPoemComplex");
      }
    }
    if (showData.show) {
      console.log("showData.show");
      console.log(showData);
      getPoems();
      setShowData(prev => ({ show: false, display: prev.display + 1, toDisplay: prev.toDisplay + 1 }));
    }
  }, [showData.show])

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