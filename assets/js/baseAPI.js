// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function(options) {
    // 在发起真正的 Ajax 请求之前，统一拼接请求的根路径
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url;
    // 统一给有权限请求设置请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    //设置用户权限、没登陆不能访问后台主页
    options.complete = function(res) {
        // console.log(res);
        if (res.responseJSON.status === 1){
            // 1.强制清除·token
            localStorage.removeItem('token');
            // 2.强制跳转到登陆页面
            location.href = './login.html';
        }
    }
   

})