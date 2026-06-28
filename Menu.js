// Trigger command #menu
if (command === '#menu') {
    // 1. Definisikan data user (sesuaikan dengan database bot kamu)
    const senderName = msg.pushName || 'User';
    const userLimit = typeof limit !== 'undefined' ? limit : 50; 
    const userLevel = typeof level !== 'undefined' ? level : 1;

    // 2. Susun susunan teks menu
    let menuText = `┌─── 「 *INFORMASI USER* 」\n`;
    menuText += `│ Nama    : ${senderName}\n`;
    menuText += `│ Limit   : ${userLimit}\n`;
    menuText += `│ Level   : ${userLevel}\n`;
    menuText += `└─────────────────────────\n\n`;

    // ─── 「 AI TOOLS 」
    menuText += `┌─── 「 *AI TOOLS* 」\n`;
    menuText += `│ ➲ #Gemini\n`;
    menuText += `│ ➲ #Solver\n`;
    menuText += `│ ➲ #Vision\n`;
    menuText += `└─────────────────────────\n\n`;

    // ─── 「 STICKER MAKER 」
    menuText += `┌─── 「 *STICKER MAKER* 」\n`;
    menuText += `│ ➲ #Sticker\n`;
    menuText += `│ ➲ #Qc\n`;
    menuText += `│ ➲ #Iqc\n`;
    menuText += `│ ➲ #StickerMeme\n`;
    menuText += `│ ➲ #Brat\n`;
    menuText += `│ ➲ #Bratvid\n`;
    menuText += `└─────────────────────────\n\n`;

    // ─── 「 ANIME & MANGA 」
    menuText += `┌─── 「 *ANIME & MANGA* 」\n`;
    menuText += `│ ➲ #Anime\n`;
    menuText += `│ ➲ #Waifu\n`;
    menuText += `│ ➲ #Husbu\n`;
    menuText += `│ ➲ #TopAnime\n`;
    menuText += `│ ➲ #TopMale\n`;
    menuText += `│ ➲ #TopFemale\n`;
    menuText += `│ ➲ #TopSong\n`;
    menuText += `│ ➲ #WhatAnime\n`;
    menuText += `│ ➲ #Ongoing\n`;
    menuText += `└─────────────────────────\n\n`;

    // ─── 「 TOOLS 」
    menuText += `┌─── 「 *TOOLS* 」\n`;
    menuText += `│ ➲ #Rvo\n`;
    menuText += `│ ➲ #Hd\n`;
    menuText += `│ ➲ #Remini\n`;
    menuText += `│ ➲ #Recolor\n`;
    menuText += `│ ➲ #Removebg\n`;
    menuText += `│ ➲ #ToMp3\n`;
    menuText += `└─────────────────────────\n\n`;

    // ─── 「 INFORMASI 」
    menuText += `┌─── 「 *INFORMASI* 」\n`;
    menuText += `│ ➲ #JadwalSholat\n`;
    menuText += `│ ➲ #InfoGempa\n`;
    menuText += `│ ➲ #BeritaBaru\n`;
    menuText += `│ ➲ #Crypto\n`;
    menuText += `│ ➲ #Cuaca\n`;
    menuText += `└─────────────────────────\n\n`;

    // ─── 「 MESIN PENCARI 」
    menuText += `┌─── 「 *MESIN PENCARI* 」\n`;
    menuText += `│ ➲ #Lyrics\n`;
    menuText += `│ ➲ #Lens\n`;
    menuText += `│ ➲ #CariLagu\n`;
    menuText += `│ ➲ #Image\n`;
    menuText += `│ ➲ #Quotes\n`;
    menuText += `│ ➲ #Pinterest\n`;
    menuText += `└─────────────────────────\n\n`;

    // ─── 「 MENU BOT 」
    menuText += `┌─── 「 *MENU BOT* 」\n`;
    menuText += `│ ➲ #Setclub\n`;
    menuText += `│ ➲ #Shop\n`;
    menuText += `│ ➲ #Level\n`;
    menuText += `│ ➲ #SetName\n`;
    menuText += `│ ➲ #Owner\n`;
    menuText += `└─────────────────────────\n\n`;

// ─── 「 MENU GRUP 」
    menuText += `┌─── 「 *MENU GRUP* 」\n`;
    menuText += `│ ➲ #Open\n`;
    menuText += `│ ➲ #Close\n`;
    menuText += `│ ➲ #Kick\n`;
    menuText += `│ ➲ #Hidetag\n`;
    menuText += `│ ➲ #Topchat\n`;
    menuText += `│ ➲ #Delete\n`;
    menuText += `│ ➲ #Topcoin\n`;
    menuText += `│ ➲ #Linkgrup\n`;
    menuText += `│ ➲ #Afk\n`;
    menuText += `└─────────────────────────\n\n`;

// ─── 「 DOWNLOAD 」
    menuText += `┌─── 「 *DOWNLOAD* 」\n`;
    menuText += `│ ➲ #Tiktok\n`;
    menuText += `│ ➲ #Youtube\n`;
    menuText += `│ ➲ #Facebook\n`;
    menuText += `│ ➲ #Instagram\n`;
    menuText += `│ ➲ #Play\n`;
    menuText += `└─────────────────────────\n\n`;

// ─── 「 FUN 」
    menuText += `┌─── 「 *FUN* 」\n`;
    menuText += `│ ➲ #Mancing\n`;
    menuText += `│ ➲ #Berburu\n`;
    menuText += `│ ➲ #Tebakkata\n`;
    menuText += `│ ➲ #Susunkata\n`;
    menuText += `│ ➲ #Tic Tac Toe\n`;
    menuText += `└─────────────────────────\n\n`;
