
import { Module } from '@nestjs/common';
import { AdicionalesController } from './adicionales.controller';
import { AdicionalesService } from './adicionales.service';

@Module({
  controllers: [AdicionalesController],
  providers: [AdicionalesService]
})
export class AdicionalesModule {}