<template>
  <div>
    <van-search v-model="value" placeholder="请输入搜索关键词" show-action @search="onSearch">
      <div slot="action" @click="onSearch">搜索</div>
    </van-search>
    <van-badge-group :active-key="activeKey" class="tab" :style="'height:'+fullHeight+'px'">
      <van-badge
        v-for="(item, index) in getGoodsModuleItem"
        :title="item.title"
        @click="onClick(index,item)"
      />
    </van-badge-group>

    <div
      v-for="(item, index) in goodsClassIndex"
      v-show="activeKey == index"
      class="content"
      :style="'width:'+fullWidth+'px;height:'+(fullHeight-7)+'px'"
    >
      <!-- {{goodsModule_index}} -->
      {{goodsModule_index[goodsClassModuleNo]}}
      <!-- <van-card
        v-for="(obj,i) in goodsModule_index[goodsClassModuleNo].data"
        :price="(obj.regPrice - obj.tax).toFixed(2)"
        :title="obj.goodsName"
        :thumb="obj.goodsImage.split(';')[0]"
        :origin-price="obj.popularizeProfit == 0 ? ((obj.regPrice - obj.tax) * 1.8).toFixed(2) : obj.popularizeProfit"
      />-->
    </div>
    <navigate />
  </div>
</template>

<script>
import { Search, Card } from "vant";
import { getGoodsModule, goodsModule } from "../../api/category.js";
export default {
  name: "userindex",
  components: {
    [Search.name]: Search
  },
  data() {
    return {
      goodsClassIndex: 1,
      goodsClassModuleNo:
        this.$route.query.moduleNo == "all"
          ? "index0"
          : this.$route.query.moduleNo, // 类别流水号
      getGoodsModuleItem: [{ title: "全部", serialNo: "all" }],
      goodsModule_index: {
        // 缓存分类数据
        index0: {
          page: 1,
          index: 0,
          data: []
        }
      },
      value: "",
      activeKey: 0,
      fullHeight: document.documentElement.clientHeight - 93,
      fullWidth: document.documentElement.clientWidth - 99
    };
  },
  created: function() {
    getGoodsModule({
      // 查询各个大类
      counterId: localStorage.getItem("counterId"),
      page: 0,
      size: 0
    }).then(response => {
      this.getGoodsModuleItem = this.getGoodsModuleItem.concat(response.datas); // 静态类别与动态数据类别合并
      response.datas.forEach((data, i) => {
        this.goodsClassIndex++;
        // 遍历分类，拿到当前类设置数据
        this.goodsModule_index[data.serialNo] = {
          page: 1, // 当前页码为第一页
          index: i + 1, // 当前下标
          data: [] // 缓存商品数据
        };
      });
      // console.log(this.goodsModule_index);
      if (this.$route.query.moduleNo == "all") {
        // 全部
        this.activeKey = this.goodsModule_index.index0.index;
      } else {
        this.activeKey = this.goodsModule_index[
          this.$route.query.moduleNo
        ].index; // 选择当前分类
      }

      this._goodsModule(); // 加载当前类别的商品数据
    });
  },
  methods: {
    onSearch() {
      // console.log(this.value);
    },
    onClick(key, item) {
      if (item.serialNo == "all") {
        this.goodsClassModuleNo = "index0";
      } else {
        this.goodsClassModuleNo = item.serialNo;
      }

      this.activeKey = key;
      this.$router.push({
        path: "/category",
        query: {
          counterId: localStorage.getItem("counterId"),
          moduleNo: item.serialNo
        }
      });
    },
    _goodsModule() {
      let page = "";
      let moduleNo = "";
      if (this.$route.query.moduleNo == "all") {
        // 全部
        page = this.goodsModule_index.index0.page;
      } else {
        moduleNo = this.$route.query.moduleNo;
        page = this.goodsModule_index[this.$route.query.moduleNo].page; // 选择当前分类
      }

      goodsModule({
        counterId: localStorage.getItem("counterId"),
        moduleNo: moduleNo,
        page: page,
        size: 10
      }).then(response => {
        if (this.$route.query.moduleNo == "all") {
          // 全部
          this.goodsModule_index.index0.page++; // 全部加页码
          this.$set(
            this.goodsModule_index.index0,
            "data",
            this.goodsModule_index.index0.data.concat(response.datas)
          );
        } else {
          this.goodsModule_index[this.$route.query.moduleNo].page++; // 把页码加1，为下载请求使用

          this.$nextTick(() => {
            // 在这里赋值入去
            this.$set(
              this.goodsModule_index[this.$route.query.moduleNo],
              "data",
              this.goodsModule_index[this.$route.query.moduleNo].data.concat(
                response.datas
              )
            );
          });
        }
        console.log(this.goodsModule_index);

        // this.goodsModule_index[this.$route.query.moduleNo].data = this.goodsModule_index[this.$route.query.moduleNo].data.concat(response.datas);// 商品数据合并
      });
    }
  },
  watch: {
    // 路由发生变化时
    $route: function() {
      var that = this;
      if (that.$route.query.moduleNo == "all") {
        that.activeKey = that.goodsModule_index.index0.index;
      } else {
        that.activeKey =
          that.goodsModule_index[that.$route.query.moduleNo].index;
      }
      that._goodsModule();
    },
    // goodsModule_index对象数据发生变化时
    goodsModule_index: {
      handler(newValue, oldValue) {
        console.log(newValue + "************记号");
      },
      deep: true
    }
  }
};
</script>

<style lang="less">
.tab {
  float: left;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  min-height: 100%;
  .van-badge {
    padding: 15px 12px 15px 9px;
  }
  .van-badge:not(:last-child)::after {
    height: 199%;
  }
}
.content {
  float: left;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  min-height: 100%;
  margin: 7px 7px 0;
  font-size: 12px;
  img {
    width: 100%;
  }
  .category-div {
    margin: 19px 0px 0;
    h4 {
      font-size: 14px;
      color: #333;
    }
    ul {
      margin-top: 10px;
    }
    li {
      width: 32.8%;
      float: left;
      text-align: center;
      img {
        width: 60px;
        height: 60px;
      }
      span {
        font-size: 12px;
        height: 36px;
        color: #686868;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        display: box;
        display: -webkit-box;
        display: -moz-box;
        display: -ms-box;
        display: -o-box;
        line-clamp: 2;
        -webkit-line-clamp: 2;
        -moz-line-clamp: 2;
        -ms-line-clamp: 2;
        -o-line-clamp: 2;
        box-orient: vertical;
        -webkit-box-orient: vertical;
        -ms-box-orient: vertical;
        -o-box-orient: vertical;
        word-break: break-all;
        box-align: center;
        -webkit-box-align: center;
        -moz-box-align: center;
        -ms-box-align: center;
        -o-box-align: center;
        box-pack: center;
        -webkit-box-pack: center;
        -moz-box-pack: center;
        -ms-box-pack: center;
        -o-box-pack: center;
        z-index: 2;
        position: relative;
      }
    }
  }
}
</style>
