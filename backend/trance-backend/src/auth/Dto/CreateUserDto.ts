import { IsString, IsNotEmpty, MinLength, Matches } from 'class-validator';

export class CreateUserDto {
	@IsNotEmpty({ message: 'Username should not be empty' })
	@IsString({ message: 'Username should be a string' })
	username: string;

	@IsNotEmpty({ message: 'Password should not be empty' })
	@IsString({ message: 'Password should be a string' })
	@MinLength(8, { message: 'Password must be at least 8 characters long' })
	@Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#-])[A-Za-z\d@$!%*?&#-]+$/, {
	  message: 'Password should contain at least one uppercase letter, one lowercase letter, one number, and one special character',
	})
	password: string;
}
