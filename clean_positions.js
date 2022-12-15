import fs from "fs"
import positions from './positions.json' assert { type: "json" };

const light_positions = positions.positions.map(song => {
  return {
    artist: song.track.artist,
    title: song.track.title,
    historyUrl: song.track.historyUrl,
    coverUrl: song.track.coverUrl,
    previewUrl: song.track.previewUrl,
    broadcastTime: song.broadcastUnixTime,
    position: {
      current: song.position.current,
      previous: song.position.previous,
    }
  }
})

fs.writeFile('./positions_light.json', JSON.stringify(light_positions), err => {
  if (err) {
    console.error(err);
  }
  console.log('done!')
});