import './config';
import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as Sentry from '@sentry/node';
import { version, name } from '../package.json';
import { createNestLogger } from '@novu/application-generic';

import { AppModule } from './app.module';

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    release: `v${version}`,
  });
}

export async function bootstrap(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule, {
    logger: createNestLogger({
      serviceName: name,
      version,
    }),
  });

  app.enableCors({
    origin: '*',
    preflightContinue: false,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  });

  await app.listen(process.env.PORT);

  return app;
}
