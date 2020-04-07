import request from "../config/request";

// 专店信息
export function counterInfo(data) {
  return request({
    url: 'merchantCounter/counterInfo',
    method: 'post',
    params: data
  })
}
// 商品类别
export function getGoodsModule(data) {
  return request({
    url: 'goodsModule/getGoodsModule',
    method: 'post',
    params: data
  })
}
// 商品类别下的商品
export function getGoods(data) {
  return request({
    url: 'goodsModule/getGoods',
    method: 'post',
    params: data
  })
}
// 推荐商品
export function recommend(data) {
  return request({
    url: 'counterGoods/recommend',
    method: 'post',
    params: data
  })
}

