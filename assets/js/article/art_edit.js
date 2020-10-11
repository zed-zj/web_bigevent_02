$(function () {
  // 设置表单信息
  // 用等号切割，然后使用后面的值
  alert(location.search.split('=')[1])

  function initForm() {
    // location.search获取？后面的值用split根据=切割成数组取第一项
    var id = location.search.split('=')[1]
    $.ajax({
      method: 'GET',
      url: '/my/article/' + id,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        // 渲染到form表单中
        form.val('form-edit', res.data)
        // tinymce赋值
        tinyMCE.activeEditor.setContent(res.data.content)
        if (!res.data.cover_img) {
          return layer.msg('用户未曾上传头像！')
        }
        var newImgURL = baseURL + res.data.cover_img
        $image
          .cropper('destroy') // 销毁旧的裁剪区域
          .attr('src', newImgURL) // 重新设置图片路径
          .cropper(options) // 重新初始化裁剪区域
      }
    })

  }

  var form = layui.form
  var layer = layui.layer
  initCate()
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        var htmlStr = template('tpl-cate', res)
        $('[name=cate_id]').html(htmlStr)
        form.render()
        initForm()
      }
    })
  }

  // 初始化富文本编辑器
  initEditor()

  // 1. 初始化图片裁剪器
  var $image = $('#image')

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }

  // 3. 初始化裁剪区域
  $image.cropper(options)


  // 为选择封面的按钮绑定点击事件
  $('#btnChooseImage').on('click', function () {
    $('#coverFile').click()
  })

  // 修改图片
  var layer = layui.layer
  $('#coverFile').on('change', function (e) {
    // var files = this.files  //两个是一样的
    var files = e.target.files
    if (files.length === 0) {
      return layer.msg('请选择文件!')
    }
    // 成功修改图片
    // 1. 拿到用户选择的文件
    var file = e.target.files[0]
    // 2. 将文件，转化为路径
    var imgURL = URL.createObjectURL(file)
    // 3. 重新初始化裁剪区域
    $image
      .cropper('destroy') // 销毁旧的裁剪区域
      .attr('src', imgURL) // 重新设置图片路径
      .cropper(options) // 重新初始化裁剪区域
  })

  // 设置状态
  var state = '已发布'
  $('#btnSave2').on('click', function () {
    state = '草稿'
  })

  // 添加文章
  $('#form-pub').on('submit', function (e) {
    e.preventDefault()
    // 2. 基于 form 表单，快速创建一个 FormData 对象
    var fd = new FormData(this)
    // 3. 将文章的发布状态，存到 fd 中
    fd.append('state', state)
    // 4. 将封面裁剪过后的图片，输出为一个文件对象
    $image
      .cropper('getCroppedCanvas', {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        // 5. 将文件对象，存储到 fd 中
        fd.append('cover_img', blob)
        // 6. 发起 ajax 数据请求
        publishArticle(fd)
      })
  })
  function publishArticle(fd) {
    $.ajax({
      method: 'POST',
      url: '/my/article/edit',
      data: fd,
      // 注意：如果向服务器提交的是 FormData 格式的数据，
      // 必须添加以下两个配置项
      contentType: false,
      processData: false,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('发布文章失败！')
        }
        layer.msg('修改文章成功！页面跳转中。。。')
        // 发布文章成功后，跳转到文章列表页面
        // 这么写有点bug，会在发表文章部分跳转
        // location.href = '/article/art_list.html'
        setTimeout(function () {
          window.parent.document.querySelector('#art_list').click()
        }, 1500)
      }
    })
  }

})