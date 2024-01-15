import { ConnectedSocket, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { GameService } from "./game.service";
import { Socket, Server } from "socket.io";
import { makeQueue } from "./Queue.service";
import { oponentDto } from "./Dto/userId";
import { validateAndSendError } from "src/utils/validateInputWebsocket";
import { RequestActionDto } from "src/friends/Dto/requestDto";
import { BotDto, GameSettingsDto } from "./Dto/GameSettingsDto";
import { UserService } from "src/user/user.service";
import { MatchInfos } from "src/classes/classes";
import { UserStatus } from "@prisma/client";
import { ThemeDto } from "./Dto/ThemeDto";

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
    async QueueReady(client: Socket){
        var queueLength =  this.makeQueue.getQueue().length;
        var queueds =  this.makeQueue.getQueue();
        console.log("Queue length 1111 ===  ", queueLength);
        console.log("Queue  ===  ", queueds);
        if (queueLength >= 2){
            const usr = this.gameService.getUserBySocketId(client.id);
            const user1 = this.makeQueue.dequeue(usr);
            const user2 = this.makeQueue.dequeue(null);
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

            const theme0  = this.gameService.players_arr.get(user1.roomId)[0].theme;
            const theme1  = this.gameService.players_arr.get(user1.roomId)[1].theme;
            const power0  = this.gameService.players_arr.get(user1.roomId)[0].powerUp;
            const power1  = this.gameService.players_arr.get(user1.roomId)[1].powerUp;
            const roomId = this.gameService.players_arr.get(user1.roomId)[1].roomId;
            console.log('ops0 : ', theme0, power0);
            console.log('ops1 : ', theme1, power1);
            const infos : MatchInfos = await this.userService.genarateMatchInfo(this.gameService.players_arr.get(user1.roomId)[0].id, this.gameService.players_arr.get(user1.roomId)[1].id, roomId)
            this.gameService.players_arr.get(roomId)[0].socket.emit('playerSettings', ({theme: theme0, power: power0, id: 0, powerOpponenent: power1}))
            this.gameService.players_arr.get(roomId)[1].socket.emit('playerSettings', ({theme: theme1, power: power1, id: 1, powerOpponenent: power0}))
            this.server.to(this.gameService.players_arr.get(user1.roomId)[0].roomId).emit('MatchReady', infos);
            this.makeQueue.deleteUserQueue(user1);
        }
        console.log("Queue length 22222 ===  ", queueLength);

    }

    @SubscribeMessage('PlayQueue')
    async QueueMaker(client: Socket, payload: Record<string, any>){
        // console.log("palsss", payload);
        // const verify = await validateAndSendError(payload, ThemeDto);
        // if (verify.valid == true){
        //     this.gameService.sendWebSocketError(client, verify.error, false);
        // }
        this.gameService.handleMatchMaker(client, this.server, payload.theme_, payload.powerUp_);
    }

    @SubscribeMessage('endBotMatch')
    endBotGame(client : Socket){
        let user = this.gameService.getUserBySocketId(client.id)
        user.isReady = false;
        user.IsInGame = false;
        user.isInQueue = false;
        console.log("is Player In Gmae or Queue 00000");
        this.userService.updateStatus(user.id, UserStatus.ONLINE);
        this.gameService.emitToFriendsStatusGame(user.id, UserStatus.ONLINE);
    }

    @SubscribeMessage('PlayBot')
    async BotMatchMaker(client : Socket, payload: any){
        this.gameService.challengeBot(client, payload);
        // client.emit('gameBotTheme', payload);
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
        const user = this.gameService.getUserBySocketId(client.id)
        await this.makeQueue.deleteUserQueue(user)
		await this.gameService.deleteUser(client, this.server)
		client.disconnect();
	}
}