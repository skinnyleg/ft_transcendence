'use client'
import { createContext, useState } from "react";
import { Cookies } from "react-cookie";
import io from 'socket.io-client';

const cookies = new Cookies();
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
socket.connect;
socket.on("connect", () => {
    console.log("heeheh", socket);
});

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


export const socketContext = createContext(socket);
export const chatSocketContext = createContext(chatSocket);
