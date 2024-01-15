import { IsNotEmpty, IsString } from "class-validator";

export class ThemeDto{
	@IsNotEmpty()
	@IsString()
	theme: string;
    @IsNotEmpty()
	@IsString()
	powerUp: string;
}