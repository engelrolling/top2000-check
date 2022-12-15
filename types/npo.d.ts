declare module "npo" {
  interface Song {
    artist: string
    title: string
    historyUrl?: string
    coverUrl: string | null
    previewUrl?: string
    broadcastTime?: number
    position: {
      current: number,
      previous: number
    }
  }

  interface Error {
    error: string
  }
}