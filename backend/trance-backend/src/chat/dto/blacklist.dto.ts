import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class kickUserDto {
    @IsNotEmpty()
    @IsString()
    channelName: string;

    @IsNotEmpty()
    @IsString()
    user2kick: string;
}

export class banUserDto {

    @IsNotEmpty()
    @IsString()
    channelName: string;

    @IsNotEmpty()
    @IsString()
    user2ban: string;
}

export class muteUserDto {

    @IsNotEmpty()
    @IsString()
    channelName: string;

    @IsNotEmpty()
    @IsString()
    user2mute: string;

    @IsNotEmpty()
    @IsNumber()
    expirationTime: number;
}