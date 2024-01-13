import { BadRequestException, ConflictException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { creatChannel } from '../dto/creat-channel.dto';
import { Channel, User, Types, Message, Dm } from '@prisma/client';
import { ChannelOutils, mutedUsers, notif2user } from './outils';
import { DateTime } from 'luxon';
import { DmOutils } from '../dm/dm.outils';
import { DmService } from '../dm/dm.service';
import { Server } from 'socket.io';
import { compareHash, hashPass } from 'src/utils/bcryptUtils';


@Injectable()
export class ChannelService {
    
    constructor(
        private readonly prisma: PrismaService,
        private readonly outils: ChannelOutils,
        private readonly dmOutils: DmOutils,
        private readonly dmService: DmService,
    ){}

    async   creatChannel(data: creatChannel, ownerId: string): Promise<Channel>
    {
        const {name, type, picture, password } = data;
        const type_: Types = type as Types;
        let hashedPass = password;
        const testName = name.trim();
        if (testName === '')
            throw new BadRequestException('Invalid Name.');
        if (type === 'PROTECTED' && (!password || password.length < 4 || password.length > 8))
            throw new BadRequestException('Invalid password.');
        else if ((type === 'PUBLIC' || type === 'PRIVATE') && password)
            throw new BadRequestException('Private & public channels don\'t require password');
        if (type === 'PROTECTED')
            hashedPass = await hashPass(password);
        const newChannel = await this.prisma.channel.create({
            data: {
                name,
                picture,
                type: type_,
                owner: ownerId,
                password: hashedPass,
                users: { connect: [{ id: ownerId }] },
                admins: { connect: [{ id: ownerId }] },
            },
        });
        if (!newChannel)
            throw new InternalServerErrorException('channel creation failed');
        const channel_: mutedUsers = {channelId: newChannel.id, users: []};
        this.outils.mutedList.push(channel_);
        return newChannel;
    }

    async   deleteChannel(channelName: string, ownerId: string)
    {
        const channel = await this.outils.findChannelByName(channelName);
        const ChannelOwner = await this.outils.getChannelOwner(channelName);
        if (ChannelOwner !== ownerId)
            throw new ForbiddenException('option allowed only for channel owner');
        const {id , updatedAt, users, ...results} = channel;
        // console.log('results == ', results);
        // const tmpChannel = await this.prisma.channel.create({
        //     data: {
        //         name: channel.name + "tmp",
        //         picture: channel.picture,
        //         type: channel.type,
        //         owner: ownerId,
        //         password: channel.password,
        //         updatedAt: channel.updatedAt
        //     },
        // });
        const deleteMessages = await this.prisma.message.deleteMany({
            where: {
                channelId: id,
            },
           });
        // console.log('deleted == ', deleteMessages);
        // console.log('name cahnell == ', channelName);
        // console.log('ownerId == ', ownerId);
        const channelId = await this.outils.getChannelIdByName(channelName)
        await this.prisma.blacklist.deleteMany({
            where: {
                channelId: channelId
            }
        })
        const deleted = await this.prisma.channel.delete({
            where: {
                name: channelName,
                owner: ownerId,
            },
        });
        // console.log('channel ==? ', deleted);
    }

    async   joinChannel(channelName: string, usernameId: string, password?: string)
    {
        const isUserInChannel =  await this.outils.isUserInChannel(channelName, usernameId);
        if (isUserInChannel)
            throw new UnauthorizedException(`You are already member of ${channelName}.`);
        const isClean = await this.outils.isUserInBlacklist(channelName, usernameId);
        if(isClean)
            throw new UnauthorizedException(`You are blacklisted in ${channelName}.`);
        const type = await this.outils.getChannelType(channelName);
        if (type === 'PROTECTED') {
            const channelPass = await this.outils.getChannelPass(channelName);
            const val = await compareHash(password, channelPass);
            if (!val)
                throw new UnauthorizedException('Password incorrect.');
        }
        if (type === 'PRIVATE') {
            const owner = await this.outils.getChannelOwner(channelName);
            return ['PRIVATE', owner];
        }
        await this.prisma.channel.update({
            where: { name: channelName },
            data: {
                users: {  connect: { id: usernameId } },
            },
        });
        return ['Done'];
    } 

    async   creatMessageChannel(channelName: string, senderId: string, content: string)
    {
        const user = await this.outils.isUserInChannel(channelName, senderId);
        if (!user)
            throw new UnauthorizedException(`You are not member of ${channelName}.`);
        const id = await this.outils.getChannelIdByName(channelName);
        const newMessage = await this.prisma.message.create({
            data: {
                content,
                sender: {connect: { id: senderId }},
                channel: {connect: { id }},
            },
        });
        if (!newMessage)
            throw new InternalServerErrorException('Failed message creation.');
        return newMessage;
    }
    
    async   getUserChannels(nicknameId: string)
    {
        const user = await this.prisma.user.findUnique({
            where: { id: nicknameId },
            select: {
                channels: {
                    include: {
                        messages: {
                            select: {
                                content: true,
                                createdAt: true
                            },
                            orderBy: {
                                createdAt: 'desc',
                            },
                            take: 1,
                        },
                    },
                    orderBy: {
                        updatedAt: 'desc',
                    },
                },
            },
        });
        if (!user) 
            throw new NotFoundException(`user not found.`);
        return user.channels || [];
    }


    async   leaveChannel(channelName: string, nicknameId: string)
    {
        const isMemberInChannel = await this.outils.isUserInChannel(channelName, nicknameId);
        if(!isMemberInChannel)
            throw new NotFoundException(`user not found in ${channelName}.`);
        const isOwner = await this.outils.getChannelOwner(channelName);
        if(isOwner === nicknameId)
            throw new BadRequestException('Set a new owner before leaving.');
        await this.prisma.channel.update({
            where: { name: channelName },
            data: {
                users: {
                    disconnect: [{ id: nicknameId }],
                },
                admins: {
                    disconnect: [{id: nicknameId}],
                },
            },
        });
    }

    async   changeOwnerOfChannel(channelName: string, oldOwnerId: string, newOwnerId: string)
    {
        const isOwner = await this.outils.getChannelOwner(channelName);
        if (isOwner !== oldOwnerId) 
            throw new ForbiddenException(`you are not allowed`);
        const isMemberNew = await this.outils.isUserInChannel(channelName, newOwnerId);
        if (!isMemberNew)
            throw new NotFoundException(`user not found in ${channelName}`);
        await   this.prisma.channel.update({
            where: { name: channelName },
            data: {
                owner: newOwnerId,
                admins: { disconnect: [{ id: oldOwnerId}],  connect: [{ id: newOwnerId}]},
            },
        });
    }

    async   setAdmin2Channel(channelName: string, ownerId: string, newAdminId: string)
    {
        const isOwner = await this.outils.getChannelOwner(channelName);
        if (isOwner !== ownerId) 
            throw new ForbiddenException(`you are not allowed`);
        if (ownerId === newAdminId)
            throw new UnauthorizedException(`you can\'t set youself`);
        const isMember = await this.outils.isUserInChannel(channelName, newAdminId);
        if (!isMember)
            throw new NotFoundException(`user not found in ${channelName}`);
        const isAdmin = await this.outils.isUserAdministrator(channelName, newAdminId);
        if (isAdmin)
            throw new NotFoundException(`user already admin in ${channelName}`);
        await   this.prisma.channel.update({
            where: { name: channelName, owner: ownerId },
            data: {
                admins: { connect: [{ id: newAdminId}] },
            },
        });
    }
    //
    async   demoteUser(channelName: string, ownerId: string, demoteUserId: string)
    {
        const isOwner = await this.outils.getChannelOwner(channelName);
        if (isOwner !== ownerId) 
            throw new ForbiddenException(`you are not allowed`);
        if (ownerId === demoteUserId)
            throw new UnauthorizedException(`you can\'t demote youself`);
        const isMember = await this.outils.isUserInChannel(channelName, demoteUserId);
        if (!isMember)
            throw new NotFoundException(`user not found in ${channelName}`);
        const isAdmin = await this.outils.isUserAdministrator(channelName, demoteUserId);
        if (!isAdmin)
            throw new NotFoundException(`user not admin in ${channelName}`);
        await   this.prisma.channel.update({
            where: { name: channelName, owner: ownerId },
            data: {
                admins: { disconnect: [{ id: demoteUserId}] },
            },
        });
    }
    //

    async   kickUser(channelName: string, adminId: string, user2kickId: string)
    {
        const isMember = await this.outils.isUserInChannel(channelName, adminId);
        if(!isMember)
            throw new NotFoundException(`user not found in ${channelName}.`);
        const isUser2kickMember = await this.outils.isUserInChannel(channelName, user2kickId);
        if(!isUser2kickMember)
            throw new NotFoundException(`user not found in ${channelName}.`);
        const isUserAdmin = await this.outils.isUserAdministrator(channelName, adminId);
        if(!isUserAdmin)
            throw new ForbiddenException('Only admins can kick users.');
        if((await this.outils.getChannelOwner(channelName)) === adminId) {
            const isAdmin = await this.outils.isUserAdministrator(channelName, user2kickId);
            if(isAdmin) {
                await this.prisma.channel.update({
                    where: {name: channelName},
                    data: { admins: {disconnect: {id: user2kickId}} },
                });
            }
        }
        const isNotAdmin = await this.outils.isUserAdministrator(channelName, user2kickId);
        if(isNotAdmin)
            throw new ForbiddenException('Only owner can kick admins.')
        await this.prisma.channel.update({
            where: {name: channelName},
            data: { users: {disconnect: {id: user2kickId}} },
        });
    }
    
    async   banUser(channelName: string, adminId: string, user2banId: string)
    {
        //check user to ban if it is baned
        const isMember = await this.outils.isUserInChannel(channelName, adminId);
        if(!isMember)
            throw new NotFoundException(`user not found in ${channelName}.`);
        const isUser2banMember = await this.outils.isUserInChannel(channelName, user2banId);
        if(!isUser2banMember)
            throw new NotFoundException(`user not found in ${channelName}.`);
        const isAdmin = await this.outils.isUserAdministrator(channelName, adminId);
        if(!isAdmin)
            throw new ForbiddenException('Only admins can ban users.');
        if((await this.outils.getChannelOwner(channelName)) === adminId)
        {
            const isAdmin = await this.outils.isUserAdministrator(channelName, user2banId);
            if(isAdmin) {
                await this.prisma.channel.update({
                    where: {name: channelName},
                    data: { admins: {disconnect: {id: user2banId}} },
                });
            }
        }
        const isNotAdmin = await this.outils.isUserAdministrator(channelName, user2banId);
        if(isNotAdmin)
            throw new ForbiddenException('Only owner can ban admins.')
        await this.prisma.channel.update({
            where: {name: channelName},
            data: { users: {disconnect: {id: user2banId}} },
        });
        await this.prisma.blacklist.create({
            data: {
                nickname: user2banId,
                status: 'BAN',
                channel: {connect: {name: channelName} },
            },
        });
    }
        
    async   muteUser(channelName: string, adminId: string, user2muteId: string, expirationTime: number)
    {
        //check user to mute if it is muted
        const isCientMember = await this.outils.isUserInChannel(channelName, adminId);
        if(!isCientMember)
            throw new NotFoundException(`user not found in ${channelName}.`);
        const isUser2muteMember = await this.outils.isUserInChannel(channelName, user2muteId);
        if(!isUser2muteMember)
            throw new NotFoundException(`user not found in ${channelName}.`);
        const isClientAdmin = await this.outils.isUserAdministrator(channelName, adminId);
        if(!isClientAdmin)
            throw new ForbiddenException('Only admins can mute users.');
        const isNotAdmin = await this.outils.isUserAdministrator(channelName, user2muteId);
        if(isNotAdmin)
            if((await this.outils.getChannelOwner(channelName)) !== adminId)
                throw new ForbiddenException('Only owner can mute admins.')
        // expirationTime *= 60;
        console.log('data now === ', DateTime.now());
        const expiredAt = DateTime.now().plus({ seconds: expirationTime }).toJSDate();
        console.log('data now === ', DateTime.now().plus({seconds: expirationTime}));
        if ((await this.outils.getStatusInBlacklist(channelName, user2muteId)) === 'MUTED')
            throw new ConflictException('can not mute user twice');
        await this.prisma.blacklist.create({
            data: {
                nickname: user2muteId,
                status: 'MUTED',
                expiredAt,
                channel: {connect: {name: channelName}},
            },
        });
        const channelId = await this.outils.getChannelIdByName(channelName);
        const channel = this.outils.mutedList.find((c) => c.channelId == channelId);
        if (channel)
            channel.users.push(user2muteId);
        else {
            const ch: mutedUsers = {channelId: channelId, users: [user2muteId]};
            this.outils.mutedList.push(ch);
        }
    }   

    async   changeChannelType(channelName: string, ownerId: string, newType: Types, password?: string)
    {
        const isOwner = await this.outils.getChannelOwner(channelName);
        if (isOwner !== ownerId) 
            throw new ForbiddenException(`you are not allowed`);
        const channel2update = await this.outils.findChannelByName(channelName);
        if (channel2update.type === newType) 
            throw new BadRequestException('Chanel already with this type.');
        if (newType !== 'PROTECTED')
            password = null;
        else
            password = await hashPass(password);
        await this.prisma.channel.update({
            where: { 
                name: channelName,
                owner: ownerId,
            },
            data: {
                type: newType,
                password,
            },
        });
    }

    async   changeChannelName(channelName: string, ownerId: string, newName: string)
    {
        const channel2update = await this.outils.findChannelByName(channelName);
        if (!channel2update)
            throw new NotFoundException(`${channelName} not found.`);
        const channelOwner = await this.outils.getChannelOwner(channelName);
        if (channelOwner !== ownerId)
            throw new UnauthorizedException('You are not allowed to make changes in this channel.');
        const isAllocated = await this.outils.isChannelExist(newName);
        if (isAllocated)
            throw new ConflictException(`${newName} is already taken`);
        const id: string = await this.outils.getChannelIdByName(channelName);
        await this.prisma.channel.update({
            where: {
                id,
                owner: ownerId
            },
            data: {
                name: newName
            },
        });
    }

    async   changeChannelPass(channelName: string, ownerId: string, newPassword: string)
    {
        const channel2update = await this.outils.findChannelByName(channelName);
        if (!channel2update)
            throw new NotFoundException(`${channelName} not found.`);
        const channelOwner = await this.outils.getChannelOwner(channelName);
        if (channelOwner !== ownerId)
            throw new UnauthorizedException('You are not allowed to make changes in this channel.');
        if (channel2update.type === 'PROTECTED') {
            const hasPassword = await hashPass(newPassword);
            await this.prisma.channel.update({
                where: {
                    name: channelName,
                    owner: ownerId,
                },
                data: { password: hasPassword },
            });
        }
        else
            throw new BadRequestException('Change password only allowed in PROTECTED channels.');
    }

    async   changeChannelPicture(channelName: string, newPicture: string, ownerId: string)
    {
        const channel2update = await this.outils.findChannelByName(channelName);
        if (!channel2update)
            throw new NotFoundException(`${channelName} not found.`);
        const channelOwner = await this.outils.getChannelOwner(channelName);
        if (channelOwner !== ownerId)
            throw new UnauthorizedException('You are not allowed to make changes in this channel');
    }

    async   getChannelUsers(channelName: string): Promise<User[]>
    {
        const channel = await this.prisma.channel.findUnique({
            where: { name: channelName },
            include: { users: true },
        });
        if (!channel)
            throw new NotFoundException(`${channelName} not found3.`);
        const users: User[] = channel?.users || [];
        return users;
    }

    async   searchChannels(channelName: string, userId: string)
    {
        const channels = await this.prisma.channel.findMany({
            where: {
                name: { contains: channelName },
                NOT: {
                    blacklist: {
                        some: { nickname: userId }
                    }
                }
            },
            include: {
                messages: {
                    select: { content: true },
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
                blacklist: {
                    select: {
                        nickname: true,
                        status: true
                    },
                },
            },
        });
        if (!channels)
            return [];
        return channels;
    }

    async   getMessagesCH(usernameId: string, channelName: string)
    {
        const isMember = await this.outils.isUserInChannel(channelName, usernameId);
        if (!isMember)
            throw new ForbiddenException('Forbidden action');
        const channelId = await this.outils.getChannelIdByName(channelName);
        const blockedList = await this.dmOutils.getBlockedUsers(usernameId);
        const allMessages = await this.prisma.message.findMany({
            where: {
                channelId: channelId,
                senderId: {
                    not: { in: blockedList },
                },
            },
            include: {
                sender: {
                    select: {
                        nickname: true,
                        profilePic: true,
                    },
                },
            },
            orderBy: { createdAt: 'asc' },
        });
        return allMessages || [];
    }

    async   allowedUsersCH(channelName: string, user: any, usersSockets: any[])
    {
        const channelusers = await this.getChannelUsers(channelName);
        const blockedList = await this.dmOutils.getBlockedUsers(user.id);
        const allowedUsers: {userId: string, socket: any}[] = [];
        for (const userSocket of usersSockets) {
            const inChannel = channelusers.find((usr) => usr.id === userSocket.userId);
            if (inChannel)
            {
                if (blockedList.length === 0)
                    allowedUsers.push(userSocket);
                for (const blocked of blockedList) {
                    if (blocked !== inChannel.id)
                        allowedUsers.push(userSocket);
                }
            }
        }
        return allowedUsers;
    }

    async   emitNotif2channelUsers(data: notif2user, values: string[], dataObj: any = {})
    {
        const {channelName, admin, notif, user2notify, server, usersSockets} = data;
        // console.log('new name ? == ', channelName)
        const user2notifyId = user2notify;
        const channelId = await this.outils.getChannelIdByName(channelName);
        const channelUsers = await this.getChannelUsers(channelName);
        // console.log('channelUsers -== ', channelUsers)
        for (const userSocket  of usersSockets) {
            if (user2notifyId === userSocket.userId)
                userSocket.socket.emit(values[0], dataObj);
            if (channelUsers.find(userIn => userIn.id === userSocket.userId))
                userSocket.socket.join(channelId);
        }
        server.to(channelId).emit(values[1], dataObj);
        server.to(channelId).emit('notification', notif);
        for (const userSocket  of usersSockets)
            if (channelUsers.find(userIn => userIn.id === userSocket.userId))
                userSocket.socket.leave(channelId);
    }
}
