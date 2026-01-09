import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OutagesService } from './outages.service';
import { CreateOutageDto } from './dto/create-outage.dto';
import { UpdateOutageStatusDto } from './dto/update-outage-status.dto';
import { UpdateOutageDto } from './dto/update-outage.dto';
import { OutageType } from './outage-type.enum';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/user-role.enum';

@ApiTags('outages')
@Controller('outages')
export class OutagesController {
  constructor(private readonly outagesService: OutagesService) {}

  @Get()
  getCurrent(
    @Query('zoneId') zoneId?: string,
    @Query('type') type?: OutageType,
  ) {
    const parsedZoneId = zoneId ? parseInt(zoneId, 10) : undefined;
    return this.outagesService.getCurrent(parsedZoneId, type);
  }

  @Get('history')
  getHistory(
    @Query('zoneId') zoneId?: string,
    @Query('type') type?: OutageType,
  ) {
    const parsedZoneId = zoneId ? parseInt(zoneId, 10) : undefined;
    return this.outagesService.getHistory(parsedZoneId, type);
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.outagesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.AGENT, UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  create(@Body() dto: CreateOutageDto) {
    return this.outagesService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.AGENT, UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOutageDto,
  ) {
    return this.outagesService.update(id, dto);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.AGENT, UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOutageStatusDto,
  ) {
    return this.outagesService.updateStatus(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.AGENT, UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.outagesService.remove(id);
  }
}
