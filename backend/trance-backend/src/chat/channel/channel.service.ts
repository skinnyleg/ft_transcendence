import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { creatChannelDto } from '../dto/creat-channel.dto';
import { Channel, User, Types, Message, Dm } from '@prisma/client';
import { Socket } from 'socket.io';
import { ChannelOutils } from './outils';
import { DateTime } from 'luxon';
import { Cron, CronExpression } from '@nestjs/schedule';
import { error } from 'console';
import { elementAt } from 'rxjs';

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
        if (!user) {
            throw new NotFoundException(`${nickname} user not found.`);
        }
        return user.channels || [];
    }

    async   joinChannel(channelName: string, username: string, password?: string)
    {
        const isChannelExist = await this.outils.isChannelExist(channelName);
        if (!isChannelExist) {
            throw new NotFoundException(`Channel with name ${channelName} not exist`);
        }
        const isUserInChannel =  await this.outils.isUserInChannel(channelName, username);
        if (isUserInChannel) {
            throw new UnauthorizedException(`${username} is already a member of ${channelName}.`);
        }
        const isClean = await this.outils.isUserInBlacklist(channelName, username);
        if(isClean) {
            throw new UnauthorizedException(`${username} is blacklisted in ${channelName}.`);
        }
        // busness logic
        const type = await this.outils.getChannelType(channelName);
        if (type === 'PROTECTED' && (await this.outils.getChannelPass(channelName) !== password)) {
            throw new UnauthorizedException('Password incorrect for this channel.');
        }
        if (type === 'PRIVATE') {
            const owner = await this.outils.getChannelOwner(channelName);
            //send an demande to the owner of channel
            return ['PRIVATE', owner];
        }
        await this.prisma.channel.update({
            where: { name: channelName },
            data: {
                users: {
                    connect: { nickname: username },
                },
            },

        });
        return ['Done'];
    } 

    async   leaveChannel(channelName: string, nickname: string)
    {
        const isMemberInChannel = await this.outils.isUserInChannel(channelName, nickname);
        if(!isMemberInChannel) {
            throw new NotFoundException(`${nickname} not found in ${channelName}.`);
        }
        const isAdministrator = await this.outils.isUserAdministrator(channelName, nickname);
        const isOwner = await this.outils.getChannelOwner(channelName);
        if(isOwner === nickname) {
            throw new BadRequestException('Set a new owner before leaving.');
        }
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
        const isMemberOld = await this.outils.isUserInChannel(channelName, newOwner);
        if (!isMemberOld) {
            throw new NotFoundException(`${oldOwner} not found in ${channelName}.`);
        }
        const isMemberNew = await this.outils.isUserInChannel(channelName, newOwner);
        if (!isMemberNew) {
            throw new NotFoundException(`${newOwner} not found in ${channelName}.`);
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
            throw new NotFoundException(`${client} not found in ${channelName}.`);
        }
        const isUser2kickMember = await this.outils.isUserInChannel(channelName, user2kick);
        if(!isUser2kickMember) {
            throw new NotFoundException(`${user2kick} not found in ${channelName}.`);
        }
        const isClientAdmin = await this.outils.isUserAdministrator(channelName, client);
        if(!isClientAdmin) {
            throw new ForbiddenException('Only admins can kick users.');
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
                throw new ForbiddenException('Only owner can kick admins.')
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
            throw new NotFoundException(`${client} not found in ${channelName}.`);
        }
        const isUser2banMember = await this.outils.isUserInChannel(channelName, user2ban);
        if(!isUser2banMember) {
            throw new NotFoundException(`${user2ban} not found in ${channelName}.`);
        }
        const isClientAdmin = await this.outils.isUserAdministrator(channelName, client);
        if(!isClientAdmin) {
            throw new ForbiddenException('Only admins can ban users.');
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
                throw new ForbiddenException('Only owner can ban admins.')
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
            throw new NotFoundException(`${client} not found in ${channelName}.`);
        }
        const isUser2muteMember = await this.outils.isUserInChannel(channelName, user2mute);
        if(!isUser2muteMember) {
            throw new NotFoundException(`${user2mute} not found in ${channelName}.`);
        }
        const isClientAdmin = await this.outils.isUserAdministrator(channelName, client);
        if(!isClientAdmin) {
            throw new ForbiddenException('Only admins can mute users.');
        }
        const isNotAdmin = await this.outils.isUserAdministrator(channelName, user2mute);
        if(isNotAdmin) {
            if((await this.outils.getChannelOwner(channelName)) !== client) {
                throw new ForbiddenException('Only owner can mute admins.')
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
        try {
            for (const channel of this.channels) {
                for (const mutedUser of channel.users) {
                    // console.log(`the user muted is : ${mutedUser}`);
                    const expiredAt = await this.outils.getExpiredAtOfUser(channel.name, mutedUser);
                    if (expiredAt && new Date() >= new Date(expiredAt)) {
                        await this.outils.updateStatusInBlacklist(channel.name, mutedUser);
                        // console.log(`Mute expired for user ${mutedUser} in channel ${channel.name}`);
                    }
                }
            }
        } catch (error) {
            console.log('Error processing mute expiration:', error);
        }
    }

    async   changeChannelType(channelName: string, owner: string, newType: Types, password?: string)
    {
        const channel2update = await this.outils.findChannelByName(channelName);
        if (channel2update.type === newType) {
            throw new BadRequestException('the chanel is already with this type.');
        }
        if (newType !== 'PROTECTED') {
            password = null;
        }
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
        if (!channel2update) {
            throw new NotFoundException(`${channelName} not found.`);
        }
        const channelOwner = await this.outils.getChannelOwner(channelName);
        if (channelOwner !== owner) {
            throw new UnauthorizedException('You are not allowed to make changes in this channel.');
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

    async   changeChannelPass(channelName: string, owner: string, newPassword: string)
    {
        const channel2update = await this.outils.findChannelByName(channelName);
        if (!channel2update) {
            throw new NotFoundException(`${channelName} not found.`);
        }
        const channelOwner = await this.outils.getChannelOwner(channelName);
        if (channelOwner !== owner) {
            throw new UnauthorizedException('You are not allowed to make changes in this channel.');
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
            throw new BadRequestException('Change password only allowed in PROTECTED channels.');
        }
    }

    async   changeChannelPicture(channelName: string, newPicture: string, owner: string)
    {
        const channel2update = await this.outils.findChannelByName(channelName);
        if (!channel2update) {
            throw new NotFoundException(`${channelName} not found.`);
        }
        const channelOwner = await this.outils.getChannelOwner(channelName);
        if (channelOwner !== owner) {
            throw new UnauthorizedException('You are not allowed to make changes in this channel.');
        }
        await this.prisma.channel.update({
            where: { name: channelName},
            data: { picture: newPicture },
        });
    }

    async   getChannelUsers(channelName: string): Promise<User[]>
    {
        const channel = await this.prisma.channel.findUnique({
            where: { name: channelName },
            include: { users: true },
        });
        if (!channel) {
            throw new NotFoundException(`${channelName} not found.`);
        }
        const users: User[] = channel?.users || [];
        return users;
    }

    async   searchChannels(channelName: string)
    {
        const channels = await this.prisma.channel.findMany({
            where: {
                name: {
                    contains: channelName,
                },
            },
            include: {
                messages: {
                    select: {
                        content: true,
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                    take: 1,
                },
            },
        });
        if (!channels) {
            return [];
        }
        return channels;
    }
}
