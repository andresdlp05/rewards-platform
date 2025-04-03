import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reward, RewardDocument } from './schemas/reward.schema';
import { CreateRewardDto } from './dto/create-reward.dto';
import { RedeemRewardDto } from './dto/redeem-reward.dto';
import { UsersService } from '../users/users.service';
import { RewardHistoryService } from '../reward-history/reward-history.service';
import { CreateRewardHistoryDto } from '../reward-history/dto/create-reward-history.dto';

@Injectable()
export class RewardsService {
  constructor(
    @InjectModel(Reward.name) private rewardModel: Model<RewardDocument>,
    private usersService: UsersService,
    private rewardHistoryService: RewardHistoryService,
  ) {}

  /**
   * Crear una nueva recompensa
   * @param createRewardDto Datos para crear la recompensa
   * @returns La recompensa creada
   */
  async create(createRewardDto: CreateRewardDto): Promise<Reward> {
    const newReward = new this.rewardModel(createRewardDto);
    return await newReward.save();
  }

  /**
   * Buscar todas las recompensas disponibles
   * @param activeOnly Si es true, solo devuelve recompensas activas
   * @returns Lista de recompensas
   */
  async findAll(activeOnly: boolean = false): Promise<Reward[]> {
    const query = activeOnly ? { isActive: true } : {};
    return this.rewardModel.find(query).exec();
  }

  /**
   * Buscar una recompensa por su ID
   * @param id ID de la recompensa
   * @returns La recompensa encontrada
   */
  async findOne(id: string): Promise<Reward> {
    const reward = await this.rewardModel.findById(id).exec();
    
    if (!reward) {
      throw new NotFoundException(`Recompensa con ID ${id} no encontrada`);
    }
    
    return reward;
  }

  /**
   * Canjear una recompensa por un usuario
   * @param redeemRewardDto Datos para el canjeo
   * @returns Resultado del canjeo
   */
  async redeemReward(redeemRewardDto: RedeemRewardDto): Promise<any> {
    const { userId, rewardId } = redeemRewardDto;
    
    // Obtener la recompensa
    const reward = await this.rewardModel.findById(rewardId).exec();
    
    if (!reward) {
      throw new NotFoundException(`Recompensa con ID ${rewardId} no encontrada`);
    }
    
    // Validar si la recompensa está activa
    if (!reward.isActive) {
      throw new ConflictException('Esta recompensa no está disponible actualmente');
    }
    
    // Validar si hay stock disponible
    if (reward.stock <= 0) {
      throw new ConflictException('No hay stock disponible para esta recompensa');
    }
    
    // Obtener el usuario y validar sus puntos
    const user = await this.usersService.findOne(userId);
    
    if (user.points < reward.pointsRequired) {
      throw new ConflictException(
        `Puntos insuficientes. Necesitas ${reward.pointsRequired} puntos, pero tienes ${user.points}`
      );
    }
    
    // Iniciar transacción
    try {
      // Restar puntos al usuario
      await this.usersService.deductPoints(userId, reward.pointsRequired);
      
      // Restar stock de la recompensa
      reward.stock -= 1;
      await reward.save();
      
      // Registrar en el historial
      await this.rewardHistoryService.create({
        userId,
        rewardId,
        redeemedAt: new Date(),
      });
      
      return {
        success: true,
        message: 'Recompensa canjeada exitosamente',
        reward: reward.title,
        pointsDeducted: reward.pointsRequired,
        remainingPoints: user.points - reward.pointsRequired,
      };
    } catch (error) {
      // En caso de error, podríamos implementar rollback de transacción
      throw error;
    }
  }
}