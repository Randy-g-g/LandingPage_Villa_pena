import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaquetesModule } from './Paquetes/paquetes.module';
import { GaleriaModule } from './galeria/galeria.module';
export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [PaquetesModule, GaleriaModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}