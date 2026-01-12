const Tags = async () => {
  
  return (
    <div className="overflow-hidden bg-blue">
      <div className="flex flex-col">
        <div className="flex justify-center items-center bg-white h-[25vh] text-black">
          <div>
          <h2>Challenge: #(here-will-be-a-tag)</h2>
          <h3>Date: from: {new Date().getDate()} {new Date().getMonth() + 1} to: {new Date().getDate() + 14} {new Date().getMonth() + 1}</h3>
          <p>Description: here will be some description about this challenge</p>
          </div>
          <div>
            <p>Go to the site</p>
          </div>
        </div>
        <div className="flex justify-center items-center bg-red-600 h-[25vh] text-white">
          <div>
          <h2>20 Most popular #</h2>
          <h3># that are the most common</h3>
          <div>
            Here will be the list of it
          </div>
          </div>
          <div>Go to the site</div>
        </div>
        <div className="flex justify-center items-center bg-white h-[25vh] text-black">
          <div>
          <h2>Find specific tag</h2>
          <input type="text" />
          </div>
          <div>
            Go to the site
          </div>
        </div>
      </div>
    </div>
  )
}

export default Tags;