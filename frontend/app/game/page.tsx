'use client';
import React, {useState} from "react";
import PongZoneQueue from "./ui/QueueLogic";
import PongZoneBoot from "./ui/BootLogic";
import GameResultBar from "./ui/GameResultBar";

const SideBar = () => {
    return (
        <div className="bg-cyan-600 w-[5.65%] h-[97.33%] rounded-[10px] ml-[0.87%]">
        </div>
    );
}

function game() {

    return (
        <main className="main flex bg-cyan-900 justify-center items-center h-screen w-screen">
            <div className="bg-cyan-100 h-[93.75%] w-[95.83%] flex space-x-[0.87%] items-center rounded-[15px]">
                <SideBar />
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
