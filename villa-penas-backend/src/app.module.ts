import { PrismaModule } from './prisma/prisma.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { createObserveModule } from '@nestjs/observe';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaquetesModule } from './Paquetes/paquetes.module';
import { AdicionalesModule } from './adicionales/adicionales.module';
import { GaleriaModule } from './galeria/galeria.module';
import { ResenasModule } from './Resenas/resenas.module';
import { ReservasModule } from './reservas/reservas.module';
import { AuthModule } from './auth/auth.module';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    PrismaModule,
    PaquetesModule,
    AdicionalesModule,
    GaleriaModule,
    ResenasModule,
    ReservasModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}