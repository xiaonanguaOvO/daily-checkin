<template>
  <div id="app">
    <router-view></router-view>  <!-- 用于渲染路由匹配到的组件 -->
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
/* 全局样式，可以根据需要添加 */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
