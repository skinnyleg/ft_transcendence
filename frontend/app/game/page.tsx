"use client"
import { useContext, useEffect, useState } from "react";
import gameSocket, { GameContext } from "./ui/gameSockets";
import { matchInfo } from "./types/interfaces";
import { useRouter } from "next/navigation";
import { off } from "process";


function GameQueue() {

    const   router = useRouter();
    const   [progress, setProgress] = useState<number>(5);
    const   {data, setData} = useContext(GameContext);

    // const time  = setInterval(() => {
    //     if (progress < 100)
    //         setProgress(progress + 5);
    // }, 1000);
    
    useEffect(() => {
        gameSocket.on('MatchReady', (data: matchInfo[]) => {
            setProgress(100);
            setData(data);
            console.log('data: ', data);
            router.push(`/game/${data[0].nickname}vs${data[1].nickname}`);
        });

        
        return () => {
            gameSocket.off('MatchReady');
            // clearTimeout(time);
            // if (progress >= 100)
            //     clearInterval(time);
        };

    }, [progress, gameSocket])
    return (
        <main className="main flex bg-cyan-900 justify-center items-center h-screen w-screen">
            <div className="bg-cyan-100 h-[93.75%] w-[95.83%] flex space-x-[0.87%] items-end justify-center rounded-[15px]">
                <div 
                className={`bg-black flex flex-col w-full  items-center relative rounded-[10px] transition-all duration-1000 ease-in-out bottom-0`}
                style={{ height: `${progress}%` }}
                >
                    <h1 className="text-red-600 text-3xl self-center">{`${progress}%`}</h1>
                </div>
            </div>
        </main>
    );
};

export default GameQueue;