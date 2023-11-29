import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { creatChannelDto } from '../dto/creat-channel.dto';
import { Channel, User } from '@prisma/client';
import { Socket } from 'socket.io';

@Injectable()
export class ChannelService {

    constructor(
        private readonly prisma: PrismaService
    ){}

    async creatChannel(creteChannelDto: creatChannelDto)
    {
        // console.log(`owner is ${cretechanneldto.owner}`);
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
}
