import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsMongoId, Min } from 'class-validator';

export class CreateAchievementDto {
  @ApiProperty({
    description: 'Nombre del logro',
    example: 'Participación Constante',
  })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  name: string;

  @ApiProperty({
    description: 'Descripción detallada del logro',
    example: 'Completar 10 acciones en la plataforma',
  })
  @IsNotEmpty({ message: 'La descripción es requerida' })
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  description: string;

  @ApiProperty({
    description: 'Requisito numérico para obtener el logro',
    example: 10,
  })
  @IsNotEmpty({ message: 'El requisito es requerido' })
  @IsNumber({}, { message: 'El requisito debe ser un número' })
  @Min(1, { message: 'El requisito debe ser al menos 1' })
  requirement: number;

  @ApiProperty({
    description: 'ID de la recompensa asociada al logro (opcional)',
    example: '60d21b4667d0d8992e610c86',
    required: false,
  })
  @IsOptional()
  @IsMongoId({ message: 'El ID de la recompensa debe ser un ID de MongoDB válido' })
  rewardId?: string;
}