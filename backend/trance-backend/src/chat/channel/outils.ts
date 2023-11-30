import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Channel, User } from '@prisma/client';

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
                        role: true,
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
    async   getChannelOwner(channelName: string): Promise<string | null>
    {
        const channel = await this.findChannelByName(channelName);
        return channel?.owner || null;
    }
    //-------------------------------------------------------------------------------//
    //-------------------------------------------------------------------------------//
    //-------------------------------------------------------------------------------//
    //-------------------------------------------------------------------------------//
    //-------------------------------------------------------------------------------//
}