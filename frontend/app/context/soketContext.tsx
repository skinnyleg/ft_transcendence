'use client'
import React , { createContext } from "react";
import { Cookies } from "react-cookie";
import io from 'socket.io-client';
import { profileNickPic } from "../interfaces/interfaces";
import { toast } from "react-toastify";

const cookies = new Cookies();
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


// chatSocket.on('connect', () => {
//     // chatSocket.emit('getUserChannels')
// })

// if (chatSocket.connected)
// {
//     chatSocket.emit('getUserChannels')
// }

export const socketContext = createContext(socket);
export const chatSocketContext = createContext(chatSocket);
export const ChatContext = React.createContext<any>({});