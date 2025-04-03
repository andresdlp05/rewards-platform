import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsMongoId, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRewardHistoryDto {
  @ApiProperty({
    description: 'ID del usuario que canjeó la recompensa',
    example: '60d21b4667d0d8992e610c85',
  })
  @IsNotEmpty({ message: 'El ID del usuario es requerido' })
  @IsMongoId({ message: 'El ID del usuario debe ser un ID de MongoDB válido' })
  userId: string;

  @ApiProperty({
    description: 'ID de la recompensa canjeada',
    example: '60d21b4667d0d8992e610c86',
  })
  @IsNotEmpty({ message: 'El ID de la recompensa es requerido' })
  @IsMongoId({ message: 'El ID de la recompensa debe ser un ID de MongoDB válido' })
  rewardId: string;

  @ApiProperty({
    description: 'Fecha y hora del canjeo',
    example: '2023-01-15T10:30:00Z',
  })
  @IsNotEmpty({ message: 'La fecha de canjeo es requerida' })
  @IsDate({ message: 'La fecha de canjeo debe ser una fecha válida' })
  @Type(() => Date)
  redeemedAt: Date;
}