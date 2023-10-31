import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // Import TypeOrmModule
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { WalletModule } from './wallet/wallet.module';
import { Wallet } from './wallet/wallet.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', // or the appropriate database type
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'qwerty',
      database: 'ejam_wallet',
      entities: [User, Wallet], // Make sure to include your entity classes here
      synchronize: true, // Auto-create database tables (only for development)
    }),
    UserModule,
    WalletModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
