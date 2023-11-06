import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UploadService {
	

	constructor(private prisma: PrismaService){}

	async updateProfilePic(pic: string, id: number)
	{
		await this.prisma.user.update({
			where: {
				id: id,
			},
			data: {
				profilePic: pic
			}
		})
	}

	async updateBackgroundPic(pic: string, id: number)
	{
		await this.prisma.user.update({
			where: {
				id: id,
			},
			data: {
				BackgroundPic: pic
			}
		})
	}
}
