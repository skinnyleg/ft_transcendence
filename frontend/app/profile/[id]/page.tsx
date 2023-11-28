import TopBar from "@/app/ui/top";

const profile = () => {
    return (
    <main className="flex flex-col font-white">
        <TopBar />
        <div className="flex flex-col mt-2">
            <div className="grid grid-cols-4 auto-rows-min gap-2 w-full h-[88vh] mt-4 md:grid-row-4 grid-row-4">
                <div className="bg-white relative col-span-4 h-[250px] row-start-1 row-end-2 w-full shadow-md rounded-xl">
                    <div className="flex flex-col rounded-xl h-[250px]" style={{backgroundImage: 'url(/Table.webp)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
                        <h1 className="p-5 text-xl">username</h1>
                    </div>
                    <div  className="rounded-full w-22 h-22 absolute bottom-0 left-0 transform  translate-x-[8px] translate-y-[32px] border-2">
                        <img src="/52.jpg" alt="profile Picture" className="rounded-full w-20 h-20 rounded-full" />
                    </div>
                </div>
                <div className="bg-white col-start-2 col-end-4 row-start-2 h-[20px] row-end-3 mr-20 flex w-5/7 shadow-md rounded-xl">
                    level and xp
                </div>
                <div className="bg-white relative col-start-4 col-end-5 row-start-2 h-[20px] row-end-3 flex w-full justify-start shadow-md rounded-xl">
                </div>
                {/* 4 cards */}
                <div  className="bg-lightblue col-span-1 row-start-3 row-end-4 w-full h-[100px] shadow-md rounded-xl">wallet</div>
                <div  className="bg-lightblue col-span-1 row-start-3 row-end-4 w-full h-[100px] shadow-md rounded-xl">wallet</div>
                <div  className="bg-lightblue col-span-1 row-start-3 row-end-4 w-full h-[100px] shadow-md rounded-xl">wallet</div>
                <div  className="bg-lightblue col-span-1 row-start-3 row-end-4 w-full h-[100px] shadow-md rounded-xl">wallet</div>
                <div className="bg-lightblue col-span-2  row-start-4 row-end-5 w-full h-[280px] shadow-md rounded-xl"> match history </div>
                <div className="bg-lightblue col-span-2  row-start-4 row-end-5 w-full h-[280px] shadow-md rounded-xl"> match history </div>
            </div>
        </div>
    </main>
    );

}

export default profile;