/**
 * Created by Administrator on 2017/7/24.
 */
export function formatDate(date, fmt) {   // fmt上就是（yyyy-MM-dd hh:mm）
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    //    substr()表示的提取一些字符，只有一个数字时表示的截取的是当前数字的下表到结束，如果是两个参数，表示的开始与结束的下表
    //    本案例中最长的是4个y，所以用4截取
    }
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    };
    // 对于一个对象，判断里面是否有重复的，可以用循环到该对象创建变量，如果有该对象这长度是1，
    // 说明已经有了这个变量，返回的而是这个变量，否则的话就是还不存在，同时需要对这个变量进行处理
    // 需要判断是以为数字还是两位，在前面添加两个0作为字符串，然后截取，如果是长度是一位，总工是3位，从第一位截取
    // 2位的话拼接是4位，从第四位截取
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + '';
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
        }
    }
    // console.log(fmt);
    return fmt;
}
function padLeftZero(str) {
    return ('00' + str).substr(str.length);
}
