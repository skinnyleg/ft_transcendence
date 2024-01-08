'use client'
import React, { useState } from "react";
import LayoutClientDashboard from "@/app/ui/layoutClientDashboard";
import { Metadata } from "next";
import { GameContext } from "./ui/gameSockets";
import { matchInfo } from "./types/interfaces";

// export const metadata : Metadata = {
//   title: 'Game',
//   description: 'Pong Platform Game Page',
//   viewport: 'width=device-width, initial-scale=1',
//   icons: ''

// }

export default function Layout({ children }: { children: React.ReactNode }) {
  const   [data, setData] = useState<matchInfo[]>([{id: 'asd', profilePic: 'asda', nickname: 'haitam'}]);

  return (
    <GameContext.Provider value={{data, setData}}>
      <div className="flex bg-main flex-col md:flex-row xl:h-screen lg:h-screen">
          {children}
      </div>
    </GameContext.Provider>
  );
}