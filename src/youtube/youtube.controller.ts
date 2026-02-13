import { Controller, Get, Query } from '@nestjs/common';
import { YouTubeService } from './youtube.service';

@Controller('youtube')
export class YouTubeController {
    constructor(private youtubeService: YouTubeService) { }

    @Get('search')
    async search(@Query('q') query: string) {
        return this.youtubeService.search(query);
    }
}
