import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Channel, User, Types, Message, Dm } from '@prisma/client';


@Injectable()
export class DmOutils {

    constructor(
        private readonly prisma: PrismaService,
    ){}

    // private userSocket: Socke

    async   getDmIdby2User(user1Id: string, user2Id: string):Promise<string | null>
    {
        // console.log('into id dm');
        // console.log(id1, id2);
        // const sortedUserIds = [id1, id2].sort();
        // const dm = await this.prisma.dm.findFirst({
        //     where: {
        //         AND: [
        //             {members: {some: {id: sortedUserIds[0]}}},
        //             {members: {some: {id: sortedUserIds[1]}}},
        //         ],
        //     },
        // });
        // if(!dm) {
        //     return null;
        // }
        // console.log('id dm: ', dm.id);
        // return dm.id;
        const dm: Dm | null = await this.prisma.dm.findFirst({
            where: {
              members: {
                every: {
                  id: {
                    in: [user1Id, user2Id],
                  },
                },
              },
            },
          });
      
          return dm ? dm.id : null;
    }
}
