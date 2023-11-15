import { IsString, IsNotEmpty } from 'class-validator';

export class publicProfileDto {
	@IsNotEmpty({ message: 'Nick should not be empty' })
	@IsString({ message: 'Nick should be a string' })
	nick: string;
}
