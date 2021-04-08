const resMap = {
  'r': 'br.png',
  'n': 'bn.png',
  'b': 'bb.png',
  'a': 'ba.png',
  'k': 'bk.png',
  'c': 'bc.png',
  'p': 'bp.png',
  'R': 'rr.png',
  'N': 'rn.png',
  'B': 'rb.png',
  'A': 'ra.png',
  'K': 'rk.png',
  'C': 'rc.png',
  'P': 'rp.png',
  ' ': 'nop.png'
}

const codeA = 'a'.charCodeAt(0)
const code0 = '0'.charCodeAt(0)
const initFen = 'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w - - 0 1'
const initPos = 'startpos'
function pcRes (pc) {
  return resMap[pc]
}

function getMove (srcX, srcY, dstX, dstY) {
  return String.fromCharCode(codeA + srcX, code0 + 9 - srcY, codeA + dstX, code0 + 9 - dstY)
}

function parseMove (move) {
  return {
    srcX: move.charCodeAt(0) - codeA,
    srcY: 9 - (move.charCodeAt(1) - code0),
    dstX: move.charCodeAt(2) - codeA,
    dstY: 9 - (move.charCodeAt(3) - code0)
  }
}

function newInitSquares () {
  return [
    ['r', 'n', 'b', 'a', 'k', 'a', 'b', 'n', 'r'],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', 'c', ' ', ' ', ' ', ' ', ' ', 'c', ' '],
    ['p', ' ', 'p', ' ', 'p', ' ', 'p', ' ', 'p'],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ['P', ' ', 'P', ' ', 'P', ' ', 'P', ' ', 'P'],
    [' ', 'C', ' ', ' ', ' ', ' ', ' ', 'C', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ['R', 'N', 'B', 'A', 'K', 'A', 'B', 'N', 'R']
  ]
}

function newEmptySquares () {
  return [
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']
  ]
}

function parseFen (fenStr) {
  let parts = fenStr.split(' ')
  let fenPart = parts[0]
  let squares = newEmptySquares()
  let x = 0
  let y = 0
  for (let i = 0; i < fenPart.length; i++) {
    let c = fenPart.charCodeAt(i) - code0
    if (c >= 0 && c <= 9) {
      x += c
    } else if (fenPart.charAt(i) === '/') {
      x = 0
      y++
    } else {
      squares[y][x] = fenPart.charAt(i)
      x++
    }
  }
  let isRed = parts[1] !== 'b'
  return {
    pcSquares: squares,
    isRed: isRed
  }
}

function toFen (pcSquares, isRed) {
  let fen = ''
  for (let y = 0; y < 10; y++) {
    if (y !== 0) {
      fen += '/'
    }
    let spaceCount = 0
    for (let i = 0; i < 9; i++) {
      if (pcSquares[y][i] !== ' ') {
        if (spaceCount > 0) {
          fen += spaceCount
          spaceCount = 0
        }
        fen += pcSquares[y][i]
      } else {
        spaceCount++
      }
    }
    if (spaceCount > 0) {
      fen += spaceCount
      spaceCount = 0
    }
  }
  fen += ' '
  fen += isRed ? 'w' : 'b'
  fen += ' - - 0 1'
  return fen
}

function isSelfPiece (square, isRed, x, y) {
  return isRed ? ['R', 'N', 'B', 'A', 'C', 'K', 'P'].includes(square[y][x])
    : ['r', 'n', 'b', 'a', 'c', 'k', 'p'].includes(square[y][x])
}

export default {
  pcRes,
  getMove,
  parseMove,
  parseFen,
  toFen,
  newInitSquares,
  newEmptySquares,
  isSelfPiece,
  initFen,
  initPos
}
