import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Achievement, AchievementDocument } from './schemas/achievement.schema';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { SimulateActionDto } from './dto/simulate-action.dto';
import { UsersService } from '../users/users.service';
import { RewardsService } from '../rewards/rewards.service';

@Injectable()
export class AchievementsService {
  constructor(
    @InjectModel(Achievement.name) private achievementModel: Model<AchievementDocument>,
    private usersService: UsersService,
    private rewardsService: RewardsService,
  ) {}

  /**
   * Crear un nuevo logro
   * @param createAchievementDto Datos para crear el logro
   * @returns El logro creado
   */
  async create(createAchievementDto: CreateAchievementDto): Promise<Achievement> {
    const newAchievement = new this.achievementModel(createAchievementDto);
    return await newAchievement.save();
  }

  /**
   * Buscar todos los logros
   * @returns Lista de logros
   */
  async findAll(): Promise<Achievement[]> {
    return this.achievementModel.find().populate('rewardId').exec();
  }

  /**
   * Buscar un logro por su ID
   * @param id ID del logro
   * @returns El logro encontrado
   */
  async findOne(id: string): Promise<Achievement> {
    const achievement = await this.achievementModel.findById(id).populate('rewardId').exec();
    
    if (!achievement) {
      throw new NotFoundException(`Logro con ID ${id} no encontrado`);
    }
    
    return achievement;
  }

  /**
   * Simular una acción para un usuario y otorgar logros si corresponde
   * @param userId ID del usuario
   * @param simulateActionDto Datos de la acción simulada
   * @returns Resultado de la simulación con logros otorgados
   */
  async simulateAction(userId: string, simulateActionDto: SimulateActionDto): Promise<any> {
    // Buscar al usuario
    const user = await this.usersService.findOne(userId);
    
    // Añadir puntos al usuario (podría variar según actionType)
    const pointsToAdd = simulateActionDto.actionValue || 1;
    await this.usersService.addPoints(userId, pointsToAdd);
    
    // Buscar logros que el usuario podría obtener basado en los puntos actuales
    const newAchievements = await this.achievementModel.find({
      requirement: { $lte: user.points + pointsToAdd },
      _id: { $nin: user.achievements } // Excluir logros que ya tiene
    }).exec();
    
    // Definir tipos para los arrays de resultados
    interface AchievementEarned {
      id: any;
      name: string;
      description: string;
    }
    
    // Array para almacenar resultados
    const results = {
      pointsAdded: pointsToAdd,
      totalPoints: user.points + pointsToAdd,
      achievementsEarned: [] as AchievementEarned[],
      rewardsEarned: [] as any[]
    };
    
    // Procesar cada logro obtenido
    for (const achievement of newAchievements) {
      // Añadir logro al usuario
      await this.usersService.addAchievement(userId, achievement._id.toString());
      
      results.achievementsEarned.push({
        id: achievement._id,
        name: achievement.name,
        description: achievement.description
      });
      
      // Si el logro tiene una recompensa asociada, canjearla automáticamente
      if (achievement.rewardId) {
        try {
          const redeemResult = await this.rewardsService.redeemReward({
            userId,
            rewardId: achievement.rewardId.toString(),
          });
          
          results.rewardsEarned.push(redeemResult);
        } catch (error) {
          // Si hay un error al canjear (por ejemplo, sin stock), lo ignoramos
          // pero podríamos registrarlo para análisis
          console.warn(`Error al canjear recompensa para el logro ${achievement.name}:`, error.message);
        }
      }
    }
    
    return results;
  }
}