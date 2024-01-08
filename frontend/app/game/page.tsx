"use client"
import { useContext, useEffect, useState } from "react";
import { SideBar } from "./[id]/page";
import gameSocket, { GameContext } from "./[id]/ui/gameSockets";
import { matchInfo } from "./[id]/types/interfaces";
import { useRouter } from "next/navigation";

function GameQueue() {

    const   router = useRouter();
    // const   [data, setData] = useState<matchInfo[]>([{id: 'asd', profilePic: 'asda', nickname: 'haitam'}]);
    const {data, setData} = useContext(GameContext);

    gameSocket.on('MatchReady', (data: matchInfo[]) => {
        setData(data);
        router.push(`/game/${data[0].nickname}vs${data[1].nickname}`);
    });

    const startGame = () => {
    };
 
    return (
        <main className="main flex bg-cyan-900 justify-center items-center h-screen w-screen">
            <div className="bg-cyan-100 h-[93.75%] w-[95.83%] flex space-x-[0.87%] items-center rounded-[15px]">
                {/* <SideBar /> */}
                <div className="flex flex-col w-[91.74%] h-[97.33%] items-center relative rounded-[10px]">
                    {/* {isMatchReady && <button onClick={startGame}>START GAME</button>} */}
                </div>
            </div>
        </main>
    );
};

export default GameQueue;