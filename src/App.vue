<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
/* eslint no-plusplus: 0 */
/* eslint comma-dangle: 0 */
/* eslint class-methods-use-this: 0 */
/* eslint consistent-return: 0 */
/* eslint array-callback-return: 0 */

if (process.env.NODE_ENV === 'production') {
  window.SOCKET_URL = 'https://caro4fun.herokuapp.com';
} else {
  window.SOCKET_URL = 'http://localhost:3000';
}

export default {
  name: 'App',
  mounted() {
  }
};
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
