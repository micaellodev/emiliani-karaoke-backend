const YouTube = require('youtube-sr').default;
async function test() {
    try {
        console.log('Searching for "linkin park karaoke"...');
        const videos = await YouTube.search('linkin park karaoke', {
            limit: 5,
            type: 'video'
        });
        console.log('Found videos:', videos.length);
        videos.forEach(v => {
            console.log(`- ${v.title} (${v.durationFormatted}) [${v.id}]`);
        });
        const mapped = videos.map(video => ({
            id: video.id,
            title: video.title,
            channelTitle: video.channel ? video.channel.name : '',
            duration: video.durationFormatted,
            thumbnail: video.thumbnail ? video.thumbnail.url : '',
        }));
        console.log('Mapped output:', mapped[0]);
    }
    catch (e) {
        console.error('Error:', e);
    }
}
test();
//# sourceMappingURL=test-youtube.js.map