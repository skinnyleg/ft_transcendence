import React, { useState } from "react";
import { Metadata } from "next";
import LayoutChat from "../ui/layoutChat";

export const metadata : Metadata = {
  title: 'Leaderboard',
  description: 'Pong Platform Leaderboard Page',
  viewport: 'width=device-width, initial-scale=1',
  icons: ''

}

export default function Layout({ children }: { children: React.ReactNode }) {


  return (
    <div className="flex bg-main flex-col md:flex-row md:overflow-y-auto overflow-y-auto xl:h-screen lg:h-screen">
      <LayoutChat>
        {children}
      </LayoutChat>
    </div>
  );
}
