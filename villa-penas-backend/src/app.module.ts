import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaquetesModule } from './Paquetes/paquetes.module';
import { AdicionalesModule } from './adicionales/adicionales.module';
import { GaleriaModule } from './galeria/galeria.module';
import { ResenasModule } from './Resenas/resenas.module';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    PaquetesModule,
    AdicionalesModule,
    GaleriaModule,
    ResenasModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}