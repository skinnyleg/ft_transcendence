
import { Socket } from 'socket.io'


export const TOKENEXP: number = 1 * 60 * 500;

export const REFRESHEXP: number = 7 * 24 * 60 * 60;

export const TOKENSECRET: string = process.env.jwtsecret
export const REFRESHSECRET: string = process.env.refreshjwtsecret

export class gatewayUser {
	id: string;
	socket: Socket;

}

export class GameUser{
	id: string;
	socket: Socket;
	isInQueue: boolean;
	IsInGame : boolean;
	isReady : boolean;
	score : number;
	roomId : string;
	win : boolean;
	matchInfos: any;
	theme: string;
	powerUp: string;
}

export class Match{
	id : string;
	winner : {
		nickname : string;
		profilePic: string;
	};
	loser : {
		nickname : string;
		profilePic: string;
	};
    winnerScore : number;
	loserScore : number;
	isMeWhoWon : boolean;
}

export class MatchInfos{
	id: string;
	profilePic: string;
	nickname: string;
	opponentId: string;
}[]

export class PlayerInfo {
	id: string;
	profilePic: string;
	nickname: string;
	opponentId?: string;
}

export class rightPaddle{
    x : number;
    y: number;
    width: number;
    height: number;
    score : number;
}

export class leftPaddle{
    x : number;
    y: number;
    width: number;
    height: number;
    score : number;
}

export class Ball {
	x: number;
	y: number;
	raduis: number;
	speed: number;
	velocityX: number;
	velocityY: number;
}

export class Paddel{
	top_y: Number;
	bottom_y: Number;
}

export class GameFrame{
	top_left_y: Number;
	bottom_left_y: Number;	
	top_right_y: Number;
	bottom_right_y: Number;
}

export class NotificationData {
	requestId: string;
	notifData: {
		userId: string;
		userProfilePic: string;
		description: string;
		typeOfRequest: string;
		responded: boolean;
		channelName?: string;
		user?: string;
	};
}

