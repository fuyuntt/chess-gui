<template>
  <div class="board-container">
    <table class="board">
      <tr v-for="(row, idxY) in pos.pcSquares" :key="idxY">
        <td class="square" v-for="(pc, idxX) in row" :key="idxX" @click="clickSq(idxX, idxY)">
          <img class="sqPc" :src="require('../assets/'+pcRes(pc))" alt=""/>
          <span class="sqPc">
            <i class="sqIcon el-icon-delete" v-show="pc !== ' '" @click="deleteSq(idxX, idxY)" @click.stop></i>
          </span>
        </td>
      </tr>
    </table>
    <el-divider></el-divider>
    <div>
      <table style="display: inline-block">
        <tr v-for="(row, idxY) in editPcSquares" :key="idxY">
          <td class="square" v-for="(pc, idxX) in row" @click="clickEditSq(idxX, idxY)" :key="idxX">
            <img class="sqPc" src="../assets/selected.png" v-show="idxX === selectSq.x && idxY === selectSq.y" alt=""/>
            <img class="sqPc" :src="require('../assets/'+pcRes(pc))" alt=""/>
          </td>
        </tr>
      </table>
      <table style="display: inline-block">
        <tr v-for="d in [{l:true,t:'红先'}, {l:false,t:'黑先'}]" :key="d.l">
          <el-radio v-model="pos.isRed" @change="updateFen" :label="d.l" border style="margin: 6px 6px 6px 16px;">{{d.t}}</el-radio>
        </tr>
      </table>
    </div>
    fen串：
    <el-input v-model="fenStr"></el-input>
  </div>
</template>

<script>
import util from './util.js'

export default {
  name: 'BoardEdit',
  props: {
    fen: {
      type: String,
      default: util.initFen
    }
  },
  data () {
    return {
      selectSq: {
        x: 0,
        y: 0
      },
      fenStr: this.fen,
      pos: util.parseFen(this.fen),
      editPcSquares: [
        ['r', 'n', 'b', 'a', 'k', 'c', 'p'],
        ['R', 'N', 'B', 'A', 'K', 'C', 'P']
      ]
    }
  },
  methods: {
    pcRes: util.pcRes,
    select (x, y) {
      this.selectSq.x = x
      this.selectSq.y = y
    },
    updateFen () {
      this.fenStr = util.toFen(this.pos.pcSquares, this.pos.isRed)
    },
    async clickSq (x, y) {
      this.$set(this.pos.pcSquares[y], x, this.editPcSquares[this.selectSq.y][this.selectSq.x])
      this.updateFen()
    },
    deleteSq (x, y) {
      this.$set(this.pos.pcSquares[y], x, ' ')
      this.updateFen()
    },
    async clickEditSq (x, y) {
      this.select(x, y)
    },
    resizePage () {
      const viewport = document.getElementsByTagName('meta')[1]
      const pageViewWidth = 525
      let initScale = Math.ceil(window.outerWidth * 100 / pageViewWidth) / 100
      if (initScale > 1) initScale = 1
      viewport.content = `width=device-width, initial-scale=${initScale}, maximum-scale=2.0, user-scalable=yes`
    },
    getFen () {
      return util.toFen(this.pos.pcSquares, this.pos.isRed)
    }
  },
  watch: {
    fenStr: function (newFen) {
      this.pos = util.parseFen(newFen)
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

.board-container {
  margin: 0 auto;
  max-width: 540px;
  border: 1px;
}

.board {
  background-image: url(../assets/board.png);
  width: 520px;
  height: 576px;
}

.square {
  padding: 0;
  position: relative;
  width: 56px;
  height: 56px;
  display: inline-block;
  margin-left: 1px;
}

.sqPc {
  width: 56px;
  height: 56px;
  position: absolute;
  display: block;
}

.sqIcon {
  float: right;
  cursor: pointer;
}
</style>
