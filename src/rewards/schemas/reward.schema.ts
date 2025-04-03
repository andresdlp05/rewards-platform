import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RewardDocument = Reward & Document;

@Schema({
  timestamps: { createdAt: true, updatedAt: false },
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
})
export class Reward {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, min: 0 })
  pointsRequired: number;

  @Prop({ required: true, min: 0 })
  stock: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  createdAt: Date;
}

export const RewardSchema = SchemaFactory.createForClass(Reward);

// Crear índices para búsquedas eficientes
RewardSchema.index({ title: 1 });
RewardSchema.index({ pointsRequired: 1 });
RewardSchema.index({ isActive: 1 });