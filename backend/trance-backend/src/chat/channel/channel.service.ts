import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { creatChannelDto } from '../dto/creat-channel.dto';
import { Channel, User, Types, Message, Dm } from '@prisma/client';
import { Socket } from 'socket.io';
import { ChannelOutils } from './outils';
import { DateTime } from 'luxon';
import { Cron, CronExpression } from '@nestjs/schedule';
import { error } from 'console';

interface mutedUsers {
    name: string;
    users: string[];
}

@Injectable()
export class ChannelService {
    
    constructor(
        private readonly prisma: PrismaService,
        private  outils: ChannelOutils,
        ){}
        
    private channels: mutedUsers[] = [];

    async   pushMutedUsers()
    {
        const array = await this.outils.getMuteBlacklist()
        if (array)
        {
            for (const entry of array)
            {
                const channel = this.channels.find((c) => c.name == entry.channelName);
                if (channel)
                {
                    channel.users.push(entry.nickname);
                }
                else {
                    const ch: mutedUsers = {name: entry.channelName, users: [entry.nickname]};
                    this.channels.push(ch);
                }
            }
        }
    }

    async creatChannel(creteChannelDto: creatChannelDto, owner: string): Promise<Channel>
    {
        // befor creat chnnel check if the name exist befor
        const {name, type, password} = creteChannelDto;
        const type_: Types = type as Types;
        // console.log('type: ', type);
        // console.log('password: ', password);
        // console.log('password length: ', password.length);
        if (type === 'PROTECTED' && (!password || password.length === 0)) {
            throw new BadRequestException('A password must be set for protected channel.');
        }
        else if ((type === 'PUBLIC' || type === 'PRIVATE') && password) {
            throw new BadRequestException('Private or public channels don\'t require password.');
        }
        const newChannel = await this.prisma.channel.create({
            data: {
                name,
                type: type_,
                owner,
                password,
                users: { connect: [{ nickname: owner }] },
                admins: { connect: [{ nickname: owner }] },
            },
        });
        const channel_: mutedUsers = {name, users: []};
        this.channels.push(channel_);
        return newChannel;
    }

    async   creatMessageChannel(channelId: string, sender: string, content: string): Promise<Message | null>
    {
        const user = await this.outils.isUserInChannel(channelId, sender);
        if (!user) {
            throw new NotFoundException(`the user ${sender} is not exist in  channel ${channelId}`);
        }
        const id = await this.outils.getChannelIdByName(channelId);
        const newMessage = await this.prisma.message.create({
            data: {
                content,
                sender: {connect: { nickname: sender }},
                channel: {connect: { id, }},
            },
        });
        return newMessage;
    }
    
    // add function to get all messages of channel 
    
    async   getUserChannels(nickname: string): Promise<Channel[]>
    {
        // if (nickname !== client.data.user.nickname) {
        //     throw new UnauthorizedException('Unauthorized access: you try to get channels of another user.');
        // }
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
        return updatedChannels.channels || [];
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
        const channel = this.channels.find((c) => c.name == channelName);
        if (channel) {
            channel.users.push(user2mute);
        }
        else {
            const ch: mutedUsers = {name: channelName, users: [user2mute]};
            this.channels.push(ch);
        }
    }   

    @Cron(CronExpression.EVERY_10_SECONDS)
    async MuteExpiration() {
        // console.log(`the channels muted is : ${this.channels[0]}`);
        try {
            // console.log('enter here');
            for (const channel of this.channels) {
                for (const mutedUser of channel.users) {
                    console.log(`the user muted is : ${mutedUser}`);
                    const expiredAt = await this.outils.getExpiredAtOfUser(channel.name, mutedUser);
                    if (expiredAt && new Date() >= new Date(expiredAt)) {
                        await this.outils.updateStatusInBlacklist(channel.name, mutedUser);
                        console.log(`Mute expired for user ${mutedUser} in channel ${channel.name}`);
                    }
                }
            }
        } catch (error) {
            console.log('Error processing mute expiration:', error);
        }
    }

    //change type of channel
    async   changeTypeOfChannel(channelName: string, owner: string, newType: Types, password?: string)
    {
        const channel2update = await this.outils.findChannelByName(channelName);
        if (!channel2update) {
            console.error('error in changeTypeOfChannel');
            throw new error('error in changeTypeOfChannel');
        }
        if (newType === 'PROTECTED' || newType === 'PUBLIC' || newType === 'PRIVATE')
        {
            if (channel2update.type === newType) {
                console.log('the chanel is already with this type.');
                throw new error('the chanel is already with this type.');
            }
            else if (channel2update.type === 'PROTECTED') {
                await this.prisma.channel.update({
                    where: {
                        name: channelName,
                        owner,
                    },
                    data: {
                        password: null,
                    },
                });
            }
            else if (newType === 'PROTECTED') {
                console.log('in protected state');
                await this.prisma.channel.update({
                    where: {
                        name: channelName,
                        owner,
                    },
                    data: {
                        password,
                    },
                });
            }
            await this.prisma.channel.update({
                where: { 
                    name: channelName,
                    owner,
                },
                data: {
                    type: newType,
                },
            });
        }
        else
        {
            console.error(`the type ${newType} not exist in types of channel`);
            throw new error(`the type ${newType} not exist in types of channel`);
        }
    }

    async   changeNameOfChannel(channelName: string, owner: string, newName: string)
    {
        const channel2update = await this.outils.findChannelByName(channelName);
        if (!channel2update) {
            console.error('error in changeNameOfChannel');
            throw new error('error in changeNameOfChannel');
        }
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

    async   changePassOfChannel(channelName: string, owner: string, newPassword: string)
    {
        const channel2update = await this.outils.findChannelByName(channelName);
        if (!channel2update) {
            console.error('error in changeNameOfChannel');
            throw new error('error in changeNameOfChannel');
        }
        if (channel2update.type === 'PROTECTED') {
            await this.prisma.channel.update({
                where: {
                    name: channelName,
                    owner,
                },
                data: { password: newPassword },
            });
        }
        else {
            console.error('error in changePassOfChannel');
        }
    }

}
