import { IsString, IsNotEmpty } from 'class-validator';

export class publicProfileDto {
	@IsNotEmpty({ message: 'Login should not be empty' })
	@IsString({ message: 'Login should be a string' })
	nick: string;
}
