$(function () {
  // 获取用户信息
  getUserInfo()

  //退出功能
  var layer = layui.layer
  $('#btnLogout').on('click', function () {
    //带提示和图标的询问框
    layer.confirm('是否确认退出?', { icon: 3, title: '提示' }, function (index) {
      //  清空本地的token
      localStorage.removeItem('token')
      // 页面跳转
      location.href = '/login.html'
      // layui自己提供的关闭询问框功能
      layer.close(index);
    });
  })



})
//获取用户信息封装函数
//设置全局函数，后面会用
function getUserInfo() {
  $.ajax({
    method: 'GET',
    url: '/my/userinfo',
    // headers: {
    //   //需要重新登录，token事件过期12小时
    //   Authorization: localStorage.getItem('token') || ''
    // },
    success: function (res) {
      if (res.status !== 0) {
        return layui.layer.msg(res.message)
      }
      // 渲染用户头像
      renderAvatar(res.data)
    },
    // 无论成功与否都会调用conmplete回调函数
    // complete: function (res) {
    //   console.log(res);
    //   if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
    //     // 清空token
    //     localStorage.removeItem('token')
    //     // 跳转到login页面
    //     location.href = '/login.html'
    //   }
    // }
  })
}

function renderAvatar(user) {
  // 获取用户名
  var name = user.nickname || user.username
  // 渲染用户名
  $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
  if (user.user_pic !== null) {
    // 有头像
    $('.layui-nav-img').attr('src', user.user_pic).show()
    $('.user-avatar').hide()
  } else {
    //没有头像
    $('.layui-nav-img').hide()
    var text = name[0].toUpperCase()
    $('.user-avatar').show().html(text)
  }
}