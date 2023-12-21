import React, { useState } from "react";
import { Metadata } from "next";
import LayoutChat from "../ui/layoutChat";

export const metadata : Metadata = {
  title: 'Chat',
  description: 'Pong Platform Chat Page',
  viewport: 'width=device-width, initial-scale=1',
  icons: ''

}

export default function Layout({ children }: { children: React.ReactNode }) {


  return (
    <div className="flex bg-main flex-col overflow-y-hidden h-screen">
      <LayoutChat>
        {children}
      </LayoutChat>
    </div>
  );
}
