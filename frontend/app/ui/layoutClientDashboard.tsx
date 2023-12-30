'use client'

import { useContext, useState } from "react";
import NavBar from "./navBar";
import { socket, socketContext } from "../context/soketContext";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
            <socketContext.Provider value={socket}>
            <ToastContainer limit={0} />
                <div className={`flex-none md:w-0 w-20 lg:w-20`}>
                    <NavBar handleShowMenu={handleShowMenu} />
                </div>
                <div className={`flex-grow p-6 xl:overflow-y-hidden lg:overflow-y-hidden overflow-y-auto overflow-x-hidden mt-5 xl:mt-1 lg:mt-1 md:p-2 ${
                    showMenu  ? 'ml-20 ' : 'lg:ml-4 md:ml-0'
                    } transition-margin duration-300`}>
                    {children}
                </div>
            </socketContext.Provider>
        </>
    );
}
