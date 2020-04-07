<template>
  <div style="height:50px;">
    <van-tabbar v-model="active":route="true">
      <van-tabbar-item name='0' icon="wap-home" :to="home">首页</van-tabbar-item>
      <van-tabbar-item name='1' icon="wap-nav" :to="category">分类</van-tabbar-item>
      <van-tabbar-item name='2' icon="cart" info="5" to="/cart">购物车</van-tabbar-item>
      <van-tabbar-item name='3' icon="contact"  to="/user/index">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { Tabbar, TabbarItem } from "vant";
export default {
  name: "navigate",
  components: {
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem
  },
  data() {
    return {
      active: 0,
      home: '/index?counterId=' + localStorage.getItem("counterId"),
      category: '/category?counterId=' + localStorage.getItem("counterId") +'&moduleNo=all',
    };
  },
   created() {
    if (this.$route.name == "index") {
      this.active = 0;
    } else if (this.$route.name == "category") {
      this.active = 1;
    } else if (this.$route.name == "cart") {
      this.active = 2;
    } else if (this.$route.name == "user") {
      this.active = 3;
    }
  },
  watch:{
      '$route':function(){
        var that = this;
        if (that.$route.name == "index") {
            that.active = 0;
        } else if (that.$route.name == "category") {
          that.active = 1;
        } else if (that.$route.name == "cart") {
          that.active = 2;
        } else if (that.$route.name == "user") {
          that.active = 3;
        }
      }
  }
};
</script>

