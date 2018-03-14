<template>
  <div id="app" :style="appStyle">
    <router-view/>
  </div>
</template>

<script>
let winH = window.innerHeight; // 获取窗口高度
// 设置app页面的内联样式
let appStyle = {
  height: winH + "px"
}

export default {
  name: 'app',
  data () {
    return {
      appStyle: appStyle
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

body {
  margin: 0;
  padding: 0;
}


.left-float { float: left; }
.right-float { float: right; }
.text-right { text-align: right; }
.text-left { text-align: left; }
.text-center { text-align: center; }

</style>
