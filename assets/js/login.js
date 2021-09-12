$(function () {
    //点击去注册的链接
    $('#link_reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();
    })

    //点击去登录的链接
    $('#link_login').on('click', function () {
        $('.login-box').show();
        $('.reg-box').hide();
    })

    // 依托layui自定义校验规则
    // 从layui中获取form对象
    var form = layui.form;
    // 优化弹出框对象
    var layer = layui.layer;
    // 通过form.verify()函数自定义校验规则
    form.verify({
        // 定义密码规则，数组格式
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 校验密码输入是否一致，函数形式 
        repwd: function (value) {
            // 从密码框拿到值，与加了repwd的表单的value比较
            var pwd = $('.reg-box [name="password"]').val();
            if (value !== pwd) {
                return '两次密码输入不一致！';
            }
        }
    })

    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function (event) {
        // 阻止表单的默认提交行为
        event.preventDefault();
        // 根据接口文档发起对应请求
        $.post('/api/reguser', {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }, function (res) {
            if (res.status !== 0) {
                // 使用layui优化效果
                // return alert(res.message);
              
                return layer.msg(res.message);
            }
            // console.log('注册成功了！');
            layer.msg("恭喜您！注册成功了！！");
            // 注册成功跳转回登陆页面
            $('#link_login').click();
        })
       
    })

    // 监听登陆表单的提交事件
    $('#form_login').on('submit', function (event) {
        // 阻止表单的默认提交行为
        event.preventDefault();
        // 根据接口文档发起对应请求
        $.ajax({
            url : '/api/login',
            method : 'POST',
            // 快速读取表单中的数据
            data : $(this).serialize(),
            success : function(res){
                if(res.status !== 0){
                    // console.log('咋整的');
                    return layer.msg('登陆失败');
                }
                layer.msg('登陆成功了！');
                // 登陆成功时，将涉及权限登陆的token值存储到本地
                localStorage.setItem('token',res.token);
                // 跳转到后台主页
                location.href = './index.html';
            }
        })
        
    })
})