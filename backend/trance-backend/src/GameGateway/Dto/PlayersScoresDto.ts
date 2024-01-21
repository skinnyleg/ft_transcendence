import { Type } from "class-transformer";
import { IsNotEmpty, IsNotEmptyObject, IsNumber, IsNumberString, IsObject, IsString, ValidateNested } from "class-validator";

class PlayerScore {
    @IsNumber()
    score: number;
}
  
  export class PlayersScoresDto {
  
    @IsObject()
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => PlayerScore)
    playerL: PlayerScore;
    
    @IsObject()
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => PlayerScore)
    playerR: PlayerScore;
  }