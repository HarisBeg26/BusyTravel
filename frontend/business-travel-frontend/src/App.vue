<template>
  <div id="app">
    <!-- Language Selector at the top of the app -->
    <header>
      <LanguageSelector />
    </header>

    <!-- Main content rendered by Vue Router -->
    <router-view></router-view>
  </div>
</template>

<script>
import {defineComponent} from "vue";
import LanguageSelector from "@/components/LanguageSelector.vue"; // Import the LanguageSelector component

export default defineComponent({
  name: "App",
  components: {
    LanguageSelector, // Register the component
  },
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
  margin-top: 20px;
}

header {
  margin-bottom: 20px;
  padding: 10px;
  background-color: #f4f4f4;
  border-bottom: 1px solid #ddd;
}

header .language-selector {
  display: inline-block;
  margin: 0 auto;
}
</style>
