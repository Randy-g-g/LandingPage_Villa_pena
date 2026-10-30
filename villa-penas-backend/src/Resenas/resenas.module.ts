import { Module } from '@nestjs/common';
import { ResenasController } from './resenas.controller';
import { ResenasService } from './resenas.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ResenasController],
  providers: [ResenasService],
})
export class ResenasModule {}