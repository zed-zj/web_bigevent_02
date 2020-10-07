$(function () {
  $('#link_reg').on('click', function () {
    $('.login-box').hide()
    $('.reg-box').show()
  });
  $('#link_login').on('click', function () {
    $('.login-box').show()
    $('.reg-box').hide()
  });


  //从layui里引入form对象
  var form = layui.form;
  form.verify({
    pwd: [/^[\S]{6,12}$/,
      '密码必须6到12位，且不能出现空格'],
    repwd: function (value) {
      //value 是输入的值，然后获取password里的值，进行比较
      //要区分登录和注册里的input输入框
      var pwd = $('.reg-box [name=password]').val()
      if (pwd !== value) {
        return '两次密码输入不一致！'
      }
    }
  });

  //从layui里引入layer对象
  var layer = layui.layer;
  // 注册功能
  $('#form_reg').on('submit', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/api/reguser',
      data: {
        username: $('.reg-box [name=username]').val(),
        password: $('.reg-box [name=password]').val(),
      },
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        layer.msg('恭喜您注册成功，请登录！')
        // 手动切换到重置表单
        $('#link_login').click()
        // 重置form表单
        $('#form_reg')[0].reset()
      }
    })
  })

  // 登录功能   监听登录的form表单
  $('#form_login').submit(function (e) {
    // 阻止表单的提交
    e.preventDefault()
    // 发送ajax
    $.ajax({
      method: 'POST',
      url: '/api/login',
      //快速获取表单的数据
      data: $(this).serialize(),
      success: function (res) {
        // 校验状态
        if (res.status !== 0) {
          return layer.mas(res.message)
        }
        // 成功就提示信息，然后保存token，跳转页面
        layer.msg('恭喜您，登陆成功！')
        // 保存token 后面的接口访问需要使用
        localStorage.setItem('token', res.token)
        //跳转
        location.href = '/index.html'
      }
    })

  })
})