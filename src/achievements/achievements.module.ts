import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AchievementsService } from './achievements.service';
import { AchievementsController } from './achievements.controller';
import { Achievement, AchievementSchema } from './schemas/achievement.schema';
import { UsersModule } from '../users/users.module';
import { RewardsModule } from '../rewards/rewards.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Achievement.name, schema: AchievementSchema }
    ]),
    UsersModule,
    RewardsModule
  ],
  controllers: [AchievementsController],
  providers: [AchievementsService],
  exports: [AchievementsService] // Exportar para usar en otros módulos
})
export class AchievementsModule {}