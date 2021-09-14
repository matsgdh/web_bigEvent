$(function () {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    // 定时时间格式化过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date);

        var y = dt.getFullYear();
        var m = zeroPlus(dt.getMonth() + 1);
        var d = zeroPlus(dt.getDate());

        var hh = zeroPlus(dt.getHours());
        var mm = zeroPlus(dt.getMinutes());
        var ss = zeroPlus(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }

    // 定义给时间补零方法
    function zeroPlus(time) {
        return time > 9 ? time : '0' + time;
    }
    // 定义一个查询参数对象，将来请求时把它提交到服务器
    var query = {
        pagenum: 1,    // 页码值，默认请求第一页的数据
        pagesize: 2,   // 每页显示几条数据，默认每页显示两条
        cate_id: '',   // 文章分类的id，非必选参数
        state: ''      // 文章的发布状态
    }
    initTable();
    initCate();
    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: query,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                console.log(res);
                // 使用模板引擎渲染数据
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);

                // 表格数据渲染完就渲染分页
                renderPage(res.total);
            }
        })
    }

    // 获取文章分类，动态初始化所有分类下拉菜单
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                // 调用模板引擎来渲染分类的可选项
                var htmlStr = template('tpl-cate', res);
                // console.log(htmlStr);
                $('[name = cate_id]').html(htmlStr);
                // layui的渲染机制
                form.render();
            }
        })
    }

    // 为筛选表单绑定 submit事件，实现筛选功能
    $('#form-search').on('submit', function (event) {
        // 阻止表单默认行为
        event.preventDefault();

        // 获取筛选表单中选中项的值
        var cate_id = $('[name = cate_id]').val();
        var state = $('[name = state]').val();

        // 为查询对象query赋值
        query.cate_id = cate_id;
        query.state = state;
        // 再根据筛选条件重新渲染表格数据
        initTable();
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox',       //分页容器的id
            count: total,          //总数据条数
            limit: query.pagesize,     //每页显示几条数据
            curr: query.pagenum,        //设置默认被选中的的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 发生分页切换时，会触发jump回调
            // 分页切换会触发  --> first为undefined
            // 刷新（刚进入页面也会调用） --> first为true
            jump: function (obj, first) {
                // 把最新的页码值赋值给查询对象query
                query.pagenum = obj.curr;
                // 把最新的条目数赋值给查询对象query
                query.pagesize = obj.limit;
                // 直接调用会死循环，一直在curr那
                if (!first) {
                    initTable();
                }
            }
        })
    }

    // 给删除按钮绑定点击事件（动态生成的要使用事件代理）
    $('tbody').on('click', '.btn-del', function () {
        // 获取当前页面删除按钮的个数（也就是文章个数）
        var len = $('.btn-del').length;
        // 获取删除按钮的id
        var id = $(this).attr('data-id');
        // 询问用户是否确认删除
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    layer.msg(res.message);
                    // 要判断当前页面的数据是否删没了
                    // 如果删除删没了要换页（页码值-1）
                    // 如果点击的时候页面上只有一个删除了，那就代表删完就没了
                    if (len === 1) {
                        // 页码-1再渲染
                        // 但是页码值最小是1
                        query.pagenum = query.pagenum === 1 ? 1 : query.pagenum - 1;
                    }
                    initTable();
                }
            })

            layer.close(index);
        });
    })
})