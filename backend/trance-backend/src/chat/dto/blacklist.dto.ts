import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class kickUserDto {
    @IsNotEmpty()
    @IsString()
    channelName: string;

    @IsNotEmpty()
    @IsString()
    user2kickId: string;
}

export class banUserDto {

    @IsNotEmpty()
    @IsString()
    channelName: string;

    @IsNotEmpty()
    @IsString()
    user2banId: string;
}

export class muteUserDto {

    @IsNotEmpty()
    @IsString()
    channelName: string;

    @IsNotEmpty()
    @IsString()
    user2muteId: string;

    @IsNotEmpty()
    @IsNumber()
    expirationTime: number;
}