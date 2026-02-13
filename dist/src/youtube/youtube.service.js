"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YouTubeService = void 0;
const common_1 = require("@nestjs/common");
const googleapis_1 = require("googleapis");
let YouTubeService = class YouTubeService {
    constructor() {
        this.youtube = googleapis_1.google.youtube({
            version: 'v3',
            auth: process.env.YOUTUBE_API_KEY,
        });
    }
    async search(query) {
        try {
            const searchQuery = query.toLowerCase().includes('karaoke') ? query : `${query} karaoke`;
            const searchResponse = await this.youtube.search.list({
                part: ['snippet'],
                q: searchQuery,
                type: ['video'],
                videoEmbeddable: 'true',
                videoCategoryId: '10',
                maxResults: 10,
            });
            const videoIds = searchResponse.data.items
                ?.map((item) => item.id?.videoId)
                .filter(Boolean)
                .join(',');
            if (!videoIds) {
                return [];
            }
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
        }
        catch (error) {
            console.error('YouTube API error:', error);
            throw new Error('Failed to search YouTube');
        }
    }
    formatDuration(isoDuration) {
        const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
        if (!match)
            return '0:00';
        const hours = (match[1] || '').replace('H', '');
        const minutes = (match[2] || '').replace('M', '');
        const seconds = (match[3] || '0').replace('S', '');
        if (hours) {
            return `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
        }
        return `${minutes || '0'}:${seconds.padStart(2, '0')}`;
    }
};
exports.YouTubeService = YouTubeService;
exports.YouTubeService = YouTubeService = __decorate([
    (0, common_1.Injectable)()
], YouTubeService);
//# sourceMappingURL=youtube.service.js.map