import { ConnectedSocket, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { GameService } from "./game.service";
import { Socket, Server } from "socket.io";
import { makeQueue } from "./Queue.service";
import { oponentDto } from "./Dto/userId";
import { validateAndSendError } from "src/utils/validateInputWebsocket";
import { RequestActionDto } from "src/friends/Dto/requestDto";
import { BotDto, GameSettingsDto, MoveDto } from "./Dto/GameSettingsDto";
import { UserService } from "src/user/user.service";
import { MatchInfos } from "src/classes/classes";
import { UserStatus } from "@prisma/client";
import { GameCustomizationDto, PowerUpDto, ThemeDto } from "./Dto/ThemeDto";
import { PlayersScoresDto } from "./Dto/PlayersScoresDto";

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
    


    @SubscribeMessage('SaveTheme')
    async saveTheme(client: Socket, payload: Record<string, any>)
    {
        const verify = await validateAndSendError(payload, ThemeDto);
        if (verify.valid == true){
            this.gameService.sendWebSocketError(client, verify.error, false);
        }
        else{
            this.gameService.saveTheme(client, verify.input.theme);
        }
    }

    @SubscribeMessage('SavePowerUp')
    async SavePowerUp(client: Socket, payload: Record<string, any>)
    {
        const verify = await validateAndSendError(payload, PowerUpDto);
        if (verify.valid == true){
            this.gameService.sendWebSocketError(client, verify.error, false);
        }
        else{
            this.gameService.savePowerUp(client, verify.input.powerUp);
        }
    }

    @SubscribeMessage('ImReady')
    async QueueReady(client: Socket){
        try {
            var queueLength =  this.makeQueue.getQueue().length;
            if (queueLength >= 2){
                const usr = this.gameService.getUserBySocketId(client.id);
                const user1 = this.makeQueue.dequeue(usr);
                const user2 = this.makeQueue.dequeue(null);
                const newGameId = await this.userService.createGame(user1.id, user2.id);
                if (!newGameId)
                    return ;
                user1.roomId= newGameId;
                user2.roomId= newGameId;
                this.gameService.players_arr.set(user1.roomId, [user1, user2]);
                this.gameService.players_arr.get(user1.roomId)[0].isInQueue = false;
                this.gameService.players_arr.get(user1.roomId)[1].isInQueue = false;
                user1.socket.join(user1.roomId);
                user2.socket.join(user2.roomId);
                this.gameService.players_arr.get(user1.roomId)[0].IsInGame = true;
                this.gameService.players_arr.get(user1.roomId)[1].IsInGame = true;
                this.server.to(this.gameService.players_arr.get(user1.roomId)[0].roomId).emit('MatchReady', {roomId: user1.roomId});
                this.makeQueue.deleteUserQueue(user1);
            }
        }
        catch (error)
        {
            this.gameService.sendWebSocketError(client, "Error on ImReady Event", false);
        }
    }




    @SubscribeMessage('arrow')
    async movePaddle(client: Socket, payload: Record<string, any>)
    {
        const verify = await validateAndSendError(payload, MoveDto);
        if (verify.valid == true){
            this.gameService.sendWebSocketError(client, verify.error, false);
        }
        else
        {
            try {
                const user = this.gameService.getUserBySocketId(client.id);
                if (user === undefined)
                    return ;
                const roomId = this.gameService.findGameUserById(user.id);
                if (roomId === null)
                    return ;
                if (this.gameService.players_arr.get(roomId)[1].isReady == false || this.gameService.players_arr.get(roomId)[0].isReady == false)
                    return ;
                if (this.gameService.players_arr.get(roomId)[0].IsInGame === false || this.gameService.players_arr.get(roomId)[0].IsInGame === false){
                    return ;
                }
                const move = verify.input.move;
                switch (move) {
                    case 'UP':
                        if (user.id === this.gameService.players_arr.get(roomId)[0].id)
                        {
                            this.gameService.players_arr.get(roomId)[1].socket.emit('leftPaddle', 'UP')
                            this.gameService.players_arr.get(roomId)[0].socket.emit('leftPaddle', 'UP')
                        }
                        else
                        {
                            this.gameService.players_arr.get(roomId)[1].socket.emit('rightPaddle', 'UP')
                            this.gameService.players_arr.get(roomId)[0].socket.emit('rightPaddle', 'UP')  
                        }
                        break;
                    case 'DOWN':
                        if (user.id === this.gameService.players_arr.get(roomId)[0].id)
                        {
                            this.gameService.players_arr.get(roomId)[1].socket.emit('leftPaddle', 'DOWN')
                            this.gameService.players_arr.get(roomId)[0].socket.emit('leftPaddle', 'DOWN')
                        }
                        else
                        {
                            this.gameService.players_arr.get(roomId)[1].socket.emit('rightPaddle', 'DOWN')
                            this.gameService.players_arr.get(roomId)[0].socket.emit('rightPaddle', 'DOWN')  
                        }
                        break;
                }
            }
            catch (error)
            {
                this.gameService.sendWebSocketError(client, "Error on arrow Event", false);
            }
        }
    }



    @SubscribeMessage('EndGame')
    async handleEndOfMatch(client: Socket, payload: Record<string, any>)
    {
        const verify = await validateAndSendError(payload, PlayersScoresDto);
        if (verify.valid == true){
            this.gameService.sendWebSocketError(client, verify.error, false);
        }
        else
        {
            try {
                const user = this.gameService.getUserBySocketId(client.id)
                if (user === undefined)
                    return ;
                await this.gameService.handleMatchFinish(verify.input, user.roomId, user.id);
            }
            catch (error)
            {
                this.gameService.sendWebSocketError(client, "Error on EndGame Event", false);
            }
        }
    }

    @SubscribeMessage('abort')
    async exitUsersFromGame(client: Socket)
    {
        try {
            const usr = this.gameService.getUserBySocketId(client.id);
            if (usr === undefined)
                return ;
            const roomId = this.gameService.findGameUserById(usr.id);
            if (roomId === null)
            {
                client.emit('readyToQueue');
                return ;
            }
            await this.gameService.deleteGame(roomId, client);
            this.server.to(roomId).emit('abortGame');
            client.emit('readyToQueue');
        }
        catch (error)
        {
            this.gameService.sendWebSocketError(client, "Error on abort Event", false);
        }
    }


    @SubscribeMessage('GameExist')
    async doesGameIdExists(client: Socket, payload: any)
    {
        if (payload.roomId === undefined)
            return ;
        const user = this.gameService.getUserBySocketId(client.id);
        if (user === undefined)
            return ;

        const roomId = this.gameService.findGameUserById(user.id);
        if (roomId === null)
            client.emit('GameIdNotValid');
    }

    @SubscribeMessage('getGameData')
    async getGameData(client: Socket)
    {
        try {
            const user1 = this.gameService.getUserBySocketId(client.id);
            if (user1 === undefined)
                return ;
            if (this.gameService.players_arr.get(user1.roomId) === undefined)
                return;
            const infos : MatchInfos = await this.userService.genarateMatchInfo(this.gameService.players_arr.get(user1.roomId)[0].id, this.gameService.players_arr.get(user1.roomId)[1].id, user1.roomId)
            this.server.to(this.gameService.players_arr.get(user1.roomId)[0].roomId).emit('gameData', infos);
        }
        catch (error)
        {
            this.gameService.sendWebSocketError(client, "Error on getGameData Event", false);
        }
    }

    @SubscribeMessage('getPlayersSettings')
    async getPlayersSettings(client: Socket)
    {
        try {
            const user1 = this.gameService.getUserBySocketId(client.id);
            if (user1 === undefined)
                return ;
            if (this.gameService.players_arr.get(user1.roomId) === undefined)
                return;
            const theme0  = this.gameService.players_arr.get(user1.roomId)[0].theme;
            const theme1  = this.gameService.players_arr.get(user1.roomId)[1].theme;
            const power0  = this.gameService.players_arr.get(user1.roomId)[0].powerUp;
            const power1  = this.gameService.players_arr.get(user1.roomId)[1].powerUp;
            const roomId = this.gameService.players_arr.get(user1.roomId)[1].roomId;
            this.gameService.players_arr.get(roomId)[0].socket.emit('playerSettings', ({theme: theme0, power: power0, id: 0, powerOpponenent: power1}))
            this.gameService.players_arr.get(roomId)[1].socket.emit('playerSettings', ({theme: theme1, power: power1, id: 1, powerOpponenent: power0}))
        }
        catch (error)
        {
            this.gameService.sendWebSocketError(client, "Error on getPlayersSettings Event", false);
        }
    }




    @SubscribeMessage('leaveQueue')
    async leaveQueue(client: Socket)
    {
        try {
            const usr = this.gameService.getUserBySocketId(client.id);
            if (usr === undefined)
                return ;
            const user1 = this.makeQueue.dequeue(usr);
            const que2 = this.makeQueue.getQueue();
            usr.isReady = false;
            usr.IsInGame = false;
            usr.matchInfos = [];
            usr.isInQueue = false;
            usr.roomId = '';
            usr.win = false;
            await this.userService.updateStatus(usr.id, UserStatus.ONLINE);
            await this.gameService.emitToFriendsStatusGame(usr.id, UserStatus.ONLINE);
        }
        catch (error)
        {
            this.gameService.sendWebSocketError(client, "Error on leaveQueue Event", false);
        }
    }

    @SubscribeMessage('PlayQueue')
    async QueueMaker(client: Socket){
        try {
            await this.gameService.handleMatchMaker(client);
        }
        catch (error)
        {
            this.gameService.sendWebSocketError(client, "Error on PlayQueue Event", false);
        }
    }


    @SubscribeMessage('SaveSettings')
    async SaveSettings(client: Socket, payload: Record<string, any>){
        const verify = await validateAndSendError(payload, GameCustomizationDto);
        if (verify.valid == true){
            this.gameService.sendWebSocketError(client, verify.error, false);
        }
        else
        {
            try {
                this.gameService.saveGameSettings(client, this.server, verify.input.theme, verify.input.powerUp);
                client.emit('saved');
            }
            catch (error)
            {
                this.gameService.sendWebSocketError(client, "Error on SaveSettings Event", false);
            }
        }

    }

    @SubscribeMessage('endBotMatch')
    async endBotGame(client : Socket){
        try {
            let user = this.gameService.getUserBySocketId(client.id)
            user.isReady = false;
            user.IsInGame = false;
            user.isInQueue = false;
            await this.userService.updateStatus(user.id, UserStatus.ONLINE);
            await this.gameService.emitToFriendsStatusGame(user.id, UserStatus.ONLINE);
            client.emit('redirectToDashboard')
        }
        catch (error)
        {
            this.gameService.sendWebSocketError(client, "Error on endBotMatch Event", false);
        }
    }

    @SubscribeMessage('leaveGameBot')
    leaveGameBot(client : Socket){
        try {
            let user = this.gameService.getUserBySocketId(client.id)
            if (user === undefined)
                return ;
            user.isReady = false;
            user.IsInGame = false;
            user.isInQueue = false;
            this.userService.updateStatus(user.id, UserStatus.ONLINE);
            this.gameService.emitToFriendsStatusGame(user.id, UserStatus.ONLINE);
        }
        catch (error)
        {
            this.gameService.sendWebSocketError(client, "Error on leaveGameBot Event", false);
        }
    }

    @SubscribeMessage('PlayBot')
    async BotMatchMaker(client : Socket, payload: any){
        const verify = await validateAndSendError(payload, GameCustomizationDto);
        if (verify.valid == true){
            this.gameService.sendWebSocketError(client, verify.error, false);
        }
        else
        {
            try {
                await this.gameService.challengeBot(client, verify.input);
            }
            catch (error)
            {
                this.gameService.sendWebSocketError(client, "Error on PlayBot Event", false);
            }
        }
    }

    @SubscribeMessage('StartBotGame')
    async startBotMatch(client : Socket, payload : Record<number, any>){
        const verify = await validateAndSendError(payload, BotDto);
        if (verify.valid == true){
            this.gameService.sendWebSocketError(client, verify.error, false);
        }
        else{
            try {
                await this.gameService.startBotGame(client, verify.input.width, verify.input.height);
            }
            catch (error)
            {
                this.gameService.sendWebSocketError(client, "Error on StartBotGame Event", false);
            }
        }
    }

    @SubscribeMessage('challengeFriend')
    async challengeFriend(client : Socket, payload : Record<string, any>){
        const verify = await validateAndSendError(payload, oponentDto); 
        if (verify.valid == true)
			this.gameService.sendWebSocketError(client, verify.error, false);
        else
        {
            try {
                await this.gameService.challenge(client , verify.input.userId);
            }
            catch (error)
            {
                this.gameService.sendWebSocketError(client, "Error on challengeFriend Event", false);
            }
        }
    }

    @SubscribeMessage('acceptChallenge') 
    async acceptChallenge(client: Socket, payload: Record<string, any>){
		const verify = await validateAndSendError(payload, RequestActionDto);
        if (verify.valid == true){
            this.gameService.sendWebSocketError(client, verify.error, false);
        }
        else
        {
            try {
                await this.gameService.acceptChallenge(client, this.server, verify.input.userId, verify.input.requestId);
            }
            catch (error)
            {
                this.gameService.sendWebSocketError(client, "Error on acceptChallenge Event", false);
            }
        }
    }

    @SubscribeMessage('refuseChallenge') 
    async refuseChallenge(client: Socket, payload: Record<string, any>){
		const verify = await validateAndSendError(payload, RequestActionDto);
        if (verify.valid == true){
            this.gameService.sendWebSocketError(client, verify.error, false);
        }
        else
        {
            try {
                await this.gameService.refuseChallenge(client, verify.input.userId, verify.input.requestId);
            }
            catch (error)
            {
                this.gameService.sendWebSocketError(client, "Error on refuseChallenge Event", false);
            }
        }
    }

    @SubscribeMessage('startGame')
    async startGame(client: Socket, payload: Record<number, any>){
        const verify = await validateAndSendError(payload, GameSettingsDto);
        if (verify.valid == true){
            this.gameService.sendWebSocketError(client, verify.error, false);
        }
        else{
            try {
                const player = this.gameService.getUserBySocketId(client.id);
                player.isReady = true;
                await this.gameService.startGame(client, this.server, verify.input.roomId, verify.input.width, verify.input.height)
            }
            catch (error)
            {
                this.gameService.sendWebSocketError(client, "Error on startGame Event", false);
            }
        }
    }

    async handleDisconnect(client: Socket) {
        try {
            const user = this.gameService.getUserBySocketId(client.id)
            await this.makeQueue.deleteUserQueue(user)
            await this.gameService.deleteUser(client, this.server)
            client.disconnect();
        }
        catch (error)
        {
            this.gameService.sendWebSocketError(client, "Error on Disconnet Event", true);
        }
	}
}