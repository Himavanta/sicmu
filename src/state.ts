import { reactive, computed } from 'vue'

/* ── 类型定义 ── */

export interface Song {
  id: number
  bvid: string
  title: string
  artist: string
  duration: number
  cid?: number
}

/* ── 播放列表 ── */

const defaultPlaylist: Song[] = [
  { id: 1, bvid: 'BV1AUDWBvEF3', title: '午夜旋律', artist: 'Sicmu', duration: 230 },
  { id: 2, bvid: 'BV1AUDWBvEF3', title: '城市之光', artist: 'Sicmu', duration: 252 },
  { id: 3, bvid: 'BV1AUDWBvEF3', title: '星河', artist: 'Sicmu', duration: 208 },
  { id: 4, bvid: 'BV1AUDWBvEF3', title: '雨后', artist: 'Sicmu', duration: 301 },
  { id: 5, bvid: 'BV1AUDWBvEF3', title: '晨曦', artist: 'Sicmu', duration: 235 },
]

/* ── 状态 ── */

export interface PlayerState {
  playlist: Song[]
  currentIndex: number
  playing: boolean
  currentTime: number
  loading: boolean
}

export const state = reactive<PlayerState>({
  playlist: defaultPlaylist,
  currentIndex: 1,
  playing: false,
  currentTime: 0,
  loading: false,
})

export const currentSong = computed(() => state.playlist[state.currentIndex])

export const duration = computed(() => state.playlist[state.currentIndex].duration)

export const progress = computed(() =>
  duration.value > 0 ? (state.currentTime / duration.value) * 100 : 0,
)

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

/* ── MD5（轻量实现） ── */

function md5(s: string): string {
  function rotl(x: number, n: number) {
    return (x << n) | (x >>> (32 - n))
  }
  function toBytes(s: string) {
    const bytes: number[] = []
    for (let i = 0; i < s.length; i++) {
      const c = s.charCodeAt(i)
      if (c < 0x80) bytes.push(c)
      else if (c < 0x800) bytes.push(0xc0 | (c >> 6), 0x80 | (c & 0x3f))
      else {
        bytes.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 0x3f), 0x80 | (c & 0x3f))
      }
    }
    return bytes
  }

  const k = [
    0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee, 0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501,
    0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be, 0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821,
    0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa, 0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
    0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed, 0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a,
    0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c, 0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70,
    0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05, 0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
    0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039, 0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
    0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1, 0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391,
  ]
  const sBits = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9,
    14, 20, 5, 9, 14, 20, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 6, 10, 15, 21,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
  ]

  const bytes = toBytes(s)
  const bitLen = bytes.length * 8
  bytes.push(0x80)
  while (bytes.length % 64 !== 56) bytes.push(0)
  for (let i = 0; i < 8; i++) bytes.push((bitLen >>> (i * 8)) & 0xff)

  let h0 = 0x67452301,
    h1 = 0xefcdab89,
    h2 = 0x98badcfe,
    h3 = 0x10325476

  for (let i = 0; i < bytes.length; i += 64) {
    const w: number[] = []
    for (let j = 0; j < 16; j++) {
      w[j] =
        bytes[i + j * 4] |
        (bytes[i + j * 4 + 1] << 8) |
        (bytes[i + j * 4 + 2] << 16) |
        (bytes[i + j * 4 + 3] << 24)
    }
    let a = h0,
      b = h1,
      c = h2,
      d = h3
    for (let j = 0; j < 64; j++) {
      const f =
        j < 16
          ? (b & c) | (~b & d)
          : j < 32
            ? (d & b) | (~d & c)
            : j < 48
              ? b ^ c ^ d
              : c ^ (b | ~d)
      const g = j < 16 ? j : j < 32 ? (5 * j + 1) % 16 : j < 48 ? (3 * j + 5) % 16 : (7 * j) % 16
      const tmp = d
      d = c
      c = b
      b = b + rotl(a + f + k[j] + w[g], sBits[j])
      a = tmp
    }
    h0 = (h0 + a) | 0
    h1 = (h1 + b) | 0
    h2 = (h2 + c) | 0
    h3 = (h3 + d) | 0
  }

  function toHex(n: number) {
    const hex = '0123456789abcdef'
    let s = ''
    for (let i = 0; i < 4; i++) {
      s = hex[(n >>> (i * 8 + 4)) & 0xf] + hex[(n >>> (i * 8)) & 0xf] + s
    }
    return s
  }

  return toHex(h0) + toHex(h1) + toHex(h2) + toHex(h3)
}

/* ── B站 API ── */

const mixinKeyEncTab = [
  46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35, 27, 43, 5, 49, 33, 9, 42, 19, 29, 28,
  14, 37, 12, 52, 56, 7, 0, 16, 38, 11, 54, 55, 54, 34, 36, 51, 6, 21, 40, 26, 41, 44, 17, 46, 52,
  17, 25, 60, 59, 13, 39, 49, 56, 4,
]

function getMixinKey(keys: string): string {
  let mixin = ''
  for (const i of mixinKeyEncTab) {
    mixin += keys[i] || ''
  }
  return mixin.slice(0, 32)
}

async function getWbiKeys(): Promise<{ imgKey: string; subKey: string }> {
  const resp = await fetch('https://api.bilibili.com/x/web-interface/nav', {
    credentials: 'include',
  })
  const data = await resp.json()
  const imgUrl: string = data.data.wbi_img.img_url
  const subUrl: string = data.data.wbi_img.sub_url
  const imgKey = imgUrl.split('/').pop()!.split('.')[0]
  const subKey = subUrl.split('/').pop()!.split('.')[0]
  return { imgKey, subKey }
}

async function encryptWbi(
  params: Record<string, string | number>,
): Promise<Record<string, string | number>> {
  const { imgKey, subKey } = await getWbiKeys()
  const mixinKey = getMixinKey(imgKey + subKey)
  const wts = Math.floor(Date.now() / 1000)
  const sorted = Object.keys(params).sort()
  const query = sorted
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(String(params[k]))}`)
    .join('&')
  const signStr = query + mixinKey
  const wRid = md5(signStr)
  return { ...params, wts, w_rid: wRid }
}

async function getVideoCid(bvid: string): Promise<number> {
  const resp = await fetch(`https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`, {
    credentials: 'include',
  })
  const data = await resp.json()
  return data.data.cid
}

async function getPlayUrl(bvid: string, cid: number): Promise<string> {
  const params = await encryptWbi({
    bvid,
    cid,
    fnval: 1,
    qn: 16,
  })
  const qs = Object.entries(params)
    .map(([k, v]) => `${k}=${v}`)
    .join('&')
  const resp = await fetch(`https://api.bilibili.com/x/player/wbi/playurl?${qs}`, {
    credentials: 'include',
  })
  const data = await resp.json()
  return data.data.durl[0].url
}

/* ── 音频管理 ── */

let audio: HTMLAudioElement | null = null
function ensureAudio(): HTMLAudioElement {
  if (!audio) {
    audio = new Audio()
    audio.addEventListener('timeupdate', () => {
      if (audio && !audio.paused) {
        state.currentTime = Math.floor(audio.currentTime)
        state.playing = true
      }
    })
    audio.addEventListener('ended', () => {
      state.playing = false
      state.currentTime = 0
      next()
    })
    audio.addEventListener('waiting', () => {
      state.loading = true
    })
    audio.addEventListener('canplay', () => {
      state.loading = false
    })
    audio.addEventListener('error', () => {
      state.loading = false
    })
  }
  return audio
}

/* ── 播放控制 ── */

export async function play(index: number) {
  const song = state.playlist[index]
  if (!song) return

  state.currentIndex = index
  state.currentTime = 0
  state.loading = true

  try {
    const el = ensureAudio()

    // 获取 cid
    if (!song.cid) {
      song.cid = await getVideoCid(song.bvid)
    }

    // 获取播放地址
    const url = await getPlayUrl(song.bvid, song.cid)

    el.src = url
    await el.play()
    state.playing = true
  } catch (e) {
    console.error('播放失败:', e)
    state.playing = false
    state.loading = false
  }
}

export function togglePlay() {
  const el = ensureAudio()
  if (state.playing) {
    el.pause()
    state.playing = false
  } else if (el.src) {
    el.play()
    state.playing = true
  } else {
    play(state.currentIndex)
  }
}

export function next() {
  const nextIdx = (state.currentIndex + 1) % state.playlist.length
  play(nextIdx)
}

export function prev() {
  const prevIdx = (state.currentIndex - 1 + state.playlist.length) % state.playlist.length
  play(prevIdx)
}
