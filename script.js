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

const loadCSS = (url) => {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = url;
  document.head.appendChild(link);
};

const loadJS = (url, callback) => {
  const script = document.createElement("script");
  script.src = url;
  script.onload = callback;
  document.body.appendChild(script);
};

const removeCSS = (filename) => {
  const links = document.querySelectorAll('link[rel="stylesheet"]');
  links.forEach((link) => {
    if (link.href.includes(filename)) {
      link.parentNode.removeChild(link);
    }
  });
};

// Function to remove loaded JS file
const removeJS = (filename) => {
  const scripts = document.querySelectorAll("script");
  scripts.forEach((script) => {
    if (script.src.includes(filename)) {
      script.parentNode.removeChild(script);
    }
  });
};

function init(obj, extension) {
  obj = decodeHtmlEntities(obj);
  if (editor) editor.dispose();
  wrapperContent.innerHTML = "";
  wrapperContent.classList.remove("mdClass");
  removeCSS("prism.css");
  removeJS("prism.min.js");
  if (extension === "md") {
    wrapperContent.innerHTML = obj;
    wrapperContent.classList.add("mdClass");
    loadCSS("prism.css");
    loadJS("prism.min.js", () => {
      console.log("Prism.js has been loaded");
    });
  } else {
    require.config({
      paths: {
        vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.1/min/vs",
      },
    });
    require(["vs/editor/editor.main"], function () {
      monaco.editor.defineTheme("myCustomTheme", {
        base: "hc-black", // 基础主题: 'vs', 'vs-dark', 'hc-black'
        inherit: true,
        rules: [
          { token: "comment", foreground: "999999", fontStyle: "italic" },
        ],
        colors: {
          "editor.foreground": "#D4D4D4",
          "editor.selectionBackground": "#264F78",
          "editor.lineHighlightBackground": "#242424",
          "editor.inactiveSelectionBackground": "#3B3A30",
          "editorIndentGuide.background": "#2A2D2E",
          "editorIndentGuide.activeBackground": "#2A2D2E",
        },
      });

      monaco.editor.setTheme("myCustomTheme");
      editor = monaco.editor.create(wrapperContent, {
        value: obj,
        language: extension === "js" ? "javascript" : extension,
        automaticLayout: true,
        theme: "myCustomTheme",
        fontSize: 16,
        fontFamily: "hack, Kanit",
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
  if (topEx) {
    topEx.onclick = () => {
      wrapperList.classList.toggle("isshow");
    };
  }
};
