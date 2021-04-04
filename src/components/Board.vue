<template>
<el-container class="board-container">
  <el-main class="board-content">
    <table class="board">
      <tr class="sqRow" v-for="(row, idxY) in pos.pcSquares" :key="idxY">
        <td class="square" v-for="(pc, idxX) in row" :key="idxX" @click="clickSq(idxX, idxY)">
          <img class="sqPc" v-show="selectSq.x===idxX && selectSq.y===idxY" src="../assets/selected.png" alt=""/>
          <img class="sqPc" :src="require('../assets/'+pcRes(pc))" alt=""/>
        </td>
      </tr>
    </table>
  </el-main>
  <el-footer flex="main:justify">
    <div>
      <img src="../assets/rk.png" alt="" v-show="pos.isRed">
      <img src="../assets/bk.png" alt="" v-show="!pos.isRed">
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
import util from './util.js'

export default {
  name: 'Board',
  data () {
    return {
      selectSq: {
        x: -1,
        y: -1
      },
      pos: {
        pcSquares: util.newInitSquares(),
        isRed: true
      },
      selfRed: true,
      posStr: util.initPos,
      moveStack: []
    }
  },
  methods: {
    pcRes: util.pcRes,
    select (x, y) {
      if (this.pos.pcSquares[y][x] !== ' ') {
        this.selectSq.x = x
        this.selectSq.y = y
      }
    },
    makeMove (move) {
      let mv = util.parseMove(move)
      let captured = this.pos.pcSquares[mv.dstY][mv.dstX]
      this.$set(this.pos.pcSquares[mv.dstY], mv.dstX, this.pos.pcSquares[mv.srcY][mv.srcX])
      this.$set(this.pos.pcSquares[mv.srcY], mv.srcX, ' ')
      if (!this.posStr.includes('moves')) {
        this.posStr += ' moves'
      }
      this.posStr = this.posStr + ' ' + move
      this.pos.isRed = !this.pos.isRed
      this.moveStack.push({mv: move, captured: captured, selectSq: {x: this.selectSq.x, y: this.selectSq.y}})
      this.select(mv.dstX, mv.dstY)
    },
    undoMakeMove () {
      let frame = this.moveStack.pop()
      if (frame === undefined) {
        return
      }
      let move = frame.mv
      let mv = util.parseMove(move)
      this.$set(this.pos.pcSquares[mv.srcY], mv.srcX, this.pos.pcSquares[mv.dstY][mv.dstX])
      this.$set(this.pos.pcSquares[mv.dstY], mv.dstX, frame.captured)
      this.posStr = this.posStr.substr(0, this.posStr.length - 5)
      if (this.posStr.endsWith('moves')) {
        this.posStr = this.posStr.substr(0, this.posStr.length - 6)
      }
      this.pos.isRed = !this.pos.isRed
      this.select(frame.selectSq.x, frame.selectSq.y)
    },
    async clickSq (x, y) {
      if (this.pos.isRed !== this.selfRed) {
        return
      }
      if (this.selectSq.x === -1) {
        this.select(x, y)
        return
      }
      let move = util.getMove(this.selectSq.x, this.selectSq.y, x, y)
      let isLegal = await server.isLegalMove(this.posStr, move)
      if (isLegal) {
        this.makeMove(move)
        let serverMove = await server.think(this.posStr)
        console.log(`score: ${serverMove.score}, moves ${serverMove.moves}`)
        if (this.pos.isRed === this.selfRed) {
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
      } else if (this.pos.pcSquares[y][x] !== ' ') {
        this.select(x, y)
      }
    },
    async reset () {
      await this.$confirm('确定重置局面？', '提示', {type: 'warning'})
      this.selectSq.x = -1
      this.selectSq.y = -1
      this.pos = util.parseFen(util.initFen)
      this.selfRed = true
      this.posStr = util.initPos
    },
    async back () {
      this.undoMakeMove()
      if (this.pos.isRed !== this.selfRed) {
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
