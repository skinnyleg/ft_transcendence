import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DmOutils } from './dm.outils';
import { User, Types, Message, Dm } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

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
               // You can add messages here if needed
            },
          });
        return dm || null;
    }

    async   creatMessageDm(dmId: string, sender: string, content: string): Promise<Message | null>
    {
        if(!dmId) {
            throw new BadRequestException('the dm id is indefined');
        }
        const newMessage = await this.prisma.message.create({
            data: {
                content,
                sender: {connect: { nickname: sender }},
                Dm: { connect: {id: dmId} },
            },
        });
        console.log('newmessage: ', newMessage);
        return newMessage;
    }

    async   getUserDms(user: string): Promise<Dm[] | []>
    {
        const findUser = await this.prisma.user.findUnique({
            where: {nickname: user},
            select: { Dm: true },
        });
        if (!findUser) {
            throw new NotFoundException(`${user} user not fout.`);
        }
       return findUser?.Dm || []; 
    }
}
