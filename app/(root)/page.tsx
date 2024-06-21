export default function Home() {
  return (
    <main>
      <div>
        <h1 className="head-text text-left">Poetica Home</h1>
      </div>
      <p className="text-white">
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
      </ul>
      {/* <Element z tymi wierszami /> */}
    </main>
  );
}
