'use client'
import React, { useState } from "react";
import LayoutClientDashboard from "@/app/ui/layoutClientDashboard";
import { Metadata } from "next";
import { GameContext } from "../context/gameSockets";
import { matchInfo, playerInfo } from "./types/interfaces";

// export const metadata : Metadata = {
//   title: 'Game',
//   description: 'Pong Platform Game Page',
//   viewport: 'width=device-width, initial-scale=1',
//   icons: ''

// }

export default function Layout({ children }: { children: React.ReactNode }) {
	const   [data, setData] = useState<matchInfo[]>([{id: 'asd', profilePic: 'asda', nickname: 'haitam'}]);
	const   [gameId, setGameId] = useState<string>('');
	const   [score, setScore] = useState({playerL: 0, playerR: 0});
	const 	[playerL, setPlayerL] = useState<playerInfo | undefined>(undefined);
    const 	[playerR, setPlayerR] = useState<playerInfo | undefined>(undefined);

	return (
		<GameContext.Provider value={{data, setData, gameId, setGameId, score, setScore, playerL, setPlayerL, playerR, setPlayerR}}>
      	<div className="flex bg-main flex-col md:flex-row xl:h-screen lg:h-screen">
        	{children}
      	</div>
    	</GameContext.Provider>
	);
}