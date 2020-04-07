<template>
  <div>
    <img width="100%" src="../../assets/images/product.png" />
    <ul
      class="cap-goods-list__container cap-goods-list__container--small cap-goods-list__container--simple"
    >
      <!-- <li v-if="productlist.length==0" style="width:100%;height:150px;border:0px;">
            <div style="width:100%;height:150px;"></div>
      </li>-->
      <li @click="toGoodsDetail(item)"  v-for="(item,index) in productlist" :key="index" class="cap-goods-list__wrapper">
        <a class="cap-goods-list__item cap-goods-list__item--small simple cap-goods-list__item--btn1 cap-goods-list__item--padding">
          <div class="cap-goods-list__photo">
            <img
              class="cap-goods-list__img lazy lazyload"
              v-lazy="_shrink_img(item.goodsImage.split(';')[0])"
            />
          </div>
          <div class="cap-goods-list__info has-title has-price">
            <h3 class="title">{{item.goodsName}}</h3>
            <p class="sale-info price">
              <span
                class="sale-price oldPrice"
              >¥ {{item.marketPrice == 0?item.marketPrice:(item.regPrice * 1.8).toFixed(2)}}</span>
              <span class="sale-price">¥ {{item.regPrice}}</span>
            </p>
          </div>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import { cutOutNum, shrink_img } from "../../config/commonUtils.js";
export default {
  data() {
    return {
      productlist: []
    };
  },
  props: {
    data: Array
  },
  created: function() {
    this.productlist = this.data;
  },
  methods: {
    _shrink_img(str) {
      return shrink_img(str);
    },
     // 跳转商品详情
    toGoodsDetail(obj){
      this.$router.push({
        path:'/product',
        query: {entGoodsNo:obj.entGoodsNo,counterId:obj.counterId}
      })
    }
  },
  watch: {
    data() {
      this.productlist = this.data;
    }
  }
};
</script>

<style scoped lang="stylus">
.cap-goods-list__wrapper {
  .cap-goods-list__item.simple{
    background: #fff;
    .cap-goods-list__info{
      padding-left:8px;
    }
  }

  p.price {
    display: flex;
    align-items: center;

    .oldPrice {
      color: grey;
      text-decoration: line-through;
      font-size: 0.2rem;
      margin-right: 8px;
    }
  }
}
</style>
