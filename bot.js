const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const config = require('./config');
const userMod = require('./user');

const { sc, deteksiGender, panggilanGender } = config;

const FILE_DATA = path.join(__dirname, 'data_user.json');
const TMP = require('os').tmpdir();

const ZONA = {
  wib:  7,
  wita: 8,
  wit:  9
};

function bacaData(){try{return JSON.parse(fs.readFileSync(FILE_DATA,'utf8'));}catch(e){return {};}}
function tulisData(d){fs.writeFileSync(FILE_DATA,JSON.stringify(d,null,2),'utf8');}
function getUser(nomor){
  const d=bacaData();
  if(!d[nomor])d[nomor]={nama:'',gender:'-',sleep:null,sleepNotified:false,level:1,xp:0,gabung:Date.now()};
  tulisData(d);return d[nomor];
}
function saveUser(nomor,obj){const d=bacaData();d[nomor]={...getUser(nomor),...obj};tulisData(d);}

function hitungRuntime(){
  const ms=Date.now()-(global.waktuMulaiBot||Date.now());
  const d=Math.floor(ms/86400000),h=Math.floor((ms%86400000)/3600000),m=Math.floor((ms%3600000)/60000),s=Math.floor((ms%60000)/1000);
  return `${d>0?d+'ᴅ ':''}${h>0?h+'ʜ ':''}${m>0?m+'ᴍ ':''}${s}ꜱ`.trim();
}
function pad(n){return String(n).padStart(2,'0');}

function jamSekarang(offset){
  const d=new Date(Date.now()+offset*3600000);
  return {
    h: d.getUTCHours(),
    m: d.getUTCMinutes(),
    key: `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`
  };
}

function dalamJamTidur(sekarang, mulai, selesai){
  const s=mulai.h*60+mulai.m, e=selesai.h*60+selesai.m, n=sekarang.h*60+sekarang.m;
  if(s<=e) return n>=s && n<e;
  return n>=s || n<e;
}

function pesanTidur(dataUser){
  const p = panggilanGender(dataUser);
  return `😴 ꜱᴜᴅᴀʜ ᴡᴀᴋᴛᴜɴʏᴀ ᴛɪᴅᴜʀ ɴɪʜ, ${p}~
ᴊᴀɴɢᴀɴ ʙᴇɢᴀᴅᴀɴɢ ᴋᴀꜱɪᴀɴ ᴛᴜʙᴜʜᴍᴜ,
ɴᴀɴᴛɪ ɢᴀᴍᴘᴀɴɢ ᴄᴀᴘᴇᴋ ʟʜᴏ 💖
ᴍᴀᴛɪᴋᴀɴ ʜᴘ ʏᴀ, ꜱᴇʟᴀᴍᴀᴛ ᴛɪᴅᴜʀ ✨`;
}

function mulaiScheduler(sock){
  setInterval(async () => {
    try {
      const data = userMod.baca(userMod.FILE_DATA||FILE_DATA,{});
      for (const [nomor, u] of Object.entries(data)) {
        if (!u?.sleep?.mulai) continue;
        const offset = ZONA[u.sleep.zona?.toLowerCase()] || 7;
        const skg = jamSekarang(offset);
        const mulai = { h: u.sleep.mulai[0], m: u.sleep.mulai[1] };
        const selesai = { h: u.sleep.selesai[0], m: u.sleep.selesai[1] };
        if (dalamJamTidur(skg, mulai, selesai)) {
          if (!u.sleepNotified) {
            userMod.saveUser(nomor, { sleepNotified: true });
            try { await sock.sendMessage(`${nomor}@s.whatsapp.net`, { text: pesanTidur(u) }); } catch {}
          }
        } else {
          if (u.sleepNotified) userMod.saveUser(nomor, { sleepNotified: false });
        }
      }
    } catch {}
  }, 60000);
}

const fitur = {

  ping: async ({ balas, t1 }) => balas(`🏓 ᴘᴏɴɢ !\nᴋᴇᴄᴇᴘᴀᴛᴀɴ : ${Date.now() - t1}ᴍꜱ`),

  delete: async ({ sock, msg, tujuan, balas, iniOwner }) => {
    if (!iniOwner) return balas('⚠️ ᴄᴜᴍᴀ ᴏᴡɴᴇʀ!');
    const cx = msg.message?.extendedTextMessage?.contextInfo;
    if (!cx?.stanzaId) return balas('💡 ʀᴇᴘʟʏ ᴘᴇꜱᴀɴ ʏᴀɴɢ ᴍᴀᴜ ᴅɪʜᴀᴘᴜꜱ!');
    try {
      await sock.sendMessage(tujuan, { delete: { remoteJid: tujuan, id: cx.stanzaId, participant: cx.participant, fromMe: !cx.participant }});
      balas('✅ ᴅᴏɴᴇ!');
    } catch(e){ balas(`❌ ${e.message}`); }
  },

  level: async ({ pengirim, balas }) => {
    const u = getUser(pengirim);
    const sl = u.sleep ? `${pad(u.sleep.mulai[0])}.${pad(u.sleep.mulai[1])}-${pad(u.sleep.selesai[0])}.${pad(u.sleep.selesai[1])} ${u.sleep.zona.toUpperCase()}` : '-';
    return balas(`📊 ᴘʀᴏꜰɪʟ ᴋᴀᴍᴜ
┌  ʟᴇᴠᴇʟ : ${u.level}
│  ᴇxᴘ   : ${u.xp} / ${u.level*100}
│  ɴᴀᴍᴀ  : ${u.nama || '-'}
│  ᴊᴋ    : ${u.gender}
└  ᴛɪᴅᴜʀ : ${sl}`);
  },

  logout: async ({ iniOwner, balas }) => {
    if (!iniOwner) return balas('⚠️ ᴋʜᴜꜱᴜꜱ ᴏᴡɴᴇʀ!');
    try {
      if (fs.existsSync('./session-wibu')) fs.rmSync('./session-wibu',{recursive:true,force:true});
      balas('✅ ꜱᴇꜱɪ ᴅɪʜᴀᴘᴜꜱ!');
      setTimeout(()=>process.exit(0),1500);
    } catch(e){ balas(`❌ ${e.message}`); }
  },

  owner: async ({ balas }) => balas(`👑 ᴏᴡɴᴇʀ\n┌  ɴᴀᴍᴀ : ${config.ownerName||'ʙᴀɴɢ ᴅɪᴍᴢᴢ'}\n│  ɴᴏ   : ${config.ownerNumber||'-'}\n└  ᴡᴀ   : https://wa.me/${config.ownerNumber||''}`),

  setname: async ({ pengirim, arg, balas }) => {
    if (!arg) return balas('💡 ᴄᴀʀᴀ: .ꜱᴇᴛɴᴀᴍᴇ ɴᴀᴍᴀ ᴋᴀᴍᴜ');
    saveUser(pengirim,{nama:arg.slice(0,30)});
    balas(`✅ ɴᴀᴍᴀ: *${arg.slice(0,30)}*`);
  },

  setgender: async ({ pengirim, arg, balas }) => {
    const g=arg.toLowerCase().trim();
    if(!['ʟ','ᴘ','ʟᴀᴋɪ','ᴘᴇʀᴇᴍᴘᴜᴀɴ','cowok','cewek','l','p'].includes(g))return balas('💡 ᴄᴀʀᴀ: .ꜱᴇᴛɢᴇɴᴅᴇʀ ʟ / ᴘ');
    saveUser(pengirim,{gender:g.startsWith('l')||g==='cowok'?'👦 ʟᴀᴋɪ-ʟᴀᴋɪ':'👧 ᴘᴇʀᴇᴍᴘᴜᴀɴ'});
    balas('✅ ᴊᴇɴɪꜱ ᴋᴇʟᴀᴍɪɴ ᴅɪꜱɪᴍᴘᴀɴ!');
  },

  setsleep: async ({ pengirim, arg, balas }) => {
    const nmr = userMod.normNomor ? userMod.normNomor(pengirim) : String(pengirim).replace(/\D/g,'');
    const u = userMod.getUser(nmr);
    if (!u.terdaftar) return balas(`⚠️ ᴋᴀᴍᴜ ʙᴇʟᴜᴍ ᴅᴀꜰᴛᴀʀ!
ꜱɪʟᴀʜᴋᴀɴ ᴅᴀꜰᴛᴀʀ ᴅᴜʟᴜ ᴘᴀᴋᴇ:
  .ᴅᴀꜰᴛᴀʀ

ʙᴀʀᴜ ʙɪꜱᴀ ᴘᴀᴋᴇ ꜰɪᴛᴜʀ ᴛɪᴅᴜʀ ɪɴɪ~ 💤`);

    const rx = /^(\d{1,2})\.(\d{1,2})-(\d{1,2})\.(\d{1,2})\s*(WIB|WITA|WIT)$/i.exec(arg.trim());
    if (!rx) return balas(`💡 ꜰᴏʀᴍᴀᴛ ꜱᴀʟᴀʜ!
ᴄᴏɴᴛᴏʜ ʏᴀɴɢ ʙᴇɴᴀʀ:
  .ꜱᴇᴛꜱʟᴇᴇᴘ 21.00-02.55 WIB
  .ꜱᴇᴛꜱʟᴇᴇᴘ 22.30-04.00 WITA
  .ꜱᴇᴛꜱʟᴇᴇᴘ 23.00-05.00 WIT

ᴢᴏɴᴀ: WIB (+7) · WITA (+8) · WIT (+9)`);
    const j1=parseInt(rx[1]),m1=parseInt(rx[2]),j2=parseInt(rx[3]),m2=parseInt(rx[4]),zona=rx[5].toLowerCase();
    if(j1>23||j2>23||m1>59||m2>59) return balas('❌ ᴊᴀᴍ ᴀᴛᴀᴜ ᴍᴇɴɪᴛ ᴛɪᴅᴀᴋ ᴠᴀʟɪᴅ!');

    userMod.saveUser(nmr,{
      sleep:{mulai:[j1,m1],selesai:[j2,m2],zona},
      sleepNotified:false
    });
    balas(`✅ ᴡᴀᴋᴛᴜ ᴛɪᴅᴜʀ ᴅɪꜱɪᴍᴘᴀɴ!
🕐 ᴍᴜʟᴀɪ  : ${pad(j1)}.${pad(m1)}
🌅 ꜱᴇʟᴇꜱᴀɪ: ${pad(j2)}.${pad(m2)}
🌍 ᴢᴏɴᴀ   : ${zona.toUpperCase()} (UTC+${ZONA[zona]})

ɴᴀɴᴛɪ ᴘᴀꜱ ᴡᴀᴋᴛᴜ ᴛɪᴅᴜʀ ᴀᴋᴜ ɪɴɢᴀᴛɪɴ ᴏᴛᴏᴍᴀᴛɪꜱ ʏᴀ~ 💖`);
  },

  runtime: async ({ balas }) => balas(`⏱️ ʀᴜɴᴛɪᴍᴇ: *${hitungRuntime()}*`),

  speed: async ({ balas, t1 }) => { const a=Date.now();await new Promise(r=>setTimeout(r,50));
    balas(`⚡ ꜱᴘᴇᴇᴅ\n┌  ʀᴇꜱᴘᴏɴ: ${Date.now()-t1}ᴍꜱ\n└  ᴘʀᴏꜱᴇꜱ: ${Date.now()-a}ᴍꜱ`);
  },

  infobot: async ({ balas }) => {
    const d=new Date();
    return balas(`ℹ️ ɪɴꜰᴏ ʙᴏᴛ
┌  ɴᴀᴍᴀ   : ${global.versiWaBot||config.botName}
│  ᴏᴡɴᴇʀ  : ${config.ownerName||'ʙᴀɴɢ ᴅɪᴍᴢᴢ'}
│  ᴍᴏᴅᴇ   : ${config.botMode?.toUpperCase()}
│  ʟɪʙ    : @ᴡʜɪꜱᴋᴇʏꜱᴏᴄᴋᴇᴛꜱ
│  ʀᴜɴ    : ${hitungRuntime()}
│  ᴊᴀᴍ    : ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} ᴡɪʙ
└  ᴘʟᴀᴛꜰ : ᴛᴇʀᴍᴜx / ɴᴏᴅᴇᴊꜱ`);
  },

  // ✅ TOTALFITUR SUDAH DIUBAH PERSIS SEPERTI YANG KAMU MINTA
  totalfitur: async ({ balas }) => {
    const { hitungTotalSemuaFitur } = require('./menu');
    const { total, detail } = hitungTotalSemuaFitur();
    const jmlBot  = Object.keys(fitur).length;
    const jmlUser = (require('./user').DAFTAR_FITUR_USER || []).length;
    const grand   = total + jmlBot + jmlUser;

    const namaMenu = {
      bot:'🤖 menu bot', anime:'🗾 menu anime', tools:'🛠️ menu tools',
      grup:'👥 menu grup', info:'ℹ️ menu info', download:'⬇️ menu download',
      cari:'🔍 menu cari', fun:'🎮 menu fun', operator:'👑 menu owner',
      game:'🎯 menu game', rpg:'⚔️ menu rpg', stiker:'🎨 menu stiker',
      user:'👤 menu user', random:'🎲 menu random'
    };

    let rincian = '';
    Object.entries(detail).forEach(([k,v]) => {
      rincian += `│  ${namaMenu[k]||k} : ${String(v).padStart(2,' ')} fitur\n`;
    });

    balas(`🔢 ᴛᴏᴛᴀʟ ꜰɪᴛᴜʀ ʙᴏᴛ ʏᴜᴜᴋɪ ꜱᴏʀɪᴍᴀᴄʜɪ ᴍᴅ

╔${'═'.repeat(30)}╗
   📊 ʀᴇᴋᴀᴘ ꜱᴇᴍᴜᴀ ᴘᴇʀɪɴᴛᴀʜ
╚${'═'.repeat(30)}╝
┌  📜 ꜱᴜʙ ᴍᴇɴᴜ ᴅɪ ᴍᴇɴᴜ.ᴊꜱ :
${rincian}│
│  🤖 ꜰɪᴛᴜʀ ᴅɪ ʙᴏᴛ.ᴊꜱ    : ${String(jmlBot).padStart(2,' ')} ꜰɪᴛᴜʀ
│  👤 ꜰɪᴛᴜʀ ᴅɪ ᴜꜱᴇʀ.ᴊꜱ   : ${String(jmlUser).padStart(2,' ')} ꜰɪᴛᴜʀ
└  ✨ ᴛᴏᴛᴀʟ ꜱᴇᴍᴜᴀ         : *${grand}* ꜰɪᴛᴜʀ

💡 ᴋᴇᴛɪᴋ .ᴍᴇɴᴜ ᴜɴᴛᴜᴋ ʟɪʜᴀᴛ ꜱᴇᴍᴜᴀ ᴍᴇɴᴜ`);
  },

  restart: async ({ iniOwner, balas }) => {
    if(!iniOwner)return balas('⚠️ ᴋʜᴜꜱᴜꜱ ᴏᴡɴᴇʀ!');
    await balas('🔄 ʀᴇꜱᴛᴀʀᴛ...');
    setTimeout(()=>{try{process.on('exit',()=>require('child_process').spawn(process.argv.shift(),process.argv,{cwd:process.cwd(),stdio:'inherit'}));}catch{}process.exit(0);},1200);
  },

  update: async ({ iniOwner, balas }) => {
    if(!iniOwner)return balas('⚠️ ᴋʜᴜꜱᴜꜱ ᴏᴡɴᴇʀ!');
    balas('⬆️ ᴜᴘᴅᴀᴛɪɴɢ...');
    try{let o='';if(fs.existsSync('.git'))o+=execSync('git pull',{encoding:'utf8'}).slice(0,300)+'\n';o+=execSync('npm update --silent 2>&1 | tail -5',{encoding:'utf8'});balas(`✅ ꜱᴇʟᴇꜱᴀɪ!\n\`\`\`${o||'-'}\`\`\``);}catch(e){balas(`❌ ${e.message}`);}
  },

  clearcache: async ({ iniOwner, balas }) => {
    if(!iniOwner)return balas('⚠️ ᴋʜᴜꜱᴜꜱ ᴏᴡɴᴇʀ!');
    let n=0;try{
      fs.readdirSync(TMP).forEach(f=>{if(f.startsWith('dl-')||f.endsWith('.tmp')){try{fs.unlinkSync(path.join(TMP,f));n++;}catch{}}});
      if(fs.existsSync('node_modules/.cache')){fs.rmSync('node_modules/.cache',{recursive:true,force:true});n++;}
      balas(`🧹 ᴄʟᴇᴀʀᴇᴅ! *${n}* ꜰɪʟᴇ/ꜰᴏʟᴅᴇʀ`);
    }catch(e){balas(`❌ ${e.message}`);}
  }
};

function cekPeringatanTidur(sock, pengirimMentah, tujuanChat){
  try {
    const nmr = userMod.normNomor ? userMod.normNomor(pengirimMentah) : String(pengirimMentah||'').replace(/\D/g,'');
    if(!nmr) return true;
    const u = userMod.getUser(nmr);
    if(!u?.terdaftar || !u?.sleep?.mulai) return true;
    const offset = ZONA[u.sleep.zona?.toLowerCase()] || 7;
    const skg = jamSekarang(offset);
    const mulai = { h: u.sleep.mulai[0], m: u.sleep.mulai[1] };
    const selesai = { h: u.sleep.selesai[0], m: u.sleep.selesai[1] };
    if(dalamJamTidur(skg,mulai,selesai) && !u.sleepNotified){
      userMod.saveUser(nmr,{sleepNotified:true});
      sock.sendMessage(tujuanChat,{text:pesanTidur(u.gender)}).catch(()=>{});
    } else if(!dalamJamTidur(skg,mulai,selesai) && u.sleepNotified){
      userMod.saveUser(nmr,{sleepNotified:false});
    }
  } catch {}
  return true;
}

async function jalankanBot(data){
  const { cmd } = data;
  if (!fitur[cmd]) return false;
  await fitur[cmd]({ ...data, t1: Date.now() });
  return true;
}

module.exports = { jalankanBot, DAFTAR_FITUR: Object.keys(fitur), mulaiScheduler, cekPeringatanTidur, sc };

