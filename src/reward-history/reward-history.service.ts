import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RewardHistory, RewardHistoryDocument } from './schemas/reward-history.schema';
import { CreateRewardHistoryDto } from './dto/create-reward-history.dto';

@Injectable()
export class RewardHistoryService {
  constructor(
    @InjectModel(RewardHistory.name) private rewardHistoryModel: Model<RewardHistoryDocument>,
  ) {}

  /**
   * Crear un nuevo registro de canjeo de recompensa
   * @param createRewardHistoryDto Datos para crear el registro
   * @returns El registro creado
   */
  async create(createRewardHistoryDto: CreateRewardHistoryDto): Promise<RewardHistory> {
    const newRewardHistory = new this.rewardHistoryModel(createRewardHistoryDto);
    return await newRewardHistory.save();
  }

  /**
   * Obtener el historial de canjeos de un usuario
   * @param userId ID del usuario
   * @returns Lista de registros de canjeo
   */
  async findByUserId(userId: string): Promise<RewardHistory[]> {
    return this.rewardHistoryModel.find({ userId })
      .populate('rewardId')
      .sort({ redeemedAt: -1 })
      .exec();
  }
}