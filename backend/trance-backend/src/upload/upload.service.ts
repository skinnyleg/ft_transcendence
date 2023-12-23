import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UploadService {
	

	constructor(private prisma: PrismaService){}

	async updateProfilePic(pic: string, id: string)
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


	async updateChannelPic(pic: string, channelName: string)
	{
		const channel = await this.prisma.channel.findUnique({
			where: {
				name: channelName,
			}
		})
		if (!channel)
			throw new NotFoundException('resource not found')

		await this.prisma.channel.update({
			where: { name: channelName},
			data: { picture: pic },
		});
	}

	async updateBackgroundPic(pic: string, id: string)
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
