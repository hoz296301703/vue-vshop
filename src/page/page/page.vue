<template>
  <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
    <van-list v-model="loading" :finished="finished" finished-text @load="onLoad">
      <div class="top">
        <!-- 搜素框占位符 -->
        <div :style="'height:'+topheight+'px'"></div>
        <!-- 首页内容 -->
        <div>
          <van-search background="#004da0" placeholder="请输入搜索关键词" show-action shape="round">
            <div class="classLogo" slot="action">
              <van-icon size="20px" color="#fff" name="qr" />
            </div>
            <div slot="action">
              <van-icon size="20px" color="#fff" name="manager-o" />
            </div>
          </van-search>
          <!-- 轮播图 -->
          <imageAd v-if="homeImgArr.length != 0" :data="homeImgArr"></imageAd>
          <!-- 商品类别 -->
          <div class="goodsClass">
            <van-swipe :loop="false" indicator-color="white">
              <van-swipe-item>
                <ul class="goodsClass_ul">
                  <li v-for="(item,index) in goodsClassArr"  @click="_toCategory(item.serialNo)">
                    <img v-lazy="item.logo" />
                    <span>{{item.title}}</span>
                  </li>
                  <li @click="_toCategory()">
                    <img src="./menu.png" />
                    <span>全部</span>
                  </li>
                </ul>
              </van-swipe-item>
            </van-swipe>
          </div>

          <!-- 分类展示  -->
          <div id="class_goods" class="class_goods load-hid">
            <div class="class_goods_item" v-for="(value, key, index) in goodsArr">
              <div>
                <p>
                  <label>{{key}}</label>
                  <span>查看更多&nbsp;〉</span>
                </p>
                <img
                  class="goods_class_img"
                  src="https://ym.191ec.com/img/goodsModule/C20181211000079425/1861fa9b14e045adac0fc13e4071b6ef_1570595088089.jpg"
                  style="height:2rem; width:100%;border-radius: 4px;display:none;"
                />
              </div>
              <div class="more">
                <div class="item" @click="toGoodsDetail(item)" v-for="(item,i) in value.slice(0,3)" :key="i">
                  <div>
                    <img v-lazy="_shrink_img(item.goodsImage.split(';')[0])" class="goodsPic" />
                    <p>{{item.goodsName}}</p>
                    <p>
                      <span class="price">￥65.99</span>
                      <span class="old_price">￥129.60</span>
                    </p>
                    <van-icon class="iconfont addToCart" class-prefix="icon" name="gouwuche1" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- <imageText v-if="item.Code=='ImageText'" :data="item.ParameterDictionary"></imageText> -->

          <!-- <pageLine v-if="item.Code=='Line'" :data="item.ParameterDictionary"></pageLine> -->

          <!-- <whitespace v-if="item.Code=='Line'" :data="item.ParameterDictionary" /> -->

          <!-- <pageText v-if="item.Code=='Text'" :data="item.ParameterDictionary"></pageText> -->

          <!-- <notice v-if="item.Code=='Notice'" :data="item.ParameterDictionary"></notice> -->

          <!-- <pageTitle v-if="item.Code=='Title'" :data="item.ParameterDictionary"></pageTitle> -->

          <!-- <cube v-if="item.Code=='Cube'" :data="item.ParameterDictionary"></cube> -->

          <!-- <product v-if="item.Code=='Product'" :data="item"></product> -->
          <!-- 推荐商品 -->
          <product v-if="recommend_datas.length != 0" :data="recommend_datas"></product>
        </div>
      </div>
    </van-list>
  </van-pull-refresh>
</template>
<script>
import "../../assets/style/index.css";
import whitespace from "../../components/page/whitespace.vue";
import pageLine from "../../components/page/line.vue";
import pageText from "../../components/page/text.vue";
import notice from "../../components/page/notice.vue";
import pageTitle from "../../components/page/title.vue";
import cube from "../../components/page/cube.vue";
import imageAd from "../../components/page/imageAd.vue";
import imageText from "../../components/page/imageText.vue";
import product from "../../components/page/product.vue";
import { checkMemberLogin } from "../../api/common.js";
import { isEmpty,shrink_img } from "../../config/commonUtils.js";

import {
  counterInfo,
  getGoodsModule,
  getGoods,
  recommend
} from "../../api/home.js";
import { Search, Icon, Swipe, SwipeItem, PullRefresh, List } from "vant";
export default {
  name: "page",
  components: {
    [Search.name]: Search,
    [PullRefresh.name]: PullRefresh,
    whitespace,
    pageLine,
    pageText,
    notice,
    // search,
    pageTitle,
    cube,
    imageAd,
    imageText,
    product
  },
  data: function() {
    return {
      sw: true,
      isLoading: false, // 下拉刷新数据标识
      loading: false, // 上拉刷新数据标识
      finished: false, // 数据全部加载完毕标识
      topheight: 46, // 头部高度
      page: {},
      homeImgArr: [], // 首页广告图数组
      goodsClassArr: [], // 首页类别数组
      goodsClassIndex: 0, // 首页类别数组
      goodsArr: {}, // 首页各个类别商品数组
      loginLogo: "",
      BackgroundColor: "", //主题颜色#004da0
      recommend_datas: [], // 推荐商品数据
      recommend_type: "query", // 推荐商品类型
      recommend_uuid: this.generateUUID() // 推荐商品uid
    };
  },
  created: function() {
    // GetPage().then(response=>{
    //     // console.log(response)
    //     this.page=response;
    // });
    if (isEmpty(localStorage.getItem("counterId"))) {
      // 有值就修改
      localStorage.setItem("counterId", this.$route.query.counterId);
    } else {
      // 没值就用就值
      this.$route.query.counterId = localStorage.getItem("counterId");
    }

    // 判断是否登录
    checkMemberLogin({
      key: "42143242422422",
      counterId: this.$route.query.counterId
    }).then(response => {
      console.log(response);
    });

    // 获取专店信息
    counterInfo(this.$route.query).then(response => {
      var imgArr = response.datas.imge.split(";"); // 截取广告图字符串
      imgArr.pop(); // 删除数组最后一个空值
      this.homeImgArr = imgArr;
    });

    // 获取商品类别
    getGoodsModule({
      page: 0,
      size: 0,
      counterId: this.$route.query.counterId
    }).then(response => {
      this.goodsClassArr = response.datas;
      for (var i = 0; i <= 2; i++) {
        this._getGoods(
          this.goodsClassArr[i].serialNo,
          this.goodsClassArr[i].title
        );
      }
    });
  },
  methods: {
    // 跳转类别
    _toCategory(moduleNo){
      this.$router.push({
        path:'/category',
        query: {counterId: localStorage.getItem("counterId"),moduleNo:moduleNo}
      })
    },
    // 缩略图
    _shrink_img(str) {
      return shrink_img(str);
    },
    // 下拉刷新
    onRefresh() {
      setTimeout(() => {
        this.$toast("刷新成功");
        this.isLoading = false;
      }, 500);
    },
    // 上拉刷新
    onLoad() {
      // 异步更新数据
      setTimeout(() => {
        // 加载状态结束
        this.loading = false;
      }, 100);
    },
    // 获取商品类别
    _getGoods(moduleNo, title) {
      getGoods({
        page: 1,
        size: 4,
        moduleNo: moduleNo,
        counterId: this.$route.query.counterId
      }).then(response => {
        this.goodsClassIndex++;
        this.goodsArr[title] = response.datas;
        this.sw = true;
      });
    },
    // 推荐商品
    _recommend(type) {
      this.recommend_type = "";
      recommend({
        counterId: this.$route.query.counterId,
        uuid: this.recommend_uuid,
        type: type
      }).then(response => {
        this.sw = true;
        if (response.status == 1) {
          this.recommend_datas = this.recommend_datas.concat(response.datas);
        } else {
          this.recommend_uuid = this.generateUUID();
          this.recommend_type = "query";
          this._recommend(this.recommend_type);
        }
      });
    },
    generateUUID() {
      // 唯一id
      var d = new Date().getTime();
      if (window.performance && typeof window.performance.now === "function") {
        d += performance.now(); //use high-precision timer if available
      }
      var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function(c) {
          var r = (d + Math.random() * 16) % 16 | 0;
          d = Math.floor(d / 16);
          return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
        }
      );
      return uuid;
    },
    // 跳转商品详情
    toGoodsDetail(obj){
      this.$router.push({
        path:'/product',
        query: {entGoodsNo:obj.entGoodsNo,counterId:obj.counterId}
      })
    }
  },
  mounted() {
    // 设置一个开关来避免重负请求数据

    let _this = this;
    // 注册scroll事件并监听
    window.addEventListener("scroll", function() {
      // console.log(document.documentElement.clientHeight+'-----------'+window.innerHeight); // 可视区域高度
      // console.log(document.body.scrollTop); // 滚动高度
      // console.log(document.documentElement.scrollTop); // 滚动高度
      // console.log(document.body.offsetHeight); // 文档高度
      // 判断是否滚动到底部
      if (
        document.body.offsetHeight -
          (document.documentElement.scrollTop + window.innerHeight) <
        200
      ) {
        // 如果开关打开则加载数据
        if (_this.sw) {
          // 将开关关闭
          _this.sw = false;
          if (_this.goodsClassArr.length != _this.goodsClassIndex) {
            // 类别商品加载完成
            _this._getGoods(
              _this.goodsClassArr[_this.goodsClassIndex].serialNo,
              _this.goodsClassArr[_this.goodsClassIndex].title
            );
          } else {
            // 开始加载推荐商品
            _this._recommend(_this.recommend_type);

            //  _this.finished = true;
          }
        }
      }
    });
  }
};
</script>

<style scoped lang="stylus">
// 头部搜索
.top {
  background: #f8f8f8;

  .van-search {
    // padding-bottom: 6px !important;
    // padding-top: 6px !important;
    padding-left: 38px;
  }

  .van-search--show-action {
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 10;

    .classLogo {
      position: absolute;
      left: 10px;
    }

    .van-cell {
      line-height: 16px;
    }

    .van-search__action {
      color: #ffffff;
    }

    .van-search__action >div {
      display: flex;
    }
  }
}

// 商品类别
.goodsClass {
  margin-bottom: 10px;

  .goodsClass_ul {
    background: linear-gradient(#e8e6f5, #fff);
    display: flex;
    flex-wrap: wrap;
    border-radius: 11px 11px 0 0;
    padding-bottom: 10px;

    li {
      display: flex;
      width: 20%;
      box-sizing: border-box;
      flex-direction: column;
      align-items: center;

      >img {
        width: 0.8rem;
        height: 0.8rem;
        border-radius: 50%;
        margin-top: 0.1rem;
        margin-bottom: 0.1rem;
        border: 1px solid #ddd;
      }

      >span {
        font-size: 0.25rem;
        color: #7d7e80;
      }
    }
  }
}

// 分类展示
.class_goods {
  padding-left: 6px;
  padding-right: 6px;

  .class_goods_item {
    margin-bottom: 8px;

    >div {
      padding: 0.05rem;
      background: #fff;

      >p {
        // color: #fff;
        border-radius: 6px 6px 0 0;
        // background: linear-gradient(90deg, #fe1d43 0%, #f2564b 100%);
        padding: 0 0.1rem;
        line-height: 0.8rem;
        display: flex;
        justify-items: center;
        align-items: center;
        justify-content: space-between;

        >label {
          font-size: 0.3rem;
        }

        >span {
          color: #7d7e80;
          font-size: 0.25rem;
        }
      }
    }
  }
}

.more {
  overflow-x: scroll;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;

  // margin: 5px 0 5px 15px;
  .item {
    position: relative;
    width: 3.5rem;
    margin-right: 10px;
    display: inline-block;

    img {
      width:3.5rem;
      height: 3.5rem;
      object-fit: cover;
      margin-left: 2.5%;
      margin-bottom: 3px;
    }

    p {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding: 0.05rem;
      font-size: 0.25rem;
      width: 100%;
      color: #7d7e80;
    }

    .price {
      display: block;
      font-size: 0.28rem;
      color: #e4393c;
      text-align: left;
    }

    .old_price {
      display: block;
      font-size: 0.22rem;
      color: #7d7e80;
      text-align: left;
      text-decoration: line-through;
    }

    .addToCart {
      position: absolute;
      bottom: 4px;
      right: 0;
      color: #e4393c;
      font-size: 0.45rem;
    }
  }
}
</style>
