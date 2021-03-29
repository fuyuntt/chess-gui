<template>
  <div id="app" flex="main:center">
    <Board/>
  </div>
</template>

<script>
import Board from './components/Board'

export default {
  name: 'App',
  components: {
    Board
  }
}
</script>

<style >
  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
  }
  #app {
    width: 100%;
    height: 100%;
  }
</style>
