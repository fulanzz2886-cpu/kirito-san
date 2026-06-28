const { MessageMedia } = require('whatsapp-web.js'); // Sesuaikan dengan library botmu
const Jimp = require('jimp');

// ==========================================
// 1. FUNGSI PEMBANTU (HELPER FUNCTIONS)
// ==========================================

async function drawMemeText(base64Data, mimeType, topText, bottomText) {
    const imageBuffer = Buffer.from(base64Data, 'base64');
    const image = await Jimp.read(imageBuffer);
    const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);

    const maxWidth = image.bitmap.width;
    const maxHeight = image.bitmap.height;

    if (topText) {
        image.print(font, 0, 20, {
            text: topText.toUpperCase(),
            alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER
        }, maxWidth);
    }

    if (bottomText) {
        image.print(font, 0, maxHeight - 60, {
            text: bottomText.toUpperCase(),
            alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER
        }, maxWidth);
    }

    return await image.getBufferAsync(mimeType);
}

async function generateBratVideo(words) {
    // Isi logika FFmpeg & Canvas di sini jika sudah siap
    throw new Error("Fungsi generateBratVideo perlu dikonfigurasi dengan FFmpeg di server Anda.");
}

// ==========================================
// 2. MAIN EVENT / COMMAND HANDLER
// ==========================================

client.on('message', async (msg) => {
    const prefix = '!'; 
    const body = msg.body || '';
    
    // Keluar jika pesan tidak dimulai dengan prefix
    if (!body.startsWith(prefix)) return;

    // Memisahkan perintah dan argumen
    const args = body.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // MASUK KE LOGIKA SWITCH-CASE
    switch (command) {

        // --- 1. COMMAND STICKER BIASA ---
        case 'stiker':
        case 's':
            if (msg.hasMedia) {
                const media = await msg.downloadMedia();
                await client.sendMessage(msg.from, media, { sendMediaAsSticker: true });
            } else {
                msg.reply('Kirim gambar/video lalu reply atau beri caption dengan !stiker');
            }
            break;

        // --- 2. COMMAND QUOTE CHAT (QC) ---
        case 'qc':
            const textToQuote = args.join(' ');
            if (!textToQuote) return msg.reply('Masukkan teksnya! Contoh: !qc madang yok 🗿🥛');
            msg.reply('Sedang membuat quote, mohon tunggu...');
            break;

        // --- 3. COMMAND BRAT STICKER ---
        case 'brat':
            const bratText = args.join(' ');
            if (!bratText) return msg.reply('Masukkan teks! Contoh: !sbrat halo');
            break;

        // --- 4. COMMAND BRAT VIDEO (TEXT PER KATA) ---
        case 'bratvid':
            const textVid = args.join(' ');
            if (!textVid) return msg.reply('Masukkan teksnya! Contoh: !bratvid halo apa kabar');

            const words = textVid.split(' ');
            msg.reply('Sedang memproses video Brat, mohon tunggu...');

            try {
                const videoBuffer = await generateBratVideo(words);
                const videoMedia = new MessageMedia('video/mp4', videoBuffer.toString('base64'));
                
                await client.sendMessage(msg.from, videoMedia, { 
                    sendMediaAsSticker: true,
                    stickerName: "Brat Vid Bot",
                    stickerAuthor: "Naa-chan"
                });
            } catch (error) {
                console.error(error);
                msg.reply('Gagal membuat bratvid. Pastikan FFmpeg sudah terinstal di server.');
            }
            break;

        // --- 5. COMMAND STICKER MEME ---
        case 'stikermeme':
        case 'smeme':
            const memeText = args.join(' ');
            
            if (!msg.hasMedia) {
                return msg.reply('Reply/kirim gambar dengan caption: !stikermeme teks atas | teks bawah');
            }

            msg.reply('Sedang menambahkan teks ke gambar...');

            try {
                const media = await msg.downloadMedia();
                let topText = '';
                let bottomText = '';
                
                if (memeText.includes('|')) {
                    const splitText = memeText.split('|');
                    topText = splitText[0].trim();
                    bottomText = splitText[1].trim();
                } else {
                    bottomText = memeText;
                }

                const processedImageBuffer = await drawMemeText(media.data, media.mimetype, topText, bottomText);
                const finalMedia = new MessageMedia(media.mimetype, processedImageBuffer.toString('base64'));

                await client.sendMessage(msg.from, finalMedia, { 
                    sendMediaAsSticker: true,
                    stickerName: "Meme Sticker Bot",
                    stickerAuthor: "Naa-chan"
                });
            } catch (error) {
                console.error(error);
                msg.reply('Gagal memproses gambar stiker meme.');
            }
            break;

        default:
            break;
    } // Penutup Switch
}); // Penutup Client On
