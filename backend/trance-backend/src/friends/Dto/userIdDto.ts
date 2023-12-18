import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class FriendRequestDto {
	@IsNotEmpty()
	@IsString()
	@IsUUID('4', { message: 'Invalid UUID format' })
	userId: string;
}

export class BlockRequestDto {
	@IsNotEmpty()
	@IsString()
	@IsUUID('4', { message: 'Invalid UUID format' })
	userId: string;
}