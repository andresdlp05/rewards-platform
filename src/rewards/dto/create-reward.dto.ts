import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsBoolean, IsOptional, Min } from 'class-validator';

export class CreateRewardDto {
  @ApiProperty({
    description: 'Título de la recompensa',
    example: 'Medalla de Oro',
  })
  @IsNotEmpty({ message: 'El título es requerido' })
  @IsString({ message: 'El título debe ser una cadena de texto' })
  title: string;

  @ApiProperty({
    description: 'Descripción detallada de la recompensa',
    example: 'Una medalla dorada por completar 10 desafíos',
  })
  @IsNotEmpty({ message: 'La descripción es requerida' })
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  description: string;

  @ApiProperty({
    description: 'Puntos necesarios para canjear la recompensa',
    example: 500,
  })
  @IsNotEmpty({ message: 'Los puntos requeridos son necesarios' })
  @IsNumber({}, { message: 'Los puntos requeridos deben ser un número' })
  @Min(0, { message: 'Los puntos requeridos no pueden ser negativos' })
  pointsRequired: number;

  @ApiProperty({
    description: 'Cantidad disponible de esta recompensa',
    example: 100,
  })
  @IsNotEmpty({ message: 'El stock es requerido' })
  @IsNumber({}, { message: 'El stock debe ser un número' })
  @Min(0, { message: 'El stock no puede ser negativo' })
  stock: number;

  @ApiProperty({
    description: 'Indica si la recompensa está activa para canjear',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'isActive debe ser un valor booleano' })
  isActive?: boolean;
}