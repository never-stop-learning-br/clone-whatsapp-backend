import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { GatewayModule } from '@/gateway';
import { ModulesModule } from '@/modules';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      cache: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      connectionName: 'main',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const uri = configService.getOrThrow('DB_URI');

        return {
          uri,
        };
      },
    }),
    GatewayModule,
    ModulesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
