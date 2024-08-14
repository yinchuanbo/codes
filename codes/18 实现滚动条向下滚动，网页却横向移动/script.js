const scroll = document.getElementById("scroll");
const scrollBox = document.getElementById("scrollBox");
const vw = document.body.clientWidth; // 不包含滚动条的宽度
const vh = window.innerHeight;

// 这里的高度设置为 length-1 个横向块 + 屏幕高度
// 因为最后一块，滚动的距离并不是宽度，而是高度
sHeight = vw * (scrollBox.children.length - 1) + vh;
scroll.style.height = sHeight + "px";

window.addEventListener("scroll", () => {
  // 获取scroll的位置信息
  const { top, bottom } = scroll.getBoundingClientRect();

  // top <= 0 时，代表容器元素到达视图顶部。
  if (top <= 0 && top > -vw * 2) {
    scrollBox.style.transform = `translateX(${top}px)`;
  }
  if (top > 0) {
    scrollBox.style.transform = `translateX(0px)`;
  }
  if (top < -vw * 2) {
    scrollBox.style.transform = `translateX(-${sHeight - vh}px)`;
  }
});
