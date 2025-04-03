import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class SimulateActionDto {
  @ApiProperty({
    description: 'Tipo de acción realizada',
    example: 'completar_tarea',
  })
  @IsNotEmpty({ message: 'El tipo de acción es requerido' })
  @IsString({ message: 'El tipo de acción debe ser una cadena de texto' })
  actionType: string;

  @ApiProperty({
    description: 'Valor numérico de la acción (opcional)',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @IsNumber({}, { message: 'El valor de la acción debe ser un número' })
  @Min(1, { message: 'El valor de la acción debe ser al menos 1' })
  actionValue?: number = 1;
}