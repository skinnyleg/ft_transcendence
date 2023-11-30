import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { creatChannelDto } from '../dto/creat-channel.dto';
import { Channel, User } from '@prisma/client';
import { Socket } from 'socket.io';
import { ChannelOutils } from './outils';

@Injectable()
export class ChannelService {

    constructor(
        private readonly prisma: PrismaService,
        private  outils: ChannelOutils,
    ){}

    async creatChannel(creteChannelDto: creatChannelDto)
    {
        const {name, type, owner, password} = creteChannelDto;
        const newChannel = await this.prisma.channel.create({
            data: {
                name,
                type,
                owner,
                password,
                users: { connect: [{ nickname: owner }] },
                admins: { connect: [{ nickname: owner }] },
            },
        });
        return newChannel;
    }
    
    async   getUserChannels(nickname: string, client: Socket)
    {
        if (nickname !== client.data.user.nickname) {
            throw new UnauthorizedException('Unauthorized access: you try to get channels of another user.');
        }
        const updatedChannels = await this.prisma.user.findUnique({
            where: { nickname },
            select: {
                channels: {
                    orderBy: {
                        updatedAt: 'desc',
                    },
                },
            },
        });
        if (!updatedChannels) {
            throw new NotFoundException('Resource not found: in get user channels.');
        }
        return updatedChannels;
    }

    async   leaveChannel(channelName: string, nickname: string)
    {
        const isMemberInChannel = await this.outils.isUserInChannel(channelName, nickname);
        if(!isMemberInChannel) {
            throw new NotFoundException('Resource not found: the user is not a member of channel.');
        }
        const isAdministrator = await this.outils.isUserAdministrator(channelName, nickname);
        if(isAdministrator) {
            const isOwner = await this.outils.getChannelOwner(channelName);
            if(isOwner === nickname) {
                throw new BadRequestException('Cannot leave as the owner. Set a new owner before leaving.');
            }
            else {
                await this.prisma.channel.update({
                    where: { name: channelName },
                    data: {
                        admins: {
                            disconnect: [{ nickname:  nickname}],
                        },
                    },
                });
                console.log('remove from admins');
            }
        }
        await this.prisma.channel.update({
            where: { name: channelName },
            data: {
                users: {
                    disconnect: [{ nickname }],
                },
            },
        });
    }
    //---
}
