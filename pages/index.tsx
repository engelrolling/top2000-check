import { Box, Button, Flex, Heading, Hide, Input, Link, Show, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
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
        <title>My Top2000</title>
        <meta name="description" content="Check if your songs made it to the top2000" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Flex minHeight="100vh" flexDirection="column">
          <Flex alignItems="center" flexDirection="column" flex={1} wrap="wrap">
            <Heading my={10} as="h1">My TOP2000</Heading>
            {(songList.length === 0 || isLoading) &&
              <>
                <Box mb={8} maxWidth="95%">
                  Enter your sharing link in the box below. Once you click on Check, the app will automatically show you the position and brodcasting time of the songs you voted for!
                </Box>
                <Box mb={8} maxWidth="95%">
                  To see your song broadcasting time, history and ranking, rotate your phone to landcape mode.
                </Box>
                <Input width={750} maxWidth="95%" mb={6} value={shareUrl} onChange={changeShareUrl} isInvalid={shareUrlInvalid()} placeholder='Sharing link' />
                <Button colorScheme='blue' onClick={checkSongs} disabled={shareUrlInvalid()}>Check</Button>
              </>
            }
            {isLoading && <div>Checking your song list...</div>}
            {songList.length > 0 && <div>
              <Box mb={2} onClick={reset}><Flex><FeatherIcon icon="chevron-left" size="18"></FeatherIcon> Back</Flex></Box>
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
                        <Th>Broadcast</Th>
                        <Th></Th>
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
                          <Td>
                            {!song.position.current && <FeatherIcon icon="x" color="red" />}
                            {(!!song.position.current && song.position.previous === 0)
                              && <Flex><FeatherIcon icon="plus" color="green" />{song.position.current}</Flex>}
                            {(!!song.position.current && song.position.current < song.position.previous)
                              && <Flex><FeatherIcon icon="chevron-up" color="green" />{song.position.current}</Flex>}
                            {(!!song.position.current && song.position.current > song.position.previous && song.position.previous !== 0)
                              && <Flex><FeatherIcon icon="chevron-down" color="orange" />{song.position.current}</Flex>}
                            {(!!song.position.current && song.position.current === song.position.previous)
                              && <Flex><FeatherIcon icon="minus" />{song.position.current}</Flex>}
                          </Td>
                          <Td>{song.broadcastTime &&
                            new Date(song.broadcastTime).toLocaleString('nl-NL', { timeZone: 'Europe/Amsterdam', month: 'short', day: 'numeric', hour: 'numeric', minute: "numeric" })}</Td>
                          <Td>{song.historyUrl &&
                            (song.position.current <= song.position.previous ?
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
          <Box p={2} pt={4}>
            This site does not use any cookie 🍪. <br />
            Made with ♥️ by <Link href="https://github.com/engelrolling" isExternal color="teal.500">Guillaume</Link>. Source available <Link href="https://github.com/engelrolling/my-top2000" isExternal color="teal.500">here</Link>.
          </Box>
        </Flex>
      </main>
    </div>
  )
}
