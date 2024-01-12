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
            this.Users.push({id: user.id, socket: client, isInQueue: false, IsInGame : false, isReady: false, score: 0, roomId: '', win: false, matchInfos: {}});
            // console.log("Users  ===  ", this.Users);
		}
		catch (error)
		{
			this.sendWebSocketError(client, "User not found", true)
			return;
		}
	}

    async deleteUser(client: Socket){
        try {
			const user = this.getUserBySocketId(client.id);
			await this.userService.updateStatus(user.id, UserStatus.OFFLINE)
            await this.emitToFriendsStatusGame(user.id, UserStatus.OFFLINE);
            this.makeQueue.deleteUserQueue(client)
			this.Users = this.Users.filter((u) => u.socket.id !== client.id);
		}
		catch (error)
		{
			this.sendWebSocketError(client, "Error on disconnecting", true)
		}
    }

    getUserBySocketId(socketId: string): GameUser | undefined {
        return this.Users.find((user) => user.socket.id === socketId);
    }
  
    getUserById(userId: string): GameUser | undefined {
        return this.Users.find((user) => user.id === userId);
    }

    async challengeBot(client : Socket){
        const player = this.getUserBySocketId(client.id);
        player.IsInGame = true;
        const infos = await this.userService.genarateMatchInfo(player.id, null, null);
        player.socket.emit('playersInfo', infos)
        player.socket.emit('redirectPlayers_match', true);
    }

    async challenge(client: Socket, opponentId){
        const challenger = this.getUserBySocketId(client.id);
        const opponent = this.getUserById(opponentId);
        const player1Status = await this.userService.getStatus(challenger.id);
        const player2Status  = await this.userService.getStatus(opponentId);
        
        console.log("statussss :: ", player2Status)
        if (player1Status === UserStatus.OFFLINE || player2Status ===  UserStatus.OFFLINE){
            challenger.socket.emit('error', `Player OFFLINE`);
            return ;
        }
        if (player1Status === UserStatus.IN_GAME || player2Status ===  UserStatus.IN_GAME)
        {
            challenger.socket.emit('error', `already in Game`);
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
        console.log("IMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM here")
        const me = this.getUserBySocketId(client.id);
        const challenger = this.getUserById(opponentId);
        
        const player1Status = await this.userService.getStatus(me.id);
        const player2Status  = await (this.userService.getStatus(challenger.id));
        if (challenger === undefined){
            me.socket.emit('notification', 'Wrong Id');
        }
        if (player1Status === UserStatus.IN_GAME || player2Status ===  UserStatus.IN_GAME)
        {
            me.socket.emit('notification', `Already in Game`);
            try{await this.userService.updateReq(me.id, challenger.id, requestID);}
            catch(error){
                this.sendWebSocketError(me.socket, error.message, false);
            }
        }
        if (challenger.IsInGame === true || me.IsInGame === true){
            me.socket.emit('notification', `Already in Game`);
            try{await this.userService.updateReq(me.id, challenger.id, requestID);}
            catch(error){
                this.sendWebSocketError(me.socket, error.message, false);
            }
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
    
    async drawPaddlesBot(player: GameUser, BotPaddel: leftPaddle , PlayerPaddle: leftPaddle){
        player.socket.emit("drawBotPaddles", BotPaddel)
        player.socket.emit("drawPlayerPaddles", PlayerPaddle)
    }

    drawBallBot(player, ball: Ball){
        player.socket.emit("drawBall", (ball))
    }

    Collision(b, p){

        b.top = b.y - b.raduis;
        b.bottom = b.y + b.raduis;
        b.left = b.x - b.raduis;
        b.right = b.x + b.raduis;
    
        p.top = p.y;
        p.bottom = p.y + p.height;
        p.left = p.x;
        p.right = p.x + p.width; 
    
        return (
            b.right > p.left &&
            b.bottom > p.top &&
            b.left < p.right &&
            b.top < p.bottom
        );
    };

    update(palyer, ball, PlayerPaddle, BotPaddel, width, height){
        ball.x += ball.velocityX;
        ball.y += ball.velocityY;
        if (ball.x + ball.raduis > 600 || ball.x - ball.raduis < 0){
            if(ball.x + ball.raduis > 600) {
                BotPaddel.score += 1;
                palyer.socket.emit("BotScore", BotPaddel.score);
            }
            if(ball.x + ball.raduis < 0) {
                PlayerPaddle.score += 1;
                palyer.socket.emit("playerScore", PlayerPaddle.score);
            }
            ball.x = width / 2;
            ball.y = height / 2;
            ball.velocityX = -ball.velocityX;
        }
        
        BotPaddel.y += (ball.y - (BotPaddel.y + BotPaddel.height / 2)) * 0.1;
                                                                                                                                                                                      
        if (ball.y + ball.raduis > 400 || ball.y - ball.raduis < 0) {
            ball.velocityY = -ball.velocityY;
        }

        let player: leftPaddle = ball.x < 300 ? leftPaddle : PlayerPaddle;
    
        if (this.Collision(ball, player)) {
            var colidePoint = (ball.y - (player.y + player.height / 2))
            colidePoint /= player.height / 2;
            var angle = colidePoint * Math.PI / 4;
            let direction = (ball.x < 300 ? 1 : -1);
            ball.velocityX = direction * ball.speed * Math.cos(angle);
            ball.velocityY = direction * ball.speed * Math.sin(angle);
        }
    }

    async startBotGame(client: Socket, width: number, height : number){
        const player = this.getUserBySocketId(client.id);
        if (player.IsInGame === false){
            player.socket.emit("error", "You're Not In Game");
            return ;
        }
        this.userService.updateStatus(player.id, UserStatus.IN_GAME); // what if there is more than one match
        await this.emitToFriendsStatusGame(player.id, UserStatus.IN_GAME);
        var ball : Ball = {
            x: width / 2,
            y : height / 2,
            raduis : 20,
            speed: 2,
            velocityX: 5,
            velocityY: 5,
        };
        var BotPaddel : leftPaddle = {
            height: 100,
            width: 10,
            x : 0,
            y: (height - 100) / 2,
            score : 0,
        };
        var PlayerPaddle : leftPaddle = {
            height: 100,
            width: 10,
            x : width - 10,
            y: (height - 100) / 2,
            score : 0,
        };
        while(true){
            this.drawPaddlesBot(player, BotPaddel, PlayerPaddle);
            this.drawBallBot(player, ball);
            ball.x += ball.velocityX;
            ball.y += ball.velocityY;
            if (ball.x + ball.raduis > 600 || ball.x - ball.raduis < 0){
                if(ball.x + ball.raduis > 600) {
                    BotPaddel.score += 1;
                    player.socket.emit("BotScore", BotPaddel.score);
                }
                if(ball.x + ball.raduis < 0) {
                    PlayerPaddle.score += 1;
                    player.socket.emit("playerScore", PlayerPaddle.score);
                }     
                ball.x = width / 2;
                ball.y = height / 2;
                ball.velocityX = -ball.velocityX;
            }

            BotPaddel.y += (ball.y - (BotPaddel.y + BotPaddel.height / 2)) * 0.1;

            if (ball.y + ball.raduis > 400 || ball.y - ball.raduis < 0) {
                ball.velocityY = -ball.velocityY;
            }

            let whoareu: leftPaddle = ball.x < 300 ? BotPaddel : PlayerPaddle;
        
            if (this.Collision(ball, whoareu)) {
                var colidePoint = (ball.y - (whoareu.y + whoareu.height / 2))
                colidePoint /= whoareu.height / 2;
                var angle = colidePoint * Math.PI / 4;
                let direction = (ball.x < 300 ? 1 : -1);
                ball.velocityX = direction * ball.speed * Math.cos(angle);
                ball.velocityY = direction * ball.speed * Math.sin(angle);
            }
            if (BotPaddel.score === 5  || PlayerPaddle.score === 5){
                player.IsInGame = false;
                if (PlayerPaddle.score > BotPaddel.score)
                {
                    player.win = true;
                }
                await this.userService.updateWinLose(player);
                await this.userService.updateStatus(player.id, UserStatus.ONLINE);
                await this.emitToFriendsStatusGame(player.id, UserStatus.ONLINE);
                break; 
            }
        }
        return ;
    }

    drawPalddles(player1, player2, server, leftPaddel, rightPaddle){
        server.to(player2.roomId).emit("leftPaddle",  leftPaddel);
        // server.to(player2.roomId).emit("rightPaddle", rightPaddle);
    }

    drawBall(player2, server, ball){
        server.to(player2.roomId).emit("drawBall", ball);
    }

    // use Global rooms each contains 2 player before start  the game √

    async handleMatchFinish(arg, roomId){
        this.players_arr.get(roomId)[0].score = arg.playerL.score;
        this.players_arr.get(roomId)[1].score = arg.playerR.score;
        
        if (arg.playerL.score > arg.playerR.score)
        {
            this.players_arr.get(roomId)[0].win = true;
        }
        if (arg.playerL.score < arg.playerR.score)
        {
            this.players_arr.get(roomId)[1].win = true;
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
        players[0] == player1 ? opponent = 1 : opponent = 0;
        const player2 = this.getUserById(players[opponent].id);
        // Erro indetifiying who is ready √
       
        if (this.players_arr.get(player1.roomId)[1].isReady == false || this.players_arr.get(player1.roomId)[0].isReady == false)
            return ;
        // problem who is the 2nd player √ (add rom id as a userGame attribute) √
        if (!player2)
        {
            player1.socket.emit("error", "Player Not connected")
            return ;
        }
        if (!player1.IsInGame){
            player1.socket.emit("error", "Your not in Game ...");
            return ;
        }
        if (player2.IsInGame === false){
            player1.socket.emit("error", "Player Not in Game, Send him a challenge request");
            return ;
        }
        this.userService.updateStatus(this.players_arr.get(player1.roomId)[1].id, UserStatus.IN_GAME);
        this.userService.updateStatus(this.players_arr.get(player1.roomId)[0].id, UserStatus.IN_GAME);
        await this.emitToFriendsStatusGame(this.players_arr.get(player1.roomId)[0].id, UserStatus.IN_GAME);
        await this.emitToFriendsStatusGame(this.players_arr.get(player1.roomId)[1].id, UserStatus.IN_GAME);

        const midleVertical = ((height - 0) / 2) + 0;
        const midleCanvas = ((width- 0) / 2) + 0;
        var ball : Ball = {
            x: width / 2,
            y : height / 2,
            raduis : 20,
            speed: 2,
            velocityX: 5,
            velocityY: 5,
        };
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
        
        this.players_arr.get(roomId)[0].socket.on('EndGame', ((arg) => {
            this.handleMatchFinish(arg, roomId)
        }));
        this.players_arr.get(roomId)[1].socket.on('EndGame', ((arg) => {
           this.handleMatchFinish(arg, roomId)
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


    async handleMatchMaker(client : Socket, server : Server){
        // Need to optimize this queue so can distiguish each room fo two players √
        // emit to client that is in Queue room √
        // distingue who is the client to update the status √
        const user = this.getUserBySocketId(client.id)
        const playerStatus = await this.userService.getStatus(user.id);
        if (playerStatus === UserStatus.IN_GAME || playerStatus === UserStatus.IN_QUEUE)
        {
            user.socket.emit('error', `Already in Game`);
            return ;
        }
        if (user.IsInGame === true){
            user.socket.emit('error', `Already in Game`);
            return ;
        }
        if (this.makeQueue.enQueue(client) == true){
            console.log(
                "is In Queue"
            )
            await this.userService.updateStatus(user.id, UserStatus.IN_QUEUE);
			await this.emitToFriendsStatusGame(user.id, UserStatus.IN_QUEUE);
        }
    }
}
