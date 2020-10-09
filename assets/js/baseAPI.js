// 实际工作中会测试多个参数所以设置相同的名字根据需求切换到对应的地址即可
// 1.开发环境服务器地址
var baseURL = 'http://ajax.frontend.itheima.net'
// 2. 测试环境服务器地址
// var baseURL = 'http://ajax.frontend.itheima.net'
// 3.生产环境服务器地址
// var baseURL = 'http://ajax.frontend.itheima.net'

// 发出Ajax之前会触动 ajaxPrefilter 方法 ,它可以拦截所有的ajax请求，通过options配置Ajax各种参数
$.ajaxPrefilter(function (options) {
  // alert(options.url);
  // 拼接对应环境的服务器地址
  options.url = baseURL + options.url
  // alert(options.url);

  //为请求为/my/开头的所有Ajax配置请求头信息
  if (options.url.indexOf('/my/') !== -1) {
    options.headers = {
      Authorization: localStorage.getItem('token') || ''
    }
  }
  //拦截所有响应，判断身份认证信息
  options.complete = function (res) {
    // console.log(res);
    if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
      // 清空token
      localStorage.removeItem('token')
      // 跳转到login页面
      location.href = '/login.html'
    }
  }
})