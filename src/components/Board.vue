<template>
<el-container class="board-container">
  <el-main class="board-content">
    <table class="board">
      <tr class="sqRow" v-for="(row, idxY) in pcSquares" :key="idxY">
        <td class="square" v-for="(pc, idxX) in row" :key="idxX" @click="clickSq(idxX, idxY)">
          <img class="sqPc" v-show="selectSq.x===idxX && selectSq.y===idxY" src="../assets/selected.png" alt=""/>
          <img class="sqPc" :src="require('../assets/'+resMap[pc])" alt=""/>
        </td>
      </tr>
    </table>
  </el-main>
  <el-footer flex="main:justify">
    <div>
      <img src="../assets/rk.png" alt="" v-show="playerRed">
      <img src="../assets/bk.png" alt="" v-show="!playerRed">
    </div>
    <div flex="cross:center">
      <el-button type="primary" @click="reset">重置</el-button>
      <el-button type="primary" @click="back">悔棋</el-button>
    </div>
  </el-footer>
</el-container>
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
      position: initPosition,
      moveStack: []
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
      let captured = this.pcSquares[dstY][dstX]
      this.$set(this.pcSquares[dstY], dstX, this.pcSquares[srcY][srcX])
      this.$set(this.pcSquares[srcY], srcX, ' ')
      if (this.position === initPosition) {
        this.position += ' moves'
      }
      this.position = this.position + ' ' + move
      this.playerRed = !this.playerRed
      this.moveStack.push({mv: move, captured: captured, selectSq: {x: this.selectSq.x, y: this.selectSq.y}})
      this.select(dstX, dstY)
    },
    undoMakeMove () {
      let frame = this.moveStack.pop()
      if (frame === undefined) {
        return
      }
      let move = frame.mv
      let srcX = move.charCodeAt(0) - codeA
      let srcY = 9 - (move.charCodeAt(1) - code0)
      let dstX = move.charCodeAt(2) - codeA
      let dstY = 9 - (move.charCodeAt(3) - code0)
      this.$set(this.pcSquares[srcY], srcX, this.pcSquares[dstY][dstX])
      this.$set(this.pcSquares[dstY], dstX, frame.captured)
      this.position = this.position.substr(0, this.position.length - 5)
      if (this.position.endsWith('moves')) {
        this.position = initPosition
      }
      this.playerRed = !this.playerRed
      this.select(frame.selectSq.x, frame.selectSq.y)
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
        console.log(`score: ${serverMove.score}, moves ${serverMove.moves}`)
        if (this.playerRed) {
          console.log(`player back`)
          return
        }
        if (serverMove.moves && serverMove.moves.length > 0) {
          this.makeMove(serverMove.moves[0])
        }
        if (serverMove.score >= 9999) {
          await this.$confirm('电脑胜利', '提示')
        } else if (serverMove.score <= -9999) {
          await this.$confirm('玩家胜利', '提示')
        } else if (serverMove.moves.length === 0) {
          await this.$confirm('和棋', '提示')
        }
      } else if (this.pcSquares[y][x] !== ' ') {
        this.select(x, y)
      }
    },
    async reset () {
      await this.$confirm('确定重置局面？', '提示', {type: 'warning'})
      this.selectSq.x = -1
      this.selectSq.y = -1
      this.pcSquares = JSON.parse(JSON.stringify(initPcSquares))
      this.playerRed = true
      this.position = initPosition
    },
    async back () {
      this.undoMakeMove()
      if (!this.playerRed) {
        this.undoMakeMove()
      }
    },
    resizePage () {
      const viewport = document.getElementsByTagName('meta')[1]
      const pageViewWidth = 525
      let initScale = Math.ceil(window.outerWidth * 100 / pageViewWidth) / 100
      if (initScale > 1) initScale = 1
      viewport.content = `width=device-width, initial-scale=${initScale}, maximum-scale=2.0, user-scalable=yes`
    }
  },
  beforeMount () {
    window.addEventListener('resize', this.resizePage)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resizePage)
  }
}
</script>
<style scoped>
  .board-content {
    padding: 5px 0;
  }
  .board-container{
    margin: 0 auto;
    max-width: 540px;
    border: 1px;
  }
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
