import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Channel, User, Types, Message, Dm } from '@prisma/client';
import { ValidationError, validate } from "class-validator";


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
}
