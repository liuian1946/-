/**
 * Created by Administrator on 2017/7/24.
 */
export function formatDate(date, fmt) {   // fmt�Ͼ��ǣ�yyyy-MM-dd hh:mm��
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    //    substr()��ʾ����ȡһЩ�ַ���ֻ��һ������ʱ��ʾ�Ľ�ȡ���ǵ�ǰ���ֵ��±������������������������ʾ�Ŀ�ʼ��������±�
    //    �������������4��y��������4��ȡ
    }
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    };
    // ����һ�������ж������Ƿ����ظ��ģ�������ѭ�����ö��󴴽�����������иö����ⳤ����1��
    // ˵���Ѿ�����������������صĶ����������������Ļ����ǻ������ڣ�ͬʱ��Ҫ������������д���
    // ��Ҫ�ж�����Ϊ���ֻ�����λ����ǰ���������0��Ϊ�ַ�����Ȼ���ȡ������ǳ�����һλ���ܹ���3λ���ӵ�һλ��ȡ
    // 2λ�Ļ�ƴ����4λ���ӵ���λ��ȡ
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
