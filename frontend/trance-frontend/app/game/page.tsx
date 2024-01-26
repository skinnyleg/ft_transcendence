"use client"
import { useContext, useEffect, useState } from "react";
import { GameContext, gameSocketContext } from "../context/gameSockets";
import { matchInfo } from "./types/interfaces";
import { useRouter } from "next/navigation";

function GameQueue() {

    const   router = useRouter();
    const   [progress, setProgress] = useState<number>(5);
    const gameSocket = useContext(gameSocketContext)
    const   {setScore,setGameMape, setPowerUps, setData, setGameId, setPlayerL, setPlayerR, gameType, setGameType, settings, setSettings} = useContext(GameContext);
    useEffect(() => {
        const handleGameReady = (data: {roomId: string}) => {
            setProgress(100);
            router.push(`/game/${data.roomId}`);
        };

        gameSocket.on('MatchReady', handleGameReady);
        
        return () => {
            gameSocket.off('MatchReady');
        };
    },[gameSocket]);
    
    useEffect(() => {
        gameSocket.emit('abort');
        gameSocket.on('readyToQueue', () => {
            setScore({playerL: 0, playerR: 0});
            gameSocket.emit('PlayQueue');
        })
        gameSocket.on('userInQueue', () => {
            gameSocket.emit('ImReady');
        })
        
        const timer = setInterval(() => {
            setProgress((prevProgress) => (prevProgress < 90 ? prevProgress + 5 : prevProgress));
        }, 900);
    
        return () => {
            clearInterval(timer);
            gameSocket.off('userInQueue')
            gameSocket.off('readyToQueue')
        };

    }, [gameSocket]);

    return (
        <main className="main flex bg-cyan-900 justify-center items-center h-screen w-screen">
            <div className="bg-cyan-100 h-[93.75%] w-[95.83%] flex space-x-[0.87%] items-end justify-center rounded-[15px]">
                <div 
                className={`bg-black flex flex-col w-full  items-center relative rounded-[10px] transition-all duration-1000 ease-in-out bottom-0`}
                style={{ height: `${progress}%` }}>
                    <h1 className="text-red-600 text-3xl self-center">{`${progress}%`}</h1>
                </div>
            </div>
        </main>
    );
};

export default GameQueue;