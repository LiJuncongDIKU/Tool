<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <!-- <input v-model.number="num" type="number"></input> -->
    <router-link to="/showBench">showCanvasCard</router-link>
    <Divider type="vertical" />
    <router-link to="/doubleColorBall">DoubleColorBall</router-link>
    <hr>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      // num:"a000",
    }
  },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
