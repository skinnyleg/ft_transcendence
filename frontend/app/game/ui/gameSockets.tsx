import io from 'socket.io-client';
import { Cookies } from "react-cookie";


const cookies = new Cookies();
const token = cookies.get('token');

const gameSocket = io('http://localhost:8000/GameGateway', {
    // transports: ['websocket'], // Use WebSocket transport protocol
    withCredentials: true, // Required if your server is using credentials
    transportOptions: {
        polling: {
            extraHeaders: {
                "token": token
            }
        }
    }
});

export default gameSocket;