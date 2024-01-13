"use client"
import { useContext, useEffect, useState } from "react";
import gameSocket, { GameContext } from "../context/gameSockets";
import { matchInfo } from "./types/interfaces";
import { useRouter } from "next/navigation";

function GameQueue() {

    const   router = useRouter();
    const   [progress, setProgress] = useState<number>(5);
    const   {setData, setGameId, setPlayerL, setPlayerR, gameType, setGameType} = useContext(GameContext);

    useEffect(() => {
        const handleGameReady = (data: any) => {
            setProgress(100);
            setGameType('QUEUE');
            setData(data);
            setGameId(data[0].roomId);
            setPlayerL({name: data[0].nickname, picture: data[0].profilePic});
            setPlayerR({name: data[1].nickname, picture: data[1].profilePic});
            router.push(`/game/${data[0].roomId}`);
        };
        
        // const handleBotReady = (data: any) => {
        //     setProgress(100);
        //     setGameType('BOT');
        //     // console.log("data front : ", data)
        //     setGameId(data.id);
        //     setPlayerL({name: data.nickname, picture: data.profilePic});
        //     setPlayerR({name: 'BOT', picture: '/WhatsApp Image 2023-11-08 at 17.00.12_964408e7.jpg'});
        //     router.push(`/game/${data.id}`);
        // };

        gameSocket.on('MatchReady', handleGameReady);
        // gameSocket.on('BotReady', handleBotReady);
        
        return () => {
            gameSocket.off('MatchReady', handleGameReady);
            // gameSocket.off('BotReady', handleBotReady);
        };
    },[]);
    
    useEffect(() => {
        gameSocket.emit('ImReady');
        
        const timer = setInterval(() => {
            setProgress((prevProgress) => (prevProgress < 90 ? prevProgress + 5 : prevProgress));
        }, 900);
    
        return () => {
            clearInterval(timer);
        };

    }, []);

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