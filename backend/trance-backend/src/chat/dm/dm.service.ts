import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DmOutils } from './dm.outils';
import { User, Types, Message, Dm } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { Socket } from 'socket.io';

@Injectable()
export class DmService {

    constructor(
        private readonly prisma: PrismaService,
        private dmOutils: DmOutils,
    ){};

    async   creatDMchat(user1: string, user2: string): Promise<Dm>
    {
        const dm = await this.prisma.dm.create({
            data: {
              members: {
                connect: [
                  { id: user1 },
                  { id: user2 }
                ],
              },
            },
          });
        if (!dm) {
            throw new InternalServerErrorException('Dm creation failed.');
        }
        return dm || null;
    }

    async   creatMessageDm(dmId: string, senderId: string, content: string): Promise<Message | null>
    {
        if(!dmId) {
            throw new BadRequestException('the dm id is indefined');
        }
        const newMessage = await this.prisma.message.create({
            data: {
                content,
                sender: {connect: { id: senderId }},
                Dm: { connect: {id: dmId} },
            },
        });
        console.log('newmessage: ', newMessage);
        return newMessage;
    }

    async   getUserDms(userId: string)
    {
        const findUser = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                Dm: {
                    include: { 
                        members: {
                            select: {
                                id: true,
                                nickname: true,
                                status: true,
                                profilePic: true,
                            },
                        },
                        messages: {
                            select: {
                                content: true,
                                sender: {
                                    select: {
                                        id: true,
                                        nickname: true
                                    },
                                },
                                createdAt: true,
                                dmId: true
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
        if (!findUser) {
            throw new NotFoundException(`user not fout.`);
        }
       return findUser?.Dm || []; 
    }

    async   getDmMessages(dmId: string)
    {
        const allMessages = await this.prisma.dm.findUnique({
            where: {
                id: dmId,
            },
            include: {
                members: {
                    select: {
                        nickname: true,
                        profilePic: true,
                    },
                },
                messages: {
                    select: {
                        id: true,
                        content: true,
                        createdAt: true,
                        sender: {
                            select: {
                                id: true,
                                nickname: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'asc',
                    },
                },
            },
        });
        if (!allMessages) {
            throw new NotFoundException('DM not found.');
        }
        return allMessages;
    }

    async   generateDm(receiverId: string , senderId: string, receiverSocket: any)
    {
        // const receiverId = await this.dmOutils.getUserIdByName(receiver);
        let dmId = await this.dmOutils.getDmIdby2User(senderId, receiverId);
        if (dmId === null) {
        	await this.creatDMchat(senderId, receiverId);
        	dmId = await this.dmOutils.getDmIdby2User(senderId, receiverId);
            if (receiverSocket)
                receiverSocket.socket.emit('refreshDms');
        }
        return {dmId, receiverId} || {};
    }

    async   getDmbyId(dmId: string)
    {
        const dm = await this.prisma.dm.findUnique({
            where: { id: dmId },
            include: {
                members: true,
            },
        });
        if (!dm)
            throw new NotFoundException('Dm not found');
        return dm;
    }
}
