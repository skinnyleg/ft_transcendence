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
    <div className="flex h-screen bg-main flex-col overflow-y-hidden">
      <LayoutChat>
        {children}
      </LayoutChat>
    </div>
  );
}
