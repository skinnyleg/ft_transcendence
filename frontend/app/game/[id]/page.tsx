'use client';
import React, {useContext, useEffect, useState} from "react";
import PongZoneQueue from "../ui/QueueLogic";
import PongZoneBoot from "../ui/BootLogic";
import GameResultBar from "../ui/GameResultBar";
import { usePathname, useRouter } from "next/navigation";
import gameSocket, { GameContext } from "../../context/gameSockets";


export const SideBar = () => {
    return (
        <div className="bg-cyan-600 w-[5.65%] h-[97.33%] rounded-[10px] ml-[0.87%]">
        </div>
    );
}

function game() {
    const   {data, setData, gameId, setGameId} = useContext(GameContext);
    
    const path = usePathname();
    setInterval(() => {
        if (path !== `/game/${gameId}`)
            gameSocket.emit('leaveGame');
    }, 2000);
    // const {data} = useContext(GameContext);

    console.log('data == ', data);
    // const router = useRouter();
    return (
        <main className="main flex bg-cyan-900 justify-center items-center h-screen w-screen">
            <div className="bg-cyan-100 h-[93.75%] w-[95.83%] flex space-x-[0.87%] items-center rounded-[15px]">
                {/* <SideBar /> */}
                <div className="flex flex-col w-[91.74%] h-[97.33%] items-center relative rounded-[10px]">
                    <GameResultBar />
                    {/* <PongZoneBoot /> */}
                    <PongZoneQueue />
                </div>
            </div>
        </main>
    );
}
export default game;