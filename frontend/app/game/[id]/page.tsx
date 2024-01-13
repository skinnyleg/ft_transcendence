'use client';
import React, {useContext, useEffect, useState} from "react";
import PongZoneQueue from "../ui/QueueLogic";
import PongZoneBoot from "../ui/BootLogic";
import GameResultBar from "../ui/GameResultBar";
import { usePathname, useRouter } from "next/navigation";
import gameSocket, { GameContext } from "../../context/gameSockets";

function game() {

    const   {data, setData, gameId, setGameId, gameType} = useContext(GameContext);
    
    const path = usePathname();

    setInterval(() => {
        if (path !== `/game/${gameId}`)
            gameSocket.emit('leaveGame');
    }, 1000);

    

    return (
        <main className="main flex bg-cyan-900 justify-center items-center h-screen w-screen">
            <div className="bg-cyan-100 h-[93.75%] w-[95.83%] flex space-x-[0.87%] items-center rounded-[15px]">
                <div className="flex flex-col w-[91.74%] h-[97.33%] items-center relative rounded-[10px]">
                    <GameResultBar />
                    <PongZoneQueue />
                </div>
            </div>
        </main>
    );
}
export default game;