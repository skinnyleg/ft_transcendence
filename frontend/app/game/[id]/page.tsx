'use client';
import React, {useContext, useEffect, useState} from "react";
import PongZoneQueue from "../ui/QueueLogic";
import PongZoneBoot from "../ui/BootLogic";
import GameResultBar from "../ui/GameResultBar";
import { usePathname, useRouter } from "next/navigation";
import { GameContext, gameSocketContext } from "../../context/gameSockets";
import SideBar from "../ui/SideBar";

function Game() {

    const   {data, setData, gameId, setGameId, gameType, setPlayerL, setPlayerR, setGameType, setSettings} = useContext(GameContext);
    const gameSocket = useContext(gameSocketContext)
    
    const path = usePathname();
    const router = useRouter();

    // setInterval(() => {
    //     if (path !== `/game/${gameId}`)
    //         gameSocket.emit('leaveGame');
    // }, 1000);


    useEffect(() => {
        gameSocket.on('abortGame', () => {
            router.push('/Dashboard');
        })

        gameSocket.on('abort', (data: boolean) => {
            console.log('abort got emitted')
            if (data === true)
                router.push('/Dashboard');
        })
    }, [gameSocket])


    useEffect(() => {
        const handleGameReady = (data: any) => {
            console.log('emit match ready');            
            setGameType('QUEUE');
            setData(data);
            setGameId(data[0].roomId);
            setPlayerL({name: data[0].nickname, picture: data[0].profilePic});
            setPlayerR({name: data[1].nickname, picture: data[1].profilePic});
            // router.push(`/game/${data[0].roomId}`);
        };

        const handlePlayerSettings = (data: any) => {
            console.log('settings before pressing start === ', data);
            setSettings({theme: data.theme, power: data.power, id: data.id, powerOpponenent: data.powerOpponenent});
        };
        gameSocket.emit('getGameData')
        gameSocket.emit('getPlayersSettings')
        gameSocket.on('gameData', handleGameReady);
        gameSocket.on('playerSettings', handlePlayerSettings);
        
        return () => {
            gameSocket.off('gameData', handleGameReady);
            gameSocket.off('playerSettings', handlePlayerSettings);
        };
    },[]);
    

    return (
        <main className="main flex bg-cyan-900 justify-center items-center h-screen w-screen">
            <div className="bg-cyan-100 h-[93.75%] w-[95.83%] flex space-x-[0.87%]  items-end justify-center rounded-[15px]">
                <div className="flex flex-col w-[91.74%] h-[97.33%] items-center relative rounded-[10px]">
                    <GameResultBar />
                    <PongZoneQueue />
                </div>
            </div>
        </main>
    );
}
export default Game;