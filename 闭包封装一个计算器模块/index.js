/*
 * @Description: 
 * @version: 
 * @Author: lxw
 * @Date: 2019-12-23 16:29:01
 * @LastEditors  : lxw
 * @LastEditTime : 2019-12-23 17:03:20
 */
const autoAdd = (function () {

    //闭包实现封装
    function autoAddCount() {
        let countNum = 0;
        return function (initNum, fcall, time_delay) {
            countNum = initNum ? initNum : countNum;
            setInterval(() => {
                countNum++;
                fcall(countNum)
            }, time_delay);
        };
    }
    //暴露的return是基于retur当前的函数的，所以直接使用autoAddCount()函数的没有办法在自调用函数这一层级别暴露出来的
    return autoAddCount();


})()