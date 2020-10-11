$(function () {
  // 获取文章分类的列表
  initArtCateList()
  function initArtCateList() {
    $.ajax({
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layui.layer.msg('获取文章分类失败！')
        }
        var htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)
      }
    })
  }

  // 显示添加文章分类列表
  var layer = layui.layer
  $('#btnAddCate').on('click', function () {
    // 利用框架代码，显示提示添加文章列别区域
    indexAdd = layer.open({
      type: 1,
      title: '添加文章分类',
      area: ['500px', '250px'],
      content: $('#dialog-add').html()
    })
  })

  // 添加文章分类（事件代理）
  var indexAdd = null
  $('body').on('submit', '#form-add', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/article/addcates',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        layer.msg('恭喜您，添加分类成功！')
        initArtCateList()
        layer.close(indexAdd)
      }
    })
  })

  // 修改展示表单
  var indexEdit = null
  $('tbody').on('click', '.btn-edit', function () {
    indexEdit = layer.open({
      type: 1,
      title: '修改文章分类',
      area: ['500px', '250px'],
      content: $('#dialog-edit').html()
    })
    // 获取id，发送Ajax获取数据，渲染到页面
    var Id = $(this).attr('data-id')
    $.ajax({
      method: 'GET',
      url: '/my/article/cates/' + Id,
      success: function (res) {
        layui.form.val('form-edit', res.data)
      }
    })
  })

  // 修改-提交
  $('body').on('submit', '#form-edit', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/article/updatecate',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        // 重新渲染数据
        initArtCateList()
        layer.msg('恭喜您，文章类别更新成功！')
        layer.close(indexEdit)
      }
    })
  })


  // 删除
  $("tbody").on('click', '.btn-delete', function () {
    // 先获取Id，后面的this就未必是按钮了
    var Id = $(this).attr('data-id')
    layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/deletecate/' + Id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg(res.message)
          }
          initArtCateList()
          layer.msg('恭喜您，文章删除成功！')
          layer.close(index);
        }
      })
    });
  })

})