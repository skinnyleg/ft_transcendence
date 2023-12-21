import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Blacklist, Channel, Membership, User, Dm } from '@prisma/client';
import { Cron, CronExpression } from "@nestjs/schedule";
import { DmOutils } from "../dm/dm.outils";
import { ChannelService } from "./channel.service";
import { Server } from "socket.io";

export interface channelsSide {
    channelName?: string,
    channelPicture?: string,
    userRole?: string,
    lastMsg?: string,
    channelType?: string
}

export interface channelSidebar {
    username?: string,
    channelRole?: string,
    userPicture?: string
}

export interface mutedUsers {
    name: string;
    users: string[];
}

export interface messsagesCH {
    id?: string,
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
        
        if(!channel) {
            throw new  NotFoundException(`${name} channel not found.`);
        }
        return channel;
    }

    async   isUserInChannel(channelName: string, nickname: string): Promise<boolean>
    {
        const channel = await this.prisma.channel.findUnique({
            where: { name: channelName },
            select: { users: { where: { nickname }, take: 1}},
        });
        if(!channel || !channel.users || channel.users.length === 0) {
            return false;
        }
        return true;
    }

    async   isUserAdministrator(channelName: string , nickname: string): Promise<boolean>
    {
        const isUserAdmin = await this.prisma.channel.count({
            where: {
                name: channelName,
                admins: {
                    some: {
                        nickname,
                    },
                },
            },
        });
        if (!isUserAdmin) {
            return false;
        }
        return true;
    }

    async   isChannelExist(name: string): Promise<boolean>
    {
        const channel = await this.prisma.channel.findUnique({
            where: { name },
        });
        if (!channel) {
            return false;
        }
        return true;
    }

    async   isUserInBlacklist(channelName: string, nickname: string): Promise<boolean>
    {
        const isUserInBlacklist = await this.prisma.blacklist.count({
            where: {
                channelName,
                nickname,
            },
        });
        if(!isUserInBlacklist) {
           return false;
        }
        return true;
    }

    async   getChannelOwner(channelName: string): Promise<string | null>
    {
        const channel = await this.findChannelByName(channelName);
        return channel?.owner || null;
    }

    async   getChannelIdByName(channelName: string):Promise<string | null>
    {
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

    async   getBlacklist(channelName: string, user: string):Promise<Blacklist | null>
    {
        const blacklist = await this.prisma.blacklist.findFirst({
            where: {
                nickname: user,
                channelName,
            },
        });
        return blacklist || null;
    }

    async   getBlacklistId(channelName: string, user: string):Promise<string>
    {
        const blacklist = await this.getBlacklist(channelName, user);
        if(!blacklist) {
            throw new NotFoundException('blacklist not found.');
        }
        return blacklist.id;
    }

    async   getStatusInBlacklist(channelName: string, user: string):Promise<string>
    {
        const isUserInBlacklis = await this.isUserInBlacklist(channelName, user);
        if(!isUserInBlacklis) {
            throw new NotFoundException('The user is not found in blacklist for this channel.');
        }
        const id = await this.getBlacklistId(channelName, user);
        const blacklist = await this.prisma.blacklist.findUnique({
            where: { id },
        });
        return blacklist.status;
    } 

    async   getExpiredAtOfUser(channelName: string, mutedUser: string)
    {
        const blacklist = await this.getBlacklist(channelName, mutedUser);
        if(!blacklist) {
            return null;
        }
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

    async   getUserChannelRole(channelName: string, user: string)
    {
        const channel = await this.findChannelByName(channelName);
        if (channel.owner === user) {
            return 'owner'.toUpperCase();
        }
        const isAdmin = await this.isUserAdministrator(channelName, user);
        if (isAdmin) {
            return 'admin'.toUpperCase();
        }
        else {
            return 'member'.toUpperCase();
        }
    }

    async   updateStatusInBlacklist(channelName: string, mutedUser: string)
    {
        const id = await this.getBlacklistId(channelName, mutedUser);
        await this.prisma.blacklist.delete({
            where: {id},
        });
    }

    @Cron(CronExpression.EVERY_10_SECONDS)
    async MuteExpiration() {
        try {
            for (const channel of this.mutedList) {
                for (const mutedUser of channel.users) {
                    const expiredAt = await this.getExpiredAtOfUser(channel.name, mutedUser);
                    if (expiredAt && new Date() >= new Date(expiredAt)) {
                        await this.updateStatusInBlacklist(channel.name, mutedUser);
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
                const channel = this.mutedList.find((c) => c.name == element.channelName);
                if (channel) {
                    channel.users.push(element.nickname);
                }
                else {
                    const ch: mutedUsers = {name: element.channelName, users: [element.nickname]};
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
        if (checkRequest) {
            throw new UnauthorizedException('Only one request accepted for channel.');
        }
    }
}