import { IsNotEmpty, IsString } from "class-validator";

export class ThemeDto{
	@IsNotEmpty()
	@IsString()
	theme: string;
}

export class PowerUpDto{
	@IsString()
	powerUp: string;
}

export class GameCustomizationDto{
	@IsNotEmpty()
	@IsString()
	theme: string;
	@IsNotEmpty()
	@IsString()
	powerUp: string;
}
