<template>
  <div style="padding: 5px 6px;">
    <!-- 轮播图 -->
    <van-swipe :autoplay="3000" v-if="data.length != 0" :style="'height:'+height+'px;border-radius: 10px;'">
      <van-swipe-item v-for="(image,index) in data" :key="index">
        <a>
          <img v-lazy="image+''" style="width: 100%;object-fit: cover;" />
        </a>
      </van-swipe-item>
    </van-swipe>

    <!-- <ul  v-if="data.type=='2'">
        <li v-for="(image,index) in data.imagelist" :key="index" class="cap-image-ad__content" :style="'margin:'+data.imagegap+'px 0px;'">
            <div class="image-wrapper">
                <a :href="image.url">
                    <img alt="" class="cap-image-ad__image" v-lazy="image.src+''" />
                </a>
            </div>
        </li>
    </ul>

    <div v-if="data.type=='3'||data.type=='4'||data.type=='5'" class='cap-image-ad__image-nav' style='overflow-x:scroll;' >
        <div v-for="(item,index) in data.imagelist" :key="index" class="image-wrapper" :style="'width:'+(data.type=='3'?'80':(data.type=='4'?'40':'20'))+'%;margin-right:'+data.imagegap+'px;'">
            <a :href="item.link" class="cap-image-ad__link cap-image-ad__link--image-nav" >
                <div class="cap-image-ad__image">
                    <img :src="item.src+'?w=640'" style="width: 100%; " />
                </div>
            </a>
        </div>
    </div>-->
  </div>
</template>

<script>
export default {
//   name: "imageAd",
  components: {},
  props: {
    data: Array
  },
  data() {
    return {
      height: 150
    };
  },
  created() {
    if (this.data.length == 0) {
      return;
    }
    // var that = this;
    // var image = this.data[0];
    // let img = new Image();
    // img.src = image;
    // var width =
    //   window.innerWidth ||
    //   document.documentElement.clientWidth ||
    //   document.body.clientWidth;
    // img.onload = function() {
    //   that.height = Math.ceil((img.height / img.width) * width);
    // };
  }
};
</script>

<style  scoped lang="stylus">
.van-swipe-item img{
  height 150px
}
</style>
