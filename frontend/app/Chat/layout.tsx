'use client';
import React, { useState } from "react";
import NavBar from "../ui/navBar";
 
export default function Layout({ children }: { children: React.ReactNode }) {
  const [showMenu, setShowMenu] = useState(false);

  const handleShowMenu = (showMenu: boolean) => {
    setShowMenu(showMenu);
  }

  return (
		<div className="flex bg-back flex-col md:flex-row md:overflow-hidden">
			<div className={`flex-none md:w-10 w-20 lg:w-20`}>
				<NavBar handleShowMenu={handleShowMenu} />
			</div>
			<div className={`flex-grow ${
				showMenu  ? 'ml-[75px] sm:ml-5 md:ml-14' : 'ml-0 sm:ml-0 md:ml-0 lg:ml-5'
				} transition-margin duration-300`}>{children}</div>
		</div>
	);
}
