import axios from 'axios'

async function isLegalMove (position, move) {
  let resp = await axios.get('/is-legal-move', {params: {position: position, move: move}})
  return resp.data.isLegal
}
async function think (position) {
  let resp = await axios.get('think', {params: {position: position}})
  return resp.data.move
}

export default {
  isLegalMove,
  think
}
