import type { NextApiRequest, NextApiResponse } from 'next'

const song_list_base = "https://backend.stem.nporadio.nl/api/form/top2000-2022/"
const song_search_base = "https://staatieindetop2000.nporadio2.nl/api/search"
const song_check_base = "https://staatieindetop2000.nporadio2.nl/_next/data/L8Fe722VQOI3qFPZh612B/"

type Song = {
  id: number
  title: string
  artist: string
  inList: boolean
  image?: string
}
type SongList = {
  songs: Song[]
}

type Error = {
  error: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SongList | Error>
) {
  const sharing_id: string | undefined = String(req.query.share_url) // user song list url

  if (!sharing_id) return res.json({ error: "no sharing url provided" })

  const song_list_raw = await fetch(song_list_base + sharing_id).then(r => r.json()).catch(e => ({ error: true }))

  if (song_list_raw.error) return res.status(404).json({ error: "could not fetch your song list" })

  const song_list = song_list_raw.shortlist

  let song_list_checked: Array<Song> = []

  for (const song of song_list) {
    const get_slug_url = `${song_search_base}?artist=${song._source.artist.replace('&', '-')}&title=${song._source.title.replace('&', '-')}`
    const song_slug = await fetch(get_slug_url).then(r => r.json())
    const song_details = await fetch(`${song_check_base + song_slug.slug}.json`).then(r => r.json())
    song_list_checked = [...song_list_checked, { id: Number(song._id), title: song._source.title, artist: song._source.artist, image: song._source.image, inList: song_details.pageProps.inList }]
  }

  res.status(200).json({ songs: song_list_checked })
}
