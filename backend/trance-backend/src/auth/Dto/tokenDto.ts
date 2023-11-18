import { IsString, IsNotEmpty } from 'class-validator';

export class tokenDto {
	@IsNotEmpty({ message: 'Token should not be empty' })
	@IsString({ message: 'Token should be a string' })
	token: string;
}
