import React from "react";
import NavBar from "../ui/navBar";
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-back flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-1 lg:w-32">
        <NavBar />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-6">{children}</div>
    </div>
  );
}