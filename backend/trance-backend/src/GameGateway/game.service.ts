import { ConflictException, Injectable, NotAcceptableException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Status, User, UserStatus } from "@prisma/client";
import { Socket, Server } from "socket.io";
import { Ball, GameUser, MatchInfos, gatewayUser, leftPaddle } from "src/classes/classes";
import { UserService } from "src/user/user.service";
import { makeQueue, room } from "./Queue.service";
import { FriendsService } from "src/friends/friends.service";


@Injectable()
export class GameService {
    constructor(private jwtService: JwtService,
        private userService: UserService,
        private makeQueue : makeQueue,
        private room: room,
        private friendsService: FriendsService){}

    private Users: GameUser[] = [];
    public players_arr = new Map<string, GameUser[]>();
    
    sendWebSocketError(client: Socket, errorMessage: string, exit: boolean) 
	{
		client.emit('error', { message: errorMessage });
		if (exit == true)
			client.disconnect();
	}

    async saveUser(client: Socket) {
		let user: User;
		try {
			const token: string = client.handshake.headers.token as string;
			const payload = await this.jwtService.verifyAsync(token, { secret: process.env.jwtsecret })
			user = await this.userService.findOneById(payload.sub);
            this.Users.push({id: user.id, socket: client, isInQueue: false, IsInGame : false, isReady: false, score: 0, roomId: '', win: false, matchInfos: {}, theme: '', powerUp: ''});
            // console.log("Users  ===  ", this.Users);
		}
		catch (error)
		{
			this.sendWebSocketError(client, "User not found", true)
			return;
		}
	}

    async deleteUser(client: Socket, server: Server){
        try {
            const user = this.getUserBySocketId(client.id);
            server.to(user.roomId).emit("abort", true);
            const pl1 = this.players_arr.get(user.roomId)[0];
            const pl2 = this.players_arr.get(user.roomId)[1];
            for (const player of this.Users){
                if (player.id == pl1.id || player.id == pl2.id){
                    player.isInQueue = false;
                    player.IsInGame = false;
                    player.isReady = false;
                    player.matchInfos = [];
                    player.roomId = '';
                    player.win = false;
                    await this.userService.updateStatus(player.id, UserStatus.ONLINE)
                    await this.emitToFriendsStatusGame(player.id, UserStatus.ONLINE);
                }
            }
            this.players_arr.delete(user.roomId);
			await this.userService.updateStatus(user.id, UserStatus.ONLINE)
            await this.emitToFriendsStatusGame(user.id, UserStatus.ONLINE);
			this.Users = this.Users.filter((u) => u.socket.id !== client.id);
		}
		catch (error)
		{
			this.sendWebSocketError(client, "Error on disconnecting", true)
		}
    }

    findGameUserById(gameUserId: string)
    {
        for (const [key, gameUsers] of this.players_arr) {
          const foundUser = gameUsers.find((gameUser) => gameUser.id === gameUserId);
          if (foundUser) {
            return key; // Return the found GameUser object
          }
        }
        return null; // Return undefined if the GameUser object is not found
    }


    deleteGame(roomId: string, socketId: string)
    {
        console.log('roomId === ', roomId);
        console.log('all rooms === ', this.players_arr);
        const user1 = this.players_arr.get(roomId)[0];
        const user2 = this.players_arr.get(roomId)[1];

        if (user1.socket.id !== socketId)
        user1.socket.emit('abortGame');
        if (user2.socket.id !== socketId)
            user2.socket.emit('abortGame');
        this.players_arr.delete(roomId);
        // console.log('room is === ', gameRoom);
    }

    getUserBySocketId(socketId: string): GameUser | undefined {
        return this.Users.find((user) => user.socket.id === socketId);
    }
  
    getUserById(userId: string): GameUser | undefined {
        return this.Users.find((user) => user.id === userId);
    }

    /** challenge Bot */
    async challengeBot(client : Socket, playload: any){
        const player = this.getUserBySocketId(client.id);
        const playerStatus = await this.userService.getStatus(player.id);
        if (playerStatus === UserStatus.IN_GAME || playerStatus ===  UserStatus.IN_QUEUE)
        {
            player.socket.emit('notification', `Already in Game Or Queue`);
            return ;
        }
        player.IsInGame = true;
        const infos = await this.userService.genarateMatchInfo(player.id, null, null);
        // Emit player infos to redirect him
        client.on('ImReadyBot', () => {
            client.emit('BotReady', infos);
            console.log();
            client.emit('gameBotTheme', playload);
        }) ;
        client.on('ballPermission', () => { client.emit('drawBallBot') });
    }
    /** End c */

    async challenge(client: Socket, opponentId){
        const challenger = this.getUserBySocketId(client.id);
        if (!challenger){
            client.emit('error', "Wrong Nickname")
            return ;
        }

        const opponent = this.getUserById(opponentId);
        const player1Status = await this.userService.getStatus(challenger.id);
        const player2Status  = await this.userService.getStatus(opponentId);
        
        if (player1Status === UserStatus.OFFLINE || player2Status ===  UserStatus.OFFLINE){
            challenger.socket.emit('error', `Player OFFLINE`);
            return ;
        }
        if (player1Status === UserStatus.IN_GAME || player2Status ===  UserStatus.IN_GAME
            || player1Status === UserStatus.IN_QUEUE || player2Status ===  UserStatus.IN_QUEUE)
        {
            challenger.socket.emit('error', `already in Game Or In Queue`);
            return ;
        }
        if (opponent.IsInGame === true || challenger.IsInGame === true){
            challenger.socket.emit('error', `Already in Game`);
            return ;
        }
        try {
            
            const reqId = await this.userService.saveChallengeRequest(challenger.id, opponentId);
            if (opponent !== undefined)
            {
                const notif = await this.userService.generateNotifData(reqId);
                opponent.socket.emit('notifHistory', notif);
                challenger.socket.emit('notification', "Your challenge has been submit");
            }
        }  
        catch(error)
		{
			this.sendWebSocketError(challenger.socket, error.message, false);
		}
    }

    async acceptChallenge(client: Socket, server : Server, opponentId :string, requestID: string){
        const me = this.getUserBySocketId(client.id);
        const challenger = this.getUserById(opponentId);
        
        if (challenger === undefined){
            me.socket.emit('notification', 'Wrong Id');
        }
        const player1Status = await this.userService.getStatus(me.id);
        const player2Status  = await (this.userService.getStatus(challenger.id));
        if (player1Status === UserStatus.IN_GAME || player2Status ===  UserStatus.IN_GAME
            || player1Status === UserStatus.IN_QUEUE || player2Status ===  UserStatus.IN_QUEUE)
        {
            me.socket.emit('notification', `Already in Game Or Queue`);
            try{await this.userService.updateReq(me.id, challenger.id, requestID);}
            catch(error){
                this.sendWebSocketError(me.socket, error.message, false);
            }
            return ;
        }
        if (challenger.IsInGame === true || me.IsInGame === true){
            me.socket.emit('notification', `Already in Game`);
            try{await this.userService.updateReq(me.id, challenger.id, requestID);}
            catch(error){
                this.sendWebSocketError(me.socket, error.message, false);
            }
            return ;
        }
        else{
            challenger.socket.join(challenger.id);
            me.socket.join(challenger.id);
            challenger.roomId = challenger.id;
            me.roomId = challenger.id;
            try{
                const bool = await this.userService.updateReq(me.id, challenger.id, requestID);
                if (bool){
                    const nick = await this.userService.getNickById(me.id)
                    challenger.socket.emit('notification', `${nick} accepted your challenge`);
                    this.players_arr.set(me.roomId, [me, challenger]);
                    me.IsInGame = true;
                    challenger.IsInGame = true;
                    // emit players info + redirect theme to play √
                    const infos : MatchInfos = await this.userService.genarateMatchInfo(this.players_arr.get(me.roomId)[0].id, this.players_arr.get(me.roomId)[1].id, me.roomId)
                    server.to(me.roomId).emit('redirectPlayers_match', infos);
                    // server.to(me.roomId).emit('MatchReady', me.roomId);
                }
                else
                {
                    me.socket.emit('error', `Challenge Request Expired`);
                    this.sendWebSocketError(me.socket, 'Request Expired', false);
                    return ;
                }

            } catch (error) {
                this.sendWebSocketError(me.socket, error.message, false);
            }
        }
    }

    async refuseChallenge(client: Socket, opponentId :string, requestID: string){
        const me = this.getUserBySocketId(client.id);
        const challenger = this.getUserById(opponentId);
        try{
            await this.userService.updateReq(me.id, challenger.id, requestID);
            if (challenger !== undefined){
                const nick = await this.userService.getNickById(me.id)
                challenger.socket.emit('notification', `${nick} refused your challenge`);
            }
        } catch (error) {
            this.sendWebSocketError(me.socket, error.message, false);
        }
    }
    
    // async drawPaddlesBot(player: GameUser, BotPaddel: leftPaddle , PlayerPaddle: leftPaddle){
    //     player.socket.emit("drawBotPaddles", BotPaddel)
    //     player.socket.emit("drawPlayerPaddles", PlayerPaddle)
    // }

    // drawBallBot(player, ball: Ball){
    //     player.socket.emit("drawBall", (ball))
    // }

    async startBotGame(client: Socket, width: number, height : number){
        const player = this.getUserBySocketId(client.id);
        const playerStatus = await this.userService.getStatus(player.id);
        
        if (player.IsInGame === false){
            player.socket.emit('error', "You're Not In Game");
            return ;
        }
        if (playerStatus === UserStatus.IN_GAME || playerStatus ===  UserStatus.IN_QUEUE)
        {
            player.socket.emit('notification', `Already in Game Or Queue`);
            return ;
        }
        await this.userService.updateStatus(player.id, UserStatus.IN_GAME); // what if there is more than one match
        await this.emitToFriendsStatusGame(player.id, UserStatus.IN_GAME);
        return ;
    }

    // use Global rooms each contains 2 player before start  the game √

    async handleMatchFinish(arg, roomId){
        const players = this.players_arr.get(roomId)
        if (!players)
            return ;
        players[0].score = arg.playerL.score;
        players[1].score = arg.playerR.score;
        
        if (arg.playerL.score > arg.playerR.score)
        {
            this.players_arr.get(roomId)[0].win = true;
            this.userService.updateAchivements(this.players_arr.get(roomId)[0].id, "Win first match");
        }
        if (arg.playerL.score < arg.playerR.score)
        {
            this.players_arr.get(roomId)[1].win = true;
            this.userService.updateAchivements(this.players_arr.get(roomId)[1].id, "Win first match");
        }
        this.players_arr.get(roomId)[0].IsInGame = false;
        this.players_arr.get(roomId)[1].IsInGame = false;
        this.players_arr.get(roomId)[0].isReady = false;
        this.players_arr.get(roomId)[1].isReady = false;
        this.userService.storeResults(this.players_arr.get(roomId)[0], this.players_arr.get(roomId)[1]);
        this.userService.updateStatus(this.players_arr.get(roomId)[0].id, UserStatus.ONLINE);
        this.userService.updateStatus(this.players_arr.get(roomId)[1].id, UserStatus.ONLINE);
        await this.emitToFriendsStatusGame(this.players_arr.get(roomId)[0].id, UserStatus.ONLINE);
        await this.emitToFriendsStatusGame(this.players_arr.get(roomId)[1].id, UserStatus.ONLINE);
        this.userService.updateWinLose(this.players_arr.get(roomId)[0]);
        this.userService.updateWinLose(this.players_arr.get(roomId)[1]);
    }

    async startGame(client: Socket, server: Server, roomId: string, width: number, height : number){
        // just send to the specific player not all the client connect √
        // check if it's a valid match (there is a challenge or two player in queue) √
        // distingue who is the client to update the status √ (add map with an arr of two player as value and roomId as key) √
        // Store match Result (match History / Achivements) √ (still have problem on score storing) √
        var opponent = 0;
        const players = this.players_arr.get(roomId);
        const player1 = this.getUserBySocketId(client.id);
        player1.isReady = true;
        players[0] == player1 ? opponent = 1 : opponent = 0;
        const player2 = this.getUserById(players[opponent].id);
        // Erro indetifiying who is ready √
        console.log("is player 1", player1.id)
        console.log("is player 2", player2.id)
        console.log("is player 44444 ",this.players_arr.get(roomId)[0].isReady)
        console.log("is player 33333 ",this.players_arr.get(roomId)[1].isReady)
        if (this.players_arr.get(roomId)[1].isReady == false || this.players_arr.get(roomId)[0].isReady == false)
            return ;
        // problem who is the 2nd player √ (add rom id as a userGame attribute) √
        if (this.players_arr.get(roomId)[0].IsInGame === false || this.players_arr.get(roomId)[0].IsInGame === false){
            player1.socket.emit('error', "Player Not in Game");
            return ;
        }
        this.userService.updateStatus(this.players_arr.get(player1.roomId)[1].id, UserStatus.IN_GAME);
        this.userService.updateStatus(this.players_arr.get(player1.roomId)[0].id, UserStatus.IN_GAME);
        await this.emitToFriendsStatusGame(this.players_arr.get(player1.roomId)[0].id, UserStatus.IN_GAME);
        await this.emitToFriendsStatusGame(this.players_arr.get(player1.roomId)[1].id, UserStatus.IN_GAME);
        //=--=
        var leftPaddel : leftPaddle = {
            height: 150,
            width: 20,
            x : 20,
            y: (height / 2),
            score : 0,
        };
        var rightPaddle : leftPaddle = {
            height: 150,
            width: 20,
            x : width - 20,
            y : (height) / 2,
            score : 0,
        };
        this.players_arr.get(roomId)[0].socket.on('arrow', ((arg)=> {
            switch (arg) {
                case 'UP':
                if (leftPaddel.y > 0  + leftPaddel.height / 2)
                    leftPaddel.y -= 10;
                    break;
                case 'DOWN':
                    if (leftPaddel.y < (height - leftPaddel.height / 2))
                        leftPaddel.y += 10;
                    break;
            }
            this.players_arr.get(roomId)[0].socket.emit('leftPaddle', leftPaddel)
            this.players_arr.get(roomId)[1].socket.emit('leftPaddle', leftPaddel)
        }))
        this.players_arr.get(roomId)[1].socket.on('arrow', ((arg)=> {
            switch (arg) {
                case 'UP':
                    if (rightPaddle.y > 0 + rightPaddle.height / 2)
                    rightPaddle.y -= 10;
                    break;
                case 'DOWN':
                    if (rightPaddle.y < (height - rightPaddle.height / 2))    
                        rightPaddle.y += 10;
                    break;
            }
            this.players_arr.get(roomId)[0].socket.emit('rightPaddle', rightPaddle)
            this.players_arr.get(roomId)[1].socket.emit('rightPaddle', rightPaddle)
        }))
        //=--=
       
        this.players_arr.get(roomId)[0].socket.emit('StartDrawing')
        this.players_arr.get(roomId)[1].socket.emit('StartDrawing')
        
        this.players_arr.get(player1.roomId)[0].socket.on('EndGame', ((arg) => {
            this.handleMatchFinish(arg, player1.roomId);
            return ;
        }));
        return ;
    }


    async emitToFriendsStatusGame(id: string, status: UserStatus)
    {
		const friends = await this.userService.getFriends(id);
		for (const friend of friends) {
		  const friendUser = this.getUserById(friend.friendId);
		  if (friendUser) {
			friendUser.socket.emit('statusChange', { id: id, status });
		  }
		}
    }


    async handleMatchMaker(client : Socket){
        // Need to optimize this queue so can distiguish each room fo two players √
        // emit to client that is in Queue room √
        // distingue who is the client to update the status √
        const user = this.getUserBySocketId(client.id);
        // if (user.theme === '')
        //     user.theme = theme;
        // if (user.powerUp === '')
        //     user.powerUp = powerUp;
        const playerStatus = await this.userService.getStatus(user.id);
        console.log('userStatus === ', playerStatus);
        if (playerStatus === UserStatus.IN_GAME)
        {
            user.socket.emit('error', `Already in Game here `);
            return ;
        }
        // if (user.IsInGame === true){
        //     user.socket.emit('error', `Already in Game 11111`);
        //     return ;
        // }
        if (this.makeQueue.enQueue(user) == true){
            await this.userService.updateStatus(user.id, UserStatus.IN_QUEUE);
			await this.emitToFriendsStatusGame(user.id, UserStatus.IN_QUEUE);
            client.emit('userInQueue');
        }
    }

    async saveGameSettings(client : Socket, server : Server, theme : string, powerUp: string){
        // Need to optimize this queue so can distiguish each room fo two players √
        // emit to client that is in Queue room √
        // distingue who is the client to update the status √
        const user = this.getUserBySocketId(client.id);
        // if (user.theme === '')
            user.theme = theme;
        // if (user.powerUp === '')
            user.powerUp = powerUp;
        // const playerStatus = await this.userService.getStatus(user.id);
        // console.log('userStatus === ', playerStatus);
        // if (playerStatus === UserStatus.IN_GAME)
        // {
        //     user.socket.emit('error', `Already in Game here `);
        //     return ;
        // }
        // // if (user.IsInGame === true){
        // //     user.socket.emit('error', `Already in Game 11111`);
        // //     return ;
        // // }
        // if (this.makeQueue.enQueue(user) == true){
        //     await this.userService.updateStatus(user.id, UserStatus.IN_QUEUE);
		// 	await this.emitToFriendsStatusGame(user.id, UserStatus.IN_QUEUE);
        // }
    }
}
