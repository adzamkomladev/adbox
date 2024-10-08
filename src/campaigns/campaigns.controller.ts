import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpException,
  BadRequestException,
  Query,
  Put,
  UseGuards,
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
import { GetCreatedCampaignsQueryDto } from './dto/get-created-campaigns.dto';

import { CampaignsService } from './campaigns.service';

import { CampaignOwnerGuard } from './guards/campaign-owner.guard';
import { AddCommentDto } from './dto/add-comment.dto';
import { GetCommentsQueryDto } from './dto/get-comments.dto';
import { OtlpLogger } from '@common/loggers/otlp.logger';

@Controller('campaigns')
@ApiTags('Campaigns')
export class CampaignsController {
  private readonly logger = new OtlpLogger(CampaignsController.name);

  constructor(private readonly campaignsService: CampaignsService) { }

  @Auth()
  @Post()
  @ApiOperation({ summary: 'Used to create a new campaign' })
  @ApiOkResponse({ description: 'Campaign created' })
  @ApiBadRequestResponse({ description: 'Failed to create campaign' })
  @ResponseMessage('campaign created')
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

  @Auth()
  @Get(':id')
  @ApiOperation({ summary: 'Used to retrieve campaign' })
  @ApiOkResponse({ description: 'Campaign retrieved' })
  @ApiBadRequestResponse({ description: 'Failed to retrieve campaign' })
  @ResponseMessage('campaign retrieved')
  findOne(
    @User() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    try {
      return this.campaignsService.findOne(id, user);
    } catch (e) {
      this.logger.error(`Failed to retrieve campaign with error ==> ${e}`);

      if (e instanceof HttpException) {
        throw e;
      }

      throw new BadRequestException('failed to retrieve campaign');
    }
  }

  @Auth()
  @Patch(':id/interact')
  @ApiOperation({ summary: 'Used to interact with a campaign (view or/and like)' })
  @ApiOkResponse({ description: 'Interacted with campaign' })
  @ApiBadRequestResponse({ description: 'Failed to interact with campaign' })
  @ResponseMessage('interacted with campaign')
  interact(
    @User() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() body: InteractWithCampaignDto,
  ) {
    try {
      return this.campaignsService.interactWithCampaign(id, body, user);
    } catch (e) {
      this.logger.error(`Failed to interact with campaign with error ==> ${e}`);

      if (e instanceof HttpException) {
        throw e;
      }

      throw new BadRequestException('failed to interact with campaign');
    }
  }

  @Auth()
  @Post(':id/comments')
  @ApiOperation({ summary: 'Used to add comment to a campaign' })
  @ApiOkResponse({ description: 'Comment added to campaign' })
  @ApiBadRequestResponse({ description: 'Failed to add comment to campaign' })
  @ResponseMessage('comment added to campaign')
  addCampaignComment(
    @User() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() body: AddCommentDto,
  ) {
    try {
      return this.campaignsService.addCommentToCampaign(id, body, user);
    } catch (e) {
      this.logger.error(`Failed to add comment to campaign with error ==> ${e}`);

      if (e instanceof HttpException) {
        throw e;
      }

      throw new BadRequestException('failed to add comment to campaign');
    }
  }

  @Auth()
  @Get(':id/comments')
  @ApiOperation({ summary: 'Used to get campaign comments' })
  @ApiOkResponse({ description: 'Comments of campaign retrieved' })
  @ApiBadRequestResponse({ description: 'Failed to get campaign comments' })
  @ResponseMessage('comments of campaign retrieved')
  findAllCampaignComments(
    @Param('id') id: string,
    @Query() query: GetCommentsQueryDto
  ) {
    try {
      return this.campaignsService.getCampaignComments(id, query);
    } catch (e) {
      this.logger.error(`Failed to get campaign comments with error ==> ${e}`);

      if (e instanceof HttpException) {
        throw e;
      }

      throw new BadRequestException('failed to get campaign comments');
    }
  }




  @Auth()
  @Get('created')
  @ApiOperation({ summary: 'Used to retrieve campaigns created by authenticated user' })
  @ApiOkResponse({ description: 'Created campaigns retrieved' })
  @ApiBadRequestResponse({ description: 'Failed to retrieve created campaigns' })
  @ResponseMessage('created campaigns retrieved')
  async getCreatedCampaigns(
    @User() user: AuthenticatedUser,
    @Query() query: GetCreatedCampaignsQueryDto
  ) {
    try {
      return await this.campaignsService.getCreatedCampaigns(query, user);
    } catch (e) {
      this.logger.error(`Failed to retrieve created campaigns with error ==> ${e}`);

      if (e instanceof HttpException) {
        throw e;
      }

      throw new BadRequestException('failed to retrieve created campaigns');
    }
  }

  @Auth()
    // @UseGuards(CampaignOwnerGuard)
  @Put(':id/pause')
  @ApiOperation({ summary: 'Used to pause a campaign' })
  @ApiOkResponse({ description: 'Campaign paused' })
  @ApiBadRequestResponse({ description: 'Failed to pause campaign' })
  @ResponseMessage('campaign paused')
  async pauseCampaign(
    @User() user: AuthenticatedUser,
    @Param('id') id: string
  ) {
    try {
      return await this.campaignsService.pauseCampaign(id, user);
    } catch (e) {
      this.logger.error(`Failed to pause campaign with error ==> ${e}`);

      if (e instanceof HttpException) {
        throw e;
      }

      throw new BadRequestException('failed to pause campaign');
    }
  }

  @Auth()
    // @UseGuards(CampaignOwnerGuard)
  @Put(':id/unpause')
  @ApiOperation({ summary: 'Used to unpause a campaign' })
  @ApiOkResponse({ description: 'Campaign unpaused' })
  @ApiBadRequestResponse({ description: 'Failed to unpause campaign' })
  @ResponseMessage('campaign unpaused')
  async unPauseCampaign(
    @User() user: AuthenticatedUser,
    @Param('id') id: string
  ) {
    try {
      return await this.campaignsService.unPauseCampaign(id, user);
    } catch (e) {
      this.logger.error(`Failed to unpause campaign with error ==> ${e}`);

      if (e instanceof HttpException) {
        throw e;
      }

      throw new BadRequestException('failed to unpause campaign');
    }
  }

  @Auth()
    // @UseGuards(CampaignOwnerGuard)
  @Put(':id/stop')
  @ApiOperation({ summary: 'Used to stop a campaign' })
  @ApiOkResponse({ description: 'Campaign stopped' })
  @ApiBadRequestResponse({ description: 'Failed to stop campaign' })
  @ResponseMessage('campaign stopped')
  async stopCampaign(
    @User() user: AuthenticatedUser,
    @Param('id') id: string
  ) {
    try {
      return await this.campaignsService.stopCampaign(id, user);
    } catch (e) {
      this.logger.error(`Failed to stop campaign with error ==> ${e}`);

      if (e instanceof HttpException) {
        throw e;
      }

      throw new BadRequestException('failed to stop campaign');
    }
  }
}
