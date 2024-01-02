'use client'
import React, { createContext, useState } from "react";
import { Cookies } from "react-cookie";
import io from 'socket.io-client';
import { profileNickPic } from "../interfaces/interfaces";

const cookies = new Cookies();
// const [profilePic, setProfilePic] = useState('');
const token = cookies.get('token');
export const socket = io("http://localhost:8000/friendsGateway", {
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

export const chatSocket = io("http://localhost:8000/chatGateway", {
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
      const res = await fetch(`http://localhost:8000/user/Nickname`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
          const nickname : profileNickPic = await res.json();
          return(nickname.profilePic);
      }
    } catch (error : any) {
    //   toast.error(error.response.data.message[0]);
      return("");
    }
};


export const avatarImage = getnickname();

export const profilePicContext = createContext(avatarImage);

export const socketContext = createContext(socket);
export const chatSocketContext = createContext(chatSocket);
export const ChatContext = React.createContext<any>({});