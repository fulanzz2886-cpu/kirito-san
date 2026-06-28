switch (command) {
    // ==================== FEATURE TIKTOK ====================
    case 'tiktok':
    case 'tt': {
        if (!args[0]) return reply('Silakan masukkan link TikTok-nya!');
        await reply('Sedang mengunduh dari TikTok, mohon tunggu...');
        try {
            let videoUrl = await fetchTiktokVideo(args[0]); 
            await client.sendMessage(from, { video: { url: videoUrl } }, { quoted: msg });
        } catch (err) {
            reply('Gagal mengunduh video TikTok.');
        }
        break;
    }

    // ==================== FEATURE YOUTUBE ====================
    case 'youtube':
    case 'yt': {
        if (!args[0]) return reply('Silakan masukkan link YouTube-nya!');
        await reply('Sedang mengunduh dari YouTube, mohon tunggu...');
        try {
            let videoUrl = await fetchYoutubeVideo(args[0]); 
            await client.sendMessage(from, { video: { url: videoUrl } }, { quoted: msg });
        } catch (err) {
            reply('Gagal mengunduh video YouTube.');
        }
        break;
    }

    // ==================== FEATURE FACEBOOK ====================
    case 'facebook':
    case 'fb': {
        if (!args[0]) return reply('Silakan masukkan link Facebook-nya!');
        await reply('Sedang mengunduh dari Facebook, mohon tunggu...');
        try {
            let videoUrl = await fetchFacebookVideo(args[0]); 
            await client.sendMessage(from, { video: { url: videoUrl } }, { quoted: msg });
        } catch (err) {
            reply('Gagal mengunduh video Facebook.');
        }
        break;
    }

    // ==================== FEATURE INSTAGRAM ====================
    case 'instagram':
    case 'ig': {
        if (!args[0]) return reply('Silakan masukkan link Instagram Reels/Post-nya!');
        await reply('Sedang mengunduh dari Instagram, mohon tunggu...');
        try {
            let videoUrl = await fetchInstagramVideo(args[0]); // Sesuaikan nama fungsi scraper IG kamu
            await client.sendMessage(from, { video: { url: videoUrl } }, { quoted: msg });
        } catch (err) {
            reply('Gagal mengunduh video Instagram.');
        }
        break;
    }

    // ==================== FEATURE SPOTIFY ====================
    case 'spotify': {
        if (!args[0]) return reply('Silakan masukkan link lagu Spotify-nya!');
        await reply('Sedang mencari dan mengunduh lagu dari Spotify, mohon tunggu...');
        try {
            let audioUrl = await fetchSpotifyAudio(args[0]); // Sesuaikan nama fungsi scraper Spotify kamu
            // Mengirim sebagai file audio (.mp3)
            await client.sendMessage(from, { audio: { url: audioUrl }, mimetype: 'audio/mp4' }, { quoted: msg });
        } catch (err) {
            reply('Gagal mengunduh lagu dari Spotify.');
        }
        break;
    }

} // Tutup switch tunggal di akhir file
