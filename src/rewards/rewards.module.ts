import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RewardsService } from './rewards.service';
import { RewardsController } from './rewards.controller';
import { Reward, RewardSchema } from './schemas/reward.schema';
import { UsersModule } from '../users/users.module';
import { RewardHistoryModule } from '../reward-history/reward-history.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reward.name, schema: RewardSchema }
    ]),
    UsersModule,
    RewardHistoryModule
  ],
  controllers: [RewardsController],
  providers: [RewardsService],
  exports: [RewardsService] // Exportar para usar en otros módulos
})
export class RewardsModule {}