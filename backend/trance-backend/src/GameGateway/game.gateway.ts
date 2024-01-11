import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { GameService } from "./game.service";
import { Socket, Server } from "socket.io";
import { makeQueue } from "./Queue.service";
import { oponentDto } from "./Dto/userId";
import { validateAndSendError } from "src/utils/validateInputWebsocket";
import { RequestActionDto } from "src/friends/Dto/requestDto";
import { BotDto, GameSettingsDto } from "./Dto/GameSettingsDto";

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