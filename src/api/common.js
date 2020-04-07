import request from "../config/request";

// 专店信息
export function checkMemberLogin(data) {
    return request({
      url: 'member/checkMemberLogin',
      method: 'post',
      params: data
    })
  }

