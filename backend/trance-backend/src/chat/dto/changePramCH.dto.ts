import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

enum Types {
    PUBLIC = 'PUBLIC',
    PROTECTED = 'PROTECTED',
    PRIVATE = 'PRIVATE'
}

export class changePassDto {

    @IsNotEmpty()
    @IsString()
    channelName: string;

    @IsString()
    @IsNotEmpty()
    newPassword: string;
}

export class changeNameDto {
    
    @IsString()
    @IsNotEmpty()
    channelName: string;

    @IsString()
    @IsNotEmpty()
    newName: string;
}

export class changeTypeDto {

    @IsString()
    @IsNotEmpty()
    channelName: string;

    @IsEnum(Types)
    newType: Types;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    password: string;
}

export class changepicDto {

    @IsString()
    @IsNotEmpty()
    channelName: string;

    @IsString()
    @IsNotEmpty()
    newPicture: string;
}

export class changeAdminsDto {

    @IsNotEmpty()
    @IsString()
    channelName: string;
    
    @IsNotEmpty()
    @IsString()
    newAdminId: string;
}

export class stringDto {
    
    @IsString()
    @IsNotEmpty()
    channelName: string;
}