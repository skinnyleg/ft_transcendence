'use client'
import React, { createContext, useState } from "react";
import { Cookies } from "react-cookie";
import io from 'socket.io-client';
import { profileNickPic } from "../interfaces/interfaces";

const cookies = new Cookies();
let profilePic = '';
let backgroundPic = '';

const token = cookies.get('token');
export const socket = io(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/friendsGateway`, {
    withCredentials: true,
    transportOptions: {
        polling: {
            extraHeaders: {
                "token": token
            }
        }
    }
});
// socket.connect;
// socket.on("connect", () => {
//     console.log("heeheh", socket);
// });

export const chatSocket = io(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/chatGateway`, {
    withCredentials: true,
    transportOptions: {
        polling: {
            extraHeaders: {
                "token": token
            }
        }
    }
});

chatSocket.on('failed', (data: string) => {
    console.log('got error from backend == ', data);
})

const getnickname = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/user/Nickname`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
          const nickname : profileNickPic = await res.json();
          profilePic = nickname.profilePic
          backgroundPic = nickname.backgroundPic
          return(nickname);
      }
    } catch (error : any) {
    //   toast.error(error.response.data.message[0]);
      return(undefined);
    }
};

getnickname();

export const profileContext = createContext<any>({profilePic, backgroundPic});

export const socketContext = createContext(socket);
export const chatSocketContext = createContext(chatSocket);
export const ChatContext = React.createContext<any>({});