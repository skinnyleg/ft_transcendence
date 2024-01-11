import io from 'socket.io-client';
import { Cookies } from "react-cookie";
import { createContext } from 'vm';
import React from 'react';


const cookies = new Cookies();
const token = cookies.get('token');

const gameSocket = io('http://localhost:8000/GameGateway', {
    withCredentials: true, // Required if your server is using credentials
    transportOptions: {
        polling: {
            extraHeaders: {
                "token": token
            }
        }
    }
});



export const GameContext = React.createContext<any>({});

export default gameSocket;