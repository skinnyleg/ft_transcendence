import { ConflictException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Status, User, UserStatus } from "@prisma/client";
import { Socket, Server } from "socket.io";
import { Ball, GameUser, gatewayUser, leftPaddle } from "src/classes/classes";
import { UserService } from "src/user/user.service";
import { makeQueue, room } from "./Queue.service";


@Injectable()
export class GameService {
    constructor(private jwtService: JwtService,
        private userService: UserService,
        private makeQueue : makeQueue,
        private room: room){}

    private Users: GameUser[] = [];
    private players_arr = new Map<string, GameUser[]>();
    
    sendWebSocketError(client: Socket, errorMessage: string, exit: boolean) 
	{
		client.emit('error', { message: errorMessage });
		if (exit == true)
			client.disconnect();
	}

    async deleteUser(client: Socket){
        try {
			const user = this.getUserBySocketId(client.id);
			await this.userService.updateStatus(user.id, UserStatus.OFFLINE)
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
        const infos = await this.userService.genarateMatchInfo(player.id, null);
        player.socket.emit('playersInfo', infos)
        player.socket.emit('redirectPlayers_match', true);
    }

    async challenge(client: Socket, opponentId){
        const challenger = this.getUserBySocketId(client.id);
        const opponent = this.getUserById(opponentId); 
        try {
            const reqId = await this.userService.saveChallengeRequest(challenger.id, opponentId);
            if (opponent !== undefined)
            {
                const notif = await this.userService.generateNotifData(reqId);
                opponent.socket.emit('notifHistory', notif);
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
        const challengername = await this.userService.getNickById(challenger.id)
        challenger.socket.join(challenger.id);
        me.socket.join(challenger.id);
        challenger.roomId = challenger.id;
        me.roomId = challenger.id;
        
        if (challenger.IsInGame === true){
            me.socket.emit('notification', `${challengername} already in Game`);
            try{await this.userService.updateReq(me.id, challenger.id, requestID);}
            catch(error){
                this.sendWebSocketError(me.socket, error.message, false);
            }
        }
        else{
            try{
                await this.userService.updateReq(me.id, challenger.id, requestID);
                if (challenger !== undefined){
                    const nick = await this.userService.getNickById(me.id)
                    challenger.socket.emit('notification', `${nick} accepted your challenge`);
                    // emit players info + redirect theme to play √
                    console.log("Me === ", me.id);
                    console.log("oppo === ", challenger.id);
                    const infos = await this.userService.genarateMatchInfo(me.id, challenger.id);
                    server.to(me.roomId).emit('playersInfo', infos)
                    server.to(me.roomId).emit('redirectPlayers_match', true);
                    this.players_arr.set(me.roomId, [me, challenger]);
                    me.IsInGame = true;
                    challenger.IsInGame = true;
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
                console.log("Me === ", me.id);
                console.log("oppo === ", challenger.id);
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
                await this.userService.updateStatus(player.id, UserStatus.ONLINE); // what if there is more than one match
                break; 
            }
        }
        return ;
    }

    drawPalddles(player1, player2, server, leftPaddel, rightPaddle){
        server.to(player2.roomId).emit("leftPaddle",  leftPaddel);
        server.to(player2.roomId).emit("rightPaddle", rightPaddle);
    }

    drawBall(player1, player2, server, ball){
        server.to(player2.roomId).emit("drawBall", ball);
    }

    // use Global rooms each contains 2 player before start  the game √

    async startGame(client: Socket, server: Server, userId: string, width: number, height : number){
        // just send to the specific player not all the client connect √
        // check if it's a valid match (there is a challenge or two player in queue) √
        // distingue who is the client to update the status √ (add map with an arr of two player as value and roomId as key) √
        // Store match Result (match History / Achivements)
        const player1 = this.getUserBySocketId(client.id);
        const player2 = this.getUserById(userId);
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
        var ball : Ball = {
            x: width / 2,
            y : height / 2,
            raduis : 20,
            speed: 2,
            velocityX: 5,
            velocityY: 5,
        };
        var leftPaddel : leftPaddle = {
            height: 100,
            width: 10,
            x : 0,
            y: (height - 100) / 2,
            score : 0,
        };
        var rightPaddle : leftPaddle = {
            height: 100,
            width: 10,
            x : width - 10,
            y : (height - 100) / 2,
            score : 0,
        };
        while(true){
            //listen on IsDrawen so teh update func can send next corr
            this.drawPalddles(player1, player2, server, leftPaddel, rightPaddle);
            this.drawBall(player1, player2, server, ball);
            ball.x += ball.velocityX;
            ball.y += ball.velocityY;
            if (ball.x + ball.raduis > 600 || ball.x - ball.raduis < 0){
                if(ball.x + ball.raduis > 600){
                    if (this.players_arr.get(player1.roomId)[1].id == player1.id){
                        this.players_arr.get(player1.roomId)[1].score++;
                    }
                    if (this.players_arr.get(player1.roomId)[1].id == player2.id){
                        this.players_arr.get(player1.roomId)[1].score++;
                    }
                    leftPaddel.score += 1;
                    server.to(player2.roomId).emit("leftPaddelScore", leftPaddel.score);
                }
                if(ball.x + ball.raduis < 0) {
                    if (this.players_arr.get(player1.roomId)[0].id == player1.id){
                        this.players_arr.get(player1.roomId)[0].score++;
                    }
                    if (this.players_arr.get(player1.roomId)[0].id == player2.id){
                        this.players_arr.get(player1.roomId)[0].score++;
                    }
                    rightPaddle.score += 1;
                    server.to(player2.roomId).emit("rightPaddleScore", rightPaddle.score);
                }     
                ball.x = width / 2;
                ball.y = height / 2;
                ball.velocityX = -ball.velocityX;
            }

            leftPaddel.y += (ball.y - (leftPaddel.y + leftPaddel.height / 2)) * 0.1;

            if (ball.y + ball.raduis > 400 || ball.y - ball.raduis < 0) {
                ball.velocityY = -ball.velocityY;
            }

            let whoareu: leftPaddle = ball.x < 300 ? leftPaddel : rightPaddle;
        
            if (this.Collision(ball, whoareu)) {
                var colidePoint = (ball.y - (whoareu.y + whoareu.height / 2))
                colidePoint /= whoareu.height / 2;
                var angle = colidePoint * Math.PI / 4;
                let direction = (ball.x < 300 ? 1 : -1);
                ball.velocityX = direction * ball.speed * Math.cos(angle);
                ball.velocityY = direction * ball.speed * Math.sin(angle);
            }
            if (this.players_arr.get(player1.roomId)[0].score === 5  || this.players_arr.get(player1.roomId)[1].score === 5){
                player1.IsInGame = false;
                player2.IsInGame = false;
                this.userService.updateStatus(this.players_arr.get(player1.roomId)[0].id, UserStatus.ONLINE);
                this.userService.updateStatus(this.players_arr.get(player1.roomId)[1].id, UserStatus.ONLINE);
                this.userService.storeResults(player1, player2);
                break;
            }
        }
        return ;
    }

    async saveUser(client: Socket) {
		let user: User;
		try {
			const token: string = client.handshake.headers.token as string;
			const payload = await this.jwtService.verifyAsync(token, { secret: process.env.jwtsecret })
			user = await this.userService.findOneById(payload.sub);
            this.Users.push({id: user.id, socket: client, isInQueue: false, IsInGame : false, score: 0, roomId: ''});
            console.log("Users  ===  ", this.Users);
		}
		catch (error)
		{
			this.sendWebSocketError(client, "User not found", true)
			return;
		}
	}

    async handleMatchMaker(client : Socket, server : Server){
        // Need to optimize this queue so can distiguish each room fo two players √
        // emit to client that is in Queue room
        // distingue who is the client to update the status
        const user = this.getUserBySocketId(client.id);
        this.makeQueue.enQueue(client);
        // this.userService.updateStatus(user.id, UserStatus.IN_QUEUE);
        var queueLength =  this.makeQueue.getQueue().length;
        console.log("Queue length ===  ", queueLength);
        if (queueLength >= 2){
            const player1 = this.makeQueue.dequeue();
            // this.userService.updateStatus(player1.id, UserStatus.IN_GAME);
            var user1 = this.getUserBySocketId(player1.id);
            const player2 = this.makeQueue.dequeue();
            var user2 = this.getUserBySocketId(player2.id);
            // this.userService.updateStatus(player2.id, UserStatus.IN_GAME);
            user1.socket.join(user2.id);
            user2.socket.join(user2.id);
            user1.roomId = user2.id;
            user2.roomId = user2.id;
            user1.IsInGame = true;
            user2.IsInGame = true;
            const infos = await this.userService.genarateMatchInfo(user1.id, user2.id);
            user1.socket.emit('playersInfo', infos)
            user2.socket.emit('playersInfo', infos)
            server.to(user1.roomId).emit('redirectPlayers_match', true);
        }
        console.log("Queue length ===  ", this.makeQueue.getQueue().length);
        // Emite that match is ready With players infos √
        // Match is Ready Backend can start Send corrdinations √
    }
}
