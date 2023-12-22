import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { authenticator } from 'otplib';
import { AchievementStatus, RequestType, Status, UserStatus } from '@prisma/client';
import { hashPass } from 'src/utils/bcryptUtils';
import { generateNickname } from 'src/utils/generateNickname';
import * as fs from 'fs';
import * as path from 'path';
import { NotificationData } from 'src/classes/classes';

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
		});


		const usersWithWinrates = users.map((user) => {
		const totalGames = user.Wins + user.Losses;
		const winrate = totalGames > 0 ? (user.Wins / totalGames) * 100 : 0;

		return {
				id: user.id,
				nickname: user.nickname,
				profilePic: user.profilePic,
				Wins: user.Wins,
				Losses: user.Losses,
				winrate,
				Rank: user.Rank,
				self: user.id === id,
			};
		});

		const sortedUsers = usersWithWinrates.sort((a, b) => b.winrate - a.winrate);

		return (sortedUsers)
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
			friendsData.push(friendData)
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
		})
	}

	async updateFriend(recipientId: string,friendStatus: any)
	{
		const friendExist = await this.prisma.friendStatus.findFirst({
			where: {
				userId: recipientId,
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

	async deleteFriend(recipientId: string)
	{
		const friendExist = await this.prisma.friendStatus.findFirst({
			where: {
				userId: recipientId, // The specific userId you want to target
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
			
		await this.deleteFriend(senderId)
		await this.deleteFriend(recipientId)

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

		// const friendStatus = await this.prisma.friendStatus.findFirst({
		// where: {
		// 	OR: [
		// 	{
		// 		userId: senderId,
		// 		friendId: recipientId,
		// 		status: {
		// 		in: [Status.FRIEND], // Check for FRIEND or PENDING status
		// 		},
		// 	},
		// 	{
		// 		userId: recipientId,
		// 		friendId: senderId,
		// 		status: {
		// 		in: [Status.FRIEND], // Check for FRIEND or PENDING status
		// 		},
		// 	},
		// 	],
		// },
		// });
		
		// if (!friendStatus)
		// 	throw new ConflictException('you need to be friends to block')
		
		// await this.deleteFriend(senderId)
		// await this.deleteFriend(recipientId)
		const sender = await this.prisma.user.findUnique({
			where: {
				id: senderId,
			}
		})
		if (!sender)
			throw new NotFoundException('sender Doesn\'t exist')
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
	
		await this.updateFriend(recipientId, Status.FRIEND)
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
	
		await this.deleteFriend(recipientId)
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

	async create(userData: any)
	{
		const nick = await generateNickname(userData.nickname);
		const hashedPass : string = await hashPass(userData.password);
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
		})

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
			notifications.push(notif)
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
				nickname: true,
				profilePic: true,
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
		// if (user.id === id)
		// 	userProfile = true;
		const {BlockedBy, usersBlocked , ...userSend} = user;
		return {userData: userSend, isfriend, privateProfile: userProfile, isBlocked};
  }

	async getProfiles(searchInput: string) {
		const users = await this.prisma.user.findMany({
			where: {
				nickname: {
					contains: searchInput,
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
				Secret: null,
				otpauth_url: null
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

}
