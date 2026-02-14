import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { YouTubeService } from './youtube.service';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';

@Controller('youtube')
export class YouTubeController {
    constructor(private youtubeService: YouTubeService) { }

    @Get('search')
    @UseGuards(OptionalJwtAuthGuard)
    async search(@Query('q') query: string, @Request() req) {
        const user = req.user;
        const isUnrestricted = user && (user.role === 'WORKER' || user.role === 'OWNER');
        return this.youtubeService.search(query, isUnrestricted);
    }
}
