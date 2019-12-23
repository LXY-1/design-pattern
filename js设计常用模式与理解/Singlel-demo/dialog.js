/*
 * @Author: lxw
 * @Date: 2019-12-19 14:06:42
 * @LastEditTime : 2019-12-19 14:11:37
 * @LastEditors  : Please set LastEditors
 * @Description: 使用单例模式来创建一个全局访问的的弹窗组件,
 * ************  如果是js动态插入的节点我们是想要在当前html页面初次使用的时候创建后插入以后就不再创建而是使用这个实例对象
 * ************  我们的意思是实现：初次使用的时候：创建dom节点插入html文档，载入对应的css文件初始化样式，同时给创建的dom节点的几个按钮绑定相关的事件
 * @FilePath: \前端部分\js设计常用模式与理解\demo\dialog.js
 */

const $myDialog = (function () {
    //单例管理,每一个单例管理对应的dom创建、dom内部按钮点击事件的绑定，实现只需要执行一次，下次再次执行返回的是闭包缓存的单例对象
    const getDialogSingle = (function () {
        let ele;
        return function (fn, ...arg) {
            console.log(ele)
            return ele || (ele = fn.apply(this, arg))
        }
    })();

    const getStyleSingle = (function () {
        let ele;
        return function (fn, ...arg) {
            console.log(ele)
            return ele || (ele = fn.apply(this, arg))
        }
    })();

    const getCloseEventSingle = (function () {
        let ele;
        return function (fn, ...arg) {
            console.log(ele)
            return ele || (ele = fn.apply(this, arg))
        }
    })();

    const getComfirmEventSingle = (function () {
        let ele;
        return function (fn, ...arg) {
            console.log(ele)
            return ele || (ele = fn.apply(this, arg))
        }
    })();

    // 管理弹窗关闭打开
    function DialogAction() {
        this.layer = null;
        if (typeof this.setLayer !== 'function') {
            DialogAction.prototype.setLayer = function (layer) {
                if (!layer) {
                    console.error('参数不完整')
                } else {
                    this.layer = layer;
                }
            }
        }

        //显示
        DialogAction.prototype.showLayer = function () {
            this.layer.style.display = 'block'
        }
        //关闭
        DialogAction.prototype.closeLayer = function () {
            this.layer.style.display = 'none'
        }
    }


    //弹窗组件相关封装
    //使用通过 let confirmDialog = $dialong.createDialogEle()创建后，以后的每次使用操作都仅仅通过confirmDialog

    const $dialong = {
        dialogLayer: null,
        dialogAction: new DialogAction(),
        //TODO:有个问题，参数只能传一次,解决；这里提供创建一个单例对象，你可以在需要的html页面的合适时间点创建实例对象保存为当前页面的全局可访问对象，以后任何涉及到需要弹窗的直接访问这个对象，需要修改信息的调用修改信息的方法
        createDialog: function (title, content) {
            let dialogWrap = document.createElement('div');
            dialogWrap.id = 'dialog-wrap';
            dialogWrap.className = 'dialog-modle-wrap';
            let dialogString =
                '        <div class="dialog-content">' +
                '            <div class="header">' +
                '                <span class="dialog-title">' + title + '</span>' +
                '                <img src="./imgs/remove.png" alt="remove" id="dialog-close1">' +
                '            </div>' +
                '            <div class="body">' +
                '                <h5>' + content + '</h5>' +
                '            </div>' +
                '            <div class="footer">' +
                '                <button class="wl-button" id="dialog-close2">取消</button>' +
                '                <button class="wl-button wl-button-primary" id="dialog-pomote">确认</button>' +
                '            </div>' +
                '        </div>'
            dialogWrap.innerHTML = dialogString
            dialogWrap.style.display = 'none'
            document.body.appendChild(dialogWrap)
            return dialogWrap
        },
        //引入dialog确认框组件样式文件
        createStyle: function () {
            let styleElemet = document.createElement('link')
            styleElemet.rel = 'stylesheet';
            styleElemet.href = './css/dialog.css'
            document.getElementsByTagName('head')[0].appendChild(styleElemet)
            return styleElemet;
        },
        //为关闭按钮绑定事件，其实这里面涉及到动态创建了dom之后里面两个按钮绑定点击事件，你可以把绑定写在创建的代码后面，但是为了方便维护，把它独立成一个函数模块，等后面再一次注册调用
        bindActionClose: function () {
            let that = $dialong;
            //两个关闭按钮
            document.getElementById('dialog-close1').onclick = () => {
                that.dialogAction.closeLayer();
            }
            document.getElementById('dialog-close2').onclick = () => {
                that.dialogAction.closeLayer();
            }
        },
        //点击确认按钮绑定事件以及通过回调传递信息
        confirm: function (fcom) {
            document.getElementById('dialog-pomote').onclick = () => {
                fcom('点击确认了')
            }
        },
        //开始创建，首次调用创建，以后每次调用不会再重新创建——getSingle本身是自动调用函数返回的闭包
        createDialogEle: function (title, content) {
            title = !title ? '一个确认框组件' : title;
            content = !content ? '是否确认删除？' : content;
            //先引入样式——使用对应的创建样式节点单例，以后再执行就不会重新创建导入
            getStyleSingle(this.createStyle)
            //创建dom节点——使用对应的创建dom节点单例，以后再执行就不会重新创建导入
            this.dialogLayer = getDialogSingle(this.createDialog, title, content)
            //为当前dom提供显示与隐藏功能
            this.dialogAction.setLayer(this.dialogLayer)
            //绑定dialog里面相关按钮的点击事件
            getCloseEventSingle(this.bindActionClose)
            return $dialong;

        },
    }

    return $dialong;
})()
