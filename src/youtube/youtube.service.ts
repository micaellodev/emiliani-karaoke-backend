import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';

@Injectable()
export class YouTubeService {
    private youtube = google.youtube({
        version: 'v3',
        auth: process.env.YOUTUBE_API_KEY,
    });

    async search(query: string) {
        try {
            // Search for videos
            const searchQuery = query.toLowerCase().includes('karaoke') ? query : `${query} karaoke`;

            const searchResponse = await this.youtube.search.list({
                part: ['snippet'],
                q: searchQuery,
                type: ['video'],
                videoEmbeddable: 'true',
                videoCategoryId: '10', // Music category
                maxResults: 10,
            });

            const videoIds = searchResponse.data.items
                ?.map((item) => item.id?.videoId)
                .filter(Boolean)
                .join(',');

            if (!videoIds) {
                return [];
            }

            // Get video details including duration
            const detailsResponse = await this.youtube.videos.list({
                part: ['contentDetails', 'snippet'],
                id: [videoIds],
            });

            return detailsResponse.data.items?.map((item) => ({
                id: item.id,
                title: item.snippet?.title,
                channelTitle: item.snippet?.channelTitle,
                duration: this.formatDuration(item.contentDetails?.duration || ''),
                thumbnail: item.snippet?.thumbnails?.medium?.url,
            })) || [];
        } catch (error) {
            console.error('YouTube API error:', error);
            throw new Error('Failed to search YouTube');
        }
    }

    private formatDuration(isoDuration: string): string {
        const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
        if (!match) return '0:00';

        const hours = (match[1] || '').replace('H', '');
        const minutes = (match[2] || '').replace('M', '');
        const seconds = (match[3] || '0').replace('S', '');

        if (hours) {
            return `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
        }
        return `${minutes || '0'}:${seconds.padStart(2, '0')}`;
    }
}
