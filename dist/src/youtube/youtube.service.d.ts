export declare class YouTubeService {
    search(query: string, isUnrestricted?: boolean): Promise<{
        id: string;
        title: string;
        channelTitle: string;
        duration: string;
        thumbnail: string;
    }[]>;
}
