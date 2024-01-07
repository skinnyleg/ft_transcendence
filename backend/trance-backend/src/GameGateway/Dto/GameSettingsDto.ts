import { IsNotEmpty, IsNumber, IsUUID } from "class-validator";

export class GameSettingsDto {
	@IsNotEmpty()
	@IsNumber()
    height: number;
	width: number;
    @IsUUID('4', { message: 'Invalid UUID format' })
	userId: string;
}

export class BotDto{
	@IsNotEmpty()
	@IsNumber()
	width:number;
	height: number;
}