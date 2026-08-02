const fs = require('fs');
const path = require('path');
const config = require('./config');

const { sc, deteksiGender, panggilanGender, defaultUser, harga } = config;

const FILE_DATA = path.join(__dirname, 'data_user.json');
const FILE_TUNGGU = path.join(__dirname, 'tunggu_daftar.json');
const FILE_INV = path.join(__dirname, 'inventory_user.json');
const PP_DEFAULT = path.join(__dirname, 'pp default.jpg');

const DAFTAR_FITUR_USER = [];

function normNomor(n){
  if(!n)return'';let x=String(n).replace(/\D/g,'');
  if(x.startsWith('0'))x='62'+x.slice(1);
  if(x.length===12&&!x.startsWith('62'))x='62'+x;
  if(x.length>14)x=x.slice(-12);
  if(!x.startsWith('62')&&x.length<=12)x='62'+x;
  return x;
}
function baca(f,def={}){try{return JSON.parse(fs.readFileSync(f,'utf8'));}catch(e){return def;}}
function tulis(f,d){fs.writeFileSync(f,JSON.stringify(d,null,2),'utf8');}
function getUser(nmr){
  const d=baca(FILE_DATA);
  if(!d[nmr])d[nmr]={
    terdaftar:false,nama:'',umur:null,gender:'-',hobi:'',status:'',
    role:'ᴍᴇᴍʙᴇʀ',money:defaultUser.money,point:defaultUser.point,
    limit:defaultUser.limit,level:defaultUser.level,xp:0,
    afk:0,premium:false,pasangan:null,nikah:null,
    absen:null,harian:null,spin:defaultUser.spin,undian:defaultUser.undian,
    sleep:null,sleepNotified:false,gabung:Date.now()
  };
  tulis(FILE_DATA,d);return d[nmr];
}
function getInv(nmr){
  const d=baca(FILE_INV,{});
  if(!d[nmr])d[nmr]={pancing:0,pedang:0,panah:0,pakan:0,daging:0,steak:0,heal:0,healm:0,heall:0,healxl:0,mana:0,str:0,def:0,spd:0,revive:0};
  tulis(FILE_INV,d);return d[nmr];
}
function saveInv(nmr,obj){const d=baca(FILE_INV,{});d[nmr]={...getInv(nmr),...obj};tulis(FILE_INV,d);}
function saveUser(nmr,obj){const d=baca(FILE_DATA);d[nmr]={...getUser(nmr),...obj};tulis(FILE_DATA,d);}
function tungguDaftar(aksi,nmr=null,data=null){
  const t=baca(FILE_TUNGGU,{});
  if(aksi==='set'){t[nmr]={...data,waktu:Date.now()};tulis(FILE_TUNGGU,t);return true;}
  if(aksi==='get')return t[nmr]||null;
  if(aksi==='hapus'){delete t[nmr];tulis(FILE_TUNGGU,t);return true;}
}
function angkaRapi(n){return Number(n||0).toLocaleString('id-ID');}
function pad(n){return String(n).padStart(2,'0');}
function garis(p=24){return '─'.repeat(p);}
function hargaAlat(lv){return 5000+Math.max(0,(Number(lv)||1)-1)*10000;}
function jamWIB(){
  const d=new Date(Date.now()+7*3600000);
  return {h:d.getUTCHours(),m:d.getUTCMinutes(),s:d.getUTCSeconds(),str:`${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`};
}
function sapaanWIB(){
  const j=jamWIB().h;
  if(j<10)return 'ᴏʜᴀʏᴏᴜ ɢᴏᴢᴀɪᴍᴀꜱᴜ ☀️';
  if(j<18)return 'ᴋᴏɴɴɪᴄʜɪᴡᴀ 🌤️';
  return 'ᴋᴏɴʙᴀɴᴡᴀ 🌙';
}

function parseDaftar(teks){
  teks=String(teks||'').replace(/\r/g,'').trim();
  const ambil=(k)=>{
    const rx=new RegExp('^\\s*'+k+'\\s*[:=]\\s*(.*?)\\s*$','im');
    const m=teks.match(rx);return m?m[1].trim():'';
  };
  const nama=ambil('nama'),umur=ambil('umur'),hobi=ambil('hobi'),status=ambil('status');
  if(!nama||nama==='-')return null;
  return{
    nama:nama.slice(0,20),
    umur:umur?umur.slice(0,15):'-',
    hobi:hobi?hobi.slice(0,30):'-',
    status:status?status.slice(0,20):'-'
  };
}

async function cekReplyDaftar(sock,msg,tujuan,pengirimMentah,teks,balas){
  const nmr=normNomor(pengirimMentah);
  const t=tungguDaftar('get',nmr);
  if(!t)return false;
  tungguDaftar('hapus',nmr);
  const p=parseDaftar(teks);
  if(!p){
    balas(`❌ ꜰᴏʀᴍᴀᴛ ꜱᴀʟᴀʜ!
Contoh yang benar:
ɴᴀᴍᴀ : Yuuki
ᴜᴍᴜʀ : 17
ʜᴏʙɪ : Ngoding
ꜱᴛᴀᴛᴜꜱ : Sendiri

Ulangi lagi dengan .ᴅᴀꜰᴛᴀʀ`);
    return true;
  }
  const u=getUser(nmr);
  saveUser(nmr,{
    terdaftar:true,
    nama:p.nama,umur:p.umur,hobi:p.hobi,status:p.status,
    money:(u.money||0)+defaultUser.money,
    point:(u.point||0)+defaultUser.point,
    limit:(u.limit||0)+defaultUser.limit,
    gabung:Date.now()
  });
  balas(`✅ ᴅᴀꜰᴛᴀʀ ʙᴇʀʜᴀꜱɪʟ! 🎉

👤 ɴᴀᴍᴀ   : ${p.nama}
🎂 ᴜᴍᴜʀ   : ${p.umur}
🎯 ʜᴏʙɪ   : ${p.hobi}
💞 ꜱᴛᴀᴛᴜꜱ : ${p.status}

🎁 ʜᴀᴅɪᴀʜ ᴅᴀꜰᴛᴀʀ:
+ 💰 ${angkaRapi(defaultUser.money)} ᴍᴏɴᴇʏ
+ ⭐ ${defaultUser.point} ᴘᴏɪɴᴛ
+ 🎟️ ${defaultUser.limit} ʟɪᴍɪᴛ

Sekarang kamu bisa pakai semua fitur! ✨`);
  return true;
}

function ambilPP(nmr){ return PP_DEFAULT; }

const fitur = {

  daftar: async({pengirim,balas})=>{
    const nmr=normNomor(pengirim),u=getUser(nmr);
    if(u.terdaftar)return balas('⚠️ ᴋᴀᴍᴜ ᴜᴅᴀʜ ᴅᴀꜰᴛᴀʀ!');
    tungguDaftar('set',nmr,{});
    balas(`📝 ꜱɪʟᴀʜᴋᴀɴ ʙᴀʟᴀꜱ ᴘᴇꜱᴀɴ ɪɴɪ ᴅᴇɴɢᴀɴ ꜰᴏʀᴍᴀᴛ:

ɴᴀᴍᴀ : namamu
ᴜᴍᴜʀ : umurmu
ʜᴏʙɪ : hobimu
ꜱᴛᴀᴛᴜꜱ : statusmu

Contoh:
ɴᴀᴍᴀ : Yuuki Sorimachi
ᴜᴍᴜʀ : 17
ʜᴏʙɪ : Ngoding & Anime
ꜱᴛᴀᴛᴜꜱ : Sendiri`);
  },

  bukaakun: async(d)=>await fitur.daftar(d),

  hapusakun: async({pengirim,balas})=>{
    const nmr=normNomor(pengirim),u=getUser(nmr);
    if(!u.terdaftar)return balas('⚠️ ʙᴇʟᴜᴍ ᴅᴀꜰᴛᴀʀ!');
    saveUser(nmr,{terdaftar:false,nama:'',umur:null,gender:'-',hobi:'',status:'',pasangan:null,nikah:null});
    balas('✅ ᴀᴋᴜɴ ʙᴇʀʜᴀꜱɪʟ ᴅɪʜᴀᴘᴜꜱ!');
  },

  me: async({pengirim,balas})=>{
    const nmr=normNomor(pengirim),u=getUser(nmr);
    if(!u.terdaftar)return balas('⚠️ .ᴅᴀꜰᴛᴀʀ ᴅᴜʟᴜ ʏᴀ~');
    const jk=deteksiGender(u);
    const p=panggilanGender(u);
    const j=jamWIB();
    const rank=fitur._getRankInfo(u.level);
    const psgn=u.pasangan?getUser(u.pasangan):null;
    balas(`${sapaanWIB()}, ${p}~ 💖

╔${garis(28)}╗
   👤 ᴘʀᴏꜰɪʟ ᴋᴀᴍᴜ
╚${garis(28)}╝
📛 ɴᴀᴍᴀ     : ${u.nama||'-'}
🎂 ᴜᴍᴜʀ     : ${u.umur||'-'}
🚻 ɢᴇɴᴅᴇʀ   : ${jk}
🎯 ʜᴏʙɪ     : ${u.hobi||'-'}
💞 ꜱᴛᴀᴛᴜꜱ   : ${u.status||'-'}
🎖️ ʀᴏʟᴇ     : ${u.role||'ᴍᴇᴍʙᴇʀ'}
⭐ ᴘʀᴇᴍɪᴜᴍ  : ${u.premium?'✅ ᴀᴋᴛɪꜰ':'❌ ʙᴇʟᴜᴍ'}

📊 ꜱᴛᴀᴛɪꜱᴛɪᴋ:
${rank.cur.e} ʟᴠ ${u.level} · ${rank.cur.n}
⚡ ᴇxᴘ      : ${u.xp||0} / ${u.level*200}
💰 ᴍᴏɴᴇʏ   : ${angkaRapi(u.money)}
⭐ ᴘᴏɪɴᴛ   : ${angkaRapi(u.point)}
🎟️ ʟɪᴍɪᴛ   : ${u.limit}
🎰 ꜱᴘɪɴ    : ${u.spin} x
🎟️ ᴜɴᴅɪᴀɴ  : ${u.undian} x

💞 ᴘᴀꜱᴀɴɢᴀɴ : ${psgn?psgn.nama+' 💕':'💔 ʟᴀᴊᴇɴɢ'}
📅 ɢᴀʙᴜɴɢ  : ${new Date(u.gabung).toLocaleDateString('id-ID')}
⏰ ᴊᴀᴍ     : ${j.str} WIB

💡 ᴋᴇᴛɪᴋ .ʀᴀɴᴋ ᴜɴᴛᴜᴋ ʟɪʜᴀᴛ ᴘʀᴏɢʀᴇꜱ ʀᴀɴᴋ!`);
  },

  limit: async({pengirim,balas})=>{
    const u=getUser(normNomor(pengirim));
    balas(`🎟️ ʟɪᴍɪᴛ ᴋᴀᴍᴜ : *${u.limit}*`);
  },

  point: async({pengirim,balas})=>{
    const u=getUser(normNomor(pengirim));
    balas(`⭐ ᴘᴏɪɴᴛ ᴋᴀᴍᴜ : *${angkaRapi(u.point)}*`);
  },

  status: async({pengirim,balas})=>{
    const u=getUser(normNomor(pengirim));
    balas(`📊 ꜱᴛᴀᴛᴜꜱ: ${u.status||'-'}`);
  },

  premium: async({pengirim,balas})=>{
    const u=getUser(normNomor(pengirim));
    balas(`⭐ ᴘʀᴇᴍɪᴜᴍ: ${u.premium?'✅ ᴀᴋᴛɪꜰ':'❌ ʙᴇʟᴜᴍ'}`);
  },

  upgradeprem: async({pengirim,balas})=>{
    const nmr=normNomor(pengirim),u=getUser(nmr);
    if(!u.terdaftar)return balas('⚠️ .ᴅᴀꜰᴛᴀʀ ᴅᴜʟᴜ!');
    if(u.premium)return balas('⚠️ ᴜᴅᴀʜ ᴘʀᴇᴍɪᴜᴍ!');
    const biaya=harga.upgradeprem;
    if(u.money<biaya)return balas(`❌ ᴍᴏɴᴇʏ ᴋᴜʀᴀɴɢ!\nʜᴀʀɢᴀ: ʀᴘ ${angkaRapi(biaya)}\nᴋᴀᴍᴜ: ʀᴘ ${angkaRapi(u.money)}`);
    saveUser(nmr,{money:u.money-biaya,premium:true,limit:u.limit+500});
    balas(`⭐ ᴜᴘɢʀᴀᴅᴇ ᴘʀᴇᴍɪᴜᴍ ʙᴇʀʜᴀꜱɪʟ! ✨
- ʀᴘ ${angkaRapi(biaya)}
+ 🎟️ 500 ʟɪᴍɪᴛ ʙᴏɴᴜꜱ
+ ᴀᴋꜱᴇꜱ ꜱᴇᴍᴜᴀ ꜰɪᴛᴜʀ ᴘʀᴇᴍɪᴜᴍ!`);
  },

  nikah: async({pengirim,arg,balas})=>{
    const nmr=normNomor(pengirim),u=getUser(nmr);
    if(!u.terdaftar)return balas('⚠️ .ᴅᴀꜰᴛᴀʀ ᴅᴜʟᴜ!');
    const rx=/^(\d+)$/.exec(arg.trim());if(!rx)return balas('💡 .ɴɪᴋᴀʜ 62819xxx');
    const t=normNomor(rx[1]),p=getUser(t);
    if(t===nmr)return balas('❌ ᴅɪʀɪ ꜱᴇɴᴅɪʀɪ? 😂');
    if(!p.terdaftar)return balas('❌ ᴅɪᴀ ʙᴇʟᴜᴍ ᴅᴀꜰᴛᴀʀ!');
    if(u.pasangan||p.pasangan)return balas('❌ ꜱᴀʟᴀʜ ꜱᴀᴛᴜ ᴜᴅᴀʜ ᴀᴅᴀ ᴘᴀꜱᴀɴɢᴀɴ!');
    const biaya=harga.nikah;if(u.money<biaya)return balas(`❌ ᴍᴏɴᴇʏ ᴋᴜʀᴀɴɢ! ʀᴘ ${angkaRapi(biaya)}`);
    saveUser(nmr,{money:u.money-biaya,pasangan:t,nikah:Date.now()});
    saveUser(t,{pasangan:nmr,nikah:Date.now()});
    balas(`💍 ꜱᴇʟᴀᴍᴀᴛ ʙᴇʀɴɪᴋᴀʜ! 💖\n${u.nama} 💕 ${p.nama}\n- ʀᴘ ${angkaRapi(biaya)}\nꜱᴇᴍᴏɢᴀ ʙᴀʜᴀɢɪᴀ ꜱᴇʟᴀᴍᴀɴʏᴀ ✨`);
  },

  pasangan: async({pengirim,balas})=>{
    const u=getUser(normNomor(pengirim));
    if(!u.pasangan)return balas('💔 ᴋᴀᴍᴜ ʟᴀᴊᴇɴɢ');
    const p=getUser(u.pasangan);
    balas(`💕 ᴘᴀꜱᴀɴɢᴀɴ ᴋᴀᴍᴜ\n┌  ɴᴀᴍᴀ : ${p.nama}\n│  ᴜᴍᴜʀ : ${p.umur}\n└  ꜱᴇᴊᴀᴋ : ${new Date(u.nikah).toLocaleDateString('id-ID')}`);
  },

  cerai: async({pengirim,balas})=>{
    const nmr=normNomor(pengirim),u=getUser(nmr);
    if(!u.pasangan)return balas('💔 ᴋᴀᴍᴜ ʟᴀᴊᴇɴɢ');
    const t=u.pasangan,pas=getUser(t);
    saveUser(nmr,{pasangan:null,nikah:null});saveUser(t,{pasangan:null,nikah:null});
    balas(`💔 ᴄᴇʀᴀɪ ᴅɪᴛᴇʀɪᴍᴀ\n${u.nama || 'User'} 💔 ${pas.nama || 'User'}\nꜱᴇᴍᴏɢᴀ ᴅɪʟᴇɢᴀɴᴛᴀɴɢ ᴅᴀʀɪ ᴍᴀꜱᴀ ʟᴀʟᴜ~`);
  },

  buy: async({pengirim,arg,balas}) => {
    const nmr=normNomor(pengirim),u=getUser(nmr);
    const B=fitur._daftarBarang();
    const a=(arg||'').trim().toLowerCase();
    if(!a){
      const kat={};B.forEach(b=>{kat[b.kat]=kat[b.kat]||[];kat[b.kat].push(b);});
      let o = `🛒 ᴛᴏᴋᴏ ʀᴘɢ · ꜱᴇᴍᴜᴀ ʙᴀʀᴀɴɢ\n╔${garis(24)}╗\n   ʟɪᴍɪᴛ x50 = ᴛᴇʀᴍᴀʜᴀʟ\n╚${garis(24)}╝\n\n💡 ᴄᴀʀᴀ:\n  .ʙᴜʏ <ᴋᴀᴛᴇɢᴏʀɪ>\n  .ʙᴜʏ <ɪᴅ_ʙᴀʀᴀɴɢ>\n\n📂 ᴋᴀᴛᴇɢᴏʀɪ:\n`;
      Object.keys(kat).slice(0, 8).forEach(k => o += `  • .ʙᴜʏ ${k.toLowerCase().replace(/[^a-z]/g, '')} → ${k}\n`);
      o += `\n🎟️ ᴛᴏᴋᴏ ᴜᴛᴀᴍᴀ:\n  1. ʟɪᴍɪᴛ x50   → ʀᴘ 990.000\n  2. ᴘᴏɪɴᴛ x100 → ʀᴘ 3.000\n  3. ᴇxᴘ x100   → ʀᴘ 4.000\n\n⚠️ ᴀʟᴀᴛ ʟᴠ 1-50: .ʙᴜʏ ᴘᴀɴᴄɪɴɢ 25`;
      return balas(o);
    }
    if (['pancing', 'pedang', 'panah'].includes(a)) {
      let o = `🛒 ᴅᴀꜰᴛᴀʀ ${a.toUpperCase()} ʟᴠ 1-50\n╔${garis(26)}╗\n`;
      for (let i = 1; i <= 50; i++) o += `${String(i).padStart(2, ' ')}. ʟᴠ ${String(i).padEnd(2, ' ')} → ʀᴘ ${angkaRapi(hargaAlat(i))}  (.ʙᴜʏ ${a}${i})\n`;
      o += `╚${garis(26)}╝\n\n💡 ᴄᴏɴᴛᴏʜ: .ʙᴜʏ ${a}25`;
      return balas(o);
    }
    if (['bahan', 'potion', 'potions'].includes(a) || ['pakan', 'daging', 'steak', 'heal', 'mana', 'str', 'def', 'spd', 'revive'].includes(a)) {
      const list = B.filter(b => b.kat.toLowerCase().includes(a) || (b.inv || '').toLowerCase() === a).slice(0, 20);
      let o = `🛒 ${a.toUpperCase()}\n╔${garis(26)}╗\n`;
      list.forEach(b => o += `• ${b.icon} ${b.nama.padEnd(14)} → ʀᴘ ${angkaRapi(b.harga).padStart(9)}  (.ʙᴜʏ ${b.id})\n`);
      o += `╚${garis(26)}╝`;
      return balas(o);
    }
    const rxAlat = /^(pancing|pedang|panah)\s*(\d{1,2})$/i.exec(a);
    let id = a;
    if (rxAlat) id = `${rxAlat[1].toLowerCase()}${parseInt(rxAlat[2])}`;
    const br = B.find(x => x.id === id);
    if (!br) return balas(`❌ ʙᴀʀᴀɴɢ ᴛɪᴅᴀᴋ ᴅɪᴛᴇᴍᴜᴋᴀɴ!\n💡 ᴄᴏʙᴀ: .ʙᴜʏ ᴘᴀɴᴄɪɴɢ 10`);
    if (br.maxLv) {
      const inv = getInv(nmr);
      if ((inv[br.inv] || 0) >= br.maxLv) return balas(`⚠️ ᴋᴀᴍᴜ ᴜᴅᴀʜ ᴘᴜɴʏᴀ ${br.nama}!`);
    }
    if (u.money < br.harga) return balas(`❌ ᴍᴏɴᴇʏ ᴋᴜʀᴀɴɢ!\n${br.icon} ${br.nama}\nʜᴀʀɢᴀ: ʀᴘ ${angkaRapi(br.harga)}\nᴋᴀᴍᴜ: ʀᴘ ${angkaRapi(u.money)}`);
    const ob = { money: u.money - br.harga };
    if (br.field) ob[br.field] = (u[br.field] || 0) + br.nilai;
    saveUser(nmr, ob);
    if (br.inv) {
      const inv = getInv(nmr);
      inv[br.inv] = br.maxLv ? br.nilai : Math.max(inv[br.inv] || 0, 0) + br.nilai;
      saveInv(nmr, inv);
    }
    balas(`✅ ʙᴇʟɪ ʙᴇʀʜᴀꜱɪʟ!\n${br.icon} ${br.nama}\n- ʀᴘ ${angkaRapi(br.harga)}\n${br.field ? `+ ${br.nilai} ${br.field.toUpperCase()}` : ''}${br.inv ? `\n+ ᴍᴀꜱᴜᴋ ɪɴᴠᴇɴᴛᴏʀʏ` : ''}`);
  },

  gift: async ({ pengirim, balas }) => {
    const u = getUser(normNomor(pengirim));
    const hadiah = ['💎 500 ᴅɪᴀᴍᴏɴᴅ', '💰 10.000 ᴍᴏɴᴇʏ', '🎟️ 100 ʟɪᴍɪᴛ', '⭐ 500 ᴘᴏɪɴᴛ', '⚡ 200 ᴇxᴘ'];
    balas(`🎁 ɢɪꜰᴛ ʀᴀɴᴅᴏᴍ: ${hadiah[Math.floor(Math.random() * hadiah.length)]}`);
  },

  kirimhadiah: async ({ pengirim, arg, balas }) => {
    const nmr = normNomor(pengirim), u = getUser(nmr);
    const rx = /^(\d+)\s+(.+)$/.exec(arg.trim());
    if (!rx) return balas('💡 .ᴋɪʀɪᴍʜᴀᴅɪᴀʜ 62819xxx ʜᴀᴅɪᴀʜɴʏᴀ');
    const t = normNomor(rx[1]);
    if (!getUser(t).terdaftar) return balas('❌ ᴛᴜᴊᴜᴀɴ ʙᴇʟᴜᴍ ᴅᴀꜰᴛᴀʀ!');
    balas(`🎁 ʜᴀᴅɪᴀʜ ᴛᴇʀᴋɪʀɪᴍ!\nᴋᴇ: ${getUser(t).nama || t}\nɪꜱɪ: ${rx[2]}`);
  },

  spin: async ({ pengirim, balas }) => {
    const nmr = normNomor(pengirim), u = getUser(nmr);
    if (u.spin <= 0) return balas('❌ ᴋᴇꜱᴇᴍᴘᴀᴛᴀɴ ʜᴀʙɪꜱ! ʙᴇꜱᴏᴋ ʟᴀɢɪ ʏᴀ~');
    const r = Math.random(), h = r < .3 ? [1000, 'money'] : r < .6 ? [50, 'point'] : r < .85 ? [25, 'limit'] : [150, 'xp'];
    const ob = { spin: u.spin - 1 };
    ob[h[1]] = (u[h[1]] || 0) + h[0];
    saveUser(nmr, ob);
    balas(`🎰 ꜱᴘɪɴ!\n┌  ʜᴀꜱɪʟ : +${h[0]} ${h[1].toUpperCase()}\n└  ꜱɪꜱᴀ  : ${u.spin - 1} x`);
  },

  undian: async ({ pengirim, balas }) => {
    const nmr = normNomor(pengirim), u = getUser(nmr);
    if (u.undian <= 0) return balas('❌ ᴋᴇꜱᴇᴍᴘᴀᴛᴀɴ ᴜɴᴅɪᴀɴ ʜᴀʙɪꜱ!');
    const jp = ['ɢʀᴀɴᴅ ᴘʀɪᴢᴇ 👑 1ᴊᴛ', 'ʜᴀᴅɪᴀʜ 2 💎 100ᴋ', 'ʜᴀᴅɪᴀʜ 3 🎟️ 500', 'ʜᴀᴅɪᴀʜ 4 ⭐ 1000', 'ᴢᴏɴᴋ 🗿'];
    const r = Math.random() < .05 ? 0 : Math.random() < .15 ? 1 : Math.random() < .35 ? 2 : Math.random() < .6 ? 3 : 4;
    saveUser(nmr, { undian: u.undian - 1, money: u.money + (r === 0 ? 1000000 : r === 1 ? 100000 : 0) });
    balas(`🎟️ ᴜɴᴅɪᴀɴ #${2 - u.undian}\n🏆 ʜᴀꜱɪʟ: ${jp[r]}${r === 0 ? `\n💰 + ʀᴘ 1.000.000! 🎉🎉🎉` : ''}`);
  },

  _urut:(kol)=>Object.entries(baca(FILE_DATA)).filter(([,v])=>v.terdaftar).sort((a,b)=>b[1][kol]-a[1][kol]),

  _getRankInfo:(lv)=>{
    const l=Math.max(1,Number(lv)||1);
    const R=[
      {n:'ʙʀᴏɴᴢᴇ',          e:'🥉', min:1,    max:25},
      {n:'ꜱɪʟᴠᴇʀ',          e:'🥈', min:25,   max:50},
      {n:'ɢᴏʟᴅ',            e:'🥇', min:50,   max:80},
      {n:'ᴘʟᴀᴛɪɴᴜᴍ',        e:'💠', min:80,   max:100},
      {n:'ᴅɪᴀᴍᴏɴᴅ',         e:'💎', min:100,  max:250},
      {n:'ʜᴇʀᴏɪᴄ',          e:'⚔️', min:250,  max:500},
      {n:'ᴇʟɪᴛᴇ',           e:'🏅', min:500,  max:800},
      {n:'ᴍᴀꜱᴛᴇʀ',          e:'👑', min:800,  max:1000},
      {n:'ɢʀᴀɴᴅ ᴍᴀꜱᴛᴇʀ',    e:'👑✨',min:1000, max:5000},
      {n:'ᴇʟɪᴛᴇ ᴍᴀꜱᴛᴇʀ',    e:'🔱', min:5000, max:Infinity}
    ];
    let i=0;while(i<R.length-1 && l>=R[i+1].min)i++;
    const cur=R[i], nx=R[i+1]||null;
    let prog=100, sisa=0;
    if(nx){
      const jarak=nx.min-cur.min;
      const jalan=l-cur.min;
      prog=Math.min(100,Math.max(0,Math.round((jalan/jarak)*100)));
      sisa=Math.max(0,nx.min-l);
    }
    return {cur,nx,prog,sisa,lv:l,isMax:!nx};
  },

  rank: async({pengirim,balas})=>{
    const u=getUser(normNomor(pengirim));
    if(!u.terdaftar)return balas('⚠️ ᴅᴀꜰᴛᴀʀ ᴅᴜʟᴜ: .ᴅᴀꜰᴛᴀʀ');
    const r=fitur._getRankInfo(u.level);
    const L=20;
    const isi=Math.round(L*(r.prog/100));
    const bar='█'.repeat(isi)+'░'.repeat(L-isi);
    const G='═';
    let o=`${r.cur.e} ʏᴏᴜʀ ᴄᴜʀʀᴇɴᴛ ʀᴀɴᴋ
╔${G.repeat(26)}╗
   ${r.cur.n.toUpperCase()}
╚${G.repeat(26)}╝

👤 ᴜꜱᴇʀ    : ${u.nama||'-'}
📊 ʟᴇᴠᴇʟ   : ${r.lv}
⭐ ᴇxᴘ     : ${u.xp||0} / ${r.lv*200}

📈 ᴘʀᴏɢʀᴇꜱꜱ
┌${G.repeat(L+2)}┐
│ ${bar} │ ${r.prog}%
└${G.repeat(L+2)}┘
`;
    if(r.isMax){
      o+=`\n🔱 ꜱᴜᴅᴀʜ ᴍᴇɴᴄᴀᴘᴀɪ ʀᴀɴᴋ ᴛᴇʀᴛɪɴɢɢɪ!
✨ ᴇʟɪᴛᴇ ᴍᴀꜱᴛᴇʀ — ᴘᴜɴᴄᴀᴋ ᴘʀᴇꜱᴛᴀꜱɪ ✨`;
    }else{
      o+=`
🎯 ʀᴀɴᴋ ꜱᴇʟᴀɴᴊᴜᴛɴʏᴀ : ${r.nx.e} ${r.nx.n.toUpperCase()}
📉 ꜱɪꜱᴀ ʟᴇᴠᴇʟ       : ${r.sisa} ʟᴠ ʟᴀɢɪ
💡 ᴋᴇᴛɪᴋ .ᴀʙꜱᴇɴ ꜱᴇᴛɪᴀᴘ ʜᴀʀɪ ᴜɴᴛᴜᴋ ᴄᴇᴘᴀᴛ ɴᴀɪᴋ!`;
    }
    balas(o);
  },

  toprank: async({balas})=>{
    const t=fitur._urut('xp').slice(0,10);let i=1,o=`🏆 ᴛᴏᴘ 10 ʀᴀɴᴋ ɢʟᴏʙᴀʟ\n╔${garis(24)}╗\n`;
    t.forEach(([k,v])=>{
      const r=fitur._getRankInfo(v.level);
      o+=`${i++}. ${r.cur.e} ${v.nama||'-'}\n     ʟᴠ ${v.level} · ${r.cur.n}\n`;
    });
    o+=`╚${garis(24)}╝\n\n💡 ᴋᴇᴛɪᴋ .ʀᴀɴᴋ ᴜɴᴛᴜᴋ ʟɪʜᴀᴛ ᴘᴏꜱɪꜱɪ ᴋᴀᴍᴜ`;
    balas(o);
  },
  topglobal: async(d)=>await fitur.toprank(d),
  localrank: async(d)=>await fitur.toprank(d),
  toplokal: async(d)=>await fitur.toprank(d),

  harian: async({pengirim,balas})=>{
    const nmr=normNomor(pengirim),u=getUser(nmr);if(!u.terdaftar)return balas('⚠️ .ᴅᴀꜰᴛᴀʀ');
    const tgl=new Date().toDateString();
    if(u.harian===tgl)return balas('⚠️ ꜱᴜᴅᴀʜ ᴄʟᴀɪᴍ ʜᴀʀɪ ɪɴɪ!');
    const m=5000+Math.floor(Math.random()*10000),l=10+Math.floor(Math.random()*20);
    saveUser(nmr,{harian:tgl,money:u.money+m,limit:u.limit+l,point:u.point+25});
    balas(`📅 ʜᴀʀɪᴀɴ ᴅɪᴄʟᴀɪᴍ! 🎉
+ ʀᴘ ${angkaRapi(m)}
+ 🎟️ ${l} ʟɪᴍɪᴛ
+ ⭐ 25 ᴘᴏɪɴᴛ`);
  },
  claim: async(d)=>await fitur.harian(d),

  absen: async({pengirim,balas})=>{
    const nmr=normNomor(pengirim),u=getUser(nmr);if(!u.terdaftar)return balas('⚠️ .ᴅᴀꜰᴛᴀʀ');
    const tgl=new Date().toDateString();
    if(u.absen===tgl)return balas('⚠️ ꜱᴜᴅᴀʜ ᴀʙꜱᴇɴ!');
    const xp=25+Math.floor(Math.random()*50),p=50+Math.floor(Math.random()*100);
    let lv=u.level,xp2=u.xp+xp;while(xp2>=lv*200){xp2-=lv*200;lv++;}
    saveUser(nmr,{absen:tgl,xp:xp2,level:lv,point:u.point+p,money:u.money+1000});
    balas(`✅ ᴀʙꜱᴇɴ ʙᴇʀʜᴀꜱɪʟ!
+ ⭐ ${xp} ᴇxᴘ
+ ⭐ ${p} ᴘᴏɪɴᴛ
+ 💰 1.000 ᴍᴏɴᴇʏ
${lv>u.level?`\n🎉 ʟᴇᴠᴇʟ ᴜᴘ! ʟᴠ ${lv}`:''}`);
  },

  _daftarBarang:()=>{
    const B=[];
    B.push({id:'limit',kat:'ᴛᴏᴋᴏ ᴜᴛᴀᴍᴀ',nama:'ʟɪᴍɪᴛ x50',   harga:990000,field:'limit',nilai:50,icon:'🎟️',desc:'ᴘᴀʟɪɴɢ ᴍᴀʜᴀʟ · ᴋᴜᴏᴛᴀ ꜰɪᴛᴜʀ'});
    B.push({id:'point',kat:'ᴛᴏᴋᴏ ᴜᴛᴀᴍᴀ',nama:'ᴘᴏɪɴᴛ x100', harga:3000,  field:'point',nilai:100,icon:'⭐'});
    B.push({id:'xp',   kat:'ᴛᴏᴋᴏ ᴜᴛᴀᴍᴀ',nama:'ᴇxᴘ x100',   harga:4000,  field:'xp',   nilai:100,icon:'⚡'});
    B.push({id:'pakan', kat:'ʙᴀʜᴀɴ',      nama:'ᴘᴀᴋᴀɴ x10',  harga:2000,  inv:'pakan', nilai:10, icon:'🌾'});
    B.push({id:'daging',kat:'ʙᴀʜᴀɴ',      nama:'ᴅᴀɢɪɴɢ x10', harga:8000,  inv:'daging',nilai:10, icon:'🥩'});
    B.push({id:'steak', kat:'ʙᴀʜᴀɴ',      nama:'ꜱᴛᴇᴀᴋ x5',   harga:25000, inv:'steak', nilai:5,  icon:'🍖'});
    B.push({id:'heal',  kat:'ᴘᴏᴛɪᴏɴ',     nama:'ʜᴇᴀʟ ꜱ x10',harga:5000,  inv:'heal',  nilai:10, icon:'🧪'});
    B.push({id:'healm', kat:'ᴘᴏᴛɪᴏɴ',     nama:'ʜᴇᴀʟ ᴍ x5', harga:12000, inv:'healm', nilai:5,  icon:'🧪'});
    B.push({id:'heall', kat:'ᴘᴏᴛɪᴏɴ',     nama:'ʜᴇᴀʟ ʟ x3', harga:25000, inv:'heall', nilai:3,  icon:'🧪'});
    B.push({id:'healxl',kat:'ᴘᴏᴛɪᴏɴ',     nama:'ʜᴇᴀʟ xʟ x1',harga:60000, inv:'healxl',nilai:1,  icon:'🧪'});
    B.push({id:'mana',  kat:'ᴘᴏᴛɪᴏɴ',     nama:'ᴍᴀɴᴀ x5',   harga:15000, inv:'mana',  nilai:5,  icon:'💧'});
    B.push({id:'str',   kat:'ᴘᴏᴛɪᴏɴ',     nama:'ꜱᴛʀᴇɴɢᴛʜ x3',harga:35000,inv:'str',   nilai:3,  icon:'💪'});
    B.push({id:'def',   kat:'ᴘᴏᴛɪᴏɴ',     nama:'ᴅᴇꜰᴇɴꜱᴇ x3',harga:35000,inv:'def',   nilai:3,  icon:'🛡️'});
    B.push({id:'spd',   kat:'ᴘᴏᴛɪᴏɴ',     nama:'ꜱᴘᴇᴇᴅ x3',  harga:30000, inv:'spd',   nilai:3,  icon:'👟'});
    B.push({id:'revive',kat:'ᴘᴏᴛɪᴏɴ',     nama:'ʀᴇᴠɪᴠᴇ x1', harga:120000,inv:'revive',nilai:1, icon:'✨'});
    for(let i=1;i<=50;i++){
      B.push({id:`pancing${i}`,kat:'🎣 ᴘᴀɴᴄɪɴɢ',nama:`ᴘᴀɴᴄɪɴɢ ʟᴠ ${i}`,harga:hargaAlat(i),inv:'pancing',nilai:i,icon:'🎣',maxLv:i});
      B.push({id:`pedang${i}`, kat:'⚔️ ᴘᴇᴅᴀɴɢ', nama:`ᴘᴇᴅᴀɴɢ ʟᴠ ${i}`, harga:hargaAlat(i),inv:'pedang', nilai:i,icon:'⚔️',maxLv:i});
      B.push({id:`panah${i}`,  kat:'🏹 ᴘᴀɴᴀʜ',  nama:`ᴘᴀɴᴀʜ ʟᴠ ${i}`,  harga:hargaAlat(i),inv:'panah',  nilai:i,icon:'🏹',maxLv:i});
    }
    return B;
  },

  buy: async({pengirim,arg,balas})=>{
    const nmr=normNomor(pengirim),u=getUser(nmr);if(!u.terdaftar)return balas('⚠️ .ᴅᴀꜰᴛᴀʀ');
    const B=fitur._daftarBarang();
    const a=(arg||'').trim().toLowerCase();
    if(!a){
      const kat={};B.forEach(b=>{kat[b.kat]=kat[b.kat]||[];kat[b.kat].push(b);});
      let o=`🛒 ᴛᴏᴋᴏ ʀᴘɢ · ꜱᴇᴍᴜᴀ ʙᴀʀᴀɴɢ
╔${garis(24)}╗
   ʟɪᴍɪᴛ x50 = ᴛᴇʀᴍᴀʜᴀʟ
╚${garis(24)}╝

💡 ᴄᴀʀᴀ:
  .ʙᴜʏ <ᴋᴀᴛᴇɢᴏʀɪ>
  .ʙᴜʏ <ɪᴅ_ʙᴀʀᴀɴɢ>

📂 ᴋᴀᴛᴇɢᴏʀɪ:
`;
      Object.keys(kat).slice(0,8).forEach(k=>o+=`  • .ʙᴜʏ ${k.toLowerCase().replace(/[^a-z]/g,'')} → ${k}\n`);
      o+=`
🎟️ ᴛᴏᴋᴏ ᴜᴛᴀᴍᴀ:
  1. ʟɪᴍɪᴛ x50   → ʀᴘ 990.000 (ᴛᴇʀᴍᴀʜᴀʟ)
  2. ᴘᴏɪɴᴛ x100 → ʀᴘ 3.000
  3. ᴇxᴘ x100   → ʀᴘ 4.000

⚠️ ᴜɴᴛᴜᴋ ᴀʟᴀᴛ ʟᴠ 1-50: .ʙᴜʏ ᴘᴀɴᴄɪɴɢ 25`;
      return balas(o);
    }
    if(['pancing','pedang','panah'].includes(a)){
      let o=`🛒 ᴅᴀꜰᴛᴀʀ ${a.toUpperCase()} ʟᴠ 1-50\n╔${garis(26)}╗\n`;
      for(let i=1;i<=50;i++)o+=`${String(i).padStart(2,' ')}. ʟᴠ ${String(i).padEnd(2,' ')} → ʀᴘ ${angkaRapi(hargaAlat(i))}  (.ʙᴜʏ ${a}${i})\n`;
      o+=`╚${garis(26)}╝\n\n💡 ᴄᴏɴᴛᴏʜ: .ʙᴜʏ ${a}25`;
      return balas(o);
    }
    if(['bahan','potion','potions','pokeball'].includes(a)||['pakan','daging','steak','heal','mana','str','def','spd','revive'].includes(a)){
      const list=B.filter(b=>b.kat.toLowerCase().includes(a)||(b.inv||'').toLowerCase()===a).slice(0,20);
      let o=`🛒 ${a.toUpperCase()}\n╔${garis(26)}╗\n`;
      list.forEach(b=>o+=`• ${b.icon} ${b.nama.padEnd(14)} → ʀᴘ ${angkaRapi(b.harga).padStart(9)}  (.ʙᴜʏ ${b.id})\n`);
      o+=`╚${garis(26)}╝`;
      return balas(o);
    }
    const rxAlat=/^(pancing|pedang|panah)\s*(\d{1,2})$/i.exec(a);
    let id=a;
    if(rxAlat)id=`${rxAlat[1].toLowerCase()}${parseInt(rxAlat[2])}`;
    const br=B.find(x=>x.id===id);
    if(!br)return balas(`❌ ʙᴀʀᴀɴɢ ᴛɪᴅᴀᴋ ᴅɪᴛᴇᴍᴜᴋᴀɴ!\n💡 ᴄᴏʙᴀ: .ʙᴜʏ ᴘᴀɴᴄɪɴɢ 10`);
    if(br.maxLv){
      const inv=getInv(nmr);
      if((inv[br.inv]||0)>=br.maxLv)return balas(`⚠️ ᴋᴀᴍᴜ ᴜᴅᴀʜ ᴘᴜɴʏᴀ ${br.nama}!`);
    }
    if(u.money<br.harga)return balas(`❌ ᴜᴀɴɢ ᴋᴜʀᴀɴɢ!\n${br.icon} ${br.nama}\nʜᴀʀɢᴀ: ʀᴘ ${angkaRapi(br.harga)}\nᴋᴀᴍᴜ: ʀᴘ ${angkaRapi(u.money)}`);
    const ob={money:u.money-br.harga};
    if(br.field)ob[br.field]=(u[br.field]||0)+br.nilai;
    saveUser(nmr,ob);
    if(br.inv){
      const inv=getInv(nmr);
      inv[br.inv]=br.maxLv?br.nilai:Math.max(inv[br.inv]||0,0)+br.nilai;
      saveInv(nmr,inv);
    }
    balas(`✅ ʙᴇʟɪ ʙᴇʀʜᴀꜱɪʟ!
${br.icon} ${br.nama}
- ʀᴘ ${angkaRapi(br.harga)}
${br.field?`+ ${br.nilai} ${br.field.toUpperCase()}`:''}${br.inv?`\n+ ᴍᴀꜱᴜᴋ ɪɴᴠᴇɴᴛᴏʀʏ`:''}`);
  },

  gift: async({pengirim,balas})=>{
    const u=getUser(normNomor(pengirim));if(!u.terdaftar)return balas('⚠️ .ᴅᴀꜰᴛᴀʀ');
    const hadiah=['💎 500 ᴅɪᴀᴍᴏɴᴅ','💰 10.000 ᴍᴏɴᴇʏ','🎟️ 100 ʟɪᴍɪᴛ','⭐ 500 ᴘᴏɪɴᴛ','⚡ 200 ᴇxᴘ'];
    balas(`🎁 ɢɪꜰᴛ ʀᴀɴᴅᴏᴍ: ${hadiah[Math.floor(Math.random()*hadiah.length)]}`);
  },
  kirimhadiah: async({pengirim,arg,balas})=>{
    const nmr=normNomor(pengirim),u=getUser(nmr);if(!u.terdaftar)return balas('⚠️ .ᴅᴀꜰᴛᴀʀ');
    const rx=/^(\d+)\s+(.+)$/.exec(arg.trim());
    if(!rx)return balas('💡 .ᴋɪʀɪᴍʜᴀᴅɪᴀʜ 62819xxx ʜᴀᴅɪᴀʜɴʏᴀ');
    const t=normNomor(rx[1]);if(!getUser(t).terdaftar)return balas('❌ ᴛᴜᴊᴜᴀɴ ʙᴇʟᴜᴍ ᴅᴀꜰᴛᴀʀ!');
    balas(`🎁 ʜᴀᴅɪᴀʜ ᴛᴇʀᴋɪʀɪᴍ!\nᴋᴇ: ${getUser(t).nama}\nɪꜱɪ: ${rx[2]}`);
  },

  spin: async({pengirim,balas})=>{
    const nmr=normNomor(pengirim),u=getUser(nmr);if(!u.terdaftar)return balas('⚠️ .ᴅᴀꜰᴛᴀʀ');
    if(u.spin<=0)return balas('❌ ᴋᴇꜱᴇᴍᴘᴀᴛᴀɴ ʜᴀʙɪꜱ! ʙᴇꜱᴏᴋ ʟᴀɢɪ ʏᴀ~');
    const r=Math.random(),h=r<.3?[1000,'ᴍᴏɴᴇʏ']:r<.6?[50,'ᴘᴏɪɴᴛ']:r<.85?[25,'limit']:[150,'xp'];
    const ob={spin:u.spin-1};ob[h[1]]=(u[h[1]]||0)+h[0];saveUser(nmr,ob);
    balas(`🎰 ꜱᴘɪɴ!
┌  ʜᴀꜱɪʟ : +${h[0]} ${h[1].toUpperCase()}
└  ꜱɪꜱᴀ  : ${u.spin-1} x`);
  },
  undian: async({pengirim,balas})=>{
    const nmr=normNomor(pengirim),u=getUser(nmr);if(!u.terdaftar)return balas('⚠️ .ᴅᴀꜰᴛᴀʀ');
    if(u.undian<=0)return balas('❌ ᴋᴜᴏᴛᴀ ᴜɴᴅɪᴀɴ ʜᴀʙɪꜱ!');
    const jp=['GRAND PRIZE 👑 1JT','HADIAH 2 💎 100K','HADIAH 3 🎟️ 500','HADIAH 4 ⭐ 1000','ZONK 🗿'];
    const r=Math.random()<.05?0:r<.15?1:r<.35?2:r<.6?3:4;
    saveUser(nmr,{undian:u.undian-1,money:u.money+(r===0?1000000:r===1?100000:0)});
    balas(`🎟️ ᴜɴᴅɪᴀɴ #${2-u.undian}
🏆 ʜᴀꜱɪʟ: ${jp[r]}
${r===0?`\n💰 + ʀᴘ 1.000.000! 🎉🎉🎉`:''}`);
  }
};

async function cekPerintahUser(data) {
  const { cmd } = data;
  if (!cmd || !fitur[cmd]) return false;
  await fitur[cmd](data);
  return true;
}

Object.assign(DAFTAR_FITUR_USER, Object.keys(fitur));
module.exports = {
  normNomor, baca, tulis, getUser, getInv, saveInv, saveUser,
  tungguDaftar, parseDaftar, cekReplyDaftar, ambilPP,
  cekPerintahUser, DAFTAR_FITUR_USER, hargaAlat,
  FILE_DATA, FILE_TUNGGU, FILE_INV, PP_DEFAULT
};

