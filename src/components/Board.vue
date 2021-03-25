<template>
<div class="board">
  <table>
    <tr class="sqRow" v-for="(row, idxY) in pcSquares" :key="idxY">
      <td class="square" v-for="(pc, idxX) in row" :key="idxX" @click="clickSq(idxX, idxY)">
        <img class="sqPc" v-show="selectSq.x===idxX && selectSq.y===idxY" src="../assets/selected.png" alt=""/>
        <img class="sqPc" :src="require('../assets/'+resMap[pc])" alt=""/>
      </td>
    </tr>
  </table>
  <div>
    <button @click="reset">重置</button>
  </div>
</div>
</template>

<script>
import server from '../server'
const initPcSquares = [
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
const initPosition = 'startpos'
const codeA = 'a'.charCodeAt(0)
const code0 = '0'.charCodeAt(0)
function getMove (srcX, srcY, dstX, dstY) {
  return String.fromCharCode(codeA + srcX, code0 + 9 - srcY, codeA + dstX, code0 + 9 - dstY)
}
export default {
  name: 'Board',
  data () {
    return {
      selectSq: {
        x: -1,
        y: -1
      },
      pcSquares: JSON.parse(JSON.stringify(initPcSquares)),
      resMap: resMap,
      playerRed: true,
      position: initPosition
    }
  },
  methods: {
    select (x, y) {
      if (this.pcSquares[y][x] !== ' ') {
        this.selectSq.x = x
        this.selectSq.y = y
      }
    },
    makeMove (move) {
      let srcX = move.charCodeAt(0) - codeA
      let srcY = 9 - (move.charCodeAt(1) - code0)
      let dstX = move.charCodeAt(2) - codeA
      let dstY = 9 - (move.charCodeAt(3) - code0)
      this.pcSquares[dstY][dstX] = this.pcSquares[srcY][srcX]
      this.pcSquares[srcY][srcX] = ' '
      this.select(dstX, dstY)
      if (this.position === initPosition) {
        this.position += ' moves'
      }
      this.position = this.position + ' ' + move
      this.playerRed = !this.playerRed
    },
    async clickSq (x, y) {
      if (!this.playerRed) {
        return
      }
      if (this.selectSq.x === -1) {
        this.select(x, y)
        return
      }
      let move = getMove(this.selectSq.x, this.selectSq.y, x, y)
      let isLegal = await server.isLegalMove(this.position, move)
      if (isLegal) {
        this.makeMove(move)
        let serverMove = await server.think(this.position)
        this.makeMove(serverMove)
      } else if (this.pcSquares[y][x] !== ' ') {
        this.select(x, y)
      }
    },
    reset () {
      this.selectSq.x = -1
      this.selectSq.y = -1
      this.pcSquares = JSON.parse(JSON.stringify(initPcSquares))
      this.playerRed = true
      this.position = initPosition
    }
  }
}
</script>

<style scoped>
  .board{
    background-image: url(../assets/board.png);
    width: 520px;
    height: 576px;
  }
  .square{
    padding: 0;
    position: relative;
    width: 56px;
    height: 56px;
    display: inline-block;
    margin-left: 1px;
  }
  .sqPc{
    position: absolute;
    display: block;
  }
</style>
