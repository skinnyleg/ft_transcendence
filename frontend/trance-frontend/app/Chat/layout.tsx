import React, { useState } from "react";
import { Metadata } from "next";
import LayoutChat from "../ui/layoutChat";

export const metadata : Metadata = {
  title: 'Chat',
  description: 'Pong Platform Chat Page',
  icons: ''
}

export const viewport = {
  content: 'width=device-width, initial-scale=1'
}

export default function Layout({ children }: { children: React.ReactNode }) {


  return (
    <main className="flex h-screen bg-main flex-col overflow-y-hidden">
      <LayoutChat>
        {children}
      </LayoutChat>
    </main>
  );
}
