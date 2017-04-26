<template>
  <div class="root">
    <h1>snapjerk</h1>
  </div>
</template>

<script>
'use strict'

var settings = require('electron').remote.getGlobal('settings') // Global variable set in mainProcess

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
