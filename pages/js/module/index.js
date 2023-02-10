/**********object oriented coding**********/
/**
 * 占用全局变量 Semiauto（半自动）和 Auto（自动轮播）
 * 启动函数.exec()
 */
(function (win) {
  function Semiauto($ul, $li, $tab) {
    this.$ul = $ul;
    this.$tab = $tab;
    this.width = $li.width();
    this.index = 0;
  }
  Semiauto.prototype = {
    exec: function () {
      this.addEvent();

    },
    addEvent: function () {
      var This = this;
      this.$tab.mouseenter(function () {
        This.index = This.$tab.index($(this));
        $(this).addClass("on").siblings().removeClass("on");
        This.$ul.finish().animate({
          left: -This.width * This.index
        }, 500)
      })
    }
  };
  //inhert and extend
  function Auto($ul, $li, $tab, $box) {
    Semiauto.call(this, $ul, $li, $tab);
    this.$box = $box;
    this.timer = null;
    this.len = $li.length;
  }
  //prototype inhert
  function Fn() { };
  Fn.prototype = Semiauto.prototype;
  Auto.prototype = new Fn();
  //extend
  Auto.prototype.doit = Auto.prototype.exec;
  Auto.prototype.exec = function () {
    this.doit();
    this.autoplay();
    this.clear();
  }
  Auto.prototype.autoplay = function () {
    var This = this;
    this.timer = setInterval(function () {
      This.index++;
      This.index %= This.len;
      This.$tab.eq(This.index).addClass("on").siblings().removeClass("on");
      This.$ul.finish().animate({
        left: -This.width * This.index
      })
    },
      3000)
  }
  Auto.prototype.clear = function () {
    var This = this;
    this.$box.hover(function () {
      clearInterval(This.timer);
    }, function () {
      This.autoplay();
    });
  }
  win.Semiauto = Semiauto;
  win.Auto = Auto;
})(window);