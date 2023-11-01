import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // Import TypeOrmModule
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { WalletModule } from './wallet/wallet.module';
import { Wallet } from './wallet/wallet.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: 'postgres://ejam_wallet_user:9xlffWA7cuj1zOdw94b1rGHtur5MqZdH@dpg-cl108dgp2gis73aovn6g-a.oregon-postgres.render.com/ejam_wallet',
      entities: [User, Wallet],
      synchronize: true,
      ssl: true,
    }),
    UserModule,
    WalletModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
