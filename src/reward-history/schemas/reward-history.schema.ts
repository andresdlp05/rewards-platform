import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
// Eliminamos la importación problemática de User
// import { User } from '../../users/schemas/user.schema';
// import { Reward } from '../../rewards/schemas/reward.schema';

export type RewardHistoryDocument = RewardHistory & Document;

@Schema({
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
})
export class RewardHistory {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId | string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Reward', required: true })
  rewardId: MongooseSchema.Types.ObjectId | string;

  @Prop({ required: true })
  redeemedAt: Date;
}

export const RewardHistorySchema = SchemaFactory.createForClass(RewardHistory);

// Crear índices para búsquedas eficientes
RewardHistorySchema.index({ userId: 1 });
RewardHistorySchema.index({ rewardId: 1 });
RewardHistorySchema.index({ redeemedAt: -1 });