/**
 * 作者: Zoran
 * 封装的基础UI 默认为系统UI控件，有Toast、showProgress、hideProgress
 * 
 * 根据实际开发需求可自定义组件或扩展
 */

/**
* toast
* @param {String} msg
* @param {Object} msg
*/
function toast(msg) {
    if (typeof msg === 'string') {
        api.toast({
            msg: msg,
            duration: 3000,
            location: 'bottom'
        })
    } else if (typeof msg === 'object') {
        api.toast({
            msg: msg.msg || '',
            duration: msg.duration || 3000,
            location: msg.location || 'bottom'
        })
    }
}

//显示loading
function showProgress(title, text, modal) {
    // 打开的是系统loading
    api.showProgress({
        title: title,
        text: text || '',
        modal: !!modal
    })
}

//关闭loading
function hideProgress() {
    api.hideProgress()
}

export {
    toast,
    showProgress,
    hideProgress
}