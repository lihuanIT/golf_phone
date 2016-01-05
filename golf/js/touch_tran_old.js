/**
 * Created by lihuan on 2015/12/10.
 */

var TouchScroll = function(content, scroll){
    this.content = content //要操作的对象
    this.scroll = scroll; //要操作的滚轮对象
    this.parentH;
    this.ready_moved = true  //判断每次滑动开始的标记变量
    this.touchX;  //触控开始的手指最初落点
    this.currentPos; //所有触控操作后当前位置
    this.content_height;//当前操作元素高度
    this.touchY;  //触控开始的手指最初落点
    this.last_move_touchY;//上次调用touchmove移动的距离
    this.move_sub_dis; //相对上次调用touchmove移动的距离差
    this.finalPos;//操作对象到达最底端时的位置
    this.scroll_top;//滚轮相对父元素最初的top
    this.scroll_bot;//滚轮相对父元素最初的bottom
    this.scroll_pos;//滚轮所在的相对父元素的位置
    this.scroll_area;//滚轮可以滚动的距离
    this.scrollH; //滚轮的高度
    this.getHeight;
    this.bindTouchEvn(); //初始化绑定滑动事件
    this.init(); //初始化事件
}

TouchScroll.prototype.init = function() {
    this.currentPos = 0;
    this.content_height = this.getHeight(this.content);
    this.finalPos = 300 - this.content_height;
    this.scroll_top = this.scroll.offsetTop;
    this.scroll_bot = this.scroll_top;

    this.scrollH = this.getHeight(this.scroll);
    this.parentH = this.getHeight(this.content.parentNode);
    this.scroll_area = 300 - this.scroll_top - this.scroll_bot - this.scrollH;
    this.scroll_pos = 0;
    console.log(this.content + "---content_height:" + this.content_height + "-----this.scroll_top:" + this.scroll_top + ",scroll_area:" + this.scroll_area);
}

TouchScroll.prototype.getHeight = function(elemt){
    return Number((window.getComputedStyle(elemt).height).match(/^\d*/));
}

TouchScroll.prototype.bindTouchEvn = function() {
    this.content.addEventListener('touchstart', this.touchstart.bind(this), false);
    this.content.addEventListener('touchmove', this.touchmove.bind(this), false);
    this.content.addEventListener('touchend', this.touchend.bind(this), false);

    this.scroll.addEventListener('touchstart', this.touchstartScr.bind(this), false);
    this.scroll.addEventListener('touchmove', this.touchmoveScr.bind(this), false);
    this.scroll.addEventListener('touchend', this.touchendScr.bind(this), false);
}

TouchScroll.prototype.touchstart = function(e) {
    //console.log("touchstart");
    if (this.ready_moved) {
        var touch = e.targetTouches[0];  //targetTouches尽量代替touches
        this.touchX = touch.pageX;
        this.touchY = touch.pageY;
        this.last_move_touchY = touch.pageY;
        this.ready_moved = false;
    }
}

TouchScroll.prototype.touchmove = function(e) {
    console.log("touchmove");
    e.preventDefault();
    //var move_dis;
    var touchY = this.touchY;
    var releasedAt = e.targetTouches[0].pageY;

    this.move_sub_dis = releasedAt - this.last_move_touchY;
    //move_dis = releasedAt - touchY;
    console.log("this.content_height:"+this.content_height+"move... 当前位置："+this.currentPos);
    console.log("touchY:"+touchY+",releasedAt:"+releasedAt+",move_dis:"/*+move_dis*/+",this.move_sub_dis:"+this.move_sub_dis);

    if(this.currentPos <= 0 && this.currentPos >= this.finalPos){
        this.show_scroll_content();
        this.ready_moved = true;
        console.log(this.ready_moved);
    }
    this.last_move_touchY = releasedAt;
}

TouchScroll.prototype.touchend = function(e) {
    console.log("touchend");
    e.preventDefault();
    //var move_dis;
    var touchY = this.touchY;
    if (this.ready_moved) {
        var releasedAt = e.changedTouches[0].pageY;
        this.move_sub_dis = releasedAt - this.last_move_touchY;
        //move_dis = releasedAt - touchY;
        console.log("this.content_height:"+this.content_height+"move... 当前位置："+this.currentPos);
        console.log("touchY:"+touchY+",releasedAt:"+releasedAt+",move_dis:"/*+move_dis*/+",this.move_sub_dis:"+this.move_sub_dis);

        if(this.currentPos <= 0 && this.currentPos >= this.finalPos){
            this.ready_moved = true;
            console.log(this.ready_moved);
        }
        this.last_move_touchY = releasedAt;
    }
}


TouchScroll.prototype.show_scroll_content = function() {
    var sub = this.currentPos - this.finalPos;
    if(this.currentPos > (-1)*this.move_sub_dis){
        this.currentPos = 0;
        //this.scroll_pos = 0;
    } else if( sub < (-1)*this.move_sub_dis ){
        this.currentPos = this.finalPos;
        //this.scroll_pos = this.scroll_area;
    } else{
        this.currentPos += this.move_sub_dis;
    }
    var per = this.currentPos / this.finalPos;
    this.scroll_pos = this.scroll_area * per;

    console.log("this.finalPos:" + this.finalPos + ","+",,,,,,,,,,,"+this.scroll_pos);
    this.content.style.transform = "translate3d(0,"+this.currentPos+"px,0)";
    this.scroll.style.transform = "translate3d(0," + this.scroll_pos + "px, 0)";
}

TouchScroll.prototype.touchstartScr = function(e) {
    if (this.ready_moved) {
        var touch = e.targetTouches[0];
        this.touchX = touch.pageX;
        this.touchY = touch.pageY;
        this.last_move_touchY = touch.pageY;
        this.ready_moved = false;
    }
}

TouchScroll.prototype.touchmoveScr = function(e) {
    console.log("touchmove");
    e.preventDefault();
    var touchY = this.touchY;
    var releasedAt = e.targetTouches[0].pageY;
    this.move_sub_dis = releasedAt - this.last_move_touchY;

    if(this.scroll_pos >= 0 && this.scroll_pos <= this.scroll_area){
        this.scroll_trans();
        this.ready_moved = true;
    }
    this.last_move_touchY = releasedAt;
}

TouchScroll.prototype.touchendScr = function(e) {
    e.preventDefault();
    var touchY = this.touchY;
    if (this.ready_moved) {
        var releasedAt = e.changedTouches[0].pageY;
        this.move_sub_dis = releasedAt - this.last_move_touchY;

        if(this.scroll_pos >= 0 && this.scroll_pos <= this.scroll_area){
            this.ready_moved = true;
        }
        this.last_move_touchY = releasedAt;
    }
}

TouchScroll.prototype.scroll_trans = function() {
    var sub = this.scroll_area - this.scroll_pos;
    if(this.scroll_pos < (-1)*this.move_sub_dis){
        this.scroll_pos = 0;
        this.currentPos = 0;
    } else if(sub < this.move_sub_dis){
        this.scroll_pos = this.scroll_area;
        this.currentPos = this.finalPos;
    } else{
        this.scroll_pos += this.move_sub_dis;
        var per = this.scroll_pos / this.scroll_area;
        this.currentPos = this.finalPos * per;
    }

    console.log("this.finalPos:" + this.finalPos + ","+",,,,,,,,,,,"+this.scroll_pos);
    this.scroll.style.transform = "translate3d(0," + this.scroll_pos + "px, 0)";
    this.content.style.transform = "translate3d(0,"+this.currentPos+"px,0)";
}



//传参

window.onload = function(){
    var imgs = new TouchScroll(document.getElementById('settings_img'), document.getElementById("scroll"));
}






















