'use client'

import { useState } from "react";
import NavBar from "./navBar";
import { chatSocket, chatSocketContext } from "../context/soketContext";

export default function LayoutChat({
    children
  }: {
    children: React.ReactNode
  }) {

    const [showMenu, setShowMenu] = useState(false);

    const handleShowMenu = (showMenu: boolean) => {
        setShowMenu(showMenu);
    }

    return (
        <chatSocketContext.Provider value={chatSocket}>
            <main className={`h-screen`}>
                <div className={`flex-none md:w-0 w-20 lg:w-20`}>
                    <NavBar handleShowMenu={handleShowMenu} />
                </div>
                <div className={`flex-grow p-0 mt-0 md:p-2 overflow-y-hidden overflow-x-hidden  h-screen ${
                    showMenu  ? 'ml-[80px] md:ml-[77px] lg:ml-[88px]' : 'ml-0 md:ml-0 lg:ml-20'
                    } transition-margin duration-300`}>
                    {children}
                </div>
            </main>
        </chatSocketContext.Provider>
    );
}
