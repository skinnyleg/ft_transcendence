import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Channel, User, Types, Message, Dm } from '@prisma/client';
import { ValidationError, validate } from "class-validator";

export interface dmsSide {
	name?: string,
	lastMsg?: string,
	picture?: string
}

@Injectable()
export class DmOutils {
  
	constructor(
		private readonly prisma: PrismaService,
		){}

	async	getDmIdby2User(user1Id: string, user2Id: string):Promise<string | null>
    {
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
    
  	async	validateDtoData(data: any, dtoClass: any)
	{
		const ObjectDto = new dtoClass();
		Object.assign(ObjectDto, data);
		const ValidationError: ValidationError[] = await validate(ObjectDto);
		if (ValidationError.length > 0) {
			console.error('ValidationErrors: ', ValidationError);
			throw new BadRequestException('Invalide data');
		}
	}

	async   getUserIdByName(nickname: string): Promise<string | null>
    {
        const user = await this.prisma.user.findUnique({
            where : {
                nickname,
            },
        });
        if (!user) {
            throw new NotFoundException('user not found.');
        }
        return user.id || null;
    }

	async	getBlockedUsers(username: string)
	{
		const userId = await this.getUserIdByName(username);
		const  userBlockedBy = await this.prisma.user.findUnique({
			where: {
				id: userId,
			},
			select: {
				BlockedBy: true,
				usersBlocked: true
			},
		});
		if (!userBlockedBy) {
			throw new NotFoundException('user not found.');
		}
		return userBlockedBy;
	}

	async	isInBlockedList(username: string, blockedList: string[])
	{
		for(const user of blockedList) {
			if (user === username) {
				return true;
			}
		}
		return false;
	}

	async	updateDmupdatedAt(dmId: string, updatedAt: Date)
	{
		await this.prisma.dm.update({
			where: {id: dmId},
			data: {
				updatedAt
			},
		});
	}
}
