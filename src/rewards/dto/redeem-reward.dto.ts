import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsMongoId } from 'class-validator';

export class RedeemRewardDto {
  @ApiProperty({
    description: 'ID del usuario que canjea la recompensa',
    example: '60d21b4667d0d8992e610c85',
  })
  @IsNotEmpty({ message: 'El ID del usuario es requerido' })
  @IsMongoId({ message: 'El ID del usuario debe ser un ID de MongoDB válido' })
  userId: string;

  @ApiProperty({
    description: 'ID de la recompensa a canjear',
    example: '60d21b4667d0d8992e610c86',
  })
  @IsNotEmpty({ message: 'El ID de la recompensa es requerido' })
  @IsMongoId({ message: 'El ID de la recompensa debe ser un ID de MongoDB válido' })
  rewardId: string;
}