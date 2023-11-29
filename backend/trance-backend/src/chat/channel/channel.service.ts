import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { creatChannelDto } from '../dto/creat-channel.dto';
import { Channel, User } from '@prisma/client';

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
}
