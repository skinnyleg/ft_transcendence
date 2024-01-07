import React, { useState } from "react";
import LayoutClientDashboard from "@/app/ui/layoutClientDashboard";
import { Metadata } from "next";

export const metadata : Metadata = {
  title: 'Dashboard',
  description: 'Pong Platform Login Page',
  viewport: 'width=device-width, initial-scale=1',
  icons: ''

}

export default function Layout({ children }: { children: React.ReactNode }) {


  return (
    <div className="flex bg-main flex-col md:flex-row md:overflow-y-auto overflow-y-auto styled-scrollbar xl:h-screen lg:h-screen">
      <LayoutClientDashboard>
        {children}
      </LayoutClientDashboard>
    </div>
  );
}