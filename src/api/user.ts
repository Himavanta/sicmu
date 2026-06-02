import { biliApi } from './ky-config.ts'

export async function getCurrentUserMid(): Promise<number> {
  const data: any = await biliApi.get('https://api.bilibili.com/x/web-interface/nav').json()
  return data.data.mid
}
