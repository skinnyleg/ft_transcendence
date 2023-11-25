import { IsNotEmpty, IsBoolean} from 'class-validator';

export class Enable2FADto {
  @IsBoolean({ message: 'Enabled should be a boolean' })
  @IsNotEmpty({ message: 'Enabled should not be empty' })
  Enabled: boolean;
}
