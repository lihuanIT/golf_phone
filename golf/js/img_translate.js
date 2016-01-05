/**
 * Created by lihuan on 2015/11/30.
 */
//封装的对象接受所有图片的盒元素与触发切换的最小滑动距离作为参数
var ImageSwiper = function(imgs, minRange, initImg, relations) {
    this.imgBox = imgs;
    this.imgs = imgs.children;
    this.relations = relations;
    this.cur_img = 2;  //起始图片设为1 ,而非0,将在图片显示方法中作-1处理
    this.initImg = initImg;//展现在视口的图片个数
    this.ready_moved = true;  //判断每次滑动开始的标记变量

    this.imgs_count = this.imgs.length;
    this.touchX;  //触控开始的手指最初落点
    this.touch_dis;//滑动距离
    this.lastImg;//为复制节点前的最后一张图
    this.copyNodeNum = 0; //复制的节点个数
    this.img_width;
    this.minRange = Number(minRange); //最小滑动距离，使图片轮播生效
    this.timestamp; //时间戳，用来判断两次滑动的间隔
    this.bindTouchEvn(); //初始化绑定滑动事件
    this.init();
}
ImageSwiper.prototype.init = function() {
    var cNode = this.imgs[0].cloneNode(true);
    this.imgBox.appendChild(cNode);
    this.copyNodeNum++;
    var last_index = this.imgs.length - 2;
    if(this.initImg != 1){
        for(var i=1; i<this.initImg; i++){
            var cNodei = this.imgs[i].cloneNode(true);
            this.imgBox.appendChild(cNodei);
            this.copyNodeNum++;
        }
    }
    var cNode_l = this.imgs[last_index].cloneNode(true);
    this.imgBox.insertBefore(cNode_l, this.imgs[0]);
    this.copyNodeNum++;
    this.imgs_count = this.imgs.length;
    this.timestamp = new Date().getTime();
    this.lastImg = this.imgs_count - this.copyNodeNum + 1;
    this.img_width = getCss(this.imgs[0], "width") + getCss(this.imgs[0],"marginRight");
    console.log("this.imgs[0].style.marginRight:--------------"+getCss(this.imgs[0],"marginRight"));
}

ImageSwiper.prototype.bindTouchEvn = function() {
    this.imgBox.addEventListener('touchstart', this.touchstart.bind(this), false)
    this.imgBox.addEventListener('touchmove', this.touchmove.bind(this), false)
    this.imgBox.addEventListener('touchend', this.touchend.bind(this), false)

}
ImageSwiper.prototype.touchstart = function(e) {

    if (this.ready_moved) {
        var touch = e.touches[0];  //targetTouches尽量代替touches
        this.touchX = touch.pageX;
        this.ready_moved = false;
    }

}

ImageSwiper.prototype.touchmove = function(e) {
    e.preventDefault();

    if (!this.ready_moved) {
        var releasedAt = e.changedTouches[0].pageX;
        this.touch_dis = releasedAt - this.touchX;
        if(Math.abs(this.touch_dis)>2){
            this.judge_cur();
            var had_moved = (-1)*(this.cur_img-1)*this.img_width;
            var sliding_dis = this.touch_dis + had_moved
            //console.log("sliding_dis:"+sliding_dis);
            showPic(this.imgBox, sliding_dis, "0ms");
        }
    }
}
ImageSwiper.prototype.judge_cur = function(){
    if(this.cur_img > this.lastImg){
        console.log("跳转")
        this.imgBox.style.transform = "translate3D(-"+this.img_width+"px,0,0)";
        this.imgBox.style.transitionDuration = "0ms";
        this.cur_img = 2;
    } else if (this.cur_img <= 1) {
        this.cur_img = this.lastImg;
        var firstPos = this.img_width*(this.imgs_count - this.copyNodeNum);
        this.imgBox.style.transform = "translate3D(-"+firstPos+"px,0,0)";
        this.imgBox.style.transitionDuration = "0ms";
    }
}
ImageSwiper.prototype.touchend = function(e) {
    e.preventDefault();

    if (!this.ready_moved) {
        if(Math.abs(this.touch_dis) < this.minRange){
            console.log("this.cur_img:"+this.cur_img);
            var had_moved = (-1)*(this.cur_img-1)*this.img_width;
            showPic(this.imgBox, had_moved, "100ms");
        } else{
            var release = e.changedTouches[0];
            var releasedAt = release.pageX;
            if (releasedAt + this.minRange < this.touchX) {
                this.cur_img++;
            } else if (releasedAt - this.minRange > this.touchX) {
                this.cur_img--;
            }
            var leftX = (-1)*(this.img_width*(this.cur_img-1));
            showPic(this.imgBox, leftX, "400ms");
            console.log(this.imgBox.style.transform+",current_img::::"+ this.cur_img);
            if(this.initImg == 1) this.changedot(this.cur_img);
            this.ready_moved = true;
        }

    }
}

ImageSwiper.prototype.changedot = function(cur_img){
  var relc = this.relations.children;
     var index = cur_img - 2;
    var initcount = this.imgs_count - this.copyNodeNum;
    index = (index==initcount) ? 0 : index;
    if(index == initcount){
        index = 0;
    }
    else if(index == -1){
        index = initcount - 1;
    }
    for(var i=0; i<initcount; i++){
        //console.log("relc[i]:"+relc[i])
        relc[i].className = "chg_pot l"
    }
    //console.log("index:"+index+",relc[index]:"+relc[index])
    relc[index].className += " chg_pot_on";
    relc[i-1].className += " cp_last";
}

var getCss = function (obj, key) {
    return Number((obj.currentStyle ? obj.currentStyle[key] : document.defaultView.getComputedStyle(obj, false)[key]).match(/^\d*/));
}
var showPic = function(obj, sliding_dis, dur_time) {
    obj.style.transform = "translate3D("+sliding_dis+"px,0,0)";
    obj.style.transitionDuration = dur_time;
}
//传参
var imgs = new ImageSwiper(document.getElementById('img_translate'), 80, 1, document.getElementById('change_points'));
var imgs_small = new ImageSwiper(document.getElementById('small_video_wrap'), 30, 3);
