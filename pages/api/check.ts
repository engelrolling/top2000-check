import type { NextApiRequest, NextApiResponse } from 'next'
import { Error, Song } from 'npo'
import positions from '../../positions_light.json' assert { type: "json" };

const song_list_base = "https://backend.stem.nporadio.nl/api/form/top2000-2022/"
const song_check_base = "https://staatieindetop2000.nporadio2.nl/_next/data/L8Fe722VQOI3qFPZh612B/"
const match_special_char = /[^-a-zA-Z0-9 ]/g
const match_spaces = / +/g

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Song[] | Error>
) {
  const sharing_id: string | undefined = String(req.query.share_url) // user song list url

  if (!sharing_id) return res.json({ error: "no sharing url provided" })

  const song_list_raw = await fetch(song_list_base + sharing_id).then(r => r.json()).catch(e => ({ error: true }))

  if (song_list_raw.error) return res.status(404).json({ error: "could not fetch your song list" })

  const song_list = song_list_raw.shortlist

  let song_list_checked: Array<Song> = []

  await Promise.all(song_list.map(async (song: any) => {
    // const artist_slug = song._source.artist.normalize("NFD").replace(/\p{Diacritic}/gu, "").replaceAll(match_special_char, '').replaceAll(match_spaces, "-").toLowerCase()
    // const song_slug = song._source.title.normalize("NFD").replace(/\p{Diacritic}/gu, "").replaceAll(match_special_char, '').replaceAll(match_spaces, "-").toLowerCase()
    // const slug_url = `/${artist_slug}/${song_slug}`
    // const song_details = await fetch(`${song_check_base + slug_url}.json`).then(r => r.json())
    // song_list_checked = [...song_list_checked, { id: Number(song._id), title: song._source.title, artist: song._source.artist, image: song._source.image, inList: song_details.pageProps.inList }]

    const song_details = positions.find(x => x.artist === song._source.artist && x.title === song._source.title)
    const song_defaults = {
      artist: song._source.artist,
      title: song._source.title,
      coverUrl: song._source.image,
      position: {
        current: 0,
        previous: 0,
      }
    }
    song_list_checked = [...song_list_checked, song_details || song_defaults]
  }))

  res.status(200).json(song_list_checked)
}
