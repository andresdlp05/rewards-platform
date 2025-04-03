import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { SimulateActionDto } from './dto/simulate-action.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('achievements')
@Controller('achievements')
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo logro' })
  @ApiResponse({ status: 201, description: 'Logro creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  create(@Body() createAchievementDto: CreateAchievementDto) {
    return this.achievementsService.create(createAchievementDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los logros' })
  @ApiResponse({ status: 200, description: 'Lista de logros' })
  findAll() {
    return this.achievementsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un logro por ID' })
  @ApiParam({ name: 'id', description: 'ID del logro' })
  @ApiResponse({ status: 200, description: 'Logro encontrado' })
  @ApiResponse({ status: 404, description: 'Logro no encontrado' })
  findOne(@Param('id') id: string) {
    return this.achievementsService.findOne(id);
  }

  @Post('users/:id/simulate-action')
  @ApiOperation({ summary: 'Simular una acción para un usuario' })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @ApiResponse({ status: 200, description: 'Acción simulada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  simulateAction(
    @Param('id') id: string,
    @Body() simulateActionDto: SimulateActionDto
  ) {
    return this.achievementsService.simulateAction(id, simulateActionDto);
  }
}