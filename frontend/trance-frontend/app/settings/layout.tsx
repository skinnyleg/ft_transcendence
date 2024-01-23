import React, { useState } from "react";
import LayoutClient from "@/app/ui/layoutClient";
import { Metadata } from "next";

export const metadata : Metadata = {
  title: 'settings',
  description: 'Pong Platform Settings Page',
  icons: ''
}

export const viewport = {
  content: 'width=device-width, initial-scale=1'
}

export default function Layout({ children }: { children: React.ReactNode }) {


  return (
    <div className="flex bg-main flex-col md:flex-row md:overflow-y-auto overflow-y-auto styled-scrollbar xl:h-screen lg:h-screen h-screen">
      <LayoutClient>
        {children}
      </LayoutClient>
    </div>
  );
}