import { IsEmail, IsNotEmpty, IsOptional, Matches } from 'class-validator';
import { Match } from 'decorators/match.decorator';
import { Role } from 'entities/role.entity';

export class CreateUserDto {
  @IsOptional()
  first_name?: string;

  @IsOptional()
  last_name?: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Matches(/^(?=.*\d)[A-Za-z.\s_-]+[\w~@#$%^&+=`|{}:;!.?"()[\]-]{6,}/, {
    message:
      'Password must have atleast one number, lower or upper case letter and it has to be longer than five characters',
  })
  password: string;

  @IsNotEmpty()
  @Match(CreateUserDto, (field) => field.password, {
    message: 'Passwords do not match',
  })
  confirm_password: string;

  @IsOptional()
  refresh_token?: string;

  @IsOptional()
  password_token?: string;

  @IsOptional()
  role?: Role;
}
