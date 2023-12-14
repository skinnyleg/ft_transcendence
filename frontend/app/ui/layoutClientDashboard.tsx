'use client'

import { useState } from "react";
import NavBar from "./navBar";

export default function LayoutClientDashboard({
    children
  }: {
    children: React.ReactNode
  }) {

    const [showMenu, setShowMenu] = useState(false);
    const handleShowMenu = (showMenu: boolean) => {
        setShowMenu(showMenu);
    }
    
    return (
        <>
            <div className={`flex-none md:w-10 w-20 lg:w-20`}>
                <NavBar handleShowMenu={handleShowMenu} />
            </div>
            <div className={`flex-grow p-6 xl:overflow-y-hidden lg:overflow-y-hidden overflow-y-auto overflow-x-hidden mt-10 xl:mt-1 lg:mt-1 md:p-2 ${
                showMenu  ? 'ml-20 ' : 'lg:ml-4 md:ml-2'
                } transition-margin duration-300`}>
                {children}
            </div>
        </>
    );
}
