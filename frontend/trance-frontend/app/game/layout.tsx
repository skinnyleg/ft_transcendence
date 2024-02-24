'use client'
import React, { useState } from "react";
import LayoutClientDashboard from "@/app/ui/layoutClientDashboard";
import { Metadata } from "next";
import { GameContext, gameSocket, gameSocketContext } from "../context/gameSockets";
import { matchInfo, playerInfo } from "./types/interfaces";


export default function Layout({ children }: { children: React.ReactNode }) {
	const   [data, setData] = useState<matchInfo[]>([{id: 'asd', profilePic: 'asda', nickname: 'haitam'}]);
	const   [gameId, setGameId] = useState<string>('');
	const   [score, setScore] = useState({playerL: 0, playerR: 0});
	const 	[playerL, setPlayerL] = useState<playerInfo | undefined>(undefined);
    const 	[playerR, setPlayerR] = useState<playerInfo | undefined>(undefined);
    const 	[gameType, setGameType] = useState<playerInfo | undefined>(undefined);
	const 	[gameMape, setGameMape] = useState('/42.jpg');
	const 	[powerUps, setPowerUps] = useState('');
	const 	[settings, setSettings] = useState({theme: '', power: '', id: -1, powerOpponenent: ''});

	return (
		<gameSocketContext.Provider value={gameSocket}>
			<GameContext.Provider value={{settings, setSettings, powerUps, setPowerUps, data, setData, gameId, setGameId, score, setScore, playerL, setPlayerL, playerR, setPlayerR, gameType, setGameType, gameMape, setGameMape}}>
				<div className="flex bg-main flex-col md:flex-row xl:h-screen lg:h-screen">
					{children}
				</div>
			</GameContext.Provider>
		</gameSocketContext.Provider>
	);
}