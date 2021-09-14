$(function () {
    var layer = layui.layer;
    var form = layui.form;
    initArticleList();
    // 获取文章分类列表
    function initArticleList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            data: {},
            success: function (res) {
                if (res.status !== 0) {
                    // return layer.msg(res.message);
                    return layer.msg('获取列表失败');
                }
                // layer.msg(res.messgae);
                // layer.msg('获取列表成功');
                // 渲染表格数据
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
            }
        })
    }

    var addIndex = null;
    // 通过弹出层添加类别
    $('#btnAddCate').on('click', function () {
        addIndex = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            // 内容也使用模板引擎来渲染
            content: $('#dialog-add').html()
        })
    })

    // 通过表单提交事件添加文章类别
    // 他是动态添加的，不是本来就有的，要使用事件委托绑定事件
    $('body').on('submit', '#form-add', function (event) {
        // 阻止表单默认提交
        event.preventDefault();

        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('添加分类失败');
                }
                initArticleList();
                layer.msg(res.message);
                // 根据打开弹出层的索引关闭弹出层
                layer.close(addIndex);
            }
        })
    })

    var editIndex = null;
    // 为编辑按钮绑定点击事件，对现有分类进行修改
    // 同样这里也要使用事件代理
    $('tbody').on('click', '.btn-edit', function () {
        editIndex = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            // 内容也使用模板引擎来渲染
            content: $('#dialog-edit').html()
        })
        // 点击编辑按钮不仅要打开弹出穿，还要把原有数据渲染出来
        var id = $(this).attr('data-id');
        // console.log(id);
        // 发起请求获取对应数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                if (res.status !== 0) {
                    console.log(res);
                    return layer.msg('获取文章分类失败');
                }
                layer.msg('获取文章分类成功');
                // console.log(res);
                // 渲染到对应表单中，通过form.val()方法快速填充表单
                form.val('form-edit', res.data);
            }

        })
    })

    // 通过表单提交事件提交对分类的修改
    $('body').on('submit', '#form-edit', function (event) {
        // 阻止表单默认提交
        event.preventDefault();

        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('修改分类失败');
                }
                // 根据打开弹出层的索引关闭弹出层
                layer.close(editIndex);
                initArticleList();
                layer.msg(res.message);

            }
        })
    })

    // 给删除按钮绑定点击事件删除对应数据
    // 同样动态生成，也要使用事件委托
    $('tbody').on('click', '.btn-del', function () {
        var id = $(this).attr('data-index');
        // console.log(index);
        // 弹出确认框，是否确认删除
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function (index) {
            // 点击确认发起请求删除数据
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    layer.msg(res.message);
                    layer.close(index);
                    initArticleList();
                }
            })


        });
    })

})