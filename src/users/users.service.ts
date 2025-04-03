import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import mongoose from 'mongoose';
import { User, UserDocument } from './interfaces/user.interface';

// DTOs
interface CreateUserDto {
  username: string;
  email: string;
}

interface UpdateUserDto {
  username?: string;
  email?: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private userModel: Model<UserDocument>,
  ) {}

  /**
   * Crear un nuevo usuario en la plataforma
   * @param createUserDto Datos para crear el usuario
   * @returns El usuario creado
   */
  async create(createUserDto: CreateUserDto): Promise<any> {
    try {
      const newUser = new this.userModel(createUserDto);
      return await newUser.save();
    } catch (error) {
      // Manejar errores de duplicación (username o email)
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        throw new ConflictException(`Ya existe un usuario con ese ${field}`);
      }
      throw error;
    }
  }

  /**
   * Buscar todos los usuarios en la plataforma
   * @returns Lista de usuarios
   */
  async findAll(): Promise<any[]> {
    return this.userModel.find().exec();
  }

  /**
   * Buscar un usuario por su ID
   * @param id ID del usuario
   * @returns El usuario encontrado
   */
  async findOne(id: string): Promise<any> {
    const user = await this.userModel.findById(id)
      .populate('achievements')
      .exec();
    
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    
    return user;
  }

  /**
   * Actualizar un usuario existente
   * @param id ID del usuario
   * @param updateUserDto Datos para actualizar
   * @returns El usuario actualizado
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<any> {
    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(
        id,
        { $set: updateUserDto },
        { new: true, runValidators: true }
      ).exec();
      
      if (!updatedUser) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      }
      
      return updatedUser;
    } catch (error) {
      // Manejar errores de duplicación (username o email)
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        throw new ConflictException(`Ya existe un usuario con ese ${field}`);
      }
      throw error;
    }
  }

  /**
   * Añadir puntos a un usuario
   * @param id ID del usuario
   * @param points Puntos a añadir
   * @returns El usuario actualizado
   */
  async addPoints(id: string, points: number): Promise<any> {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      { $inc: { points } },
      { new: true }
    ).exec();
    
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    
    return user;
  }

  /**
   * Restar puntos a un usuario
   * @param id ID del usuario
   * @param points Puntos a restar
   * @returns El usuario actualizado
   */
  async deductPoints(id: string, points: number): Promise<any> {
    const user = await this.userModel.findById(id).exec();
    
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    
    // Verificar si el usuario tiene suficientes puntos
    if (user.points < points) {
      throw new ConflictException('El usuario no tiene suficientes puntos');
    }
    
    // Restar puntos
    user.points -= points;
    return user.save();
  }

  /**
   * Añadir un logro a un usuario
   * @param userId ID del usuario
   * @param achievementId ID del logro
   * @returns El usuario actualizado
   */
  async addAchievement(userId: string, achievementId: string): Promise<any> {
    const user = await this.userModel.findById(userId).exec();
    
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }
    
    // Verificar si el usuario ya tiene este logro
    if (user.achievements && user.achievements.some((ach: any) => ach.toString() === achievementId)) {
      return user; // Ya tiene el logro, no hacer nada
    }
    
    // Añadir el logro
    user.achievements.push(new mongoose.Types.ObjectId(achievementId));
    return user.save();
  }
}