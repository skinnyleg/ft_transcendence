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
            const res = await fetch(`http://localhost:8000/user/Nickname`, {
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
        if (newProfilePic)
            setProfilePic(newProfilePic);
        if (newBackground) setBackgroundPic(newBackground);
        if (newNickname) setNickname(newNickname);
      };
      console.log("1***========", profilePic)
      console.log("2***========", backgroundPic)
      console.log("3***========", nickname)
    return (
        <picturesContext.Provider value={{ profilePic, backgroundPic, nickname, updateProfile }}>
        {children}
      </picturesContext.Provider>
    );
}