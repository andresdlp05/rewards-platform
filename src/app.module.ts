import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { RewardsModule } from './rewards/rewards.module';
import { AchievementsModule } from './achievements/achievements.module';
import { RewardHistoryModule } from './reward-history/reward-history.module';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    // Cargar configuración de variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    
    // Configurar conexión a MongoDB
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/rewards-platform',
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
    }),
    
    // Importar módulos de la aplicación
    UsersModule,
    RewardsModule,
    AchievementsModule,
    RewardHistoryModule,
  ],
})
export class AppModule {}