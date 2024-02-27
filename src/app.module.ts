import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { GatewayModule } from '@/gateway';
import { ModulesModule } from '@/modules';
import { CONNECTION_NAME_MAIN } from '@/shared/constants/database';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      cache: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      connectionName: CONNECTION_NAME_MAIN,
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
