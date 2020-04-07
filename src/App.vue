<template>
  <div id="app" style="background:#f8f8f8;">
    <keep-alive>
     <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
import "./assets/style/common.css";

export default {
  name: "app"
};
</script>


