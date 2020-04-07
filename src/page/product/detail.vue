<template>
  <div class="goods">
     <headerNav title="商品详情"/>
    <van-swipe class="goods-swipe" :autoplay="3000">
      <van-swipe-item v-for="thumb in goods_thumb" :key="thumb">
        <img v-lazy="thumb" >
      </van-swipe-item>
    </van-swipe>

    <van-cell-group v-if="goods_stock">
      <van-cell>
        <span class="goods-price">{{ formatPrice(goods_stock.regPrice) }}</span>
        <span  class="goods-market-price">{{ formatPrice(goods_stock.regPrice * 1.8) }}</span>        <div class="goods-title">{{ goods.spareGoodsName }}</div>
        <!-- <div class="goods-subtit">{{goods.subtitle}}</div> -->
      </van-cell>
      
      <van-cell class="goods-tag" >
        <template slot="title" style="font-size:10px;">
            <span >商品规格：{{goods.spareGoodsStyle}}</span>
            <span >商品产地：{{goods.spareGoodsOriginCountry}}</span>
      
        </template>
      </van-cell>   
    </van-cell-group>

    <van-cell-group class="goods-cell-group">
      <van-cell is-link  @click="showPromotion" >
        <template slot="title">
            <span style="margin-right: 10px;">领券</span>
            <van-tag type="danger" mark  style="margin-right: 5px;">满180减30</van-tag>
            <van-tag type="danger" mark  style="margin-right: 5px;">满300减100</van-tag>
        </template>
      </van-cell>
      
      <!-- <van-cell  is-link @click="showPromotion" >
        <template slot="title">
            <span style="margin-right: 10px;">促销</span>
            <van-tag type="danger" style="margin-right: 5px;">多买优惠</van-tag>
            <van-tag type="danger" style="margin-right: 5px;">满减</van-tag>
            <van-tag type="danger" style="margin-right: 5px;">限购</van-tag>
        </template>
      </van-cell> -->
    </van-cell-group>
    
    <!-- <van-cell-group class="goods-cell-group">
      <van-cell  is-link @click="showSku" >
        <template slot="title">
            <span style="margin-right: 10px;">已选</span>
            <span >10件装</span>
        </template>
      </van-cell>
      
    </van-cell-group> -->
   <van-tabs v-model="active">
    <van-tab title="详情">
      <div v-if="goods" class="info" v-html="goods.spareGoodsDetail"></div>
    </van-tab>
    <van-tab title="规格" v-if="goods">
       <van-cell class="goods-tag" >
        <template slot="title" style="font-size:10px;">
            <p >商品名称：{{goods.spareGoodsName}}</p>
            <p >商品编号：{{goods.entGoodsNo}}</p>
            <p >商品规格：{{goods.spareGoodsStyle}}</p>
            <p >商品品牌：{{goods.spareGoodsBrand}}</p>
            <p >商品净重：{{goods.netWt}}kg</p>
            <p >商品毛重：{{goods.grossWt}}kg</p>
      
        </template>
      </van-cell>  
    </van-tab>
    <van-tab title="评价">内容 3</van-tab>
  </van-tabs>
    <!-- <div class="goods-info">
        <p class="goods-info-title" >图文详情</p>
        <div v-html="goods.info"></div>
    </div> -->
    <van-goods-action>
        
      <van-goods-action-mini-btn icon="wap-home" @click="sorry">
        首页
      </van-goods-action-mini-btn>
      <van-goods-action-mini-btn icon="wap-home" @click="sorry">
        客服
      </van-goods-action-mini-btn>
      <van-goods-action-mini-btn icon="cart" @click="onClickCart">
        购物车
      </van-goods-action-mini-btn>
      <van-goods-action-big-btn @click="showSku">
        加入购物车
      </van-goods-action-big-btn>
      <van-goods-action-big-btn primary @click="showSku">
        立即购买
      </van-goods-action-big-btn>
    </van-goods-action>
    <van-actionsheet v-model="show" title="促销" style="font-size:14px;">
        
            <van-cell  is-link @click="sorry" >
                <template slot="title">
                    <van-tag type="danger">多买优惠</van-tag>
                    <span> 满2件，总价打9折</span>
                </template>
            </van-cell>
            <van-cell  is-link @click="sorry" >
                <template slot="title">
                    <van-tag type="danger">满减</van-tag>
                    <span> 满100元减50元</span>
                </template>
            </van-cell>
            <van-cell  is-link @click="sorry" >
                <template slot="title">
                    <van-tag type="danger">限购</van-tag>
                    <span> 购买不超过5件时享受单件价￥8.00，超出数量以结算价为准</span>
                </template>
            </van-cell>
    </van-actionsheet>
    

    <van-sku
          v-model="showBase"
          :sku="skuData.sku"
          :goods="skuData.goods_info"
          :goods-id="skuData.goods_id"
          :hide-stock="skuData.sku.hide_stock"
          :quota="skuData.quota"
          :quota-used="skuData.quota_used"
          reset-stepper-on-hide
          reset-selected-sku-on-hide
          disable-stepper-input
          :close-on-click-overlay="closeOnClickOverlay"
          :message-config="messageConfig"
          :custom-sku-validator="customSkuValidator"
          @buy-clicked="onBuyClicked"
          @add-cart="onAddCartClicked"
        />
  </div>
</template>

<script>
import skuData from '../../data/sku';
import { getOneGoodsBaseInfo,evaluationInfo } from "../../api/goodsDetail.js";
export default {
  components: {
  },
  data() {
    this.skuData = skuData;
    return {
      active: 0,
      show:false,
      goods_thumb: [],// 商品轮播图
      goods: null,// 商品信息
      goods_stock: null,// 商品库存
      showBase: false,
      showCustom: false,
      showStepper: false,
      closeOnClickOverlay: true,
    
      customSkuValidator: (component) => {
        return '请选择xxx';
      },
      customStepperConfig: {
        quotaText: '单次限购100件',
        stockFormatter: (stock) => `剩余${stock}间`,
        handleOverLimit: (data) => {
          const { action, limitType, quota } = data;
          if (action === 'minus') {
            this.$toast('至少选择一件商品');
          } else if (action === 'plus') {
            if (limitType === LIMIT_TYPE.QUOTA_LIMIT) {
              this.$toast(`限购${quota}件`);
            } else {
              this.$toast('库存不够了~~');
            }
          }
        }
      },
      messageConfig: {
        uploadImg: (file, img) => {
          return new Promise(resolve => {
            setTimeout(() => resolve(img), 1000);
          });
        },
        uploadMaxSize: 3
      }
    };
  },
  created: function() {
    window,scrollTo(0,0)
    this._getGoodsDetail()
  },
  
  methods: {
    // 获取商品详情信息
    _getGoodsDetail(){
      getOneGoodsBaseInfo({entGoodsNo:this.$route.query.entGoodsNo}).then(response => {
        //** 商品广告图 **//
        var imgArr = response.datas[0].goods.spareGoodsImage.split(";");
        var del = imgArr.pop();// 删除最后一个空元素
        this.goods_thumb = imgArr;
        // 商品信息
        this.goods = response.datas[0].goods;
        // 商品信息
        this.goods_stock = response.datas[0].stock;
      });
    },
    formatPrice(data) {
      return '¥' + (data).toFixed(2);
    },
    onClickCart() {
      this.$router.push('/cart');
    },
    sorry() {
      Toast('暂无后续逻辑~');
    },
    showPromotion() {
        this.show=true;
    },
    showSku(){
        this.showBase=true;
    },

    onBuyClicked(data) {
      this.$toast(JSON.stringify(data));
    },
    onAddCartClicked(data) {
      this.$toast(JSON.stringify(data));
    },

  }
};
</script>

<style lang="less">
.goods {
  padding-bottom: 50px;
  &-swipe {
    img {
      width: 7.5rem;
      height: 7.5rem;
      display: block;
    }
  }
  &-tag{
      font-size: 12px;
        span{
      margin-right: 10px;
        }
        i{
            color: red;
            margin-right: 3px;
        }
        img{
          width: 12px;
          margin-right: 3px;
          margin-top: 6px;
      }
  }
  &-title {
        line-height: 18px;
    padding-top: 10px;
    margin-bottom: 6px;
    font-size: 16px;
    color: #333;
    font-weight: 700;
  }
  &-subtit{
      font-size: 13px;
    color: #333;
    line-height: 21px;
  }
  &-price {
    color: #f44;font-size: 22px;
    font-weight: bold;
  }
  &-market-price {    
    text-decoration: line-through;
    margin-left: 8px;
    font-size: 13px;
    color: #999;
  }
  &-cell-group {
    margin: 15px 0;
    .van-cell__value {
      color: #999;
    }
  }
  &-info-title{
      height: 44px;line-height: 44px;text-align: center;font-size: 14px;font-weight: 700;margin: 10px;border-top: 1px solid #e5e5e5;
  }
  &-info p{
          margin: 0;
    padding: 0;
    margin-block-end: 0;
    margin-block-start: 0;
    display: grid;
  }
  &-info img{
      width: 100%;
  }
  .info img{
     width: 100%;
  }
  .van-goods-action{
    z-index: 1000;
  }
}
</style>