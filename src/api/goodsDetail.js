import request from "../config/request";

// 商品详情
export function getOneGoodsBaseInfo(data) {
  return request({
    url: 'goods/getOneGoodsBaseInfo',
    method: 'post',
    params: data
  })
}
// 商品评论
export function evaluationInfo(data) {
  return request({
    url: 'evaluation/getInfo',
    method: 'post',
    params: data
  })
}


