$(function () {
    var layer = layui.layer;
    var form = layui.form;
    // 加载文章分类
    initCate();
    // 初始化富文本编辑器
    initEditor();

    // 实现图片裁剪基本效果
    // 1. 初始化图片裁剪器
    var $image = $('#image')
    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 3. 初始化裁剪区域
    $image.cropper(options);

    // 给选择封面按钮绑定点击事件
    $('#btn-choseImage').on('click', function () {
        // 触发事件，选择文件
        // console.log(1);
        $('#coverFile').click();
    })
    // 将选择的图片设置到裁剪区域
    // 监听coverFile文本框的change事件
    $('#coverFile').on('change', function (event) {
        // 1.拿到用户选择的文件列表
        var files = event.target.files;
        if (files.length === 0) {
            return layer.msg('请至少选择一个文件')
        }
        var file = files[0];
        // 2.根据选择的文件，创建一个对应的 URL 地址
        var newImgURL = URL.createObjectURL(file);
        // 3.先销毁旧的裁剪区域，再重新设置图片路径之后再创建新的裁剪区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }

                // 请求成功了就使用模板引擎渲染列表
                var htmlStr = template('tpl-list', res);
                $('[name = cate_id]').html(htmlStr);
                form.render();
            }
        })
    }

    // 发布文章
    // 根据接口准备请求体的五个参数
    // 第一个 --> 定义文章的发布状态
    var article_state = '已发布';
    $('#btn-save2').on('click', function () {
        article_state = '草稿';
    })

    // 为表单准备提交事件
    $('#form-pub').on('submit', function (event) {
        // 阻止表单默认提交行为
        event.preventDefault();
        // 基于表单快速创建formData对象
        // 这里能获得三个
        var fd = new FormData($(this)[0]);

        // 再把刚才获得的文件状态追加进来
        fd.append('state', article_state);
        // 把裁剪的图片拿出来，提交到fd对象中
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob);
                // 发起ajax请求把文章提交上去\
                publishArticle(fd);
            })
    })
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            // 如果提交的是formdata格式的数据，要另外配置两个配置项
            contentType: false,
            processData: false,
            data: fd,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                // 发布文章成功后跳转到文章列表页面
                location.href = './article_list.html';
            }
        })
    }
})