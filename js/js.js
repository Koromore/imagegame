$(function () {
  document.getElementById("btn").addEventListener("click", function () {
    // 打散
    $("#whole").hide();
    console.info("开始")
    // 交换元素的left，top值,交换元素的位置。
    for (let i = 1; i < 20; i++) {
      // 设置随机数
      let a = Math.floor(Math.random() * 1000) % 9;
      let b = Math.floor(Math.random() * 1000) % 9;

      // console.info(a, b);
      if (a != b) {

        //交换boxs[a] 与boxs[b]
        let _left = boxs[a].style.left;
        boxs[a].style.left = boxs[b].style.left;
        boxs[b].style.left = _left;

        let _top = boxs[a].style.top;
        boxs[a].style.top = boxs[b].style.top;
        boxs[b].style.top = _top;

        let _index = boxs[a].getAttribute("data-index");
        boxs[a].setAttribute("data-index", boxs[b].getAttribute("data-index"));
        boxs[b].setAttribute("data-index", _index);
      }
    }
  })
  let maskbox = $("#maskbox");
  let boxs = $(".box");
  let imgBox = document.getElementById('imgbox');
  // let imgBox = $("#imgbox");
  let info = {
    x: 0, y: 0, top: 0, left: 0
  }
  for (let i = 0; i < boxs.length; i++) {
    boxs[i].addEventListener("touchstart", function (e) {
      info.x = e.targetTouches[0].pageX;
      info.y = e.targetTouches[0].pageY;
      info.top = parseInt(this.style.top);
      info.left = parseInt(this.style.left);

      // 缓存起点位置  给元素加了两个属性
      this.oriLeft = info.left;
      this.oriTop = info.top;

      // 禁止动画
      this.style.transition = "none";
      // console.log(e.targetTouches[0])
      // console.log(newLeft)

    });

    boxs[i].addEventListener("touchmove", function (e) {
      //newTop - newY = top - Y
      //newTop = top -y + newY
      this.style["z-index"] = 1000;
      let newTop = info.top - info.y + e.targetTouches[0].pageY;
      let newLeft = info.left - info.x + e.targetTouches[0].pageX;

      this.style.left = newLeft + "px";
      this.style.top = newTop + "px";

      // console.log("x" + e.targetTouches[0].pageX)
      // console.log("y" + e.targetTouches[0].pageY)
    });
    boxs[i].addEventListener("touchend", function (e) {
      this.style.transition = " all .5s";
      this.style["z-index"] = 0;
      // 点击坐标
      let x = e.changedTouches[0].pageX - imgBox.offsetLeft;
      let y = e.changedTouches[0].pageY - imgBox.offsetTop;
      // console.info(x, y);
      // 通过当前 x,y来找到目标元素
      let obj = findSwtichBox(this, x, y);
      // console.log(obj)
      // console.log("点击坐标"+x)
      // console.log("点击坐标"+y)
      // console.log(e.changedTouches[0])
      if (obj === this) {
        // 不要交换位置，返回原位
        obj.style.left = obj.oriLeft + "px";
        obj.style.top = obj.oriTop + "px";
      }
      else {
        swtichBoxs(this, obj);
        // 完成提示
        setTimeout(function () {
          // 执行判断是否完成
          if (isOk()) {
            // 游戏完成提示
            console.log("完成")
            maskbox.css("display", "block");
            $("#whole").show();
            // 定时隐藏提示
            setTimeout(function () {
              maskbox.css("display", "none");
            }, 1000);
          }
        }, 600)
      }
      // console.log("拖动元素")
      // console.log(obj);
    });
  }
  // 判断是否完成事件
  function isOk() {
    // 获取所有的元素的序号
    let str = "";
    for (let i = 0; i < boxs.length; i++) {
      str += boxs[i].getAttribute("data-index");
    }
    // console.info(str);
    return str == "012345678";
  }
  // 交换a，b元素的位置
  function swtichBoxs(oriEle, targetEle) {
    let _top = oriEle.oriTop;// let t = a;
    oriEle.style.top = targetEle.style.top;// a = b;
    targetEle.style.top = _top + "px";// b = t;

    // 把targetEle的top设置为oriEle的oriTop;
    let _left = oriEle.oriLeft;// let t = a;
    oriEle.style.left = targetEle.style.left; // a = b;
    targetEle.style.left = _left + "px";// b = t;

    // 交换data-index值
    let _index = oriEle.getAttribute("data-index");
    oriEle.setAttribute("data-index", targetEle.getAttribute("data-index"));
    targetEle.setAttribute("data-index", _index);
  }
  // 根据x,y的值，看当前的x，y落在box中的哪一个元素上。
  function findSwtichBox(obj, x, y) {
    // console.log("拖拽元素")
    // console.log(obj)
    // console.log(info)
    for (let i = 0; i < boxs.length; i++) {
      if (obj !== boxs[i]) {
        // 查找目标元素
        let t1 = x > boxs[i].offsetLeft && x < (boxs[i].offsetLeft + 100);
        let t2 = y > boxs[i].offsetTop && y < (boxs[i].offsetTop + 100);
        // console.log(t1)
        // console.log(t2)
        // console.log(boxs[i].offsetLeft)
        // console.log(boxs[i].offsetTop)
        if (t1 && t2) {
          // console.log("目标元素")
          // console.info(boxs[i]); 
          // 拖拽元素位置
          let startLeft = info.left
          let startTop = info.top
          // 目标元素位置
          let targetLeft = boxs[i].offsetLeft
          let targetTop = boxs[i].offsetTop
          // console.log("left"+startLeft)
          // console.log("top"+startTop)
          // console.log("left"+targetLeft)
          // console.log("top"+targetTop)
          // 计算差值
          let differLeft = Math.abs(targetLeft - startLeft)
          let differTop = Math.abs(targetTop - startTop)
          // console.log(differLeft)
          // console.log(differTop)
          // 限制只能相邻交换位置
          if (differLeft == 100 & differTop == 0) {
            return boxs[i];
          }
          else if (differLeft == 0 & differTop == 100) {
            return boxs[i];
          }
        }
      }
    }
    // 没有找到目标元素，则返回原来位置
    return obj;
  }
});