function handleSearchParams(index: number, pathname: string) {
  if (index === 1) return pathname;
  else return `${pathname}?page=${index}`
}

function handlePagination(pathname: string, howManyResults: number, dpp: number, pageNum: number, routerFunc: Function) {
  const pages = Math.ceil(howManyResults / dpp);
  if (!pages || pageNum > pages) return <button disabled className="text-black bg-white border border-white px-[12px] py-1 rounded-lg">1</button>;
  if (pages < 11) {
    return Array.from({ length: pages }, (_, i) => (
      <button
        key={i + 1}
        title={String(i + 1)}
        disabled={pageNum === i + 1}
        className={`border border-white rounded-lg px-[12px] py-1 text-white ${pageNum === i + 1 ? "bg-white !text-black" : ""} hover:opacity-80 hover:cursor-pointer`}
        onClick={() => routerFunc(handleSearchParams(i + 1, pathname))}
      >
        {i + 1}
      </button>
    ))
  } else {
    if (pageNum < 5) {
      const btnsToDisplay = Array.from({ length: pageNum + (6 - pageNum) }, (_, i) => (
        <button
          key={i + 1}
          title={String(i + 1)}
          disabled={pageNum === i + 1}
          className={`border border-white rounded-lg px-[12px] py-1 text-white ${pageNum === i + 1 ? "bg-white !text-black" : ""} hover:opacity-80 hover:cursor-pointer`}
          onClick={() => routerFunc(handleSearchParams(i + 1, pathname))}
        >
          {i + 1}
        </button>
      ))
      btnsToDisplay.push(
        <button
          key={pages}
          title={String(pages)}
          className={`border border-white rounded-lg px-[12px] py-1 text-white hover:opacity-80 hover:cursor-pointer`}
          onClick={() => routerFunc(handleSearchParams(pages, pathname))}
        >
          {pages}
        </button>
      );
      return btnsToDisplay;
    }
    else if (pages - pageNum > 3) {
      const iList = [-2, -1, 0, 1, 2];
      const btnsToDisplay = Array.from({ length: iList.length }, (_, i) => (
        <button
          key={pageNum + iList[i]}
          title={String(pageNum + iList[i])}
          disabled={pageNum === pageNum + iList[i]}
          className={`border border-white rounded-lg px-[12px] py-1 text-white ${pageNum === pageNum + iList[i] ? "bg-white !text-black" : ""} hover:opacity-80 hover:cursor-pointer`}
          onClick={() => routerFunc(handleSearchParams(pageNum + iList[i], pathname))}
        >
          {pageNum + iList[i]}
        </button>
      ));
      btnsToDisplay.unshift(
        <button
          key={1}
          title="1"
          className={`border border-white rounded-lg px-[12px] py-1 text-white hover:opacity-80 hover:cursor-pointer`}
          onClick={() => routerFunc(handleSearchParams(1, pathname))}
        >
          {1}
        </button>
      );
      btnsToDisplay.push(
        <button
          key={pages}
          title={String(pages)}
          className={`border border-white rounded-lg px-[12px] py-1 text-white hover:opacity-80 hover:cursor-pointer`}
          onClick={() => routerFunc(handleSearchParams(pages, pathname))}
        >
          {pages}
        </button>
      );
      return btnsToDisplay;
    } else {
      const iList = pages - pageNum > 2 ? [-2, -1, 0] : pages - pageNum > 1 ? [-3, -2, -1, 0] : pages - pageNum > 0 ? [-4, -3, -2, -1, 0] : [-5, -4, -3, -2, -1, 0];
      const btnsToDisplay = Array.from({ length: iList.length + pages - pageNum }, (_, i) => (
        <button
          key={pageNum + (i > (iList.length - 1) ? i - (iList.length - 1) : iList[i])}
          title={String(pageNum + (i > (iList.length - 1) ? i - (iList.length - 1) : iList[i]))}
          disabled={pageNum === pageNum + (i > (iList.length - 1) ? i - (iList.length - 1) : iList[i])}
          className={`border border-white rounded-lg px-[12px] py-1 text-white ${pageNum === pageNum + (i > (iList.length - 1) ? i - (iList.length - 1) : iList[i]) ? "bg-white !text-black" : ""} hover:opacity-80 hover:cursor-pointer`}
          onClick={() => routerFunc(handleSearchParams(pageNum + (i > (iList.length - 1) ? i - (iList.length - 1) : iList[i]), pathname))}
        >
          {pageNum + (i > (iList.length - 1) ? i - (iList.length - 1) : iList[i])}
        </button>
      ));
      btnsToDisplay.unshift(
        <button
          key={1}
          title="1"
          className={`border border-white rounded-lg px-[12px] py-1 text-white hover:opacity-80 hover:cursor-pointer`}
          onClick={() => routerFunc(handleSearchParams(1, pathname))}
        >
          {1}
        </button>
      );
      return btnsToDisplay;
    }
  }
}

export default handlePagination;