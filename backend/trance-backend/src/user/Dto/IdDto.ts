import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class IdDto {
	@IsNotEmpty()
	@IsString()
	@IsUUID('4', { message: 'Invalid UUID format' })
	userId: string;
}