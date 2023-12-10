import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";


@Injectable()
export class DmOutils {

    constructor(
        private readonly prisma: PrismaService,
    ){}

    // private userSocket: Socke

    async   getDmIdby2User(id1: string, id2: string):Promise<string>
    {
        const dm = await this.prisma.dm.findFirst({
            where: {
                members: {
                    every: {
                        id: {
                            in: [id1, id2]
                        },
                    },
                },
            },
        });
        return dm.id || null;
    }
}
