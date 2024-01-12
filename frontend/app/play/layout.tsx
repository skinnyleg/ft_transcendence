import React, { useState } from "react";
import LayoutClinet from "@/app/ui/layoutClient"
import { Metadata } from "next";

export const metadata : Metadata = {
  title: 'Game',
  description: 'Pong Platform Game Page',
  icons: ''
}

export const viewport = {
  content: 'width=device-width, initial-scale=1'
}

export default function Layout({ children }: { children: React.ReactNode }) {
  
  return (
    <div className="flex bg-main flex-col md:flex-row md:overflow-y-auto overflow-y-auto xl:overflow-y-hidden lg:overflow-y-hidden h-screen">
      <LayoutClinet>
        {children}
      </LayoutClinet>
    </div>
  );
}