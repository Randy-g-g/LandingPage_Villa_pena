import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaquetesModule } from './Paquetes/paquetes.module';
export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [PaquetesModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}