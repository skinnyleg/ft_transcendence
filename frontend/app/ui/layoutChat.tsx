'use client'

import { useState } from "react";
import NavBar from "./navBar";

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
        <>
            <div className={`flex-none md:w-0 w-20 lg:w-20`}>
                <NavBar handleShowMenu={handleShowMenu} />
            </div>
            <div className={`flex-grow p-0 overflow-y-hidden overflow-x-hidden mt-0 xl:mt-0 lg:mt-0 h-screen md:p-0 ${
                showMenu  ? 'ml-[80px] md:ml-[77px] lg:ml-[88px]' : 'ml-0 md:ml-0 lg:ml-24'
                } transition-margin duration-300`}>
                {children}
            </div>
        </>
    );
}
