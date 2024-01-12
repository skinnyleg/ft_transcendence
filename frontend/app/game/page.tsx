"use client"
import { useContext, useEffect, useState } from "react";
import gameSocket, { GameContext } from "../context/gameSockets";
import { matchInfo } from "./types/interfaces";
import { useRouter } from "next/navigation";
import MatchType from "./ui/matchType";


function GameQueue() {

    const   router = useRouter();
    const   [progress, setProgress] = useState<number>(5);
    const   {setData, setGameId, setPlayerL, setPlayerR, matchType, setmatchTypes} = useContext(GameContext);
    
    useEffect(() => {
            const handleMatchReady = (data: any) => {
            setProgress(100);
            setData(data);
            setGameId(data[0].roomId);
            router.push(`/game/${data[0].roomId}`);
            setPlayerL({name: data[0].nickname, picture: data[0].profilePic});
            setPlayerR({name: data[1].nickname, picture: data[1].profilePic});
            // router.push(`/game/${Math.floor(Math.random() * 100) + 1}`);
        };
        
        gameSocket.on('MatchReady', handleMatchReady);
        // handleMatchReady('VSboot');
        
        return () => {
            gameSocket.off('MatchReady', handleMatchReady);
        };
    },[]);
    
    useEffect(() => {
        if (matchType === 'QUEUE') {
            gameSocket.emit('ImReady');
            console.log(' type = = ',matchType);
        }
        const timer = setInterval(() => {
            if (matchType === 'QUEUE')
                setProgress((prevProgress) => (prevProgress < 90 ? prevProgress + 5 : prevProgress));
        }, 900);
    
        return () => {
            clearInterval(timer);
        };

    }, [matchType]);

    return (
        <main className="main flex bg-cyan-900 justify-center items-center h-screen w-screen">
            <div className="bg-cyan-100 h-[93.75%] w-[95.83%] flex space-x-[0.87%] items-end justify-center rounded-[15px]">
                {matchType === ''  && <MatchType/>}
                {matchType === 'QUEUE' && <div 
                className={`bg-black flex flex-col w-full  items-center relative rounded-[10px] transition-all duration-1000 ease-in-out bottom-0`}
                style={{ height: `${progress}%` }}>
                    <h1 className="text-red-600 text-3xl self-center">{`${progress}%`}</h1>
                </div>}
            </div>
        </main>
    );
};

export default GameQueue;