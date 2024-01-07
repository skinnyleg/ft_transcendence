import React, { useState } from "react";
import LayoutClient from "@/app/ui/layoutClient";
import { Metadata } from "next";

export const metadata : Metadata = {
  title: 'settings',
  description: 'Pong Platform Login Page',
  viewport: 'width=device-width, initial-scale=1',
  icons: ''

}

export default function Layout({ children }: { children: React.ReactNode }) {


  return (
    <div className="flex bg-main flex-col md:flex-row md:overflow-y-auto overflow-y-auto xl:h-full lg:h-full styled-scrollbar">
      <LayoutClient>
        {children}
      </LayoutClient>
    </div>
  );
}