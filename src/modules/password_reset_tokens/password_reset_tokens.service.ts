import { Injectable } from '@nestjs/common';
import { CreatePasswordResetTokenDto } from './dto/create-password_reset_token.dto';
import { UpdatePasswordResetTokenDto } from './dto/update-password_reset_token.dto';
import { Password_Reset_Token } from 'entities/password_reset_token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AbstractService } from 'modules/common/abstract.service';
import { User } from 'entities/user.entity';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class PasswordResetTokensService extends AbstractService<Password_Reset_Token> {
  constructor(
    @InjectRepository(Password_Reset_Token)
    private readonly password_token_repository: Repository<Password_Reset_Token>,
  ) {
    super(password_token_repository)
  }

  async createToken(createPasswordResetTokenDto: CreatePasswordResetTokenDto) {
    const newToken = await this.password_token_repository.create({
      ...createPasswordResetTokenDto,
    });
    return this.password_token_repository.save(newToken);
  }

  async findByUser(user:User){
    const tokenUser = await this.password_token_repository.findOne({where : {user: {email: user.email}}})
    return tokenUser
  }

  async findByToken(token:string){
    const password_reset_info = await this.password_token_repository.findOne({where:{token}})
    return password_reset_info
  }

  @Cron('0 00 12 * * 1-5')
  async handleTokenDeletion() {
    return await this.password_token_repository.clear()
  }

  async removeToken(token: string) {
    const password_token = await this.password_token_repository.findOne({where:{token}})
    return this.password_token_repository.remove(password_token);
  }
}
