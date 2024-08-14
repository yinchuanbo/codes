function dragMoveX(containerSelector) {
  var container = document.querySelector(containerSelector);
  var flag = false;
  var downX;
  var scrollLeft;

  container.addEventListener("mousedown", function (event) {
    console.log("mousedown");
    flag = true;
    downX = event.clientX;
    scrollLeft = container.scrollLeft;
  });

  document.addEventListener("mousemove", function (event) {
    console.log("mousemove", flag, event.clientX);
    if (flag) {
      var moveX = event.clientX;
      var scrollX = moveX - downX;
      container.scrollLeft = scrollLeft - scrollX;
    }
  });

  document.addEventListener("mouseup", function () {
    console.log("mouseup");
    flag = false;
  });

  container.addEventListener("mouseleave", function (event) {
    if (event.pageX < 0 || event.pageX > document.body.offsetWidth) {
      console.log("在元素上移出");
      flag = false;
    }
  });
}

dragMoveX(".box");
