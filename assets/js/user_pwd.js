$(function(){
    var form = layui.form;
    var layer = layui.layer;

    form.verify({
        pwd : [
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
        ] ,
        samePwd : function(value){
            var oldPwd = $('.layui-card-body [name="oldPwd"]').val();
            if(value === oldPwd){
                return '新密码不能与原密码一致';
            }
        },
        confirmPwd : function(value){
            var newPwd = $('.layui-card-body [name="newPwd"]').val();
            if(value !== newPwd){
                return '两次输入的新密码不一致，请重新确认';
            }
        }
    })

    // 为表单绑定提交事件
    $('.layui-form').on('submit',function(event){
        // 阻止默认提交事件
        event.preventDefault();
        $.ajax({
            method : 'POST',
            url : '/my/updatepwd',
            data : $(this).serialize(),
            success : function(res){
                if(res.status !== 0){
                    return layer.msg(res.message);
                }
                layer.msg('密码更新成功！')
                // 密码更新成功后重置表单
                $('.layui-form')[0].reset();
            }
        })
    })
})