// Trigger command #menu
if (command === '#menu') {
    // 1. Definisikan data user (sesuaikan dengan database bot kamu)
    const senderName = msg.pushName || 'User';
    const userLimit = typeof limit !== 'undefined' ? limit : 999; 
    const userLevel = typeof level !== 'undefined' ? level : 1;

    // 2. Susun susunan teks menu
    let menuText = `┌─── 「 *INFORMASI USER* 」\n`;
    menuText += `│ Nama    : ${senderName}\n`;
    menuText += `│ Limit   : ${userLimit}\n`;
    menuText += `│ Level   : ${userLevel}\n`;
    menuText += `└─────────────────────────\n\n`;

    // ─── 「 MENU LAINNYA 」
    menuText += `┌─── 「 *MENU LAINNYA* 」\n`;
    menuText += `│ ➲ #Language\n`;
    menuText += `│ ➲ #MenuGrup\n`;
    menuText += `│ ➲ #MenuGame\n`;
    menuText += `│ ➲ #Download\n`;
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
    menuText += `│ ➲ #Toimage\n`;
    menuText += `│ ➲ #StickerMeme\n`;
    menuText += `└─────────────────────────\n\n`;

    // ─── 「 AI PROCESSING 」
    menuText += `┌─── 「 *AI PROCESSING* 」\n`;
    menuText += `│ ➲ #Hd\n`;
    menuText += `│ ➲ #Recolor\n`;
    menuText += `│ ➲ #RemoveBG\n`;
    menuText += `│ ➲ #Diffusion\n`;
    menuText += `│ ➲ #Zimage\n`;
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

    // ─── 「 UTILITAS/TOOLS 」
    menuText += `┌─── 「 *UTILITAS/TOOLS* 」\n`;
    menuText += `│ ➲ #MenuBrat\n`;
    menuText += `│ ➲ #Math\n`;
    menuText += `│ ➲ #Lyric\n`;
    menuText += `│ ➲ #Brainly\n`;
    menuText += `│ ➲ #Quotes\n`;
    menuText += `│ ➲ #Translate\n`;
    menuText += `│ ➲ #ToMp3\n`;
    menuText += `└─────────────────────────\n\n`;

    // ─── 「 INFORMASI 」
    menuText += `┌─── 「 *INFORMASI* 」\n`;
    menuText += `│ ➲ #JadwalSholat\n`;
    menuText += `│ ➲ #InfoGempa\n`;
    menuText += `│ ➲ #BeritaBaru\n`;
    menuText += `│ ➲ #InfoKurs\n`;
    menuText += `│ ➲ #Crypto\n`;
    menuText += `│ ➲ #Cuaca\n`;
    menuText += `└─────────────────────────\n\n`;

    // ─── 「 MESIN PENCARI 」
    menuText += `┌─── 「 *MESIN PENCARI* 」\n`;
    menuText += `│ ➲ #YtSearch\n`;
    menuText += `│ ➲ #Lens\n`;
    menuText += `│ ➲ #CariLagu\n`;
    menuText += `│ ➲ #Image\n`;
    menuText += `│ ➲ #Fact\n`;
    menuText += `└─────────────────────────\n\n`;

    // ─── 「 MENU BOT 」
    menuText += `┌─── 「 *MENU BOT* 」\n`;
    menuText += `│ ➲ #Setclub\n`;
    menuText += `│ ➲ #Shop\n`;
    menuText += `│ ➲ #Delete\n`;
    menuText += `│ ➲ #Level\n`;
    menuText += `│ ➲ #TopCoin\n`;
    menuText += `│ ➲ #SetName\n`;
    menuText += `│ ➲ #Owner\n`;
    menuText += `└─────────────────────────\n\n`;
    
