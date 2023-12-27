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

    async   creatChannel(data: creatChannel, owner: string): Promise<Channel>
    {
        const {name, type, picture, password } = data;
        const type_: Types = type as Types;
        let hashedPass = password;
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
                owner,
                password: hashedPass,
                users: { connect: [{ nickname: owner }] },
                admins: { connect: [{ nickname: owner }] },
            },
        });
        if (!newChannel)
            throw new InternalServerErrorException('channel creation failed');
        const channel_: mutedUsers = {name, users: []};
        this.outils.mutedList.push(channel_);
        return newChannel;
    }

    async   joinChannel(channelName: string, username: string, password?: string)
    {
        const isUserInChannel =  await this.outils.isUserInChannel(channelName, username);
        if (isUserInChannel)
            throw new UnauthorizedException(`You are already member of ${channelName}.`);
        const isClean = await this.outils.isUserInBlacklist(channelName, username);
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
                users: {  connect: { nickname: username } },
            },
        });
        return ['Done'];
    } 

    async   creatMessageChannel(channelId: string, sender: string, content: string)
    {
        const user = await this.outils.isUserInChannel(channelId, sender);
        if (!user) {
            throw new UnauthorizedException(`You are not member of ${channelId}.`);
        }
        const id = await this.outils.getChannelIdByName(channelId);
        const newMessage = await this.prisma.message.create({
            data: {
                content,
                sender: {connect: { nickname: sender }},
                channel: {connect: { id, }},
            },
        });
        if (!newMessage) {
            throw new InternalServerErrorException('Failed message creation.');
        }
        return newMessage;
    }
    
    async   getUserChannels(nickname: string)
    {
        const user = await this.prisma.user.findUnique({
            where: { nickname },
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
            throw new NotFoundException(`${nickname} user not found.`);
        return user.channels || [];
    }


    async   leaveChannel(channelName: string, nickname: string)
    {
        const isMemberInChannel = await this.outils.isUserInChannel(channelName, nickname);
        if(!isMemberInChannel)
            throw new NotFoundException(`${nickname} not found in ${channelName}.`);
        const isOwner = await this.outils.getChannelOwner(channelName);
        if(isOwner === nickname)
            throw new BadRequestException('Set a new owner before leaving.');
        await this.prisma.channel.update({
            where: { name: channelName },
            data: {
                users: {
                    disconnect: [{ nickname }],
                },
                admins: {
                    disconnect: [{nickname}],
                },
            },
        });
    }

    async   changeOwnerOfChannel(channelName: string, oldOwner: string, newOwner: string)
    {
        const isOwner = await this.outils.getChannelOwner(channelName);
        if (isOwner !== oldOwner) 
            throw new ForbiddenException(`you are not allowed`);
        const isMemberNew = await this.outils.isUserInChannel(channelName, newOwner);
        if (!isMemberNew)
            throw new NotFoundException(`${newOwner} not found in ${channelName}`);
        console.log('new onwer == ', newOwner);
        await   this.prisma.channel.update({
            where: { name: channelName },
            data: {
                owner: newOwner,
                admins: { disconnect: [{ nickname: oldOwner}] , connect: [{ nickname: newOwner}]},
            },
        });
    }

    async   setAdmin2Channel(channelName: string, owner: string, newAdmin: string)
    {
        const isOwner = await this.outils.getChannelOwner(channelName);
        if (isOwner !== owner) 
            throw new ForbiddenException(`you are not allowed`);
        if (owner === newAdmin)
            throw new UnauthorizedException(`you can\'t set youself`);
        const isMember = await this.outils.isUserInChannel(channelName, newAdmin);
        if (!isMember)
            throw new NotFoundException(`${newAdmin} not found in ${channelName}`);
        const isAdmin = await this.outils.isUserAdministrator(channelName, newAdmin);
        if (isAdmin)
            throw new NotFoundException(`${newAdmin} already admin in ${channelName}`);
        await   this.prisma.channel.update({
            where: { name: channelName, owner },
            data: {
                admins: { connect: [{ nickname: newAdmin}] },
            },
        });
    }
    //
    async   demoteUser(channelName: string, owner: string, demoteUser: string)
    {
        const isOwner = await this.outils.getChannelOwner(channelName);
        if (isOwner !== owner) 
            throw new ForbiddenException(`you are not allowed`);
        if (owner === demoteUser)
            throw new UnauthorizedException(`you can\'t demote youself`);
        const isMember = await this.outils.isUserInChannel(channelName, demoteUser);
        if (!isMember)
            throw new NotFoundException(`${demoteUser} not found in ${channelName}`);
        const isAdmin = await this.outils.isUserAdministrator(channelName, demoteUser);
        if (!isAdmin)
            throw new NotFoundException(`${demoteUser} not admin in ${channelName}`);
        await   this.prisma.channel.update({
            where: { name: channelName, owner },
            data: {
                admins: { disconnect: [{ nickname: demoteUser}] },
            },
        });
    }
    //

    async   kickUser(channelName: string, admin: string, user2kick: string)
    {
        const isMember = await this.outils.isUserInChannel(channelName, admin);
        if(!isMember)
            throw new NotFoundException(`${admin} not found in ${channelName}.`);
        const isUser2kickMember = await this.outils.isUserInChannel(channelName, user2kick);
        if(!isUser2kickMember)
            throw new NotFoundException(`${user2kick} not found in ${channelName}.`);
        const isUserAdmin = await this.outils.isUserAdministrator(channelName, admin);
        if(!isUserAdmin)
            throw new ForbiddenException('Only admins can kick users.');
        if((await this.outils.getChannelOwner(channelName)) === admin) {
            console.log()
            const isAdmin = await this.outils.isUserAdministrator(channelName, user2kick);
            if(isAdmin) {
                await this.prisma.channel.update({
                    where: {name: channelName},
                    data: { admins: {disconnect: {nickname: user2kick}} },
                });
            }
        }
        const isNotAdmin = await this.outils.isUserAdministrator(channelName, user2kick);
        if(isNotAdmin)
            throw new ForbiddenException('Only owner can kick admins.')
        await this.prisma.channel.update({
            where: {name: channelName},
            data: { users: {disconnect: {nickname: user2kick}} },
        });
    }
    
    async   banUser(channelName: string, admin: string, user2ban: string)
    {
        //check user to ban if it is baned
        const isMember = await this.outils.isUserInChannel(channelName, admin);
        if(!isMember)
            throw new NotFoundException(`${admin} not found in ${channelName}.`);
        const isUser2banMember = await this.outils.isUserInChannel(channelName, user2ban);
        if(!isUser2banMember)
            throw new NotFoundException(`${user2ban} not found in ${channelName}.`);
        const isAdmin = await this.outils.isUserAdministrator(channelName, admin);
        if(!isAdmin)
            throw new ForbiddenException('Only admins can ban users.');
        if((await this.outils.getChannelOwner(channelName)) === admin)
        {
            const isAdmin = await this.outils.isUserAdministrator(channelName, user2ban);
            if(isAdmin) {
                await this.prisma.channel.update({
                    where: {name: channelName},
                    data: { admins: {disconnect: {nickname: user2ban}} },
                });
            }
        }
        const isNotAdmin = await this.outils.isUserAdministrator(channelName, user2ban);
        if(isNotAdmin)
            throw new ForbiddenException('Only owner can ban admins.')
        await this.prisma.channel.update({
            where: {name: channelName},
            data: { users: {disconnect: {nickname: user2ban}} },
        });
        await this.prisma.blacklist.create({
            data: {
                nickname: user2ban,
                status: 'BAN',
                channel: {connect: {name: channelName} },
            },
        });
    }
        
    async   muteUser(channelName: string, client: string, user2mute: string, expirationTime: number)
    {
        //check user to ban if it is baned
        const isCientMember = await this.outils.isUserInChannel(channelName, client);
        if(!isCientMember)
            throw new NotFoundException(`${client} not found in ${channelName}.`);
        const isUser2muteMember = await this.outils.isUserInChannel(channelName, user2mute);
        if(!isUser2muteMember)
            throw new NotFoundException(`${user2mute} not found in ${channelName}.`);
        const isClientAdmin = await this.outils.isUserAdministrator(channelName, client);
        if(!isClientAdmin)
            throw new ForbiddenException('Only admins can mute users.');
        const isNotAdmin = await this.outils.isUserAdministrator(channelName, user2mute);
        if(isNotAdmin)
            if((await this.outils.getChannelOwner(channelName)) !== client)
                throw new ForbiddenException('Only owner can mute admins.')
        // expirationTime *= 60;
        const expiredAt = DateTime.now().plus({ seconds: expirationTime }).toJSDate();
        await this.prisma.blacklist.create({
            data: {
                nickname: user2mute,
                status: 'MUTED',
                expiredAt,
                channel: {connect: {name: channelName}},
            },
        });
        const channel = this.outils.mutedList.find((c) => c.name == channelName);
        if (channel)
            channel.users.push(user2mute);
        else {
            const ch: mutedUsers = {name: channelName, users: [user2mute]};
            this.outils.mutedList.push(ch);
        }
    }   

    async   changeChannelType(channelName: string, owner: string, newType: Types, password?: string)
    {
        const isOwner = await this.outils.getChannelOwner(channelName);
        if (isOwner !== owner) 
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
                owner,
            },
            data: {
                type: newType,
                password,
            },
        });
    }

    async   changeChannelName(channelName: string, owner: string, newName: string)
    {
        const channel2update = await this.outils.findChannelByName(channelName);
        if (!channel2update)
            throw new NotFoundException(`${channelName} not found.`);
        // console.log('channel name 00: ', channelName);
        // console.log('channel name 01: ', newName);
        const channelOwner = await this.outils.getChannelOwner(channelName);
        if (channelOwner !== owner)
            throw new UnauthorizedException('You are not allowed to make changes in this channel.');
        const isAllocated = await this.outils.isChannelExist(newName);
        if (isAllocated)
            throw new ConflictException(`${newName} is already taken`);
        const id: string = await this.outils.getChannelIdByName(channelName);
        await this.prisma.channel.update({
            where: {
                id,
                owner
            },
            data: {
                name: newName
            },
        });
    }

    async   changeChannelPass(channelName: string, owner: string, newPassword: string)
    {
        const channel2update = await this.outils.findChannelByName(channelName);
        if (!channel2update)
            throw new NotFoundException(`${channelName} not found.`);
        const channelOwner = await this.outils.getChannelOwner(channelName);
        if (channelOwner !== owner)
            throw new UnauthorizedException('You are not allowed to make changes in this channel.');
        if (channel2update.type === 'PROTECTED') {
            const hasPassword = await hashPass(newPassword);
            await this.prisma.channel.update({
                where: {
                    name: channelName,
                    owner,
                },
                data: { password: hasPassword },
            });
        }
        else
            throw new BadRequestException('Change password only allowed in PROTECTED channels.');
    }

    async   changeChannelPicture(channelName: string, newPicture: string, owner: string)
    {
        const channel2update = await this.outils.findChannelByName(channelName);
        if (!channel2update)
            throw new NotFoundException(`${channelName} not found.`);
        const channelOwner = await this.outils.getChannelOwner(channelName);
        if (channelOwner !== owner)
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

    async   searchChannels(channelName: string)
    {
        const channels = await this.prisma.channel.findMany({
            where: {
                name: { contains: channelName }
            },
            include: {
                messages: {
                    select: { content: true },
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
            },
        });
        if (!channels)
            return [];
        return channels;
    }

    async   getMessagesCH(username: string, channelName: string)
    {
        const isMember = await this.outils.isUserInChannel(channelName, username);
        if (!isMember)
            throw new ForbiddenException('forbidden action.');
        const channelId = await this.outils.getChannelIdByName(channelName);
        const blockedList = await this.dmOutils.getBlockedUsers(username);
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
        const blockedList = await this.dmOutils.getBlockedUsers(user.nickname);
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
        const user2notifyId = await this.dmOutils.getUserIdByName(user2notify);
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
