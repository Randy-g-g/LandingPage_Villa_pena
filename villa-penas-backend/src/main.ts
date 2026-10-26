import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'node:path';

import { AppModule } from './app.module';

async function bootstrap() {

  // Crear aplicación NestJS
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );

  // Validación global de datos
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Permitir acceso a las fotografías guardadas
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  // Permitir comunicación con el frontend
  app.enableCors({
    origin: [
      'http://127.0.0.1:5500',
      'http://localhost:5500',
    ],
     methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  // Iniciar servidor
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();