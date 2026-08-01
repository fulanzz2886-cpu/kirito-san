const {
  default: makeWASocket,
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  Browsers
} = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const readline = require('readline');
const config = require('./config');
const { Boom } = require('@hapi/boom');
const fs = require('fs');
const pino = require('pino');
const logger = pino({ level: 'error' });

const { jalankanPerintah, normNomor } = require('./cmd');
const { cekPeringatanTidur } = require('./bot');
const { cekReplyDaftar } = require('./user');

global.waktuMulaiBot = Date.now();
global.versiWaBot = 'ʏᴜᴜᴋɪ ᴠ0.5';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const tanya = (t) => new Promise(r => rl.question(t, r));

async function mulaiBot() {
  const { state, saveCreds } = await useMultiFileAuthState('session-wibu');
  const { version, isLatest } = await fetchLatestBaileysVersion();
  console.log(`✨ WA Web v${version.join('.')} (${isLatest ? 'TERBARU' : 'BISA UPDATE'})`);

  let modeAuth = 'qr';
  let nomorPairing = '';
  let tampilQR = true;
  let sudahMintaKode = false;

  if (!state.creds.registered) {
    console.log('\n🔐 LOGIN BOT: [1] QR Code   [2] Pairing Code (TANPA SCAN)');
    const p = await tanya('Pilih (1/2): ');
    if (p.trim() === '2') {
      modeAuth = 'pairing';
      tampilQR = false;
      while (!nomorPairing) {
        const i = await tanya('Nomor WA bot (08xx / 62xx): ');
        const n = normNomor(i);
        n.length >= 10 ? nomorPairing = n : console.log('❌ Nomor tidak valid');
      }
      console.log(`\n📱 Mode Pairing Code | Nomor: ${nomorPairing}`);
    } else {
      console.log('\n📱 Mode QR Code, silakan scan nanti');
    }
  } else {
    console.log('\n🔄 Pakai sesi login lama...');
  }

  const sock = makeWASocket({
    logger: logger,
    auth: state,
    version,
    browser: Browsers.ubuntu('Chrome'),
    defaultQueryTimeoutMs: 60000,
    keepAliveIntervalMs: 10000,
    connectTimeoutMs: 30000,
    printQRInTerminal: tampilQR,
    syncFullHistory: false,
    emitOwnEvents: true
  });

  sock.ev.on('messages.upsert', async (m) => {
    try {
      const msg = m.messages[0];
      if (!msg || msg.key.remoteJid === 'status@broadcast' || !msg.message) return;

      const mm = msg.message;
      const teks = mm.conversation || mm.extendedTextMessage?.text || mm.imageMessage?.caption || mm.videoMessage?.caption || '';
      if (!teks) return;

      const tujuan = msg.key.remoteJid;
      const pengirim = (msg.key.participant || msg.participant || tujuan || '').split('@')[0].split(':')[0];
      const owner = normNomor(config.ownerNumber || '');
      const nomorBotSendiri = normNomor(sock.user.id.split('@')[0].split(':')[0]);
      const dariMe = msg.key.fromMe;
      const iniOwner = dariMe || (pengirim === owner) || (pengirim === nomorBotSendiri);
      const iniGrup = tujuan.endsWith('@g.us');

      const balas = async (t) => {
        try {
          await sock.sendMessage(tujuan, { text: t }, { quoted: msg });
        } catch (e) {
          console.log('❌ Gagal mengirim pesan:', e.message);
        }
      };

      await cekPeringatanTidur(sock, pengirim, tujuan);

      if (mm.extendedTextMessage?.contextInfo?.quotedMessage) {
        const sudah = await cekReplyDaftar(sock, msg, tujuan, pengirim, teks, balas);
        if (sudah) return;
      }

      if (config.botMode === 'private' && !iniOwner) return;

      const prefixes = config.prefixes || ['.'];
      const pakaiPrefix = prefixes.some(p => teks.startsWith(p));
      if (!pakaiPrefix) {
        if (!iniGrup && iniOwner && !dariMe) {
          await balas(`Halo Sensei! Ketik *${prefixes[0]}menu* buat buka menu utama ya~`);
        }
        return;
      }

      const p = prefixes.find(x => teks.startsWith(x));
      const cmdNama = teks.slice(p.length).split(' ')[0].toLowerCase();
      const arg = teks.slice(p.length + cmdNama.length).trim();

      await jalankanPerintah({
        sock, msg, tujuan, pengirim, owner, iniOwner, iniGrup,
        cmd: cmdNama, arg, prefix: p, balas
      });

    } catch (e) {
      console.log('❌ Err:', e.message);
    }
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (upd) => {
    const { connection, qr, lastDisconnect } = upd;
    if (qr && modeAuth === 'qr') {
      qrcode.generate(qr, { small: true });
      console.log('⚠️ Scan segera!');
    }
    if (connection === 'open') {
      console.log('\n✅ YUUKI AKTIF & TERHUBUNG! 🎉');
      try {
        const s = normNomor(sock.user.id.split('@')[0].split(':')[0]);
        await sock.sendMessage(`${s}@s.whatsapp.net`, { text: config.welcomeMessage });
      } catch (e) {}
      try {
        if (require('./bot').mulaiScheduler) {
          require('./bot').mulaiScheduler(sock);
        }
      } catch (e) {}
    }
    if (connection === 'close') {
      const err = lastDisconnect?.error;
      const kode = err instanceof Boom ? err.output.statusCode : (err?.output?.statusCode || 999);
      const alasan = Object.keys(DisconnectReason).find(k => DisconnectReason[k] === kode) || 'UNKNOWN';
      console.log(`\n⚠️ Terputus: ${alasan} (${kode})`);
      if (kode === DisconnectReason.loggedOut) {
        console.log('❌ Logout! Hapus session-wibu lalu ulangi.');
        if (fs.existsSync('session-wibu')) {
          fs.rmSync('session-wibu', { recursive: true, force: true });
        }
        rl.close();
        process.exit(0);
      }
      const autoRestart = [408, 428, 515, 503].includes(kode);
      setTimeout(() => mulaiBot(), autoRestart ? 3000 : 5000);
    }
  });

  if (modeAuth === 'pairing' && !state.creds.registered) {
    if (!global.pairingListenerRegistered) {
      global.pairingListenerRegistered = true;

      sock.ev.on('connection.update', async (upd) => {
        const { connection } = upd;

        if (connection === 'connecting' && !sudahMintaKode && nomorPairing) {
          sudahMintaKode = true;
          console.log('🔗 Koneksi tersambung. Menunggu 10 detik agar sistem Baileys siap...');
          await new Promise(r => setTimeout(r, 10000));
          try {
            await sock.sendPresenceUpdate('unavailable');
          } catch (e) {}

          for (let coba = 1; coba <= 3; coba++) {
            try {
              console.log(`   🧪 Percobaan ${coba}/3 meminta kode pairing...`);
              const jawabanWA = await Promise.race([
                sock.requestPairingCode(nomorPairing),
                new Promise((_, rj) => setTimeout(() => rj(new Error('Timeout dari WhatsApp')), 40000))
              ]);
              let kodeMurni = '';
              if (typeof jawabanWA === 'string') {
                kodeMurni = jawabanWA.replace(/[^0-9A-Za-z]/g, '');
              } else if (jawabanWA && typeof jawabanWA === 'object') {
                const codeField = jawabanWA.code || jawabanWA.pairingCode || Object.values(jawabanWA).find(v => typeof v === 'string' && v.length === 8);
                if (codeField) {
                  kodeMurni = codeField.replace(/[^0-9A-Za-z]/g, '');
                }
              }

              if (!kodeMurni || kodeMurni.length !== 8) {
                throw new Error(`Format kode tidak valid (didapat: ${kodeMurni || 'kosong'})`);
              }

              const kodeRapi = kodeMurni.slice(0, 4) + '-' + kodeMurni.slice(4);

              console.log('\n' + '═'.repeat(45));
              console.log('✅ KODE PAIRING BERHASIL DIDAPATKAN!');
              console.log('═'.repeat(45));
              console.log(`📋 KODE ANDA:  <<< ${kodeMurni} >>>`);
              console.log(`👀 MUDAH DIBACA: ${kodeRapi}`);
              console.log('═'.repeat(45));
              console.log('📲 Silakan masukkan kode di atas pada WhatsApp Anda.\n');
              break;
            } catch (e) {
              console.log(`   ⚠️ Gagal pada percobaan ${coba}: ${e.message}`);
              if (coba < 3) {
                const jeda = coba * 20;
                console.log(`   ⏳ Menunggu ${jeda} detik sebelum mencoba kembali...\n`);
                await new Promise(r => setTimeout(r, jeda * 1000));
              } else {
                console.log('\n❌ Gagal mendapatkan kode setelah 3x percobaan.');
                sudahMintaKode = false;
              }
            }
          }
        }
      });
    }
  }
}

mulaiBot().catch(e => {
  console.log('❌ FATAL:', e.message);
  process.exit(1);
});
