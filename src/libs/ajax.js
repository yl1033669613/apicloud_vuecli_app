/**
 * 作者: Zoran
 * 封装api.ajax
 */

import { storage } from './utils'
import { toast, hideProgress } from './base_ui'

const BASE_API_URL = 'http://localhost:8080' //接口 base url
const RESOURCE_URL = 'http://localhost:8080/resource' //资源 base url

const DEFAULT_OPTION = {
    url: '',
    method: 'post',
    dataType: '',
    timeout: 30,
    headers: {
        'Accept': 'application/json'
    }
}

var Ajax = {
    baseApiUrl: BASE_API_URL,
    resourceUrl: RESOURCE_URL,
    /**
     * 封装api.ajax
     * @param {Object} options ajax参数
     */
    ajax(options) {
        const self = this
        let _options = {}
        _options = Object.assign(_options, DEFAULT_OPTION, options)
        if (!_options.url) {
            api.alert({
                msg: '数据地址不正确'
            })
            return false
        }
        if (_options.url.lastIndexOf('.json') > -1) {
            _options.type = 'get'
        }
        if (!_options.url.match(/^(?:http|ftp|https):\/\//)) {
            _options.url = self.baseApiUrl + _options.url
        }
        if (!_options.data) {
            _options.data = {}
        }
        if (!_options.data.files && !_options.data.body) {
            _options.headers = Object.assign(_options.headers, {
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
            })
        }
        // acc_token
        let token = storage.get('token')
        if (token && !_options.disableToken) {
            _options.headers = Object.assign(_options.headers, {
                'token': token
            })
        }
        return new Promise((resolve, reject) => {
            api.ajax({
                url: _options.url,
                data: _options.data,
                method: _options.method,
                dataType: _options.dataType,
                headers: _options.headers,
                timeout: _options.timeout
            }, (ret, err) => {
                if (ret) {
                    if (ret.code == 200) { //接口返回判断 成功 具体判断请依据具体接口返回处理
                        resolve(ret)
                    } else {
                        hideProgress()
                        api.refreshHeaderLoadDone()
                        if (ret.code == 401) { //接口 授权判断  具体判断请依据具体接口返回处理
                            toast('登录已过期，请重新登录')
                            //未授权则跳回首页并打开登录页
                            setTimeout(() => {
                                api.closeToWin({
                                    name: 'root',
                                    animation: {
                                        type: 'none',
                                        duration: 0
                                    }
                                })
                                api.execScript({
                                    name: 'root',
                                    script: '$vm.openLoginWhenTokenInvalid()'
                                })
                            }, 700)
                            return reject({ errMsg: '登录已过期，请重新登录' })
                        }
                        reject(ret)
                    }
                } else {
                    hideProgress()
                    api.refreshHeaderLoadDone()
                    toast('请求失败')
                    reject(err)
                }
            })
        })
    }
}

export default Ajax