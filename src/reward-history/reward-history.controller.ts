import { Controller, Get, Param } from '@nestjs/common';
import { RewardHistoryService } from './reward-history.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('reward-history')
@Controller('users/:id/history')
export class RewardHistoryController {
  constructor(private readonly rewardHistoryService: RewardHistoryService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener historial de canjeos de un usuario' })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @ApiResponse({ status: 200, description: 'Historial de canjeos' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async getHistory(@Param('id') id: string): Promise<any> {
    return this.rewardHistoryService.findByUserId(id);
  }
}