import { IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";

export class GameSettingsDto {
	@IsNotEmpty()
	@IsNumber()
    height: number;
	width: number;
    @IsUUID('4', { message: 'Invalid UUID format' })
	roomId: string;
}

export class BotDto{
	@IsNotEmpty()
	@IsNumber()
	width:number;
	height: number;
}


export class MoveDto{
	@IsNotEmpty()
	@IsString()
	move: string;
}