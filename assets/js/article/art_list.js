$(function () {
  // 定义查询参数
  var q = {
    pagenum: 1,     //	页码值
    pagesize: 2,    //  每页显示多少条数据
    cate_id: '',    //	文章分类的 Id
    state: '',      //	文章的状态，可选值有：已发布、草稿
  }

  // 定义美化时间的过滤器
  template.defaults.imports.dataFormat = function (dtStr) {
    var dt = new Date(dtStr)

    var y = dt.getFullYear()
    var m = padZero(dt.getMonth() + 1)
    var d = padZero(dt.getDate())

    var hh = padZero(dt.getHours())
    var mm = padZero(dt.getMinutes())
    var ss = padZero(dt.getSeconds())

    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    // return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
  }

  // 定义补零函数
  function padZero(n) {
    return n > 9 ? n : '0' + n
  }

  // 初始化文章列表
  initTable()
  function initTable() {
    $.ajax({
      method: 'GET',
      url: '/my/article/list',
      data: q,
      success: function (res) {
        var str = template('tpl-table', res)
        $('tbody').html(str)
        // 渲染文章列表同时渲染分页
        renderPage(res.total)
      }
    })
  }

  // 初始化分类
  var form = layui.form
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
      }
    })
  }

  //筛选功能
  $('#form-search').on('submit', function (e) {
    e.preventDefault()
    var cate_id = $('[name=cate_id]').val()
    var state = $('[name=state]').val()
    // 赋值
    q.state = state
    q.cate_id = cate_id
    //  初始化文章列表
    initTable()
  })

  // 定义渲染分页的方法
  var laypage = layui.laypage
  function renderPage(total) {
    //执行一个laypage实例
    laypage.render({
      elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
      count: total,//数据总数，从服务端得到
      limit: q.pagesize, // 每页显示几条
      curr: q.pagenum,// 当前是第几页
      // 分页模块设置，显示哪些子模块
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [2, 3, 5, 10],//每页显示多少条的下拉菜单
      // 切换分页的回调函数
      // jump触发的方法：点击页面的时候会触发jump回调
      // 调用了laypage.render()方法触发jump回调
      // 每页显示几条数发送改变的时候
      jump: function (obj, first) {
        q.pagenum = obj.curr
        q.pagesize = obj.limit
        // 判断不是第一次初始化分页才能调用initTable方法初始化文章列表
        if (!first) {
          //初始化文章列表
          initTable()
        }
      }
    });
  }


  // 删除
  var layer = layui.layer
  $('tbody').on('click', '.btn-delete', function () {
    // 先获取id
    var Id = $(this).attr('data-id')
    // 询问框
    layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/delete/' + Id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg(res.message)
          }
          layer.msg('恭喜您，文章删除成功！')
          // 成功，渲染页面数据
          // 判断当前页有没有数据，没有就让页面值-1
          // 页面的删除按钮的个数等于1并且页面数大于1的时候才能让页面值减一
          if ($('.btn-delete').length == 1 && q.pagenum > 1) q.pagenum--
          initTable()
        }
      })
      layer.close(index);
    });
  })
})