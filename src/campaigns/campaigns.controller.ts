import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { ApiBadRequestResponse, ApiOkResponse } from '@nestjs/swagger';
import { User } from '../auth/decorators/user.decorator';
import { AuthenticatedUser } from '../@common/dto/authenticated.user.dto';
import { InteractWithCampaignDto } from './dto/interact.with.campaign.dto';
import { GetTimelineDto } from './dto/get.timeline.dto';

@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) { }

  @Auth()
  @Post()
  @ApiOkResponse()
  @ApiBadRequestResponse()
  async create(
    @User() user: AuthenticatedUser,
    @Body() createCampaignDto: CreateCampaignDto,
  ) {
    try {
      return await this.campaignsService.create(user.id, createCampaignDto);
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }

      throw new BadRequestException(e.message);
    }
  }

  @Auth()
  @Patch(':id/interact')
  @ApiOkResponse()
  @ApiBadRequestResponse()
  interact(
    @User() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() body: InteractWithCampaignDto,
  ) {
    return this.campaignsService.interactWithCampaign(id, body, user);
  }

  @Auth()
  @Get('timeline')
  @ApiOkResponse()
  @ApiBadRequestResponse()
  async getTimeline(
    @User() user: AuthenticatedUser,
    @Query() query: GetTimelineDto
  ) {
    try {
      return await this.campaignsService.getTimeline(query, user);
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }

      throw new BadRequestException(e.message);
    }
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
