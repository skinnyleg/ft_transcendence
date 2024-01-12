'use client'

import { useState } from "react";
import NavBar from "./navBar";
import { socketContext , socket} from "@/app/context/soketContext";
import { ToastContainer, toast } from "react-toastify";
import { ContextProvider } from "../context/profilePicContext";
import { ContextFriendProvider } from "../context/profileContext";

export default function LayoutClinet({
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
            <ContextProvider>
                <ToastContainer pauseOnFocusLoss={false}  />
                <div className={`flex-none md:w-0 w-20 lg:w-20 xl:w-20`}>
                    <NavBar handleShowMenu={handleShowMenu} />
                </div>
                <div className={`flex-grow lg:p-6 xl:p-6 md:p-2 p-2 xl:mr-2 ${
                    showMenu  ? 'ml-20 ' : 'ml-0'} transition-margin duration-300`}>
                    {children}
                </div>
            </ContextProvider>
        </socketContext.Provider>
    );
}