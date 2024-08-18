const elements = document.querySelectorAll(".element");
const inner = document.querySelector(".inner");

let deg = 0;

elements.forEach((element, index) => {
  element.style.transform = `rotateY(${deg}deg) translateX(220px)`;
  element.style.backgroundColor = `hsl(${deg}, 70%, 50%)`;
  deg += 5;
});

window.onmousemove = (e) => {
  let midPoint = window.innerWidth / 2;
  let midTopPoint = window.innerHeight / 2;
  inner.style.transform = `rotateY(${
    (e.clientX / midPoint - 1) * 50
  }deg) rotateX(${(e.clientY / midTopPoint - 1) * 50}deg)`;
};
