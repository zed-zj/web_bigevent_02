$(function () {
  //定义校验规则
  var form = layui.form
  form.verify({
    nickname: function (value) {
      if (value.length > 6) {
        return '用户昵称的长度为 1 ~ 6 个字符之间'
      }
    }
  })

  // 初始化用户信息
  initUserInfo()
  var layer = layui.layer
  //封装初始化用户信息函数
  function initUserInfo() {
    $.ajax({
      method: 'GET',
      url: '/my/userinfo',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        // console.log(res);
        // 使用form.val方法进行快速为表单赋值
        form.val('formUserInfo', res.data)
      }
    })
  }

  // 重置按钮
  $('#btnReset').on('click', function (e) {
    e.preventDefault()
    initUserInfo()
  })


  // 监听表单的提交
  $(".layui-form").on('submit', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/userinfo',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('用户信息修改失败！')
        }
        layer.msg(res.message)
        // 调用父页面的方法
        window.parent.getUserInfo()
      }
    })
  })
})