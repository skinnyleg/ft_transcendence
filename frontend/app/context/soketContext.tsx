'use client'
import React , { createContext } from "react";
import { Cookies } from "react-cookie";
import io from 'socket.io-client';
import { profileNickPic } from "../interfaces/interfaces";
import { toast } from "react-toastify";

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

export const socketContext = createContext(socket);
