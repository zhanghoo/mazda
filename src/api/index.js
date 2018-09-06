import { request } from '@/utils/request'

// mazda API
let config = {
    'login': 'http://dealers.faw-mazda.com/chat/index/login',
    'init': 'http://dealers.faw-mazda.com/chat/index/init',
    'user': 'http://dealers.faw-mazda.com/chat/index/getuser',
    'advisors': 'http://dealers.faw-mazda.com/chat/index/getadvisors',
    'saveMsg': 'http://dealers.faw-mazda.com/chat/index/savemsg',
    'message': 'http://dealers.faw-mazda.com/api/dealer/message',
    'province': 'http://dealers.faw-mazda.com/api/dealer/get_province',
    'city': 'http://dealers.faw-mazda.com/api/dealer/get_city'
}

// 登录
export function getLogin(form) {
    // 模拟登录
    // return new Promise((resolve, reject) => {
    // if (form.username === 'uncleLian' && form.password === '123456') {
    //     resolve('验证成功')
    // } else {
    //     reject('错误')
    // }
    // })
    let res = request(config.login, form)
    return res
}
// 初始化参数
export function getInitParams() {
    let res = request(config.init)
    return res
}
// 当前用户
export function getUser() {
    let res = request(config.user)
    return res
}
// 客服列表
export function getCustomList() {
    let params = {
        'dealer_id': 194
    }
    let res = request(config.advisors, params)
    return res
}
// 保存消息
export function saveMsg(params) {
    let res = request(config.saveMsg, params)
    return res
}
// 留言接口
export function postMessage(data) {
    let params = {
        'dealer_id': 194,
        'advisors_id': 0,
        'province': data.province,
        'city': data.city,
        'name': data.name,
        'mobile': data.phone,
        'sex': data.gender,
        'content': data.content
    }
    let res = request(config.message, params)
    return res
}
// 获取省
export function getProvince() {
    let res = request(config.province)
    return res
}
// 获取市
export function getCity(province_id) {
    let res = request(config.city, { province_id })
    return res
}
