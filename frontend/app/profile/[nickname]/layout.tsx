import React, { useState } from "react";
import LayoutClinet from "@/app/ui/layoutClient"
import { Metadata } from "next";

export const metadata : Metadata = {
  title: 'Profile',
  description: 'Pong Platform Login Page',
  viewport: 'width=device-width, initial-scale=1',
  icons: ''

}

export default function Layout({ children }: { children: React.ReactNode }) {
  
  return (
    <div className="flex bg-main flex-col md:flex-row md:overflow-hidden xl:overflow-hidden h-screen">
      <LayoutClinet>
        {children}
      </LayoutClinet>
    </div>
  );
}