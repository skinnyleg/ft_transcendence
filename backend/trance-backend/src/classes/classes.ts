
import { Socket } from 'socket.io'


// export const TOKENEXP: number = 1 * 60 * 60;
export const TOKENEXP: number = 1 * 60 * 180;

export const REFRESHEXP: number = 7 * 24 * 60 * 60;

export const TOKENSECRET: string = process.env.jwtsecret
export const REFRESHSECRET: string = process.env.refreshjwtsecret

export class gatewayUser {
	id: string;
	socket: Socket;
}
 

export class NotificationData {
	requestId: string;
	notifData: {
		userId: string;
		userProfilePic: string;
		description: string;
		typeOfRequest: string;
		responded: boolean;
	};
}
