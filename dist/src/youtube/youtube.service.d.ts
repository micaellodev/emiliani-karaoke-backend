export declare class YouTubeService {
    private youtube;
    search(query: string): Promise<{
        id: string;
        title: string;
        channelTitle: string;
        duration: string;
        thumbnail: string;
    }[]>;
    private formatDuration;
}
