import { Module } from '@nestjs/common';
import { PaquetesController } from './paquetes.controller';
import { PaquetesService } from './paquetes.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [PaquetesController],
  providers: [PaquetesService]
})
export class PaquetesModule {}