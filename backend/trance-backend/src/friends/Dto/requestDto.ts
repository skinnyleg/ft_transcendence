import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class RequestActionDto {
	@IsNotEmpty()
	@IsString()
	@IsUUID('4', { message: 'Invalid UUID format' })
	userId: string;

	@IsNotEmpty()
	@IsString()
	@IsUUID('4', { message: 'Invalid UUID format' })
	requestId: string;
}
