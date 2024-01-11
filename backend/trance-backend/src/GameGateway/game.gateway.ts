import { ConnectedSocket, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { GameService } from "./game.service";
import { Socket, Server } from "socket.io";
import { makeQueue } from "./Queue.service";
import { oponentDto } from "./Dto/userId";
import { validateAndSendError } from "src/utils/validateInputWebsocket";
import { RequestActionDto } from "src/friends/Dto/requestDto";
import { BotDto, GameSettingsDto } from "./Dto/GameSettingsDto";
import { UserService } from "src/user/user.service";

@WebSocketGateway({ namespace: 'GameGateway', cors: {
    origin: process.env.FrontendHost,
    allowedHeaders: ["token"],
    credentials: true
}
})
export class GameGateway {
    
    constructor(private readonly gameService: GameService, private makeQueue : makeQueue, private userService: UserService) {}
    
    @WebSocketServer()
    
    server: Server;
    async handleConnection(client: Socket){
        await this.gameService.saveUser(client);
    }
    
    @SubscribeMessage('ImReady')
    QueueReady(client: Socket){
        var queueLength =  this.makeQueue.getQueue().length;
        // console.log("Queue length 1111 ===  ", queueLength);
        if (queueLength >= 2){
            const player1 = this.makeQueue.dequeue();
            var user1 = this.gameService.getUserBySocketId(player1.id);
            const player2 = this.makeQueue.dequeue();
            var user2 = this.gameService.getUserBySocketId(player2.id);
            user1.roomId= user2.id;
            user2.roomId= user2.id;
            // add user to player_arr √
            this.gameService.players_arr.set(user1.roomId, [user1, user2]);
            this.gameService.players_arr.get(user1.roomId)[0].isInQueue = false;
            this.gameService.players_arr.get(user1.roomId)[1].isInQueue = false;
            user1.socket.join(user1.roomId);
            user2.socket.join(user2.roomId);
            this.gameService.players_arr.get(user1.roomId)
            // update Status
            this.gameService.players_arr.get(user1.roomId)[0].IsInGame = true;
            this.gameService.players_arr.get(user1.roomId)[1].IsInGame = true;
            // Match is Ready Backend can start Send corrdinations √
            const infos = this.userService.genarateMatchInfo(this.gameService.players_arr.get(user1.roomId)[0].id, this.gameService.players_arr.get(user1.roomId)[1].id)
            this.server.to(this.gameService.players_arr.get(user1.roomId)[0].roomId).emit('MatchReady', infos);
        }
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
        else{
            const player = this.gameService.getUserBySocketId(client.id);
            player.isReady = true;
            await this.gameService.startGame(client, this.server, verify.input.roomId, verify.input.width, verify.input.height)
        }
    }

    async handleDisconnect(client: Socket) {
		await this.gameService.deleteUser(client)
		client.disconnect();
	}
}