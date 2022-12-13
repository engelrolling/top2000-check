declare module "npo" {
  interface Song {
    id: number
    title: string
    artist: string
    inList: boolean
    image: string?
  }

  interface Error {
    error: string
  }
}