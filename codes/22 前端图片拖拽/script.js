// 初始化拖放对象
var box = document.getElementById("box");
// 获取页面中被拖放元素的引用指针
box.style.position = "absolute"; // 绝对定位
box.style.width = "160px"; // 定义宽度
box.style.height = "160px"; // 定义高度
// box.style.backgroundColor = "red";  // 定义背景色
// 初始化变量，标准化事件对象
var mx, my, ox, oy; // 定义备用变量
function e(event) {
  // 定义事件对象标准化函数
  if (!event) {
    // 兼容IE浏览器
    event = window.event;
    event.target = event.srcElement;
    event.layerX = event.offsetX;
    event.layerY = event.offsetY;
  }
  event.mx = event.pageX || event.clientX + document.body.scrollLeft;
  // 计算鼠标指针的x轴距离
  event.my = event.pageY || event.clientY + document.body.scrollTop;
  // 计算鼠标指针的y轴距离
  return event; // 返回标准化的事件对象
}
// 定义鼠标事件处理函数
document.onmousedown = function (event) {
  // 按下鼠标时，初始化处理
  event = e(event); // 获取标准事件对象
  o = event.target; // 获取当前拖放的元素
  ox = parseInt(o.offsetLeft); // 拖放元素的x轴坐标
  oy = parseInt(o.offsetTop); // 拖放元素的y轴坐标
  mx = event.mx; // 按下鼠标指针的x轴坐标
  my = event.my; // 按下鼠标指针的y轴坐标
  document.onmousemove = move; // 注册鼠标移动事件处理函数
  document.onmouseup = stop; // 注册松开鼠标事件处理函数
};
function move(event) {
  // 鼠标移动处理函数
  event = e(event);
  o.style.left = ox + event.mx - mx + "px"; // 定义拖动元素的x轴距离
  o.style.top = oy + event.my - my + "px"; // 定义拖动元素的y轴距离
}
function stop(event) {
  // 松开鼠标处理函数
  event = e(event);
  ox = parseInt(o.offsetLeft); // 记录拖放元素的x轴坐标
  oy = parseInt(o.offsetTop); // 记录拖放元素的y轴坐标
  mx = event.mx; // 记录鼠标指针的x轴坐标
  my = event.my; // 记录鼠标指针的y轴坐标
  o = document.onmousemove = document.onmouseup = null;
  // 释放所有操作对象
}