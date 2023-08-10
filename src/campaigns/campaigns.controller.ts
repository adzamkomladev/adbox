import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { ApiBadRequestResponse, ApiOkResponse } from '@nestjs/swagger';
import { User } from '../auth/decorators/user.decorator';

@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Auth()
  @Post()
  @ApiOkResponse()
  @ApiBadRequestResponse()
  create(
    @User('id') userId: string,
    @Body() createCampaignDto: CreateCampaignDto,
  ) {
    return this.campaignsService.create(userId, createCampaignDto);
  }

  @Get()
  findAll() {
    return this.campaignsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.campaignsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCampaignDto: UpdateCampaignDto,
  ) {
    return this.campaignsService.update(+id, updateCampaignDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.campaignsService.remove(+id);
  }
}
