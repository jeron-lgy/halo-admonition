export interface LinkMetadata {
  url: string
  host: string
  platform: string
  siteName: string
  title: string
  description: string
  iconUrl: string
  imageUrl: string
  source: 'api' | 'page' | 'fallback'
}

export async function readLinkMetadata(url: string): Promise<LinkMetadata> {
  const response = await fetch(
    `/apis/console.api.halo-admonition.jeronlgy.github.io/v1alpha1/link-metadata?url=${encodeURIComponent(url)}`,
    { credentials: 'same-origin', headers: { Accept: 'application/json' } },
  )
  if (!response.ok) {
    const payload = await response.json().catch(() => undefined) as { message?: string } | undefined
    throw new Error(payload?.message || `读取失败（HTTP ${response.status}）`)
  }
  return response.json() as Promise<LinkMetadata>
}
