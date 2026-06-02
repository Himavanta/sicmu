import ky from 'ky'

export async function getCurrentUserMid(): Promise<number> {
  const data: any = await ky
    .get('https://api.bilibili.com/x/web-interface/nav', { credentials: 'include' })
    .json()
  return data.data.mid
}
