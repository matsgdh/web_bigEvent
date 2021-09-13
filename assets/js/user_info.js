$(function () {
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称的长度必须在1-6个字符之间';
            }
        }
    })
    initUserInfo();
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            // 接口楼文档里说带my的都要加请求头
            // headers : {
            //     Authorization : localStorage.getItem('token') || ''
            // },
            success: function (res) {
                // console.log(res.data);
                if (res.status !== 0) {
                    layer.msg(res.message);
                }
                // 给表单赋值
                form.val('formUserInfo', res.data);
            }

        })
    }

    // 重置表单中的数据
    $('#btnReset').on('click', function (event) {
        event.preventDefault();
        initUserInfo();
    })

    // 提交修改
    $('.layui-form').on('submit', function (event) {
        event.preventDefault();
        // 发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('更新用户信息成功！')
                // initUserInfo();
                // 调用父页面方法，重新渲染用户头像和用户信息
                window.parent.getUserInfo();
                // initUserInfo();
                // console.log('sillyb');
            }
        })
    })
})

