const config = require('./config');
const moment = require('moment-timezone');
const fs = require('fs');

const SETTING = {
  bannerUrl: 'https://files.catbox.moe/a0gioz.jpg',
  bannerLokal: './yuuki sorimachi.jpg',
  sourceUrl: 'https://whatsapp.com/channel/0029VbAov1MJ93wP1BTWXk1N',
  kredit: 'WhatsApp Bot by Bang Dimzz',
  zonaWaktu: 'Asia/Jakarta',
  namaBot: 'YUUKI SORIMACHI MD',
  author: 'BANG DIMZZ',
  database: 'FILE SYSTEM',
  library: '@whiskeysockets/baileys'
};

// Helper untuk mengubah teks biasa menjadi Small Caps
function toSmallCaps(text) {
  const standard = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const smallCaps = "ᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ";
  return text.split('').map(char => {
    const idx = standard.indexOf(char);
    return idx !== -1 ? smallCaps[idx] : char;
  }).join('');
}

function hariPasaranJawa(tgl) {
  const p = ['PON','WAGE','KLIWON','LEGI','PAHING'];
  const o = new Date('2024-01-01T00:00:00+07:00');
  return p[((Math.floor((tgl-o)/86400000)%5)+5)%5];
}
const HARI = ['MINGGU','SENIN','SELASA','RABU','KAMIS','JUMAT','SABTU'];
const BULAN = ['JANUARI','FEBRUARI','MARET','APRIL','MEI','JUNI','JULI','AGUSTUS','SEPTEMBER','OKTOBER','NOVEMBER','DESEMBER'];
function sapa(j){return j<10?'OHAYOU':j<17?'KONNICHIWA':'KONBANWA';}
function pad(n){return String(n).padStart(2,'0');}
function rt(d){const h=Math.floor(d/3600),m=Math.floor(d%3600/60),s=Math.floor(d%60);return `${pad(h)}:${pad(m)}:${pad(s)}`;}

function buatMainMenu(data) {
  const { nomorUser, namaUser } = data;
  const t1 = Date.now();
  const skg = moment().tz(SETTING.zonaWaktu).toDate();

  let nmr = String(nomorUser||'').replace(/\D/g,'');
  if (nmr.startsWith('1') && nmr.length===12) nmr = '62'+nmr.slice(1);
  if (nmr.startsWith('0')) nmr = '62'+nmr.slice(1);
  if (!nmr.startsWith('62') && nmr.length<=12) nmr = '62'+nmr;
  const tag = nmr ? `@${nmr}` : 'SENPAI';
  const nama = namaUser || 'SENPAI';

  const psr = hariPasaranJawa(skg);
  const hri = HARI[skg.getDay()];
  const bln = BULAN[skg.getMonth()];
  const tgl = skg.getDate();
  const thn = skg.getFullYear();
  const jam = `${pad(skg.getHours())}:${pad(skg.getMinutes())}:${pad(skg.getSeconds())} WIB`;

  const judulKartu = `© ${SETTING.namaBot}`;
  const bodyKartu = `${hri} ${psr} • ${tgl} ${bln}`; // ✅ MAKS 25 KARAKTER

  const sapaan = `${sapa(skg.getHours())} [ ${tag} ] 😊
${toSmallCaps("Watashi namanya")} *YUUKI-CHAN*, ${toSmallCaps("bot whatsapp buatan bang dimzz yang asik, kece, dan selalu siap membantu senpai")} 😎
${toSmallCaps("Maaf ya kalo ada yang error atau belum rapi, namanya juga masih tahap percobaan wkwk~")}
${toSmallCaps("Arigatou gozaimasu sudah mau pakai bot ini nee")} 💖`;

  // Menu list yang diubah ke Small Caps agar estetik
  const info = `
• DATABASE : ${SETTING.database}
• LIBRARY  : ${SETTING.library}
• AUTHOR   : ${SETTING.author}
• UPTIME   : ${rt(Math.floor((Date.now()-(global.waktuMulaiBot||Date.now()))/1000))}
• DAY      : ${hri} ${psr}
• DATE     : ${tgl} ${bln} ${thn}
• TIME     : ${jam}
• MODE     : ${(config.botMode==='public'?'PUBLIC':'PRIVATE')}
• SPEED    : ${Date.now()-t1}MS
• VERSI    : ${global.versiWaBot||'LATEST'}

${toSmallCaps(`┌  ◦  .menu ai
│  ◦  #menu anime
│  ◦  #menu bot
│  ◦  #menu download
│  ◦  #menu fun
│  ◦  #menu game
│  ◦  #menu grup
│  ◦  #menu owner
│  ◦  #menu random
│  ◦  #menu rpg
│  ◦  #menu user info
└  ◦  #menu tools`)}

👤 ${toSmallCaps("PENGGUNA")} : *${nama}* ( ${nmr||'-'} )

> ${SETTING.sourceUrl}
> *${SETTING.kredit}*
`.trim();

  // Kita kembalikan objek berisi pesan Teks Menu DAN pesan Audio
  return {
    menuMessage: {
      text: `${sapaan}\n\n${info}`,
      mentions: nmr ? [`${nmr}@s.whatsapp.net`] : [],
      contextInfo: {
        externalAdReply: {
          title: judulKartu,
          body: bodyKartu,
          thumbnailUrl: SETTING.bannerUrl,
          sourceUrl: SETTING.sourceUrl,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    },
    audioMessage: {
      audio: { url: './yuukibot.mp3' },
      mimetype: 'audio/mp4',
      ptt: true // true agar terkirim sebagai voice note (VN), false jika ingin sebagai audio biasa
    }
  };
}

module.exports = { buatMainMenu };
