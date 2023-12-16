import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Blacklist, Channel, Membership, User, Dm } from '@prisma/client';
import { ChannelService } from './channel.service';

@Injectable()
export class ChannelOutils {

    constructor(
        private readonly prisma: PrismaService,
    ){}

    //-------------------------------------------------------------------------------//
    async   findChannelByName(name: string): Promise< Channel | null>
    {
        const channel =  await this.prisma.channel.findUnique({
            where: { name },
            include: {
                users: {
                    select: {
                        id: true,
                        intraId: true,
                        login: true,
                        profilePic: true,
                        nickname: true,
                        status: true,
                    },
                },
                admins: {
                    select : {
                        id: true,
                        intraId: true,
                        login: true,
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
            throw new  NotFoundException(`Channel with name ${name} not found.`);
        }
        return channel;
    }
    //-------------------------------------------------------------------------------//
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
    //-------------------------------------------------------------------------------//
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
    //-------------------------------------------------------------------------------//
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
    //-------------------------------------------------------------------------------//
    async   getChannelOwner(channelName: string): Promise<string | null>
    {
        const channel = await this.findChannelByName(channelName);
        return channel?.owner || null;
    }
    //-------------------------------------------------------------------------------//
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
    //-------------------------------------------------------------------------------//
    async   getChannelIdByName(channelName: string):Promise<string | null>
    {
        const channel = await this.findChannelByName(channelName);
        return channel?.id || null;
    }
    //-------------------------------------------------------------------------------//
    async   getChannelType(channelName: string):Promise<string | null>
    {
        const channel = await this.findChannelByName(channelName);
        return channel?.type || null;
    }
    //-------------------------------------------------------------------------------//
    async   getChannelPass(channelName: string):Promise<string | null>
    {
        const channel = await this.findChannelByName(channelName);
        return channel?.password || null;
    }
    //-------------------------------------------------------------------------------//
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
    //-------------------------------------------------------------------------------//
    async   getBlacklistId(channelName: string, user: string):Promise<string>
    {
        const blacklist = await this.getBlacklist(channelName, user);
        if(!blacklist) {
            throw new NotFoundException('blacklist not found.');
        }
        return blacklist.id;
    }
    //-------------------------------------------------------------------------------//
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
    //-------------------------------------------------------------------------------//
    async   getExpiredAtOfUser(channelName: string, mutedUser: string)
    {
        const blacklist = await this.getBlacklist(channelName, mutedUser);
        if(!blacklist) {
            // throw new NotFoundException(`The ${mutedUser} is not found in getExpiredAtOfUser.`);
            return null;
        }
        return blacklist.expiredAt;
    }
    //-------------------------------------------------------------------------------//
    async getMuteBlacklist(): Promise<Blacklist[]>
    {
        return this.prisma.blacklist.findMany({
            where: {
                status: Membership.MUTED,
            },
        });
    }
    //-------------------------------------------------------------------------------//
    async   getUserIdByName(nickname: string): Promise<string | null>
    {
        const user= await this.prisma.user.findUnique({
            where : {
                nickname,
            },
        });
        console.log('user id: ', user.id);
        return user.id || null;
    }
    //-------------------------------------------------------------------------------//
    // async   getAllChannels(): Promise<Channel[]>
    // {
    //     return this.prisma.channel.findMany();
    // }
    //-------------------------------------------------------------------------------//
    async   updateStatusInBlacklist(channelName: string, mutedUser: string)
    {
        const id = await this.getBlacklistId(channelName, mutedUser);
        await this.prisma.blacklist.delete({
            where: {id},
        });
    }
    //-------------------------------------------------------------------------------//
    //-------------------------------------------------------------------------------//
    //-------------------------------------------------------------------------------//
}