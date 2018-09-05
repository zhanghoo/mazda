// 对话框排序
export function compare(order, propertyName) {
    return function (obj1, obj2) {
        let val1 = obj1[propertyName]
        let val2 = obj2[propertyName]
        // des：倒序
        // asc：正序
        return order === 'asc' ? (val1 - val2) : (val2 - val1)
    }
}
export function formatTime(dateTimeStamp) {
    // 若是 Linux 9位, 补全为13位
    dateTimeStamp = Number(String(dateTimeStamp).padEnd(13, '0'))
    var result
    var minute = 1000 * 60
    var hour = minute * 60
    var day = hour * 24
    var month = day * 30
    var now = new Date().getTime()
    // 时间差
    var diffValue = now - dateTimeStamp
    if (diffValue < 0) { return }
    var monthC = diffValue / month
    // var weekC = diffValue / (7 * day)
    var dayC = diffValue / day
    var hourC = diffValue / hour
    var minC = diffValue / minute

    // 数值补0方法
    var zero = function (value) {
        if (value < 10) {
            return '0' + value
        }
        return value
    }

    var date = new Date(dateTimeStamp)
    var _year = date.getFullYear()
    var _month = zero(date.getMonth() + 1)
    var _day = zero(date.getDate())
    var _hours = zero(date.getHours())
    var _minutes = zero(date.getMinutes())

    // 根据时间差返回不同时间格式
    if (monthC > 12) {
        result = `${_year}-${_month}-${_day} ${_hours}:${_minutes}`
    } else if (monthC >= 1) {
        result = `${_month}-${_day} ${_hours}:${_minutes}`
    } else if (dayC >= 2) {
        result = `${_month}-${_day} ${_hours}:${_minutes}`
    } else if (dayC >= 1) {
        result = `昨天 ${_hours}:${_minutes}`
    } else if (hourC >= 1) {
        result = `${_hours}:${_minutes}`
    } else if (minC >= 1) {
        result = `${_hours}:${_minutes}`
    } else {
        result = '刚刚'
    }
    return result
}
