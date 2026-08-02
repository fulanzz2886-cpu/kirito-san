const { sc, garis } = require('./config');
const config = require('./config');
const p = () => config.prefixes[0];

function tampilkanSubMenu(namaMenu, hitung = false) {
  const pre = p();
  switch (String(namaMenu).toLowerCase()) {

    case 'bot': case 'menu bot':
      return sc(`
╔═══════════════════════════╗
   🤖 MENU FITUR BOT
╚═══════════════════════════╝
┌ ◦ ${pre}ping
│ ◦ ${pre}delete
│ ◦ ${pre}level
│ ◦ ${pre}logout
│ ◦ ${pre}owner
│ ◦ ${pre}setname
│ ◦ ${pre}setgender
│ ◦ ${pre}setsleep
│ ◦ ${pre}runtime
│ ◦ ${pre}speed
│ ◦ ${pre}infobot
│ ◦ ${pre}totalfitur
│ ◦ ${pre}restart
│ ◦ ${pre}update
└ ◦ ${pre}clearcache
${garis}
📊 TOTAL: *16 FITUR*
`.trim());

    case 'anime': case 'menu anime':
      return sc(`
╔═══════════════════════════╗
   🗾 MENU ANIME
╚═══════════════════════════╝
┌ ◦ ${pre}anime
│ ◦ ${pre}animesong
│ ◦ ${pre}ongoing
│ ◦ ${pre}manga
│ ◦ ${pre}topanime
│ ◦ ${pre}topwaifu
│ ◦ ${pre}tophusband
│ ◦ ${pre}husbu
│ ◦ ${pre}waifu
│ ◦ ${pre}character
│ ◦ ${pre}quoteanime
│ ◦ ${pre}randomanime
│ ◦ ${pre}fanart
│ ◦ ${pre}rekomendasi
│ ◦ ${pre}jadwalrilis
│ ◦ ${pre}trailer
│ ◦ ${pre}lirikanime
└ ◦ ${pre}kosplay
${garis}
📊 TOTAL: *18 FITUR*
`.trim());

    case 'tools': case 'alat': case 'menu tools':
      return sc(`
╔═══════════════════════════╗
   🛠️ MENU PERALATAN
╚═══════════════════════════╝
┌ ◦ ${pre}hd
│ ◦ ${pre}rvo
│ ◦ ${pre}remini
│ ◦ ${pre}removebg
│ ◦ ${pre}recolor
│ ◦ ${pre}toimg
│ ◦ ${pre}tomp3
│ ◦ ${pre}translate
│ ◦ ${pre}upscale
│ ◦ ${pre}enhance
│ ◦ ${pre}topdf
│ ◦ ${pre}ocr
│ ◦ ${pre}qrmaker
│ ◦ ${pre}qrreader
│ ◦ ${pre}base64
│ ◦ ${pre}kalkulator
│ ◦ ${pre}tts
│ ◦ ${pre}stt
│ ◦ ${pre}kompres
│ ◦ ${pre}potongvideo
└ ◦ ${pre}resize
${garis}
📊 TOTAL: *21 FITUR*
`.trim());

    case 'grup': case 'menu gc': case 'menu grup':
      return sc(`
╔═══════════════════════════╗
   👥 MENU PENGELOLA GRUP
╚═══════════════════════════╝
┌ ◦ ${pre}afk
│ ◦ ${pre}antilink
│ ◦ ${pre}antitagsw
│ ◦ ${pre}antivirtex
│ ◦ ${pre}antitoxic
│ ◦ ${pre}addadmin
│ ◦ ${pre}deladmin
│ ◦ ${pre}promote
│ ◦ ${pre}demote
│ ◦ ${pre}deskgc
│ ◦ ${pre}getsw
│ ◦ ${pre}swgc
│ ◦ ${pre}linkgc
│ ◦ ${pre}revoke
│ ◦ ${pre}listonline
│ ◦ ${pre}setwelcome
│ ◦ ${pre}setgoodbye
│ ◦ ${pre}setintro
│ ◦ ${pre}setdesk
│ ◦ ${pre}setnamagc
│ ◦ ${pre}seticongc
│ ◦ ${pre}totalchat
│ ◦ ${pre}tagall
│ ◦ ${pre}hidetag
│ ◦ ${pre}open
│ ◦ ${pre}close
│ ◦ ${pre}mutegc
│ ◦ ${pre}unmutegc
│ ◦ ${pre}kick
│ ◦ ${pre}warn
│ ◦ ${pre}unwarn
│ ◦ ${pre}listwarn
│ ◦ ${pre}listadmin
│ ◦ ${pre}listmember
│ ◦ ${pre}infogrup
│ ◦ ${pre}ban
│ ◦ ${pre}unban
│ ◦ ${pre}absen
└ ◦ ${pre}autorespon
${garis}
📊 TOTAL: *39 FITUR*
`.trim());

    case 'info': case 'informasi': case 'menu info':
      return sc(`
╔═══════════════════════════╗
   ℹ️ MENU INFORMASI
╚═══════════════════════════╝
┌ ◦ ${pre}beritabaru
│ ◦ ${pre}cuaca
│ ◦ ${pre}gempa
│ ◦ ${pre}jadwalsholat
│ ◦ ${pre}bmkg
│ ◦ ${pre}cekresi
│ ◦ ${pre}cekongkir
│ ◦ ${pre}kodepos
│ ◦ ${pre}artinama
│ ◦ ${pre}artimimpi
│ ◦ ${pre}zodiak
│ ◦ ${pre}ramalan
│ ◦ ${pre}harilibur
│ ◦ ${pre}kursmatauang
│ ◦ ${pre}cekip
│ ◦ ${pre}whois
│ ◦ ${pre}ceknomor
│ ◦ ${pre}tvonline
└ ◦ ${pre}liburnasional
${garis}
📊 TOTAL: *18 FITUR*
`.trim());

    case 'download': case 'dl': case 'menu dl': case 'menu download':
      return sc(`
╔═══════════════════════════╗
   ⬇️ MENU DOWNLOAD
╚═══════════════════════════╝
┌ ◦ ${pre}tiktok
│ ◦ ${pre}facebook
│ ◦ ${pre}instagram
│ ◦ ${pre}youtube
│ ◦ ${pre}ytmp3
│ ◦ ${pre}ytmp4
│ ◦ ${pre}twitter
│ ◦ ${pre}xdl
│ ◦ ${pre}threads
│ ◦ ${pre}capcut
│ ◦ ${pre}snackvideo
│ ◦ ${pre}likee
│ ◦ ${pre}spotify
│ ◦ ${pre}soundcloud
│ ◦ ${pre}pinterest
│ ◦ ${pre}mediafire
│ ◦ ${pre}googledrive
│ ◦ ${pre}sfile
│ ◦ ${pre}pixiv
└ ◦ ${pre}bstation
${garis}
📊 TOTAL: *19 FITUR*
`.trim());

    case 'cari': case 'search': case 'menu cari':
      return sc(`
╔═══════════════════════════╗
   🔍 MENU PENCARIAN
╚═══════════════════════════╝
┌ ◦ ${pre}ytsearch
│ ◦ ${pre}fbsearch
│ ◦ ${pre}lyric
│ ◦ ${pre}play
│ ◦ ${pre}quotes
│ ◦ ${pre}wikipedia
│ ◦ ${pre}google
│ ◦ ${pre}gambar
│ ◦ ${pre}aitanya
│ ◦ ${pre}resep
│ ◦ ${pre}kamus
│ ◦ ${pre}tafsirmimpi
│ ◦ ${pre}cerita
│ ◦ ${pre}loker
│ ◦ ${pre}film
│ ◦ ${pre}liriklagu
└ ◦ ${pre}kosakata
${garis}
📊 TOTAL: *16 FITUR*
`.trim());

    case 'fun': case 'menu fun':
      return sc(`
╔═══════════════════════════╗
   🎮 MENU FUN
╚═══════════════════════════╝
┌ ◦ ${pre}cekpacar
│ ◦ ${pre}cekjodoh
│ ◦ ${pre}cekganteng
│ ◦ ${pre}cekcantik
│ ◦ ${pre}cekimut
│ ◦ ${pre}cekgila
│ ◦ ${pre}cekstress
│ ◦ ${pre}cekgay
│ ◦ ${pre}ceklesby
│ ◦ ${pre}cekjomok
│ ◦ ${pre}cekwibu
│ ◦ ${pre}ceksultan
│ ◦ ${pre}cekpintar
│ ◦ ${pre}cekbaik
│ ◦ ${pre}cekjahat
│ ◦ ${pre}ceksetan
│ ◦ ${pre}cekdewasa
│ ◦ ${pre}cekbocil
│ ◦ ${pre}cekjomblo
│ ◦ ${pre}cekwangi
│ ◦ ${pre}cekbau
│ ◦ ${pre}cekasmara
│ ◦ ${pre}cekhodam
│ ◦ ${pre}cekrezeki
│ ◦ ${pre}cekhoki
│ ◦ ${pre}cekwatak
│ ◦ ${pre}cantik
│ ◦ ${pre}ganteng
│ ◦ ${pre}imut
│ ◦ ${pre}lesby
│ ◦ ${pre}gay
│ ◦ ${pre}jomok
│ ◦ ${pre}gila
│ ◦ ${pre}stress
│ ◦ ${pre}toblack
│ ◦ ${pre}togreen
│ ◦ ${pre}toorange
│ ◦ ${pre}toblue
│ ◦ ${pre}topink
│ ◦ ${pre}horoskop
│ ◦ ${pre}truthordare
│ ◦ ${pre}dare
│ ◦ ${pre}truth
│ ◦ ${pre}gombal
│ ◦ ${pre}pantun
│ ◦ ${pre}suratcinta
│ ◦ ${pre}paptembok
│ ◦ ${pre}hina
│ ◦ ${pre}puji
│ ◦ ${pre}tebaksifat
│ ◦ ${pre}apaiya
│ ◦ ${pre}bagram
│ ◦ ${pre}samek
└ ◦ ${pre}khodam
${garis}
📊 TOTAL: *55 FITUR*
`.trim());

    case 'operator': case 'menu owner':
      return sc(`
╔═══════════════════════════╗
   👑 MENU KHUSUS OWNER
╚═══════════════════════════╝
┌ ◦ ${pre}addowner
│ ◦ ${pre}delowner
│ ◦ ${pre}mute
│ ◦ ${pre}unmute
│ ◦ ${pre}join
│ ◦ ${pre}out
│ ◦ ${pre}leaveall
│ ◦ ${pre}broadcast
│ ◦ ${pre}bcgrup
│ ◦ ${pre}block
│ ◦ ${pre}unblock
│ ◦ ${pre}banuser
│ ◦ ${pre}unbanuser
│ ◦ ${pre}setprefix
│ ◦ ${pre}setmode
│ ◦ ${pre}eval
│ ◦ ${pre}exec
│ ◦ ${pre}termux
│ ◦ ${pre}getfile
│ ◦ ${pre}getsesi
│ ◦ ${pre}clearall
│ ◦ ${pre}pushkontak
│ ◦ ${pre}antiblokir
│ ◦ ${pre}autoonline
└ ◦ ${pre}forcerestart
${garis}
📊 TOTAL: *25 FITUR*
`.trim());

    case 'game': case 'games': case 'menu game':
      return sc(`
╔═══════════════════════════╗
   🎯 MENU GAME
╚═══════════════════════════╝
┌ ◦ ${pre}caklontong
│ ◦ ${pre}family100
│ ◦ ${pre}tebakkata
│ ◦ ${pre}tebaklagu
│ ◦ ${pre}tebakanime
│ ◦ ${pre}tebakheroml
│ ◦ ${pre}tebakkartun
│ ◦ ${pre}tebakartis
│ ◦ ${pre}tebakff
│ ◦ ${pre}tebakpubg
│ ◦ ${pre}tebakorganisasi
│ ◦ ${pre}tebaknegara
│ ◦ ${pre}tebaksamudra
│ ◦ ${pre}tebakbenua
│ ◦ ${pre}tebakelemen
│ ◦ ${pre}tebakkrakter
│ ◦ ${pre}tebakgunung
│ ◦ ${pre}tebakpulau
│ ◦ ${pre}tebakprovinsi
│ ◦ ${pre}tebakyoutuber
│ ◦ ${pre}tebakvtuber
│ ◦ ${pre}tebakgame
│ ◦ ${pre}tebakapk
│ ◦ ${pre}tebakbendera
│ ◦ ${pre}tebaklirik
│ ◦ ${pre}tebakemoji
│ ◦ ${pre}tebakmakanan
│ ◦ ${pre}tebakminuman
│ ◦ ${pre}tebakhewan
│ ◦ ${pre}tebaktumbuhan
│ ◦ ${pre}tebakpekerjaan
│ ◦ ${pre}tebakalat
│ ◦ ${pre}tictactoe
│ ◦ ${pre}susunkata
│ ◦ ${pre}ulartangga
│ ◦ ${pre}suit
│ ◦ ${pre}tekateki
│ ◦ ${pre}sambungkata
│ ◦ ${pre}mathquiz
│ ◦ ${pre}quiz
│ ◦ ${pre}dadu
│ ◦ ${pre}coinflip
│ ◦ ${pre}roulette
│ ◦ ${pre}slot
│ ◦ ${pre}balapankucing
└ ◦ ${pre}tebaksuara
${garis}
📊 TOTAL: *47 FITUR*
`.trim());

    case 'rpg': case 'menu rpg':
      return sc(`
╔═══════════════════════════╗
   ⚔️ MENU RPG PETUALANGAN
╚═══════════════════════════╝
┌ ◦ ${pre}mancing
│ ◦ ${pre}menambang
│ ◦ ${pre}berkebun
│ ◦ ${pre}explore
│ ◦ ${pre}shop
│ ◦ ${pre}berburu
│ ◦ ${pre}bertarung
│ ◦ ${pre}duel
│ ◦ ${pre}inventory
│ ◦ ${pre}profil
│ ◦ ${pre}upgrade
│ ◦ ${pre}gacha
│ ◦ ${pre}daily
│ ◦ ${pre}weekly
│ ◦ ${pre}monthly
│ ◦ ${pre}quest
│ ◦ ${pre}misi
│ ◦ ${pre}pasar
│ ◦ ${pre}kerja
│ ◦ ${pre}nikah
│ ◦ ${pre}cerai
│ ◦ ${pre}rumah
│ ◦ ${pre}kendaraan
│ ◦ ${pre}peliharaan
│ ◦ ${pre}prestasi
│ ◦ ${pre}peringkat
└ ◦ ${pre}topup
${garis}
📊 TOTAL: *26 FITUR*
`.trim());

    case 'stiker': case 'menus': case 'menu stiker':
      return sc(`
╔═══════════════════════════╗
   🎨 MENU STIKER
╚═══════════════════════════╝
┌ ◦ ${pre}stiker
│ ◦ ${pre}stikernobg
│ ◦ ${pre}stikermeme
│ ◦ ${pre}brat
│ ◦ ${pre}bratvid
│ ◦ ${pre}iqc
│ ◦ ${pre}qc
│ ◦ ${pre}togif
│ ◦ ${pre}tovideo
│ ◦ ${pre}take
│ ◦ ${pre}tulisstiker
│ ◦ ${pre}stikerteks
│ ◦ ${pre}rotate
│ ◦ ${pre}cermin
└ ◦ ${pre}gabungstiker
${garis}
📊 TOTAL: *14 FITUR*
`.trim());

    case 'user': case 'user info': case 'menu user':
      return sc(`
╔═══════════════════════════╗
   👤 MENU USER & PROFIL
╚═══════════════════════════╝
┌ ◦ ${pre}buy
│ ◦ ${pre}claim
│ ◦ ${pre}daftar
│ ◦ ${pre}limit
│ ◦ ${pre}level
│ ◦ ${pre}localrank
│ ◦ ${pre}me
│ ◦ ${pre}point
│ ◦ ${pre}rank
│ ◦ ${pre}tfpoint
│ ◦ ${pre}tflimit
│ ◦ ${pre}tfmoney
│ ◦ ${pre}nikah
│ ◦ ${pre}pasangan
│ ◦ ${pre}cerai
│ ◦ ${pre}topglobal
│ ◦ ${pre}toplokal
│ ◦ ${pre}harian
│ ◦ ${pre}gift
│ ◦ ${pre}kirimhadiah
│ ◦ ${pre}upgradeprem
│ ◦ ${pre}status
│ ◦ ${pre}bukaakun
│ ◦ ${pre}hapusakun
│ ◦ ${pre}absen
│ ◦ ${pre}spin
│ ◦ ${pre}undian
└ ◦ ${pre}premium
${garis}
📊 TOTAL: *27 FITUR*
`.trim());

    case 'random': case 'acak': case 'menu random':
      return sc(`
╔═══════════════════════════╗
   🎲 MENU RANDOM
╚═══════════════════════════╝
┌ ◦ ${pre}tembak
│ ◦ ${pre}tolak
│ ◦ ${pre}faktaunik
│ ◦ ${pre}katakata
│ ◦ ${pre}pantunrandom
│ ◦ ${pre}gombalrandom
│ ◦ ${pre}quoterandom
│ ◦ ${pre}ceritahoror
│ ◦ ${pre}ceritalucu
│ ◦ ${pre}memerandom
│ ◦ ${pre}videorandom
│ ◦ ${pre}waifurandom
│ ◦ ${pre}husburandom
│ ◦ ${pre}namarandom
│ ◦ ${pre}nomorrandom
│ ◦ ${pre}angkarandom
│ ◦ ${pre}warnarandom
│ ◦ ${pre}emojirandom
│ ◦ ${pre}negararandom
│ ◦ ${pre}kotarandom
│ ◦ ${pre}makananrandom
│ ◦ ${pre}minumanrandom
│ ◦ ${pre}lagurandom
│ ◦ ${pre}filmrandom
│ ◦ ${pre}ucapanselamat
│ ◦ ${pre}tantangan
│ ◦ ${pre}hukuman
│ ◦ ${pre}keberuntungan
│ ◦ ${pre}rezekihariini
│ ◦ ${pre}mimpiburuk
│ ◦ ${pre}saranmakan
│ ◦ ${pre}saranminum
│ ◦ ${pre}sarantonton
│ ◦ ${pre}saranlagu
│ ◦ ${pre}pigeon
│ ◦ ${pre}youdie
│ ◦ ${pre}youlive
│ ◦ ${pre}pilihak
│ ◦ ${pre}apayang
└ ◦ ${pre}jwbacok
${garis}
📊 TOTAL: *39 FITUR*
`.trim());

    default:
      return sc(`
⚠️ MENU *${namaMenu}* BELUM TERSEDIA ATAU SALAH KETIK!
KETIK ${pre}MENU UNTUK MELIHAT DAFTAR MENU YANG ADA.
`.trim());
  }
}

function hitungTotalSemuaFitur() {
  const detail = {
    bot: 16,
    anime: 18,
    tools: 21,
    grup: 39,
    info: 18,
    download: 19,
    cari: 16,
    fun: 55,
    operator: 25,
    game: 47,
    rpg: 26,
    stiker: 14,
    user: 27,
    random: 39
  };
  const total = Object.values(detail).reduce((sum, v) => sum + v, 0);
  return { total, detail };
}

module.exports = { tampilkanSubMenu, hitungTotalSemuaFitur, sc };

