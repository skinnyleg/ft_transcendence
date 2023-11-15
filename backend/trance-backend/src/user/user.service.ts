import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { authenticator } from 'otplib';
import { RequestType, Status, UserStatus } from '@prisma/client';
import { hashPass } from 'src/utils/bcryptUtils';
import { generateNickname } from 'src/utils/generateNickname';
import { request } from 'http';

@Injectable()
export class UserService {

	constructor(private readonly prisma: PrismaService){}

  	async findOneByLogin(login: string) {
    const user = await this.prisma.user.findUnique({
			where: {
				login,
			},
		})
		return user;
  }



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
		const user = await this.prisma.user.findUnique({
			where: {
				nickname: nick,
			}
		})
		return user;
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

	async setNewFriend(senderId: string, recipientId: string,friendStatus: any)
	{
		const newFriend = await this.prisma.friendStatus.create({
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
				userId: recipientId, // The specific userId you want to target
			},
		});

		if (!friendExist)
			throw new NotFoundException('no instanse found')

		const updatedFriendStatus = await this.prisma.friendStatus.update({
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

		const updatedFriendStatus = await this.prisma.friendStatus.delete({
			where: {
				id: friendExist.id, // Use the ID of the existing record
				},
		});
	}

	async saveRequest(senderId: string, recipientId: string)
	{
		if (senderId === recipientId)
			throw new BadRequestException('Can\'t add yourself as a friend')

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
		  },
		});

		if (requestExist)
			throw new BadRequestException('you have already sent a request')

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
			throw new BadRequestException('you are already friends or already got a request from this user')
			

		const id = await this.generateRequest(senderId, recipientId, RequestType.FRIEND);
		await this.setNewFriend(senderId, recipientId, Status.PENDING)
		return id;
	}



	async generateRequest(senderId: string, recipientId: string, typeOfRequest: RequestType)
	{
		let description;
		if (typeOfRequest === RequestType.FRIEND)
			description = "sent you a friend request";
		else if (typeOfRequest === RequestType.CHALLENGE)
			description = "has challenged you";
		else if (typeOfRequest === RequestType.MESSAGE)
			description = "sent you a message"

		const request = await this.prisma.request.create({
		  data: {
			user: { connect: { id: recipientId } }, // Assuming you have the `userId` available
			senderId: senderId, // Assuming you have the `senderId` available
			typeOfRequest: typeOfRequest,
			descriptionOfRequest: description,
		  },
		});
		if (!request)
			throw new BadRequestException('Can\'t generate a request');
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

	async acceptRequest(senderId: string, recipientId: string, requestId: string)
	{
		if (senderId === recipientId)
			throw new BadRequestException('can\'t accept a request from yourself')

		const request = await this.prisma.request.findUnique({
			where: {
				id: requestId,
				senderId: recipientId,
			}
		});

		if (!request)
			throw new NotFoundException('request Doesn\'t exist')

		const user = await this.prisma.user.findUnique({
			where: {
				id: recipientId,
			}
		})
		if (!user)
			throw new NotFoundException('user Doesn\'t exist')
	
		await this.updateFriend(recipientId, Status.FRIEND)
		await this.setNewFriend(senderId, recipientId, Status.FRIEND)
		await this.prisma.request.delete({
			where: {
				id: requestId
			},
		  });
		
	}

	async refuseRequest(senderId: string, recipientId: string, requestId: string)
	{
		if (senderId === recipientId)
			throw new BadRequestException('can\'t refuse a request from yourself')

		const request = await this.prisma.request.findUnique({
			where: {
				id: requestId,
				senderId: recipientId,
			}
		});

		if (!request)
			throw new NotFoundException('request Doesn\'t exist')

		const user = await this.prisma.user.findUnique({
			where: {
				id: recipientId,
			}
		})
		if (!user)
			throw new NotFoundException('user Doesn\'t exist')
	
		await this.deleteFriend(recipientId)
		await this.prisma.request.delete({
			where: {
				id: requestId
			},
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
		const combinedData = {
			requestId: notifData.id,
			notifData: {
				userId: userData.id,
				userProfilePic: userData.profilePic,
				description: `${userData.nickname}` + " " + notifData.descriptionOfRequest,
				typeOfRequest: notifData.typeOfRequest,
			},
		}
		return combinedData;
	}

	async create(userData: any)
	{
		const nick = await generateNickname(userData.login);
		const hashedPass : string = await hashPass(userData.password);
		return await this.prisma.user.create({
			data: {
			intraId: userData.intraId,
			email: userData.email,
			login: userData.login,
			password: hashedPass,
			firstName: userData.firstName,
			lastName: userData.lastName,
			profilePic: userData.profilePic,
			BackgroundPic: userData.BackgroundPic,
			wallet: userData.wallet,
			level: userData.level,
			grade: userData.grade,
			status: UserStatus.ONLINE,
			nickname: nick,
			token: "",
			}
		})
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
		if (requestIds.length === 0)
			throw new NotFoundException('no new notification')
	
		for (const req of requestIds)
		{
			const notif = await this.generateNotifData(req.id);
			notifications.push(notif)
		}
		return notifications;
	}

	async updateToken(id: string, token: string)
	{
		return await this.prisma.user.update({
			where:{
				id: id,
			},
			data: {
				token: token,
			}
		})
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
			throw new BadRequestException('User hasn\'t enable 2FA')
		return secret.Secret;
	}


		async changePassword(newPass : string, id : string) {

		// if (!isStrongPassword(newPass))
		// 	throw new BadRequestException('Password does not meet strength requirements');
		const user = await this.findOneById(id);

		if (!user)
			throw new UnauthorizedException("No User Found")
	
		// const isMatch = await compareHash(oldPass,user.password);
		// if (isMatch == false)
		// 	throw new UnauthorizedException('Wrong Crendentiels')

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




		async changeNickname(newNick : string, id: string) {

		const isunique = await this.findOneByNickname(newNick);
		if (isunique)
			throw new BadRequestException('nickname already taken')
	
		const user = await this.findOneById(id)

		if (!user)
			throw new BadRequestException("user doesn't exist")

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
			login:true,
			wallet: true,
			grade:true,
			profilePic: true,
			BackgroundPic: true,
			level: true,
			status: true,
			isEnabled: true,
			},
		})
		if (!user)
			throw new BadRequestException('user not found')
		return user;
  }


	async publicProfile(nick: string, id: string) {
		let isfriend = false;
		let userProfile = false;
    	const user = await this.prisma.user.findUnique({
			where: {
				nickname: nick,
			},
			select: {
			id: true,
			nickname: true,
			login:true,
			wallet: true,
			grade:true,
			profilePic: true,
			BackgroundPic: true,
			level: true,
			status: true,
			},
		})
		if (!user)
			throw new BadRequestException('user not found')
		const friendStatus = await this.prisma.friendStatus.findFirst({
		  where: {
			userId: id, // Specify the ID of the user making the request
			friendId: user.id, // The ID of the user whose profile is being requested
			status: Status.FRIEND, // Adjust this based on your enum or string values for friendship status
		  },
		});
		if (friendStatus)
			isfriend = true;
		if (user.id === id)
			userProfile = true;
		return {userData: user, isfriend, userProfile};
  }

	async getProfiles() {
    	const users = await this.prisma.user.findMany({
			select: {
			id: true,
			nickname: true,
			login:true,
			profilePic: true,
			status: true,
			},
		})
		return users;
  }

	async enable2FA(id: string, login: string)
	{
		const secret = authenticator.generateSecret();
		const url = authenticator.keyuri(login,'Pong',secret);
		await this.prisma.user.update({
			where: {
				id: id,
			},
			data: {
				isEnabled: true,
				Secret: secret,
				otpauth_url: url
			}
		})
		return url;
	}

	async disable2FA(id: string)
	{
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

	async TwoFA(id: string)
	{
		const user = await this.findOneById(id);
		if (!user)
			throw new BadRequestException('user not found')

		if (user.isEnabled == false)
		{
			const url = await this.enable2FA(id, user.login)
			return {valid:true, img: url}
		}
		await this.disable2FA(id)
		return {valid:false}
	}

}
