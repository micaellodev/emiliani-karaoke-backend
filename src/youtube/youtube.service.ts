import { Injectable } from '@nestjs/common';
import YouTube from 'youtube-sr';

@Injectable()
export class YouTubeService {
    // Escuadrón de Nodos de Rescate (Plan B)
    private readonly INVIDIOUS_NODES = [
        'https://vid.puffyan.us',
        'https://invidious.jing.rocks',
        'https://invidious.nerdvpn.de',
        'https://iv.melmac.space'
    ];

    async search(query: string, isUnrestricted: boolean = false) {
        try {
            // --- PLAN A: Tu código original con youtube-sr ---
            const searchQuery = isUnrestricted ? query : (query.toLowerCase().includes('karaoke') ? query : `${query} karaoke`);

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
            // --- PLAN B: Si youtube-sr falla por el CAPTCHA, usamos Invidious ---
            console.warn('youtube-sr fue bloqueado. Activando nodos de rescate (Invidious)...');
            
            const fallbackQuery = encodeURIComponent(isUnrestricted ? query : `${query} karaoke`);
            
            for (const node of this.INVIDIOUS_NODES) {
                try {
                    const response = await fetch(`${node}/api/v1/search?q=${fallbackQuery}`);
                    if (!response.ok) continue; // Si este nodo no responde, salta al siguiente

                    const data = await response.json();
                    const fallbackVideos = data.filter((item: any) => item.type === 'video').slice(0, 10);
                    
                    if (fallbackVideos.length > 0) {
                        console.log(`¡Rescate exitoso usando ${node}!`);
                        return fallbackVideos.map((video: any) => {
                            // Convertimos los segundos de Invidious a formato "Min:Seg" para tu frontend
                            const mins = Math.floor(video.lengthSeconds / 60);
                            const secs = (video.lengthSeconds % 60).toString().padStart(2, '0');
                            
                            return {
                                id: video.videoId,
                                title: video.title,
                                channelTitle: video.author,
                                duration: `${mins}:${secs}`,
                                thumbnail: video.videoThumbnails && video.videoThumbnails.length > 0 ? video.videoThumbnails[0].url : '',
                            };
                        });
                    }
                } catch (fallbackError) {
                    continue; // Intenta con el siguiente nodo del array
                }
            }

            // --- PLAN C: El Salvavidas Definitivo ---
            // Si TODO falla (youtube-sr e Invidious), en vez de "throw new Error", devolvemos un array vacío.
            // Esto le dice al frontend: "No encontré videos, pero no te rompas".
            console.error('Todos los métodos de búsqueda fallaron. Retornando array vacío.');
            return [];
        }
    }
}
