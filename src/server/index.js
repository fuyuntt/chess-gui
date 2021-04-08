import axios from 'axios'

async function isLegalMove (position, move) {
  let resp = await axios.get('/api/is-legal-move', {params: {position: position, move: move}})
  return resp.data.isLegal
}

async function getLegalMoves (position, move) {
  let resp = await axios.get('/api/get-legal-moves', {params: {position: position, move: move}})
  return resp.data.legalMoves
}

async function think (position) {
  let resp = await axios.get('/api/think', {params: {position: position}})
  return {moves: resp.data.moves, score: resp.data.score}
}

export default {
  isLegalMove,
  getLegalMoves,
  think
}
