import { ConnectedSocket, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { GameService } from "./game.service";
import { Socket, Server } from "socket.io";
import { makeQueue } from "./Queue.service";
import { oponentDto } from "./Dto/userId";
import { validateAndSendError } from "src/utils/validateInputWebsocket";
import { RequestActionDto } from "src/friends/Dto/requestDto";
import { BotDto, GameSettingsDto } from "./Dto/GameSettingsDto";

let num: number = 0;
const width = 20;
        const height = 150;
        let speedR = 20;
        const minY = 0;
        const minX = 0;
        const maxY = 600;
        const maxX = 800;
        const midleVertical = ((maxY - minY) / 2) + minY;
        const midleCanvas = ((maxX- minX) / 2) + minX;
        let currentPositionL = { x: (minX + width), y: midleVertical };
            const newPositionL = { ...currentPositionL }; 
@WebSocketGateway({ namespace: 'GameGateway', cors: {
    origin: process.env.FrontendHost,
    allowedHeaders: ["token"],
    credentials: true
}
})
export class GameGateway {

    constructor(private readonly gameService: GameService, private makeQueue : makeQueue) {}

    @WebSocketServer()

    server: Server;
    async handleConnection(client: Socket){
        console.log('med-doba: ', num++);
        await this.gameService.saveUser(client);
    }

    @SubscribeMessage('PlayQueue')
    QueueMaker(client: Socket){
        this.gameService.handleMatchMaker(client, this.server);
    }
    
    @SubscribeMessage('challengeBot')
    async BotMatchMaker(client : Socket){
        this.gameService.challengeBot(client);
    }

    @SubscribeMessage('StartBotGame')
    async startBotMatch(client : Socket, payload : Record<number, any>){
        const verify = await validateAndSendError(payload, BotDto);
        if (verify.valid == true){
            this.gameService.sendWebSocketError(client, verify.error, false);
        }
        else{
            this.gameService.startBotGame(client, verify.input.width, verify.input.height);
        }
    }
    
    //
    // @SubscribeMessage('arrow')
    // @SubscribeMessage('players-data')
    @SubscribeMessage('arrow')
    async playersinfo(@ConnectedSocket() client : Socket, arrow: any)
    {
        console.log('in backend == ', arrow)
        // const width = 20;
        // const height = 150;
        // let speedR = 20;
        // const minY = 0;
        // const minX = 0;
        // const maxY = 600;
        // const maxX = 800;
        // const midleVertical = ((maxY - minY) / 2) + minY;
        // const midleCanvas = ((maxX- minX) / 2) + minX;
        interface playerInfo {
            name: string,
            picture: string
        };

        interface playersCoordinates {
            playerL: {x: number, y: number}, 
            playerR: {x: number, y: number}
        }
        //*****--*--**
        // let currentPositionL = { x: (minX + width), y: midleVertical };
        //     const newPositionL = { ...currentPositionL }; 
            switch (arrow) {
                case 'UP':
                    newPositionL.y -= speedR;
                    break;
                case 'DOWN':
                    newPositionL.y += speedR;
                    break;
            }
            newPositionL.y = Math.max(minY + height/2, Math.min(newPositionL.y, maxY- height/2));
            // newPositionL.y = Math.max(minY + height/2, Math.min(newPositionL.y, maxY- height/2));
            console.log('y: ',  newPositionL.y)
            // Matter.Body.setPosition(paddleLeft, newPositionLeft, []);
            const data: playersCoordinates = {playerL: newPositionL, playerR: newPositionL};
            console.log('Coordinates in backend: ', data);
            client.emit('players-coordinates', data);
            currentPositionL = newPositionL;
            // currentPositionL = newPositionR;
        //*****--*--**
        // const data: playerInfo[] = [{name: 'med-doba', picture: ''}, {name: 'hmoubal', picture: ''}]; 
        
        console.log('data == ', data);
    }
    //

    @SubscribeMessage('challengeFriend')
    async challengeFriend(client : Socket, payload : Record<string, any>){
        const verify = await validateAndSendError(payload, oponentDto); 
        if (verify.valid == true)
			this.gameService.sendWebSocketError(client, verify.error, false);
        else
            await this.gameService.challenge(client , verify.input.userId);
    }

    @SubscribeMessage('acceptChallenge') 
    async acceptChallenge(client: Socket, payload: Record<string, any>){
		const verify = await validateAndSendError(payload, RequestActionDto);
        if (verify.valid == true){
            this.gameService.sendWebSocketError(client, verify.error, false);
        }
        else
            await this.gameService.acceptChallenge(client, this.server, verify.input.userId, verify.input.requestId);
    }

    @SubscribeMessage('refuseChallenge') 
    async refuseChallenge(client: Socket, payload: Record<string, any>){
		const verify = await validateAndSendError(payload, RequestActionDto);
        if (verify.valid == true){
            this.gameService.sendWebSocketError(client, verify.error, false);
        }
        else
            await this.gameService.refuseChallenge(client, verify.input.userId, verify.input.requestId);
    }

    @SubscribeMessage('startGame')
    async startGame(client: Socket, payload: Record<number, any>){
        const verify = await validateAndSendError(payload, GameSettingsDto);
        if (verify.valid == true){
            this.gameService.sendWebSocketError(client, verify.error, false);
        }
        else
            await this.gameService.startGame(client, this.server, verify.input.userId, verify.input.width, verify.input.height)
    }

    async handleDisconnect(client: Socket) {
		await this.gameService.deleteUser(client)
		client.disconnect();
	}
}