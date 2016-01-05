# 移动端的高尔夫专题页

##1. 移动端网页自适应布局
  
##2. 图片轮播
    原生js编写
    实现效果：
            （1）视口中可存在单张或多张图片
            （2）循环切换图片
            （3）可滑动显示左右相邻图片
            （4）首尾无缝衔接
            （5）快速滑动，图片无缝衔接
            （6）在某一范围内，横向滑动当前图片同时会带出相邻另一张图片同向滑动相同距离
            （7）移动距离过小时，动画恢复滑动图片原来位置
            （8）单张图片轮播带动切换锚点
    实现步骤：
            （1）移动ul，非li，通过transform改变其位置
            （2）封装一个对象ImageSwiper
                参数：imgs, minRange, initImg, relations
                1）imgs: 接受所有图片的盒元素
                2）minRange: 触发切换的最小滑动距离作为参数
                3）initImg: 展现在视口的图片个数
                4）relations: 单张图片轮播时，传入关联锚点
            （2）初始化该对象，clone initImg个图片节点
            （3）在对象原型链上添加处理方法
                1）为相应对象绑定touch的三个事件
                2）touchstart时记录初始滑动时的手指所在位置
                3）touchmove时：
                    1> 主要判断滑动后照片是否为第一张或最后一张图片，改变其cur_img值，并将其transform作相应调整
                    2> 记录滑动距离，实现滑动当前图片时带动相邻图片同向滑动
                4）touchend时：
                    1> 判断滑动距离小于minRange时，恢复当前滑动图片原来位置
                    2> 否则，判断当前图片左滑还是右滑，改变cur_img
                    3> 然后，显示图片轮播效果
                5）单张图片轮播时，改变关联锚点的类名
                    
    使用方法：var imgs = new ImageSwiper(document.getElementById('img_translate'), 80, 1, document.getElementById('change_points'));

##3. Mobile Touch 事件 模拟滚轮效果
    原生js编写
    实现效果：
            （1）移动滚轮显示隐藏内容
            （2）移动内容显示隐藏内容，带动滚轮一起移动
    实现步骤：
            （1）封装一个对象TouchScroll，参数为content, scroll
                1）content：要操作的内容对象
                2）scroll：要操作的滚轮对象
            （2）分别为两个操作对象绑定touch的三个事件
            （3）在内容高度范围内，记录每一次的移动距离move_sub_dis
            （4）判断上下滑动，改变this.currentPos
            （5）transform滑动内容，同时按照相等比例滑动滚轮
            （6）判断每一次的移动是否到达内容顶部或尾部
    使用方法：var imgs = new TouchScroll(document.getElementById('settings_img'), document.getElementById("scroll"));

##4. form表单验证
    使用validationEngine插件验证
    使用JSONP跨域访问接口
    
