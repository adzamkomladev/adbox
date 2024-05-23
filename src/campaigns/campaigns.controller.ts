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
  Logger,
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Auth } from '../auth/decorators/auth.decorator';
import { User } from '../auth/decorators/user.decorator';
import { ResponseMessage } from '../@common/decorators/response.message.decorator';

import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { AuthenticatedUser } from '../@common/dto/authenticated.user.dto';
import { InteractWithCampaignDto } from './dto/interact.with.campaign.dto';
import { GetTimelineQueryDto } from './dto/get.timeline.dto';

import { CampaignsService } from './campaigns.service';

@Controller('campaigns')
@ApiTags('Campaigns')
export class CampaignsController {
  private readonly logger = new Logger(CampaignsController.name);

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
  @ApiOperation({ summary: 'Used to retrieve campaign timeline for authenticated user' })
  @ApiOkResponse({ description: 'Timeline retrieved' })
  @ApiBadRequestResponse({ description: 'Failed to retrieve timeline' })
  @ResponseMessage('timeline retrieved')
  async getTimeline(
    @User() user: AuthenticatedUser,
    @Query() query: GetTimelineQueryDto
  ) {
    try {
      return await this.campaignsService.getTimeline(query, user);
    } catch (e) {
      this.logger.error(`Failed to retrieve timeline with error ==> ${e}`);

      if (e instanceof HttpException) {
        throw e;
      }

      throw new BadRequestException('failed to retrieve timeline');
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
