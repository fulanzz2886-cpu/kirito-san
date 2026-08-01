const { jalankanBot, DAFTAR_FITUR } = require('./bot');
const { cekPerintahUser, DAFTAR_FITUR_USER } = require('./user');

const downloadCommands = [
  'tiktok','tt','facebook','fb','instagram','ig','youtube','yt',
  'ytmp3','ytmp4','twitter','xdl','threads','capcut','cp','snackvideo',
  'likee','spotify','spy','soundcloud','pinterest','pin','mediafire',
  'googledrive','gdrive','sfile','pixiv','bstation'
];

const botCommands = [
  'ping','delete','level','logout','owner','setname','setgender',
  'setsleep','runtime','speed','infobot','totalfitur','restart',
  'update','clearcache'
];

const userCommands = [
  'daftar','bukaakun','hapusakun',
  'listdaftar','listuser','daftarlist',
  'me','level','point','limit','status','premium','upgradeprem',
  'tfmoney','tfpoint','tflimit',
  'nikah','pasangan','cerai',
  'rank','topglobal','localrank','toplokal',
  'harian','claim','absen','buy',
  'gift','kirimhadiah','spin','undian'
];

const SEMUA_PERINTAH = [...downloadCommands, ...botCommands, ...userCommands];

function dapatkanPlatform(cmd) {
  const c = cmd.toLowerCase();
  if (['tiktok','tt'].includes(c)) return 'tiktok';
  if (['facebook','fb'].includes(c)) return 'facebook';
  if (['instagram','ig'].includes(c)) return 'instagram';
  if (['youtube','yt'].includes(c)) return 'youtube';
  if (c === 'ytmp3') return 'ytmp3';
  if (c === 'ytmp4') return 'ytmp4';
  if (['twitter','xdl'].includes(c)) return 'twitter';
  if (c === 'threads') return 'threads';
  if (['capcut','cp'].includes(c)) return 'capcut';
  if (c === 'snackvideo') return 'snackvideo';
  if (c === 'likee') return 'likee';
  if (['spotify','spy'].includes(c)) return 'spotify';
  if (c === 'soundcloud') return 'soundcloud';
  if (['pinterest','pin'].includes(c)) return 'pinterest';
  if (c === 'mediafire') return 'mediafire';
  if (['googledrive','gdrive'].includes(c)) return 'gdrive';
  if (c === 'sfile') return 'sfile';
  if (c === 'pixiv') return 'pixiv';
  if (c === 'bstation') return 'bstation';
  return null;
}

async function cekPerintahBot(data) {
  const { cmd } = data;
  if (!botCommands.includes(cmd.toLowerCase())) return false;
  await jalankanBot(data);
  return true;
}

function cekPerintahDownload(cmd) {
  return downloadCommands.includes(String(cmd).toLowerCase());
}

module.exports = {
  downloadCommands,
  botCommands,
  userCommands,
  SEMUA_PERINTAH,
  DAFTAR_FITUR,
  DAFTAR_FITUR_USER,
  dapatkanPlatform,
  cekPerintahBot,
  cekPerintahUser,
  cekPerintahDownload
};

