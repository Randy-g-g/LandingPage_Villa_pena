
import { Module } from '@nestjs/common';
import { AdicionalesController } from './adicionales.controller';
import { AdicionalesService } from './adicionales.service';
import { AuthModule } from '../auth/auth.module';

@Module({
   imports: [AuthModule],
  controllers: [AdicionalesController],
  providers: [AdicionalesService]
})
export class AdicionalesModule {}