import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { authenticator } from 'otplib';
import { AchievementStatus, RequestType, Status, User, UserStatus } from '@prisma/client';
import { hashPass } from 'src/utils/bcryptUtils';
import { generateNickname } from 'src/utils/generateNickname';
import * as fs from 'fs';
import * as path from 'path';
import { GameUser, Match, NotificationData, PlayerInfo } from 'src/classes/classes';
import axios from 'axios';
import { title } from 'process';

@Injectable()
export class UserService {

	constructor(private readonly prisma: PrismaService){}


	async findOneByIntraId(intraId: number)
	{
		const user = await this.prisma.user.findUnique({
			where: {
				intraId: intraId,
			}
		})
		return user;
	}

	async downloadImage(url: string, filename: string)
	{
		const response = await axios.get(url, { responseType: 'arraybuffer' });

		fs.writeFile(filename, response.data, (err) => {
		  if (err) throw err;
		});
	}

	async findOneById(Id: string)
	{
		const user = await this.prisma.user.findUnique({
			where: {
				id: Id,
			}
		})
		return user;
	}

	async findOneByNickname(nick: string)
	{
		const users = await this.prisma.user.findMany({
			where: {
				nickname: {
					contains: nick,
					mode: 'insensitive',
				},
			},
			select: {
				id: true,
				nickname: true,
			},
		});

		for (const user of users)
		{
			if (user.nickname.toLowerCase() === nick.toLowerCase())
				return (user)
		}

		return null;
	}


	async getFriends(id: string)
	{
	  return await this.prisma.friendStatus.findMany({
		where: {
		  userId: id,
		  status: Status.FRIEND,
		},
		select: {
			friendId: true
		},
	  });
	}

	async getDoneAchievements(id: string)
	{
		const doneAchievements = await this.prisma.achievement.findMany({
			where: {
				userId: id,
				status: AchievementStatus.DONE,
			},
			select: {
				id: true,
				title: true,
				description: true,
				userScore: true,
				totalScore: true,
			},
		});

		return (doneAchievements);
	}

	async getLeaderboard(id: string)
	{
		const users = await this.prisma.user.findMany({
			select: {
				id: true,
				nickname: true,
				profilePic: true,
				Wins: true,
				Losses: true,
				Rank: true,
			},
			orderBy: {
				Rank: 'asc', // Use 'desc' for descending order
			},
		});


		const usersWithWinrates = users.map((user) => {
		const totalGames = user.Wins + user.Losses;
		let winrate = totalGames > 0 ? (user.Wins / totalGames) * 100 : 0;
		const winrateStr = winrate.toFixed(2);

		return {
				id: user.id,
				nickname: user.nickname,
				profilePic: user.profilePic,
				Wins: user.Wins,
				Losses: user.Losses,
				winrate,
				winrateStr,
				Rank: user.Rank,
				self: user.id === id,
			};
		});

		const sortedUsers = usersWithWinrates.sort((a, b) => b.winrate - a.winrate);

		return (sortedUsers);
	}

	async getAchievements(id: string)
	{
		const acheivements = await this.getDoneAchievements(id);
		const notAcheivements = await this.getNotDoneAchievements(id);
		return ({doneAchievements: acheivements, notDoneAchievements: notAcheivements});
	}

	async getNotDoneAchievements(id: string)
	{
		const notDoneAchievements = await this.prisma.achievement.findMany({
			where: {
				userId: id,
				status: AchievementStatus.NOTDONE,
			},
			select: {
				id: true,
				title: true,
				description: true,
				userScore: true,
				totalScore: true,
			},
		});

		
		return (notDoneAchievements);
	}


	async updateAchivements(userId: string, type: string){
				
		const AchivementId = await this.prisma.achievement.findFirst({
			where: {
				title: type,
				userId: userId,
			},
			select: {
				id: true,
			}
		});
		
		if (!AchivementId)
			throw new NotFoundException('acheivement not found')
		const Achivements = await this.prisma.achievement.update({
		where: {
			id: AchivementId.id,
			title: type,
			userId: userId
		},
		data: {
			status: AchievementStatus.DONE,
		},
		});
		return ;
	}


	async checkWins(id: string)
	{
		const wins = await this.prisma.user.findUnique({
			where: {
				id: id,
			},
			select: {
				Wins: true,
			}
		})
		if (wins.Wins >= 5)
			return true;
		return false;
	}

	async getFriendsCards(id: string)
	{
		let friendsData = [];
		const friendsIds = await this.prisma.friendStatus.findMany({
			where: {
				userId: id,
				status: Status.FRIEND,
			},
			select: {
				friendId: true,
			},
		});


		for (const friendId of friendsIds)
		{
			const friendData = await this.prisma.user.findUnique({
				where: {
					id: friendId.friendId,
				},
				select: {
					id: true,
					profilePic: true,
					nickname: true,
					status: true,
				}
			})
			friendsData.push(friendData);
		}
		return (friendsData);
	}



	async setNewFriend(senderId: string, recipientId: string,friendStatus: any)
	{
		await this.prisma.friendStatus.create({
			data: {
				user: {
					connect: {
						id: senderId,
					}
				},
				status: friendStatus,
				friendId: recipientId,
			}
		});
	}

	async updateFriend(recipientId: string, senderId: string, friendStatus: any)
	{
		const friendExist = await this.prisma.friendStatus.findFirst({
			where: {
				userId: recipientId,
				friendId: senderId,
			},
		});

		if (!friendExist)
			throw new NotFoundException('no instanse found')

		await this.prisma.friendStatus.update({
			where: {
				id: friendExist.id, // Use the ID of the existing record
				},
				data: {
					status: friendStatus, // Update the 'status' field with the new value
				},
		});
	}

	async deleteFriend(recipientId: string, senderId: string)
	{
		const friendExist = await this.prisma.friendStatus.findFirst({
			where: {
				userId: recipientId, // The specific userId you want to target
				friendId: senderId
			},
		});

		if (!friendExist)
			throw new NotFoundException('no instanse found')

		await this.prisma.friendStatus.delete({
			where: {
				id: friendExist.id, // Use the ID of the existing record
				},
		});
	}

	// GAME SECTION

	async saveChallengeRequest(challengerId: string, opponentId: string){
		// check if the challenger and opponent exist
		if (challengerId === opponentId)
			throw new ConflictException('Can\'t challenge yourself')

		const challenger = await this.prisma.user.findUnique({
			where: {
				id: challengerId,
			}
		})
		if (!challenger)
			throw new NotFoundException('user Doesn\'t exist')
		const opponent = await this.prisma.user.findUnique({
			where: {
				id: opponentId,
			}
		})
		if (!opponent)
			throw new NotFoundException('user Doesn\'t exist')

		// check request
		const requestExist = await this.prisma.request.findFirst({
			where: {
			  userId: opponentId,
			  senderId: challengerId,
			  typeOfRequest: RequestType.CHALLENGE,
			  responded: false,
			},
		});
		if (requestExist)
			throw new ConflictException('you have already sent challenge')
		const requestExist2 = await this.prisma.request.findFirst({
				where: {
				  userId: challengerId,
				  senderId: opponentId,
				  typeOfRequest: RequestType.CHALLENGE,
				  responded: false,
				},
			});
		if (requestExist2)
			throw new ConflictException('you already got a challenge from that user')
		// check if one of them is in, geme
		const isInGame = await this.prisma.user.findFirst({
			where: {
				OR: [
				{
					id: challengerId,
					status: {
						in: [UserStatus.IN_GAME]
					},
				},
				{
					id: opponentId,
					status: {
						in: [UserStatus.IN_GAME]
					},
				},
				],
			},
		});
		if (isInGame)
			throw new ConflictException('Already In Game!');
		// SEND REQUEST 
		const id = await this.generateRequest(challengerId, opponentId, RequestType.CHALLENGE);
		return id;
	}



	async genarateMatchInfo(me : string, opponentId : string, roomId: string){
		var infos;
		var playerL : PlayerInfo = await this.prisma.user.findUnique({
			where:{
				id: me,
			},
			select:{
				id: true,
				profilePic: true,
				nickname: true,
			}
		});
		if (opponentId){
			var playerR : PlayerInfo = await this.prisma.user.findUnique({
				where:{
					id: opponentId,
				},
				select:{
					id: true,
					profilePic: true,
					nickname: true,
				}
			});
			infos = [{...playerL, opponentId: playerR.id, roomId: roomId}, {...playerR, opponentId: playerL.id, roomId: roomId}];
			return infos;
		}
		infos = playerL;
		return (infos);
	}


	async updateReq(me: string, challenger: string, requestId: string)
	{
		if (me === challenger)
			throw new ConflictException('can\'t accept a challenge from yourself')

		const request = await this.prisma.request.findUnique({
			where: {
				id: requestId,
				senderId: challenger,
				responded: false,
			},
			select :{
				expiresAt: true,
			}
		});

		if (!request)
			throw new NotFoundException('request Doesn\'t exist or already responded')
		const user = await this.prisma.user.findUnique({
			where: {
				id: challenger,
			}
		})
		if (!user)
			throw new NotFoundException('user Doesn\'t exist')
		const date = new Date();
		await this.prisma.request.update({
			where: {
				id: requestId
			},
			data: {
				emitted: true,
				responded: true,
			}
		});
		if (date.getTime() > request.expiresAt.getTime()){
			return false;
		}
		return true;
	}

	// END OF GAME SECTION

	async saveRequest(senderId: string, recipientId: string)
	{
		if (senderId === recipientId)
			throw new ConflictException('Can\'t add yourself as a friend')

		const user = await this.prisma.user.findUnique({
			where: {
				id: recipientId,
			}
		})
		if (!user)
			throw new NotFoundException('user Doesn\'t exist')

		const requestExist = await this.prisma.request.findFirst({
		  where: {
			userId: recipientId,
			senderId: senderId,
			typeOfRequest: RequestType.FRIEND,
			responded: false,
		  },
		});

		if (requestExist)
			throw new ConflictException('you have already sent a request')

		const friendStatus = await this.prisma.friendStatus.findFirst({
		  where: {
			OR: [
			  {
				userId: senderId,
				friendId: recipientId,
				status: {
				  in: [Status.FRIEND, Status.PENDING], // Check for FRIEND or PENDING status
				},
			  },
			  {
				userId: recipientId,
				friendId: senderId,
				status: {
				  in: [Status.FRIEND, Status.PENDING], // Check for FRIEND or PENDING status
				},
			  },
			],
		  },
		});
		
		if (friendStatus)
			throw new ConflictException('you are already friends or already got a request from this user')

		const sender = await this.prisma.user.findUnique({
			where: {
				id: senderId,
			}
		})
		if (!sender)
		throw new NotFoundException('user Doesn\'t exist')

		const blocked = sender.usersBlocked.find((id) => id === recipientId);
		if (blocked)
			throw new BadRequestException('you blocked him')
		const blockedby = sender.BlockedBy.find((id) => id === recipientId);
		if (blockedby)
				throw new BadRequestException('you are blocked')

		const id = await this.generateRequest(senderId, recipientId, RequestType.FRIEND);
		await this.setNewFriend(senderId, recipientId, Status.PENDING)
		return id;
	}

	async deleteRequest(senderId: string, recipientId: string)
	{
		if (senderId === recipientId)
			throw new ConflictException('Can\'t unfriend yourself')

		const user = await this.prisma.user.findUnique({
			where: {
				id: recipientId,
			}
		})
		if (!user)
			throw new NotFoundException('user Doesn\'t exist')

		const friendStatus = await this.prisma.friendStatus.findFirst({
		  where: {
			OR: [
			  {
				userId: senderId,
				friendId: recipientId,
				status: {
				  in: [Status.FRIEND], // Check for FRIEND or PENDING status
				},
			  },
			  {
				userId: recipientId,
				friendId: senderId,
				status: {
				  in: [Status.FRIEND], // Check for FRIEND or PENDING status
				},
			  },
			],
		  },
		});
		
		if (!friendStatus)
			throw new ConflictException('you need to be friends to unfriend')
			
		await this.deleteFriend(senderId, recipientId)
		await this.deleteFriend(recipientId, senderId)

		const id = await this.generateRequest(senderId, recipientId, RequestType.UNFRIEND, true);
		return id;
	}

	async generateRequest(senderId: string, recipientId: string, typeOfRequest: RequestType, respond: boolean = false, channelName?: string)
	{
		let description: string;
		if (typeOfRequest === RequestType.FRIEND)
			description = "sent you a friend request";
		else if (typeOfRequest === RequestType.CHALLENGE)
			description = "has challenged you";
		else if (typeOfRequest === RequestType.MESSAGE)
			description = "sent you a message"
		else if (typeOfRequest === RequestType.UNFRIEND)
			description = "has unfriended you"
		else if (typeOfRequest === RequestType.BLOCKED)
			description = "has blocked you"
		else if (typeOfRequest === RequestType.UNBLOCKED)
			description = "has unblocked you"
		else if (typeOfRequest === RequestType.JOINCHANNEL)
			description = "wishes to join your channel"

		const request = await this.prisma.request.create({
		  data: {
			user: { connect: { id: recipientId } }, // Assuming you have the `userId` available
			senderId: senderId, // Assuming you have the `senderId` available
			typeOfRequest: typeOfRequest,
			descriptionOfRequest: description,
			responded: respond,
			channelName,
		  },
		});
		if (!request)
			throw new InternalServerErrorException('Can\'t generate a request');
		return (request.id)
	}

	async getNickById(id: string)
	{
		const nick = await this.prisma.user.findUnique({
			where: {
				id : id,
			},
			select: {
				nickname: true,
			}
		})
		if (!nick)
			throw new NotFoundException('user Doesn\'t exist')
		return nick.nickname;
	}

	async blockUser(senderId: string, recipientId: string)
	{
		if (senderId === recipientId)
			throw new ConflictException('Can\'t block yourself')

		const user = await this.prisma.user.findUnique({
			where: {
				id: recipientId,
			}
		})
		if (!user)
			throw new NotFoundException('user Doesn\'t exist')

		const sender = await this.prisma.user.findUnique({
			where: {
				id: senderId,
			}
		})
		if (!sender)
			throw new NotFoundException('sender Doesn\'t exist')

		const idExists = sender.usersBlocked.find((id) => id === recipientId)

		if (idExists)
			throw new BadRequestException('user is already blocked');
		const idExistsby = user.BlockedBy.find((id) => id === senderId)

		if (idExistsby)
			throw new BadRequestException('user is already blocked');
		sender.usersBlocked.push(recipientId);

		user.BlockedBy.push(senderId);

		await this.prisma.user.update({
			where: {
				id: senderId,
			},
			data: {
				usersBlocked: sender.usersBlocked,
			},
		})

		await this.prisma.user.update({
			where: {
				id: recipientId,
			},
			data: {
				BlockedBy: user.BlockedBy,
			},
		})

		const id = await this.generateRequest(senderId, recipientId, RequestType.BLOCKED, true);
		return id;
		
	}

	async unblockUser(senderId: string, recipientId: string)
	{
		if (senderId === recipientId)
			throw new ConflictException('Can\'t unblock yourself')

		const user = await this.prisma.user.findUnique({
			where: {
				id: recipientId,
			}
		})
		if (!user)
			throw new NotFoundException('user Doesn\'t exist')


		const sender = await this.prisma.user.findUnique({
			where: {
				id: senderId,
			}
		})
		if (!sender)
			throw new NotFoundException('sender Doesn\'t exist')


		const idExists = sender.usersBlocked.find((id) => id === recipientId)

		if (!idExists)
			throw new BadRequestException('user is not blocked');
		const idExistsby = user.BlockedBy.find((id) => id === senderId)

		if (!idExistsby)
			throw new BadRequestException('user is not blocked');


		let index = sender.usersBlocked.indexOf(idExists);
		sender.usersBlocked.splice(index, 1);

		index = user.BlockedBy.indexOf(idExistsby);
		user.BlockedBy.splice(index, 1);

		await this.prisma.user.update({
			where: {
				id: senderId,
			},
			data: {
				usersBlocked: sender.usersBlocked,
			},
		})

		await this.prisma.user.update({
			where: {
				id: recipientId,
			},
			data: {
				BlockedBy: user.BlockedBy,
			},
		})

		const id = await this.generateRequest(senderId, recipientId, RequestType.UNBLOCKED, true);
		return id;
		
	}


	async acceptRequest(senderId: string, recipientId: string, requestId: string)
	{
		if (senderId === recipientId)
			throw new ConflictException('can\'t accept a request from yourself')

		const request = await this.prisma.request.findUnique({
			where: {
				id: requestId,
				senderId: recipientId,
				responded: false,
			}
		});

		if (!request)
			throw new NotFoundException('request Doesn\'t exist or already responded')

		const user = await this.prisma.user.findUnique({
			where: {
				id: recipientId,
			}
		})
		if (!user)
			throw new NotFoundException('user Doesn\'t exist')

			
		const friendStatus = await this.prisma.friendStatus.findFirst({
		where: {
			OR: [
			{
				userId: senderId,
				friendId: recipientId,
				status: {
				in: [Status.FRIEND], // Check for FRIEND or PENDING status
				},
			},
			{
				userId: recipientId,
				friendId: senderId,
				status: {
				in: [Status.FRIEND], // Check for FRIEND or PENDING status
				},
			},
			],
		},
		});
		
		if (friendStatus)
			throw new ConflictException('you are already friends or already got a request from this user')

		await this.updateFriend(recipientId, senderId ,Status.FRIEND)
		await this.setNewFriend(senderId, recipientId, Status.FRIEND)
		await this.prisma.request.update({
			where: {
				id: requestId
			},
			data: {
				emitted: true,
				responded: true,
			}
		  });
		
	}

	async refuseRequest(senderId: string, recipientId: string, requestId: string)
	{
		if (senderId === recipientId)
			throw new ConflictException('can\'t refuse a request from yourself')

		const request = await this.prisma.request.findUnique({
			where: {
				id: requestId,
				senderId: recipientId,
				responded:false,
			}
		});

		if (!request)
			throw new NotFoundException('request Doesn\'t exist or already responded')

		const user = await this.prisma.user.findUnique({
			where: {
				id: recipientId,
			}
		})
		if (!user)
			throw new NotFoundException('user Doesn\'t exist')
	
		await this.deleteFriend(recipientId, senderId)
		await this.prisma.request.update({
			where: {
				id: requestId
			},
			data: {
				emitted: true,
				responded: true,
			}
		  });
		
	}
	async generateNotifData(requestId: string)
	{
		  const notifData = await this.prisma.request.findUnique({
				where: {
					id: requestId,
				},
				select: {
					id: true,
					senderId: true,
					descriptionOfRequest: true,
					typeOfRequest: true,
					responded:true,
					channelName: true,
				},
			});

		if (!notifData)
			throw new NotFoundException('request not found')

		await this.prisma.request.update({
			where: {
			  id: requestId,
			},
			data: {
				emitted: true,
			}
		  });

		const userData = await this.prisma.user.findUnique({
			where: {
				id: notifData.senderId,
			},
			select: {
				id: true,
				nickname: true,
				profilePic: true,
			}
		})
	
		if (!userData)
			throw new NotFoundException('user not found')
		const combinedData: NotificationData = {
			requestId: notifData.id,
			notifData: {
				userId: userData.id,
				userProfilePic: userData.profilePic,
				description: `${userData.nickname}` + " " + notifData.descriptionOfRequest,
				typeOfRequest: notifData.typeOfRequest,
				responded: notifData.responded,
				channelName: notifData.channelName,
				user: userData.nickname,
			},
		}
		return combinedData;
	}



	async getDashboard(id: string)
	{
		const doneAchievements = await this.getDoneAchievements(id);
		const notDoneAchievements = await this.getNotDoneAchievements(id);
		
		return ({doneAchievements, notDoneAchievements})
	}

	generateImgName(profilePic: string)
	{
		const parts = profilePic.split('/')
		const newName = parts.pop();
		return newName;
	}


	async changeUserImg(userData: any)
	{
		if (userData.profilePic === '' || userData.profilePic === undefined || userData.profilePic === null)
			userData.profilePic = '/defaultAvatarPic.png';
		else
		{
			let imgName = this.generateImgName(userData.profilePic);
			await this.downloadImage(userData.profilePic, `./uploads/avatar/${imgName}`);
			const newDir = path.join(__dirname, '..', '..' , 'uploads', 'avatar');
			const filePath = path.join(newDir, imgName);
			fs.stat(filePath, (err, stats) => {
				if (err || !stats.isFile()) {
				  throw new NotFoundException('Image not found');
				}
			});
			userData.profilePic = `${process.env.BackendHost}/upload/profile/${imgName}`;
		}
	}


	async firstFriend(recipientId: string, senderId: string)
	{
		const userOneFriends = await this.prisma.friendStatus.count({
			where: {
				userId: recipientId,
			}
		})
		if (userOneFriends === 1)
		await this.updateAchivements(recipientId, 'make first friend')
	
	
		const userTwoFriends = await this.prisma.friendStatus.count({
			where: {
				userId: senderId,
			}
		})
	
		if (userTwoFriends === 1)
			await this.updateAchivements(senderId, 'make first friend')
	}


	async updateRank(userData: any)
	{
		const players = await this.prisma.user.count();
		userData.Rank = players + 1; 
	}

	async generateIntraId(userData: any)
	{
		const players = await this.prisma.user.count();
		userData.intraId = players + 1; 
	}

	async create(userData: any)
	{
		const nick = await generateNickname(userData.nickname);
		const hashedPass : string = await hashPass(userData.password);
		try {
			await this.changeUserImg(userData);
		}
		catch (error)
		{
			console.log('Something Went Wrong couldnt download user image');
			userData.profilePic = '/defaultAvatarPic.png';
		}
		await this.updateRank(userData);
		const user = await this.prisma.user.create({
			data: {
				intraId: userData.intraId,
				password: hashedPass,
				profilePic: userData.profilePic,
				BackgroundPic: userData.BackgroundPic,
				wallet: userData.wallet,
				level: userData.level,
				Rank: userData.Rank,
				status: UserStatus.ONLINE,
				nickname: nick,
			}
		})
		await this.linkAchievements(user.id);
		await this.updateAchivements(user.id, 'First Login');
		return user;
	}


	async createNewUser(username: string, password: string)
	{
		const userData: any = {
			intraId: 0,
			nick: username,
			Rank: 0,
		}
		const nick = await generateNickname(username);
		const hashedPass : string = await hashPass(password);
		await this.updateRank(userData);
		await this.generateIntraId(userData);
		const user = await this.prisma.user.create({
			data: {
				intraId: userData.intraId,
				password: hashedPass,
				profilePic: '/defaultAvatarPic.png',
				BackgroundPic: '/DefaultBackground.png',
				wallet: 0,
				level: 0,
				Rank: userData.Rank,
				status: UserStatus.ONLINE,
				nickname: nick,
				setPass: true,
			}
		})
		await this.linkAchievements(user.id);
		await this.updateAchivements(user.id, 'First Login');
		return user;
	}

	async linkAchievements(id: string)
	{
		const jsonDataPath = path.resolve(__dirname, '..' ,'..' , 'src', 'Achievements', 'data.json');

		const rawData = fs.readFileSync(jsonDataPath, 'utf-8');
		const achievementData = JSON.parse(rawData);

		for (const data of achievementData) {
			const { title, description, userScore, totalScore } = data;

			await this.prisma.achievement.create({
				data: {
					title,
					description,
					userScore,
					totalScore,
					status: AchievementStatus.NOTDONE,
					User: { connect: { id: id } },
				},
			});
		}
	}

	async getNotificationsHistory(id: string)
	{
		let notifications: NotificationData[] = [];
		const requests = await this.prisma.user.findMany({
			where: {
				id: id,
			},
			select: {
				userRequests:{
					where: {
						responded:false,
					},
					select: {
						id: true,
					}
				}
			}
		});
		const requestIds = requests.flatMap((user) => user.userRequests.map((req) => ({ id: req.id })));
	
		for (const req of requestIds)
		{
			const notif: NotificationData = await this.generateNotifData(req.id);
			notifications.push(notif)
		}
		return notifications;
	}

	async getNotifications(id: string)
	{
		let notifications = [];
		const requests = await this.prisma.user.findMany({
			where: {
				id: id,
			},
			select: {
				userRequests:{
					where: {
						emitted: false,
					},
					select: {
						id: true,
					}
				}
			}
		})

		const requestIds = requests.flatMap((user) => user.userRequests.map((req) => ({ id: req.id })));
	
		for (const req of requestIds)
		{
			const notif = await this.generateNotifData(req.id);
			notifications.push(notif);
		}
		return notifications;
	}

	async updateStatus(id: string, status: any)
	{
		return await this.prisma.user.update({
			where:{
				id: id,
			},
			data: {
				status: status,
			}
		})
	}

	async storeResults(player1 : GameUser, player2 : GameUser, roomId: string){
		var score: number[];
		const winner : string = (player1.score > player2.score) ? player1.id : player2.id;
		const winnerscore : number = (player1.score > player2.score) ? player1.score : player2.score;
		const loserscore : number = (player1.score > player2.score) ? player2.score : player1.score;
		score = [player1.score, player2.score];
		await this.prisma.game.update({
			where: {
				id: roomId,
			},
			data: {
				winner: winner,
				winnerScore: winnerscore,
				loserScore: loserscore,
			}
		})
	}


	async getGame(roomId: string)
	{
		const game = await this.prisma.game.findUnique({
			where: {
				id: roomId,
			},
		})
		if (!game)
			return false;
		return true;
	}

	async getGameWinner(roomId: string)
	{
		const game = await this.prisma.game.findUnique({
			where: {
				id: roomId,
			},
			select: {
				winner: true,
			}
		})
		if (!game)
			return false;
		if (game.winner !== '')
			return false;
		return true;
	}

	async createGame(userId: string, opponentId: string)
	{
		const game = await this.prisma.game.create({
			data: {
				MatchScore: [], // Assuming this is an empty array initially
				player:{connect: {id : userId}},
				opponent:{connect: {id : opponentId}},
				winner: '',
				winnerScore: 0,
				loserScore: 0,
			}
		})
		if (!game)
			return null;
		return game.id;
	}


	async deleteGame(roomId: string)
	{
		const gameExists = await this.prisma.game.findUnique({
			where: {
				id: roomId,
			}
		})
		if (!gameExists)
			return ;
		try {
			const game = await this.prisma.game.delete({
				where: {
					id: roomId,
				}
			})
		}
		catch (error)
		{
			return ;
		}
	}

	async updateWinLose(player: GameUser){
		const wins : boolean = player.win;
		
		if (wins){
			await this.prisma.user.update({
				where:{
					id: player.id,
				},
				data: {
					Wins: {increment: 1}
				}
			})
		}
		else
		{
			await this.prisma.user.update({
				where:{
					id: player.id,
				},
				data: {
					Losses:{increment: 1} 
				}
			})
		}
		const players = await this.prisma.user.findMany({
			select: {
				id: true,
				Wins: true,
				Losses: true
			}
		});
	
		// Sort players by score in descending order

		const playersWinRate = players.map((player) => {
			const totalGames = player.Wins + player.Losses;
			let winrate = totalGames > 0 ? (player.Wins / totalGames) * 100 : 0;

			return {
					winrate: winrate,
					...player
				};
			});

		const sortedPlayers = playersWinRate.sort((a, b) => b.winrate - a.winrate);
	
		// Update ranks based on sorted positions
		for (let rank = 1; rank <= sortedPlayers.length; rank++) {
			const player = sortedPlayers[rank - 1];
			await this.prisma.user.update({
				where: {
					id: player.id,
				},
				data: {
					Rank: rank
				}
			});
		}
		return ;
	}

	async getMatches(id: string) {
		let Matches: Match[] = [];
		const matches = await this.prisma.game.findMany({
		  where: {
			OR: [
			  {
				userId: id,
			  },
			  {
				opponentId: id,
			  },
			],
		  },
		  orderBy: {
			createdAt: 'asc', // Use 'asc' for ascending order
		  },
		});
	  
		if (!matches) {
		  return [];
		}
	  
		for (const match of matches) {
		  let isMeWhoWin = false;
		  let winnerUser: User;
		  let loserUser: User;
	  
		  // Determine if the current user is the winner
		  if (match.winner === id) {
			isMeWhoWin = true;
			winnerUser = await this.findOneById(id);
			loserUser = await this.findOneById(match.winner === match.userId ? match.opponentId : match.userId);
		  } else {
			isMeWhoWin = false;
			winnerUser = await this.findOneById(match.winner === match.userId ? match.userId : match.opponentId);
			loserUser = await this.findOneById(id);
		  }
	  
		  // Construct the result object
		  const obj = {
			id: match.id,
			winner: {
			  nickname: winnerUser.nickname,
			  profilePic: winnerUser.profilePic,
			},
			loser: {
			  nickname: loserUser.nickname,
			  profilePic: loserUser.profilePic,
			},
			winnerScore: match.winnerScore,
			loserScore: match.loserScore,
			isMeWhoWon: isMeWhoWin,
		  };
	  
		  Matches.push(obj);
		}
		return Matches;
	  }
	  

	async getSecret(id: string)
	{
		const secret = await this.prisma.user.findUnique({
			where:{
				id,
			},
			select: {
				Secret: true
			}
		})
		if (!secret)
			throw new ConflictException('User hasn\'t enable 2FA')
		return secret.Secret;
	}

	async getStatus(id :string){
		const status = await this.prisma.user.findUnique({
			where:{
				id: id,
			},
			select: {
				status: true
			}
		})
		if (!status)
			throw new NotFoundException('User Not Found');
		return status.status;
	}

		async changePassword(newPass : string, id : string) {

		const user = await this.findOneById(id);

		if (!user)
			throw new NotFoundException("No User Found")
	
		const hashedPass = await hashPass(newPass);
		await this.prisma.user.update({
			where: {
				id:id,
			},
			data: {
				password: hashedPass,
				setPass: true
			}
		})
		return {valid: true}
	}


	async getNickname(id: string)
	{
		const user = await this.prisma.user.findUnique({
			where: {
				id,
			},
			select: {
				id: true,
				nickname: true,
				profilePic: true,
				BackgroundPic: true,
			}
		})
		if (!user)
			throw new NotFoundException("User not found")
		return user;
	}


	async changeNickname(newNick : string, id: string) {

		const isunique = await this.findOneByNickname(newNick);
		if (isunique && isunique.id !== id)
			throw new ConflictException('nickname already taken')
	
		const user = await this.findOneById(id)

		if (!user)
			throw new NotFoundException("user doesn't exist")

		await this.prisma.user.update({
			where: {
				id: id
			},
			data: {
				nickname: newNick
			}
		})
		return {nick: newNick}

	}


	async privateProfile(id: string) {
    	const user = await this.prisma.user.findUnique({
			where: {
				id: id,
			},
			select: {
				id: true,
				nickname: true,
				wallet: true,
				Rank:true,
				profilePic: true,
				BackgroundPic: true,
				level: true,
				status: true,
				isEnabled: true,
				Wins: true,
				Losses: true,
			},
		})
		if (!user)
			throw new NotFoundException('user not found')
		return user;
  }

	async getProfile(id: string, nickname: string)
	{
		const currentUser = await this.prisma.user.findUnique({
			where: {
				id: id,
			},
			select: {
				nickname: true,
			}
		})
		if (!currentUser)
			throw new NotFoundException('user not found')

		if (currentUser.nickname === nickname)
			return {userData: await this.privateProfile(id), isfriend: false, privateProfile: true, isBlocked: false};
		else
			return await this.publicProfile(nickname, id);
	}



	async publicProfile(nick: string, id: string) {
		let isfriend = false;
		let userProfile = false;
		let isBlocked = false;
    	const user = await this.prisma.user.findUnique({
			where: {
				nickname: nick,
			},
			select: {
				id: true,
				nickname: true,
				wallet: true,
				Rank:true,
				profilePic: true,
				BackgroundPic: true,
				level: true,
				status: true,
				BlockedBy: true,
				usersBlocked: true,
				Wins: true,
				Losses: true,
			},
		})
		if (!user)
			throw new NotFoundException('user not found')
		const friendStatus = await this.prisma.friendStatus.findFirst({
		  where: {
			userId: id, // Specify the ID of the user making the request
			friendId: user.id, // The ID of the user whose profile is being requested
			status: Status.FRIEND, // Adjust this based on your enum or string values for friendship status
		  },
		});
		if (friendStatus)
			isfriend = true;
		if (user.BlockedBy.find((bo) => bo === id))
			isBlocked = true;
		const {BlockedBy, usersBlocked , ...userSend} = user;
		return {userData: userSend, isfriend, privateProfile: userProfile, isBlocked};
  }

	async getProfiles(searchInput: string) {
		const users = await this.prisma.user.findMany({
			where: {
				nickname: {
					startsWith: searchInput,
					mode: 'insensitive',
				},
			},
			select: {
				id: true,
				nickname: true,
				profilePic: true,
			},
		});
		return users;
  }

	async enable2FA(id: string, login: string)
	{
		const isEnabled = await this.prisma.user.findUnique({
			where: {
				id: id,
			},
			select: {
				isEnabled: true,
			}
		})
		if (isEnabled.isEnabled == true)
			throw new ConflictException('2FA already enabled')

		await this.prisma.user.update({
			where: {
				id: id,
			},
			data: {
				isEnabled: true,
			}
		})
	}


	async getEnabled(id: string)
	{
		const user = await this.findOneById(id);
		if (!user)
			throw new NotFoundException('user not found')

		const isEnabled = await this.prisma.user.findUnique({
			where: {
				id: id,
			},
			select: {
				isEnabled: true,
				otpauth_url: true,
			}
		})
		return isEnabled;
	}

	async generateQRUrl(id: string)
	{
		const user = await this.findOneById(id);
		if (!user)
			throw new NotFoundException('user not found')
		const secret = authenticator.generateSecret();
		const url = authenticator.keyuri(user.nickname,'Pong',secret);
		if (user.isEnabled === true)
		{
			const url = user.otpauth_url;
			return {img: url};
		}
		await this.prisma.user.update({
			where: {
				id: id,
			},
			data: {
				Secret: secret,
				otpauth_url: url
			}
		})
		return {img: url};
	}

	async disable2FA(id: string)
	{
		const isEnabled = await this.prisma.user.findUnique({
			where: {
				id: id,
			},
			select: {
				isEnabled: true,
			}
		})
		if (isEnabled.isEnabled == false)
			throw new ConflictException('2FA already disabled')

		await this.prisma.user.update({
			where: {
				id: id,
			},
			data: {
				isEnabled: false,
			}
		})
	}

	async TwoFA(id: string, Enabled: boolean)
	{
		const user = await this.findOneById(id);
		if (!user)
			throw new NotFoundException('user not found')

		if (Enabled == true)
		{
			await this.enable2FA(id, user.nickname)
			return {valid:true}
		}
		await this.disable2FA(id)
		return {valid:false}
	}


	async getFriendStatus(id: string, nickname: string)
	{
		const user = await this.findOneByNickname(nickname);

		if (!user)
			throw new NotFoundException('User Not Found')
		const friendStatus = await this.prisma.friendStatus.findFirst({
			where: {
				userId: id,
				friendId: user.id
			}
		})
		
		if (!friendStatus)
		{
			const {BlockedBy, usersBlocked} = await this.prisma.user.findUnique({
				where: {
					id: user.id
				},
				select: {
					BlockedBy: true,
					usersBlocked: true,
				}
			})
			let ret1 = BlockedBy.find((b) => b === id);
			let ret2 = usersBlocked.find((b) => b === id);
			if (ret2 || ret1)
				return ({status: 'BLOCKED'})
			return ({status: 'NONE'})
		}
		return {status: friendStatus.status};
	}
}
