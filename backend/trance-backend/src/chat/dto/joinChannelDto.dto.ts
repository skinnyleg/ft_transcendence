import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";


export class joinChannelDto {

    @IsNotEmpty()
    @IsString()
    channelName: string;
    
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    password: string;
}

export class responseJoinChannelDto {

    @IsNotEmpty()
    @IsString()
    channelName: string;

    @IsNotEmpty()
    @IsString()
    user: string;

    @IsNotEmpty()
    @IsBoolean()
    value: boolean;
}