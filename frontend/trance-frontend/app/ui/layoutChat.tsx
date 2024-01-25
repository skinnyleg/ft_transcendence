'use client'

import { useState } from "react";
import NavBar from "./navBar";
import { chatSocket, chatSocketContext, socketContext , socket } from "../context/soketContext";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ContextProvider } from "../context/profilePicContext";
import Image from "next/image";
import { gameSocket, gameSocketContext } from "../context/gameSockets";
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
        <socketContext.Provider value={socket}>
            <gameSocketContext.Provider value={gameSocket}>
                <ContextProvider>
                    <chatSocketContext.Provider value={chatSocket}>
                    <ToastContainer pauseOnFocusLoss={false}  />
                        <main className={`h-screen`}>
                            <div className={`flex-none md:w-0 w-20 lg:w-20`}>
                                <NavBar handleShowMenu={handleShowMenu} />
                            </div>
                            <div className={`flex-grow  p-0 mt-0 md:p-2 overflow-y-hidden overflow-x-hidden  h-screen ${
                                showMenu  ? 'ml-[80px] md:ml-[77px] lg:ml-[88px]' : 'ml-0 md:ml-0 lg:ml-20'
                            } transition-margin duration-300`}>
                                {children}
                            </div>
                        </main>
                    </chatSocketContext.Provider>
                </ContextProvider>
            </gameSocketContext.Provider>
        </socketContext.Provider>
        </>
    );
}
