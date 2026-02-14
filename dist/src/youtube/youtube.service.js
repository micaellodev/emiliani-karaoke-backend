"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YouTubeService = void 0;
const common_1 = require("@nestjs/common");
const youtube_sr_1 = __importDefault(require("youtube-sr"));
let YouTubeService = class YouTubeService {
    async search(query, isUnrestricted = false) {
        try {
            const searchQuery = isUnrestricted ? query : (query.toLowerCase().includes('karaoke') ? query : `${query} karaoke`);
            const videos = await youtube_sr_1.default.search(searchQuery, {
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
        }
        catch (error) {
            console.error('YouTube API error:', error);
            throw new Error('Failed to search YouTube');
        }
    }
};
exports.YouTubeService = YouTubeService;
exports.YouTubeService = YouTubeService = __decorate([
    (0, common_1.Injectable)()
], YouTubeService);
//# sourceMappingURL=youtube.service.js.map