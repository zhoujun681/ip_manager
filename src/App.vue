<!--
 * @Descripttion: 使用ctrl+alt+i添加头部注释，ctrl+alt+t添加方法注释, 或者复制方法名后使用gocm来添加方法注释
 * @version: 
 * @Author: bb
 * @Date: 2020-10-12 09:04:32
 * @LastEditors: bb
 * @LastEditTime: 2021-01-07 15:39:24
-->
<template>
  <div id="app">
    <img src="./assets/logo.png" />
    <br />
    <div class="seTitle">IP地址管理</div>
    <router-view></router-view>
    <div class="version">技术支持:信息管理部 - zj 版本：{{ version }}</div>
  </div>
</template>

<script>
export default {
  name: "app",
  components: {},
  data() {
    return {
      version: "1.0",
    };
  },
  
};
</script>

<style>
.seTitle {
  font-size: 2em;
  font-style: italic;
  color: #115c7a;
  text-shadow: 0px 6px 1px #35333327;
}
.version {
  color: white;
  font-style: italic;
  font-size: 0.8em;
  position: fixed;
  left: 50%;
  bottom: 10px;
  margin-left: -5%;
}
.loginbox {
  margin-top: 5%;
}
img {
  width: 60%;
  height: 30%;
  margin-top: 3%;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

}
body,
html {
  height: 100%;
  background-image: url("./assets/bg.jpg");
  background-size:cover;
  background-position: center;
}
</style>
