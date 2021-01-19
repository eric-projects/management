export function getPlatform(userAgent: string): 'wechat' | 'h5' | 'pc' {
  const ua = userAgent.toLowerCase();

  if (ua.match(/micromessenger/i)) {
    return 'wechat';
  }

  if (ua.match(/mobile/i)) {
    return 'h5';
  }

  return 'pc';
}
