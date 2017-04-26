<template>
  <div class="root">
    <h1>snapjerk</h1>
  </div>
</template>

<script>
'use strict'

const settings = require('electron').remote.getGlobal('settings')
const camera = require('./lib/camera')

export default {
  data() {
    return {}
  },
  mounted() {
  }
}
</script>
<style>
html {
  height: 100%;
  font-family: sans-serif;
}
</style>
