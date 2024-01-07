'use client'

import React , { createContext, useEffect, useState } from "react";
import { profileNickPic } from "../interfaces/interfaces";
import { toast } from "react-toastify";

export const picturesContext = createContext<any>({});


export const ContextProvider = ({ children }: { children: any })=> {
    
    const [profilePic, setProfilePic] = useState('');
    const [backgroundPic, setBackgroundPic] = useState('');
    const [nickname, setNickname] = useState('');
    useEffect(() => {
        const getnickname = async () => {
          try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/user/Nickname`, {
              method: "GET",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
            });
            if (res.ok) {
              const nickname : profileNickPic = await res.json();
              setProfilePic(nickname.profilePic);
              setBackgroundPic(nickname.BackgroundPic);
              setNickname(nickname.nickname);
              console.log("nick:", nickname);
            }
          } catch (error) {
            toast.error('Error fetching data');
          }
        };
        getnickname();
      }, []);
      const updateProfile = (newProfilePic: string, newBackground: string, newNickname: string) => {
        console.log("1***========", newProfilePic)
        console.log("2***========", newBackground)
        console.log("3***========", newNickname)
        if (newProfilePic)
            setProfilePic(newProfilePic);
        if (newBackground) setBackgroundPic(newBackground);
        if (newNickname) setNickname(newNickname);
      };
    return (
        <picturesContext.Provider value={{ profilePic, backgroundPic, nickname, updateProfile }}>
        {children}
      </picturesContext.Provider>
    );
}