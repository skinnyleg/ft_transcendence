import { IsString, IsNotEmpty, IsOptional, IsEnum } from "class-validator";

// enum    model {
//     CHANNEL = 'CHANNEL',
//     DM = 'DM',
// }

export class creatMessageCh {

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsNotEmpty()
    @IsString()
    channelId: string;
}

export class sendMessageDm {

    @IsNotEmpty()
    @IsString()
    receiver: string;
    
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    content?: string;
}

export class getMessagesCH {

    // @IsEnum(model)
    @IsNotEmpty()
    @IsString()
    channelName: string;
}