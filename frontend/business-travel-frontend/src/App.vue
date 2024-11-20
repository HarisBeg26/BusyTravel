<template>
  <div id="app">
    <router-view></router-view> <!-- This is where HomePage.vue will be rendered -->
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "App"
});
</script>

<style>
/* Global styles */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
