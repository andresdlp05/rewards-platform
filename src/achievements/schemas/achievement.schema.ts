import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Reward } from '../../rewards/schemas/reward.schema';

export type AchievementDocument = Achievement & Document;

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
export class Achievement {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, min: 0 })
  requirement: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Reward' })
  rewardId: Reward | string;
}

export const AchievementSchema = SchemaFactory.createForClass(Achievement);

// Crear índices para búsquedas eficientes
AchievementSchema.index({ name: 1 });
AchievementSchema.index({ requirement: 1 });