import { Controller, Get, Post, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { CreateRewardDto } from './dto/create-reward.dto';
import { RedeemRewardDto } from './dto/redeem-reward.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('rewards')
@Controller('rewards')
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva recompensa' })
  @ApiResponse({ status: 201, description: 'Recompensa creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createRewardDto: CreateRewardDto) {
    return this.rewardsService.create(createRewardDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las recompensas' })
  @ApiQuery({ name: 'activeOnly', required: false, type: Boolean, description: 'Filtrar solo recompensas activas' })
  @ApiResponse({ status: 200, description: 'Lista de recompensas' })
  findAll(@Query('activeOnly') activeOnly: boolean) {
    return this.rewardsService.findAll(activeOnly);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una recompensa por ID' })
  @ApiParam({ name: 'id', description: 'ID de la recompensa' })
  @ApiResponse({ status: 200, description: 'Recompensa encontrada' })
  @ApiResponse({ status: 404, description: 'Recompensa no encontrada' })
  findOne(@Param('id') id: string) {
    return this.rewardsService.findOne(id);
  }

  @Post('redeem')
  @ApiOperation({ summary: 'Canjear una recompensa' })
  @ApiResponse({ status: 200, description: 'Recompensa canjeada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 404, description: 'Usuario o recompensa no encontrados' })
  @ApiResponse({ status: 409, description: 'Conflicto: puntos insuficientes, recompensa inactiva o sin stock' })
  @HttpCode(HttpStatus.OK)
  redeemReward(@Body() redeemRewardDto: RedeemRewardDto) {
    return this.rewardsService.redeemReward(redeemRewardDto);
  }
}