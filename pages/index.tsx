import { Box, Button, Flex, Heading, Hide, Input, Show, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import Head from 'next/head'
import Image from 'next/image'
import { SetStateAction, useState } from 'react'
import FeatherIcon from 'feather-icons-react';

import { Error, Song } from 'npo'

export default function Home() {
  const [isLoading, setLoading] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const [songList, setSongList] = useState<Song[]>([])


  const changeShareUrl = (event: { target: { value: SetStateAction<string> } }) => setShareUrl(event.target.value)

  const shareUrlInvalid = (): boolean => {
    if (shareUrl === "") return true
    return false
  }

  const checkSongs = async () => {
    setLoading(true)
    const sharing_id = shareUrl.split("/").pop() // user song list ID
    const fetchedSongList = await fetch(`/api/check?share_url=${sharing_id}`).then(r => r.json())
    setSongList(fetchedSongList)
    setLoading(false)
  }

  const reset = () => {
    setSongList([])
  }

  return (
    <div>
      <Head>
        <title>Top2000 song check</title>
        <meta name="description" content="Check if your songs made it to the top2000" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Flex alignItems="center" flexDirection="column" wrap="wrap">
          <Heading my={8} as="h1">Top2000 automatic check</Heading>
          {(songList.length === 0 || isLoading) &&
            <>
              <Box mb={6} maxWidth="95%">
                This app works by pasting your sharing URL in the box below. Once you click on Check, the app will automatically verify all of your songs,
                and tell you if they made it to the top2000 or not!
              </Box>
              <Input width={750} maxWidth="95%" mb={6} value={shareUrl} onChange={changeShareUrl} isInvalid={shareUrlInvalid()} placeholder='Sharing url' />
              <Button colorScheme='blue' onClick={checkSongs} disabled={shareUrlInvalid()}>Check</Button>
            </>
          }
          {isLoading && <div>Checking your song list...</div>}
          {songList.length > 0 && <div>
            <Button colorScheme='blue' onClick={reset}>Back</Button>
            <TableContainer>
              <Table size={{ lg: 'md', md: 'sm' }}>
                <Thead>
                  <Tr>
                    <Show above="sm">
                      <Th></Th>
                      <Th>Artist</Th>
                    </Show>
                    <Hide above="sm">
                      <Th>TOP</Th>
                    </Hide>
                    <Th>Title</Th>
                    <Show above="sm">
                      <Th>Rank</Th>
                      <Th>Broadcast time</Th>
                      <Th>History</Th>
                    </Show>
                  </Tr>
                </Thead>
                <Tbody>
                  {songList.map(song =>
                    <Tr key={song.title}>
                      <Show above="sm">
                        {song.coverUrl ?
                          <Td p={1}><Image src={song.coverUrl} width='44' height='44' alt={song.title}></Image></Td>
                          :
                          !song.coverUrl && <Td p={1}><Image src="/default.png" width='44' height='44' alt={song.title}></Image></Td>
                        }
                        <Td>{song.artist}</Td>
                      </Show>
                      <Hide above="sm">
                        <Td>{song.position.current ? <FeatherIcon icon="check" color="green" /> : <FeatherIcon icon="x" color="red" />}</Td>
                      </Hide>
                      <Td>{song.title}</Td>
                      <Show above="sm">
                        <Td>{song.position.current ?
                          song.position.current > song.position.previous ?
                            <Flex><FeatherIcon icon="chevron-up" color="green" />{song.position.current}</Flex>
                            : song.position.current < song.position.previous ?
                              <Flex><FeatherIcon icon="chevron-down" color="orange" />{song.position.current}</Flex>
                              : <Flex><FeatherIcon icon="minus" />{song.position.current}</Flex>
                          : <FeatherIcon icon="x" color="red" />}</Td>
                        <Td>{song.broadcastTime &&
                          new Date(song.broadcastTime).toLocaleString('nl-NL', { timeZone: 'Europe/Amsterdam', month: 'short', day: 'numeric', hour: 'numeric', minute: "numeric" })}</Td>
                        <Td>{song.historyUrl &&
                          (song.position.current >= song.position.previous ?
                            <a href={"https://www.nporadio2.nl" + song.historyUrl} target="_blank" rel="noopener noreferrer"><FeatherIcon icon="trending-up" /></a>
                            : <a href={"https://www.nporadio2.nl" + song.historyUrl} target="_blank" rel="noopener noreferrer"><FeatherIcon icon="trending-down" /></a>
                          )}</Td>
                      </Show>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </TableContainer>
          </div>}
        </Flex>
      </main>
    </div>
  )
}
