<template>
  <div id="app">
    <div id="live_canvas">LIVE CAMERA</div>
    <img id="still_frame">
  </div>
</template>

<script>
import store from './vuex/store'

export default {
  name: 'App',
  store
}
</script>

<style>
html {
  height: 100%;
}

body {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

#app {
  color: #2c3e50;
  margin-top: -100px;
  max-width: 600px;
  font-family: Source Sans Pro, Helvetica, sans-serif;
  text-align: center;
  position: relative;
}

#app a {
  color: #42b983;
  text-decoration: none;
}

#app > div {
  background: #EEE;
  position: absolute;
  width: 100%;
}

.logo {
  width: 100px;
  height: 100px
}
</style>
