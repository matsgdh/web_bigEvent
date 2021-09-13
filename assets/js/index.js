$(function () {
    // 实例化layer对象
    var layer = layui.layer;
    // 调用 getUserInfo(),获取用户信息
    getUserInfo();
    // 在首页点击退出按钮实现退出登录功能
    $('#btnLogout').on('click', function () {
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            // 1.清楚本地存储的token
            localStorage.removeItem('token');
            // 2.重新跳转到登陆页面
            location.href = './login.html';

            //点击取消按钮关闭确认框
            layer.close(index);
        });
    })

    // 获取用户信息
    function getUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            // 接口楼文档里说带my的都要加请求头
            // headers : {
            //     Authorization : localStorage.getItem('token') || ''
            // },
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    layui.layer.msg(res.message);
                }
                // 获取用户信息成功了就开始渲染头像
                renderAvatar(res.data);
            }
            // ajax无论请求成功还是失败都会调用complete回调函数
            // 将其同意挂在baseAPI中
        })
    }

    // 渲染用户的头像
    function renderAvatar(user) {
        // 1.获取用户的名称
        // 有昵称选昵称，没昵称选登录名
        var name = user.nickname || user.username;
        // 2.设置欢迎***的文本
        $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
        // 3.渲染用户头像
        if (user.user_pic !== null) {
            // 3.1 有图片头像渲染图片头像
            $('.layui-nav-img').attr('src', user.user_pic).show();
            $('.text-avatar').hide();
        } else {
            // 3.2 无图片头像渲染文本头像
            $('.layui-nav-img').hide();
            // 获取第一个文字或者字母
            var first = name[0].toUpperCase();
            $('.text-avatar').html(first).show();
        }
    }
})

