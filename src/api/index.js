import { request } from '@/utils/request'

// mazda API
let config = {
    'login': 'http://dealers.faw-mazda.com/chat/index/login',
    'init': 'http://dealers.faw-mazda.com/chat/index/init',
    'user': 'http://dealers.faw-mazda.com/chat/index/getuser',
    'advisors': 'http://dealers.faw-mazda.com/chat/index/getadvisors',
    'saveMsg': 'http://dealers.faw-mazda.com/chat/index/savemsg',
    'message': 'http://dealers.faw-mazda.com/api/dealer/message'
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
    let res = request(config.message)
    return res
}
