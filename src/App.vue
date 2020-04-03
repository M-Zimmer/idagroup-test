<template>
  <div id="app">
    <h1 id='app-header'>Table UI</h1>
    <AppTable/>
  </div>
</template>

<script>
import AppTable from './components/AppTable.vue'

export default {
  name: 'App',
  components: {
    AppTable
  }
}
</script>

<style>
body {
  background-color: whitesmoke;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 25px 100px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

#app-header {
  padding: 25px 0px;
  margin: 0;
  min-width: 660px;
  border-bottom: 2px solid rgb(233, 233, 233);
}
</style>
