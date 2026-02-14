import { Injectable } from '@nestjs/common';
import YouTube from 'youtube-sr';

@Injectable()
export class YouTubeService {
    async search(query: string, isUnrestricted: boolean = false) {
        try {
            // Search for videos
            const searchQuery = isUnrestricted ? query : (query.toLowerCase().includes('karaoke') ? query : `${query} karaoke`);

            // Use youtube-sr to search
            const videos = await YouTube.search(searchQuery, {
                limit: 20,
                type: 'video',
                safeSearch: !isUnrestricted
            });

            const filteredVideos = isUnrestricted ? videos : videos.filter(video => {
                const title = video.title?.toLowerCase() || '';
                return title.includes('karaoke') ||
                    title.includes('instrumental') ||
                    title.includes('pista') ||
                    title.includes('letra') ||
                    title.includes('lyrics') ||
                    title.includes('off vocal') ||
                    title.includes('backing track');
            });

            return filteredVideos.slice(0, 10).map(video => ({
                id: video.id,
                title: video.title,
                channelTitle: video.channel ? video.channel.name : '',
                duration: video.durationFormatted,
                thumbnail: video.thumbnail ? video.thumbnail.url : '',
            }));
        } catch (error) {
            console.error('YouTube API error:', error);
            throw new Error('Failed to search YouTube');
        }
    }
}
