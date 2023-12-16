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
            <div className={`flex-none md:w-10 w-20 lg:w-20`}>
                <NavBar handleShowMenu={handleShowMenu} />
            </div>
            <div className={`flex-grow p-0 xl:overflow-y-hidden lg:overflow-y-hidden overflow-y-auto overflow-x-hidden mt-1 xl:mt-0 lg:mt-1 md:p-0 ${
                showMenu  ? 'ml-[80px] md:ml-[40px]' : 'ml-0 lg:ml-0'
                } transition-margin duration-300`}>
                {children}
            </div>
        </>
    );
}
