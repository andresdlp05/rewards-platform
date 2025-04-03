import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RewardHistoryService } from './reward-history.service';
// Eliminamos la importación problemática por ahora
// import { RewardHistoryController } from './reward-history.controller';
import { Schema } from 'mongoose';

// Definir el esquema directamente
const RewardHistorySchema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  rewardId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Reward', 
    required: true 
  },
  redeemedAt: { 
    type: Date, 
    required: true 
  }
}, {
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  }
});

// Crear índices para búsquedas eficientes
RewardHistorySchema.index({ userId: 1 });
RewardHistorySchema.index({ rewardId: 1 });
RewardHistorySchema.index({ redeemedAt: -1 });

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'RewardHistory', schema: RewardHistorySchema }
    ])
  ],
  // Comentamos el controlador si el archivo no existe o tiene problemas
  // controllers: [RewardHistoryController],
  providers: [RewardHistoryService],
  exports: [RewardHistoryService] // Exportar para usar en otros módulos
})
export class RewardHistoryModule {}