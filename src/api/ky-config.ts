import ky from 'ky'

export const biliApi = ky.extend({
  credentials: 'include',
  referrer: 'https://www.bilibili.com',
  headers: { Referer: 'https://www.bilibili.com' },
})
