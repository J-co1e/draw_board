<template>
  <div id="app">
    <draw-board />
  </div>
</template>

<script>
import DrawBoard from './components/DrawBoard.vue'
export default {
  name: 'App',
  components: {
    DrawBoard,
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100vw;
  height: 100vh;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
a {
  text-decoration: none;
}
ul {
  list-style: none;
}
</style>
