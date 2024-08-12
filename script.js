const liElementsWithDataPath = document.querySelectorAll("li[data-path]");

const preDom = document.querySelector("#pre");
const html = preDom.innerHTML;
const data = JSON.parse(html);
const wrapperContent = document.querySelector(".wrapper__content");
const wrapperList = document.querySelector(".wrapper__list");
const topEx = document.querySelector(".wrapper__top_ex");
let isEx = false;

let imgArr = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];

let editor = null;

function getDataByPath(data, path) {
  const keys = path.split("/");
  const fileName = keys.pop();
  const fileExtension = fileName.split(".").pop();
  let result = data;
  for (const key of keys) {
    if (result[key] !== undefined) {
      result = result[key];
    } else {
      return { data: null, extension: null };
    }
  }
  return { data: result[fileName], extension: fileExtension };
}

function decodeHtmlEntities(encodedString) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = encodedString;
  return textarea.value;
}

function init(obj, extension) {
  obj = decodeHtmlEntities(obj);
  if (editor) editor.dispose();
  wrapperContent.innerHTML = "";
  wrapperContent.classList.remove("mdClass");
  if (extension === "md") {
    wrapperContent.innerHTML = obj;
    wrapperContent.classList.add("mdClass");
  } else {
    require.config({
      paths: {
        vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.1/min/vs",
      },
    });
    require(["vs/editor/editor.main"], function () {
      editor = monaco.editor.create(wrapperContent, {
        value: obj,
        language: extension === "js" ? "javascript" : extension,
        automaticLayout: true,
        theme: "hc-black",
        fontSize: 20,
        fontFamily: "consolas",
        scrollbar: {
          vertical: "hidden",
          horizontal: "hidden",
        },
        lineNumbers: true,
        lineHeight: 40,
        minimap: {
          enabled: false,
        },
      });
    });
  }
}

window.onload = () => {
  const firstPath = document.querySelector("li[data-path]");
  if (firstPath) {
    firstPath.classList.add("active");
    const path = firstPath.dataset.path;
    if (path) {
      const { data: obj, extension } = getDataByPath(data, path);
      if (!imgArr.includes(extension)) {
        init(obj, extension);
      } else {
        wrapperContent.innerHTML = "";
        wrapperContent.insertAdjacentHTML(
          "beforeend",
          `<img src="${obj}" style="margin-bottom: 0!important" />`
        );
      }
    }
  }
  liElementsWithDataPath.forEach((item) => {
    item.onclick = () => {
      const path = item.dataset.path;
      const curActive = document.querySelector("li[data-path].active");
      if (path) {
        curActive.classList.remove("active");
        const { data: obj, extension } = getDataByPath(data, path);
        if (!imgArr.includes(extension)) {
          init(obj, extension);
        } else {
          wrapperContent.innerHTML = "";
          wrapperContent.insertAdjacentHTML(
            "beforeend",
            `<img src="${obj}" style="margin-bottom: 0!important" />`
          );
        }
        item.classList.add("active");
      }
    };
  });
  topEx.onclick = () => {
    wrapperList.classList.toggle("isshow");
  };
};
