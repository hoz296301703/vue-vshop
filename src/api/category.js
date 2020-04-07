import request from "../config/request";

// 分类（大类）
export function getGoodsModule(data) {
  return request({
    url: 'goodsModule/getGoodsModule',
    method: 'post',
    params: data
  })
}
// 查询分类商品
export function goodsModule(data) {
  return request({
    url: 'goodsModule/getGoods',
    method: 'post',
    params: data
  })
}




  