import React, { useState } from "react";
import LayoutClientDashboard from "@/app/ui/layoutClientDashboard";
import { Metadata } from "next";

export const metadata : Metadata = {
  title: 'Dashboard',
  description: 'Pong Platform Dashboard Page',
  icons: ''
}

export const viewport = {
  content: 'width=device-width, initial-scale=1'
}

export default function Layout({ children }: { children: React.ReactNode }) {


  return (
    <div className="flex bg-main flex-col md:flex-row md:overflow-y-auto overflow-y-auto styled-scrollbar h-screen">
      <LayoutClientDashboard>
        {children}
      </LayoutClientDashboard>
    </div>
  );
}