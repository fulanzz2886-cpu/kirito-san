const { tampilkanSubMenu } = require('./menu');
const config = require('./config');
const { buatMainMenu } = require('./main');
const fs = require('fs');
const path = require('path');

const { cekPerintahBot, cekPerintahDownload, dapatkanPlatform, cekPerintahUser } = require('./handler');

const downloader = require('./download'); 

function normNomor(n) {
  if (!n) return '';
  let x = String(n).replace(/\D/g, '');
  if (x.startsWith('0')) x = '62' + x.slice(1);
  if (x.length === 12 && !x.startsWith('62')) x = '62' + x;
  if (x.length > 14) x = x.slice(-12);
  if (x.length === 13 && !x.startsWith('62')) x = '62' + x.slice(1);
  if (!x.startsWith('62') && x.length <= 12) x = '62' + x;
  return x;
}

function simpanMode(mode) {
  try {
    let c = fs.readFileSync('./config.js', 'utf8');
    const rx = /botMode\s*:\s*["'](.+?)["']/;
    if (!rx.test(c)) return false;
    fs.writeFileSync('./config.js', c.replace(rx, `botMode: "${mode}"`), 'utf8');
    config.botMode = mode;
    return true;
  } catch { return false; }
}

async function jalankanPerintah(data) {
  const { sock, msg, tujuan, pengirim, owner, iniOwner, cmd, arg, prefix, balas } = data;
  const nomorBenar = normNomor(pengirim);
  const commandKecil = cmd.toLowerCase();

  const jalanBot = await cekPerintahBot({ ...data, nomorBenar });
  if (jalanBot) return;

  const platform = dapatkanPlatform(commandKecil);
  if (platform) {
    const link = arg ? arg.trim() : '';

    console.log('\n🔍 [DOWNLOAD MASUK] =================================');
    console.log('cmd     :', commandKecil);
    console.log('platform:', platform);
    console.log('arg     :', JSON.stringify(arg));
    console.log('link    :', JSON.stringify(link));
    console.log('====================================================\n');

    if (!downloader.cekYtDlp()) {
      return balas(`❌ ʏᴛ-ᴅʟᴘ ʙᴇʟᴜᴍ ᴅɪɪɴꜱᴛᴀʟʟ!
> pkg install -y python ffmpeg
> pip install -U yt-dlp`);
    }

    if (!link || !/^https?:\/\//i.test(link)) {
      return balas(`⚠️ ᴍᴀꜱᴜᴋᴋᴀɴ ʟɪɴᴋ ɴʏᴀ ʏᴀ~
ᴄᴏɴᴛᴏʜ: ${prefix}${cmd} ʜᴛᴛᴘꜱ://...`);
    }

    const idProses = await sock.sendMessage(tujuan, { text: downloader.pesanProses() }, { quoted: msg });
    const semuaFile = [];

    try {
      const meta = await downloader.ambilMeta(link);
      console.log('✅ meta didapat, judul:', meta?.title || '-');

      const teks = downloader.buatFormatTeks(platform, meta);

      // JIKA PENGGUNA MEMINTA HANYA AUDIO (Spotify, MP3, SoundCloud)
      if (['spotify', 'ytmp3', 'soundcloud'].includes(platform)) {
        const hasil = await downloader.downloadSemua(link, platform);
        console.log('✅ download audio selesai');
        
        if (hasil.audio[0]) {
          semuaFile.push(...hasil.gambar, ...hasil.video, ...hasil.audio);
          try { await sock.sendMessage(tujuan, { delete: idProses.key }); } catch {}
          await sock.sendMessage(tujuan, { 
            audio: fs.readFileSync(hasil.audio[0]), 
            caption: teks, 
            mimetype: 'audio/mpeg', 
            ptt: false 
          }, { quoted: msg });
        } else {
          throw new Error('ᴀᴜᴅɪᴏ ᴛɪᴅᴀᴋ ᴅɪᴛᴇᴍᴜᴋᴀɴ~');
        }
      } 
      // JIKA PENGGUNA MEMINTA VIDEO (TikTok, YouTube Video, IG, dll)
      // Bot akan mengirimkan VIDEO sekaligus AUDIO secara bersamaan!
      else {
        console.log('⚡ Mengunduh video dan audio secara paralel...');
        const hasil = await downloader.downloadVideoDanAudio(link);
        
        if (hasil.video) semuaFile.push(hasil.video);
        if (hasil.audio) semuaFile.push(hasil.audio);
        if (hasil.gambar) semuaFile.push(...hasil.gambar);

        try { await sock.sendMessage(tujuan, { delete: idProses.key }); } catch {}

        // 1. Kirim Gambar jika ada (misalnya slide gambar TikTok)
        if (hasil.gambar && hasil.gambar.length) {
          for (let i = 0; i < hasil.gambar.length; i++) {
            const f = hasil.gambar[i];
            const ext = path.extname(f).toLowerCase().slice(1);
            await sock.sendMessage(tujuan, {
              image: fs.readFileSync(f),
              caption: i === 0 ? teks : '',
              mimetype: `image/${ext === 'jpg' ? 'jpeg' : ext}`
            }, { quoted: i === 0 ? msg : undefined });
            await new Promise(r => setTimeout(r, 600));
          }
        }

        // 2. Kirim File Video
        if (hasil.video) {
          const ext = path.extname(hasil.video).toLowerCase().slice(1);
          await sock.sendMessage(tujuan, {
            video: fs.readFileSync(hasil.video),
            caption: hasil.gambar && hasil.gambar.length ? '' : teks,
            mimetype: `video/${ext}`
          }, { quoted: msg });
        }

        // 3. Kirim File Audio (Secara bersamaan di bawah video!)
        if (hasil.audio) {
          await sock.sendMessage(tujuan, {
            audio: fs.readFileSync(hasil.audio),
            caption: `🎵 ꜱᴏᴜɴᴅ / ᴍᴜꜱɪᴋ\n✨ ʙʏ ʏᴜᴜᴋɪ-ᴄʜᴀɴ`,
            mimetype: 'audio/mpeg', 
            ptt: false
          }, { quoted: msg });
        }
      }

      // Hapus file sementara agar storage tidak penuh
      downloader.hapusSemuaFile(semuaFile);
      console.log('✅ SEMUA BERHASIL DIKIRIM\n');
    } catch (e) {
      console.log('\n❌ [ERROR DOWNLOAD SEBENARNYA] ======================');
      console.log('Pesan  :', e.message);
      console.log('Stack  :', (e.stack || '').split('\n').slice(0, 4).join('\n'));
      console.log('====================================================\n');

      try { await sock.sendMessage(tujuan, { delete: idProses.key }); } catch {}
      balas(`❌ ᴇʀʀᴏʀ: ${e.message || 'ɢᴀɢᴀʟ ᴅɪᴘʀᴏꜱᴇꜱ'}`);
      downloader.hapusSemuaFile(semuaFile);
    }
    return;
  }

  // ✅ BARU: CEK FITUR USER DARI user.js (DAFTAR, RANK, TOKO DLL)
  const jalanUser = await cekPerintahUser({ ...data, nomorBenar });
  if (jalanUser) return;

  switch (commandKecil) {

    case 'help': {
      let h = '📚 PERINTAH YUUKI:\n\n';
      for (const [c, d] of Object.entries(config.commands)) h += `• ${prefix}${c} → ${d}\n`;
      h += `\n✨ Mode: ${config.botMode}`;
      await balas(h);
      break;
    }

    case 'menu': {
      if (!arg) {
        const nomorUser = nomorBenar;
        let namaUser = 'ꜱᴇɴᴘᴀɪ';
        try {
          const namaWA = msg.pushName || sock.user?.name || msg.verifiedBizName || '';
          if (namaWA && namaWA.trim().length > 0) namaUser = namaWA.trim();
        } catch (e) { console.log(e); }

        const data = { nomorUser, namaUser };
        const { menuMessage, audioMessage } = buatMainMenu(data);
        await sock.sendMessage(tujuan, menuMessage, { quoted: msg });
        if (audioMessage) await sock.sendMessage(tujuan, audioMessage, { quoted: msg });
        return;
      }
      await balas(tampilkanSubMenu(arg.trim().toLowerCase()));
      break;
    }

    case 'halo': {
      await balas(`Haaaaalo Sensei ${nomorBenar}! ٩(◕‿◕)۶ Semoga harimu super menyenangkan yaa~`);
      break;
    }

    case 'info': {
      await balas(`ℹ️ TENTANG YUUKI-CHAN:\n• Nama: ${config.botName}\n• Owner: ${owner}\n• Mode: ${config.botMode}\n• Dibuat dengan 💖`);
      break;
    }

    case 'mode': {
      if (!iniOwner) return balas('Maaf Sensei~ Cuma Owner yang boleh ganti mode bot nih! (◕︵◕)');
      const m = arg.toLowerCase();
      if (!['public','private'].includes(m)) return balas(`Cara pakai: ${prefix}mode public  ATAU  ${prefix}mode private`);
      await balas(simpanMode(m)
        ? `✅ Berhasil! Mode bot diganti jadi *${m}* nih Sensei!`
        : `❌ Gagal ganti mode, cek file config.js ya~`
      );
      break;
    }

    default: {
      await balas(`Eh? Perintah *${prefix}${cmd}* itu Yuuki-chan nggak ngerti deh (◕︵◕) Ketik ${prefix}menu ya~`);
    }
  }
}

module.exports = { jalankanPerintah, normNomor };
