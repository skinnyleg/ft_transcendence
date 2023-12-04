'use client';
import NavBar from "@/app/ui/navBar";
import React, { useState } from "react";
 
export default function Layout({ children }: { children: React.ReactNode }) {
  const [showMenu, setShowMenu] = useState(false);

  const handleShowMenu = (showMenu: boolean) => {
    setShowMenu(showMenu);
  }

  return (
    <div className="flex bg-back flex-col md:flex-row h-screen md:overflow-hidden">
      <div className={`flex-none md:w-10 w-20 lg:w-20`}>
        <NavBar handleShowMenu={handleShowMenu} />
      </div>
      <div className={`flex-grow p-6 md:overflow-y-auto md:p-2 ${
          showMenu  ? 'ml-20 ' : 'ml-5'
        } transition-margin duration-300`}>{children}</div>
    </div>
  );
}