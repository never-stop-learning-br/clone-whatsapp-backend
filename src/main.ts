import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configServer = app.get<ConfigService>(ConfigService);
  const serverPort = configServer.getOrThrow('SERVER_PORT');

  const TITLE = 'Project - WhatsApp Clone Backend';
  const DESCRIPTION = 'The main API of "WhatsApp Clone Backend"';
  const API_VERSION = '1.0';

  const config = new DocumentBuilder()
    .setTitle(TITLE)
    .setDescription(DESCRIPTION)
    .setVersion(API_VERSION)
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    ignoreGlobalPrefix: false,
  });

  SwaggerModule.setup('api', app, document, { customSiteTitle: TITLE });

  app.enableCors();
  app.setGlobalPrefix('api');

  await app.listen(serverPort);
}
bootstrap();
