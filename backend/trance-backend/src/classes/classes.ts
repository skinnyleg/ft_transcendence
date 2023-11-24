
import { Socket } from 'socket.io'


export const TOKENEXP: number = 1 * 60 * 60;

export const REFRESHEXP: number = 7 * 24 * 60 * 60;

export const TOKENSECRET: string = process.env.jwtsecret
export const REFRESHSECRET: string = process.env.refreshjwtsecret

export class gatewayUser {
	id: string;
	socket: Socket;
}
