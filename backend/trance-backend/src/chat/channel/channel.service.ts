import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { creatChannelDto } from '../dto/creat-channel.dto';
import { Channel, User } from '@prisma/client';
import { Socket } from 'socket.io';
import { ChannelOutils } from './outils';
import { DateTime } from 'luxon';

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
    //-----------------------------------------------------------------------------------
    async   changeOwnerOfChannel(channelName: string, oldOwner: string, newOwner: string)
    {
        const isMemberOld = await this.outils.isUserInChannel(channelName, newOwner);
        const isMemberNew = await this.outils.isUserInChannel(channelName, newOwner);
        if (!isMemberOld || !isMemberNew) {
            throw new NotFoundException('Resource not found: old owner or new owner is not a user in channels.');
        }
        await   this.prisma.channel.update({
            where: { name: channelName },
            data: {
                owner: newOwner,
                admins: { disconnect: [{ nickname: oldOwner}] },
            },
        });
    }

    async   kickUser(channelName: string, client: string, user2kick: string)
    {
        const isCientMember = await this.outils.isUserInChannel(channelName, client);
        if(!isCientMember) {
            throw new NotFoundException('The channel or the user is not found.');
        }
        const isUser2kickMember = await this.outils.isUserInChannel(channelName, user2kick);
        if(!isUser2kickMember) {
            throw new NotFoundException('The user to kick is not found.');
        }
        const isClientAdmin = await this.outils.isUserAdministrator(channelName, client);
        if(!isClientAdmin) {
            throw new ForbiddenException('You are not authorized to perform this action. Only admins can do this.');
        }
        if((await this.outils.getChannelOwner(channelName)) === client)
        {
            const isAdmin = await this.outils.isUserAdministrator(channelName, user2kick);
            if(isAdmin) {
                await this.prisma.channel.update({
                    where: {name: channelName},
                    data: {
                        admins: {disconnect: {nickname: user2kick}},
                    },
                });
            }
        }
        else
        {
            const isNotAdmin = await this.outils.isUserAdministrator(channelName, user2kick);
            if(isNotAdmin) {
                throw new ForbiddenException('You are not authorized to kick admin, only owner can do this.')
            }
        }
        await this.prisma.channel.update({
            where: {name: channelName},
            data: {
                users: {disconnect: {nickname: client}},
            },
        });
    }
    
    async   banUser(channelName: string, client: string, user2ban: string)
    {
        //check user to ban if it is baned
        const isCientMember = await this.outils.isUserInChannel(channelName, client);
        if(!isCientMember) {
            throw new NotFoundException('The channel or the user is not found.');
        }
        const isUser2banMember = await this.outils.isUserInChannel(channelName, user2ban);
        if(!isUser2banMember) {
            throw new NotFoundException('The user to ban is not found.');
        }
        const isClientAdmin = await this.outils.isUserAdministrator(channelName, client);
        if(!isClientAdmin) {
            throw new ForbiddenException('You are not authorized to perform this action. Only admins can do this.');
        }
        if((await this.outils.getChannelOwner(channelName)) === client)
        {
            const isAdmin = await this.outils.isUserAdministrator(channelName, user2ban);
            if(isAdmin) {
                await this.prisma.channel.update({
                    where: {name: channelName},
                    data: {
                        admins: {disconnect: {nickname: user2ban}},
                    },
                });
            }
        }
        else
        {
            const isNotAdmin = await this.outils.isUserAdministrator(channelName, user2ban);
            if(isNotAdmin) {
                throw new ForbiddenException('You are not authorized to ban admin, only owner can do this.')
            }
        }
        await this.prisma.channel.update({
            where: {name: channelName},
            data: {
                users: {disconnect: {nickname: client}},
            },
        });
        await this.prisma.blacklist.create({
            data: {
                nickname: user2ban,
                status: 'BAN',
                channel: {connect: {name: channelName}},
            },
        });
    }
        
    async   muteUser(channelName: string, client: string, user2mute: string, expirationTime: number)
    {
        //check user to ban if it is baned
        const isCientMember = await this.outils.isUserInChannel(channelName, client);
        if(!isCientMember) {
            throw new NotFoundException('The channel or the user is not found.');
        }
        const isUser2muteMember = await this.outils.isUserInChannel(channelName, user2mute);
        if(!isUser2muteMember) {
            throw new NotFoundException('The user to mute is not found.');
        }
        const isClientAdmin = await this.outils.isUserAdministrator(channelName, client);
        if(!isClientAdmin) {
            throw new ForbiddenException('You are not authorized to perform this action. Only admins can do this.');
        }
        const isNotAdmin = await this.outils.isUserAdministrator(channelName, user2mute);
        if(isNotAdmin) {
            if((await this.outils.getChannelOwner(channelName)) !== client) {
                throw new ForbiddenException('You are not authorized to mute admin, only owner can do this.')
            }
        }
        expirationTime *= 60;
        const expiredAt = DateTime.now().plus({ seconds: expirationTime }).toJSDate();
        await this.prisma.blacklist.create({
            data: {
                nickname: user2mute,
                status: 'MUTED',
                expiredAt,
                channel: {connect: {name: channelName}},
            },
        });
    }
}
