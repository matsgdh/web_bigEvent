$(function () {
    var layer = layui.layer;

    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }
    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 点击上传按钮选择图片文件
    $('#btnChose').on('click', function () {
        $('#file').click();
    })

    // 裁剪区图片的上传（替换）
    $('#file').on('change', function (event) {
        // 获得用户选择的文件
        var fileList = event.target.files;
        // console.log(fileList);
        if (fileList.length <= 0) {
            return layer.msg('请至少选择一张图片');
        }
        // 成功了就开始替换图片
        // 1.拿到用户选择的文件
        var file = fileList[0];
        // 2.根据选择的文件，创建一个对应的 URL 地址
        var newImgURL = URL.createObjectURL(file);
        // 3.先销毁旧的裁剪区域，再重新设置图片路径 ，之后再创建新的裁剪区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域 

    })

    // 点击确定按钮上传裁剪后的头像
    $('#btnUpload').on('click', function () {
        // 1.先拿到用户裁剪之后的图片（base64字符串形式）
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        // 2.调用接口，把头像上传到服务器
        $.ajax({
            method : 'POST',
            url : '/my/update/avatar',
            data : {
                avatar : dataURL
            },
            success : function(res){
                if(res.status !== 0){
                    return layer.msg(res.message);
                }
                layer.msg('更换头像成功！！');
                // 再调用父页面方法重新渲染头像
                window.parent.getUserInfo();
                
            }
        })
    })
})