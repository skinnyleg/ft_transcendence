import { IsString, IsNotEmpty, IsOptional, IsEnum } from "class-validator";

enum    messageForme {
    CHANNEL = 'channel',
    DM = 'dm'
}

export class creatMessageCh {

    @IsNotEmpty()
    @IsString()
    @IsEnum(messageForme)
    forme: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsNotEmpty()
    @IsString()
    channelId: string;
}