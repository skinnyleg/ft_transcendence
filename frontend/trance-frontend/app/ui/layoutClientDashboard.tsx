'use client'

import { useContext, useState } from "react";
import NavBar from "./navBar";
import { socket, socketContext } from "../context/soketContext";
import { ToastContainer } from "react-toastify";
import { ContextProvider } from "../context/profilePicContext";
import {gameSocket, gameSocketContext} from "../context/gameSockets";

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
        <socketContext.Provider value={socket}>
            <gameSocketContext.Provider value={gameSocket}>
                <ContextProvider>
                <ToastContainer pauseOnFocusLoss={false}  />
                    <div className={`flex-none md:w-0 w-20 lg:w-20`}>
                        <NavBar handleShowMenu={handleShowMenu} />
                    </div>
                    <div className={`flex-grow p-6 mt-5 xl:mt-1 lg:mt-1 md:p-2 ${
                        showMenu  ? 'ml-20 ' : 'lg:ml-4 md:ml-0'
                        } transition-margin duration-300`}>
                        {children}
                    </div>
                </ContextProvider>
            </gameSocketContext.Provider>
        </socketContext.Provider>
    );
}
