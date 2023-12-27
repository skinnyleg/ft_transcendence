import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Blacklist, Channel, Membership, User, Dm } from '@prisma/client';
import { Cron, CronExpression } from "@nestjs/schedule";
import { DmOutils } from "../dm/dm.outils";
import { ChannelService } from "./channel.service";
import { Server } from "socket.io";

export interface channelsSide {
    channelId?: string,
    channelName?: string,
    channelPicture?: string,
    userRole?: string,
    userStatus?: string,
    lastMsg?: string,
    channelType?: string
}

export interface channelSidebar {
    username?: string,
    userId?: string,
    channelRole?: string,
    userPicture?: string
}

export interface mutedUsers {
    channelId: string;
    users: string[];
}

export interface messsagesCH {
    channelId?: string,
    messageId?: string,
    sender?: string,
    picture?: string,
    message?: string,
    time?: string
}

export interface notif2user {
    channelName?: string,
    admin?: string,
    notif?: any,
    user2notify?: string,
    server?: Server,
    usersSockets?: {userId: string, socket: any}[],
}

@Injectable()
export class ChannelOutils {

    constructor(
        private readonly prisma: PrismaService,
        private readonly dmOutils: DmOutils, 
    ){}

    public readonly mutedList: mutedUsers[] = [];

    async   findChannelByName(name: string)
    {
        const channel =  await this.prisma.channel.findUnique({
            where: { name },
            include: {
                users: {
                    select: {
                        id: true,
                        intraId: true,
                        profilePic: true,
                        nickname: true,
                        status: true,
                    },
                },
                admins: {
                    select : {
                        id: true,
                        intraId: true,
                        profilePic: true,
                        nickname: true,
                        status: true,
                    },
                },
                blacklist: {
                    select: {
                        id: true,             
                        nickname: true,
                        status: true,
                        expiredAt: true,
                        channelName: true,
                        channel: {
                            select: {
                                id: true,
                                name: true,
                                type: true,
                                owner: true,
                            },
                        },
                    },
                },
            },
        });
        
        if(!channel) 
            throw new  NotFoundException(`${name} channel not found2.`);
        return channel;
    }

    async   isUserInChannel(channelName: string, nicknameId: string): Promise<boolean>
    {
        const channel = await this.prisma.channel.findUnique({
            where: { name: channelName },
            select: { users: { where: { id: nicknameId }, take: 1}},
        });
        if(!channel || !channel.users || channel.users.length === 0)
            return false;
        return true;
    }

    async   isUserAdministrator(channelName: string , nicknameId: string): Promise<boolean>
    {
        const isUserAdmin = await this.prisma.channel.count({
            where: {
                name: channelName,
                admins: {
                    some: { id: nicknameId }
                },
            },
        });
        if (!isUserAdmin)
            return false;
        return true;
    }

    async   isChannelExist(name: string): Promise<boolean>
    {
        const channel = await this.prisma.channel.findUnique({
            where: { name },
        });
        if (!channel)
            return false;
        return true;
    }

    async   isUserInBlacklist(channelName: string, nicknameId: string): Promise<boolean>
    {
        const isUserInBlacklist = await this.prisma.blacklist.count({
            where: {
                channelName,
                nickname: nicknameId,
            },
        });
        if(!isUserInBlacklist)
           return false;
        return true;
    }

    async   getChannelOwner(channelName: string): Promise<string | null>
    {
        const channel = await this.findChannelByName(channelName);
        return channel?.owner || null;
    }

    async   getChannelIdByName(channelName: string):Promise<string | null>
    {
        console.log('get channel id: ', channelName);
        // console.log('channel name 01: ', newName);
        const channel = await this.findChannelByName(channelName);
        return channel?.id || null;
    }

    async   getChannelType(channelName: string):Promise<string | null>
    {
        const channel = await this.findChannelByName(channelName);
        return channel?.type || null;
    }

    async   getChannelPass(channelName: string):Promise<string | null>
    {
        const channel = await this.findChannelByName(channelName);
        return channel?.password || null;
    }

    async   getBlacklist(channelId: string, userId: string):Promise<Blacklist | null>
    {
        const blacklist = await this.prisma.blacklist.findFirst({
            where: {
                nickname: userId,
                channelId,
            },
        });
        return blacklist || null;
    }

    async   getBlacklistId(channelName: string, userId: string):Promise<string>
    {
        const blacklist = await this.getBlacklist(channelName, userId);
        if(!blacklist)
            throw new NotFoundException('blacklist not found.');
        return blacklist.id;
    }

    async   getStatusInBlacklist(channelName: string, userId: string):Promise<string>
    {
        const isUserInBlacklis = await this.isUserInBlacklist(channelName, userId);
        if(!isUserInBlacklis)
            return 'LOLO';
        const id = await this.getBlacklistId(channelName, userId);
        const blacklist = await this.prisma.blacklist.findUnique({
            where: { id },
        });
        return blacklist.status;
    } 

    async   getExpiredAtOfUser(channelId: string, mutedUserId: string)
    {
        const blacklist = await this.getBlacklist(channelId, mutedUserId);
        if(!blacklist)
            return null;
        return blacklist.expiredAt;
    }

    async getMuteBlacklist(): Promise<Blacklist[]>
    {
        return this.prisma.blacklist.findMany({
            where: {
                status: Membership.MUTED,
            },
        });
    }

    async   getUserChannelRole(channelName: string, userId: string)
    {
        const channel = await this.findChannelByName(channelName);
        if (channel.owner === userId) 
            return 'owner'.toUpperCase();
        const isAdmin = await this.isUserAdministrator(channelName, userId);
        if (isAdmin)
            return 'admin'.toUpperCase();
        else
            return 'member'.toUpperCase();
    }

    async   updateStatusInBlacklist(channelId: string, mutedUserId: string)
    {
        const id = await this.getBlacklistId(channelId, mutedUserId);
        await this.prisma.blacklist.delete({
            where: {id},
        });
    }

    @Cron(CronExpression.EVERY_10_SECONDS)
    async MuteExpiration() {
        try {
            for (const channel of this.mutedList) {
                for (const mutedUser of channel.users) {
                    const expiredAt = await this.getExpiredAtOfUser(channel.channelId, mutedUser);
                    if (expiredAt && new Date() >= new Date(expiredAt)) {
                        await this.updateStatusInBlacklist(channel.channelId, mutedUser);
                    }
                }
            }
        }
        catch (error) {
            console.error('Error<processing mute expiration> :', error.message);
        }
    }

    async   pushMutedUsers()
    {
        const array = await this.getMuteBlacklist()
        if (array)
        {
            for (const element of array)
            {
                const channel = this.mutedList.find((c) => c.channelId == element.channelId);
                if (channel)
                    channel.users.push(element.nickname);
                else {
                    const ch: mutedUsers = {channelId: element.channelId, users: [element.nickname]};
                    this.mutedList.push(ch);
                }
            }
        }
    }

    onePic4msgSender(chMessages: &messsagesCH[])
    {
        for (let i = 0 ; i < chMessages.length - 1; i++)
        {
            let currentMsg = chMessages[i];
            let nextMsg = chMessages[i + 1];

            if (currentMsg.sender === nextMsg.sender)
                currentMsg.picture = null;
        }
        return chMessages;
    }

    async   checkRequest(data: any, ownerId: string, senderId: string)
    {
        const checkRequest = await this.prisma.request.findUnique({
            where: {
                channelName: data.channelName,
                typeOfRequest: 'JOINCHANNEL',
                senderId,
                userId: ownerId
            },
        });
        if (checkRequest)
            throw new UnauthorizedException('only one request accepted for channel');
    }

    async   getUserStatusCh(channelName: string, userId: string)
    {
        const channel = await this.prisma.channel.findUnique({
            where: { name: channelName, users: {some : { id: userId }}},
            include: {
                blacklist: {
                    select: {
                        nickname: true,
                        status: true
                    }
                }
            }
        });
        if (!channel)
            throw new NotFoundException(`${channelName} not found`);
        for(const user of channel.blacklist) {
            if (user.nickname === userId)
                return user.status;
        }
        return "ACTIVE"
    }
}