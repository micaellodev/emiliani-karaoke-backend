import { YouTubeService } from './youtube.service';
export declare class YouTubeController {
    private youtubeService;
    constructor(youtubeService: YouTubeService);
    search(query: string, req: any): Promise<{
        id: string;
        title: string;
        channelTitle: string;
        duration: string;
        thumbnail: string;
    }[]>;
}
