import 'dotenv/config';

import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';

import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super();
  }

  async onModuleInit() {
    await this.$connect();
    console.log('Conexión con PostgreSQL Neon establecida');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
