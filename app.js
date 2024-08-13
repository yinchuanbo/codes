const fs = require("fs");
const ejs = require("ejs");
const path = require("path");
const marked = require("marked");

const directoryPath = __dirname;

function deleteHtmlFilesInCurrentDirectory(dirPath) {
  try {
    const files = fs.readdirSync(dirPath);
    files.forEach((file) => {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);
      if (stats.isFile() && path.extname(file) === ".html") {
        fs.unlinkSync(filePath);
        console.log(`Deleted file: ${file}`);
      }
    });
  } catch (err) {
    console.error(`Error: ${err.message}`);
  }
}

deleteHtmlFilesInCurrentDirectory(directoryPath);

const isImage = (fileName) => {
  const imageExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".bmp",
    ".webp",
    ".svg",
  ];
  const ext = path.extname(fileName).toLowerCase();
  return imageExtensions.includes(ext);
};

function svgToBase64(svgString) {
  return "data:image/svg+xml;base64," + btoa(svgString);
}
function getDirectoryStructure(dirPath) {
  const result = {};

  const items = fs.readdirSync(dirPath);

  items.forEach((item) => {
    const itemPath = path.join(dirPath, item);
    const stats = fs.statSync(itemPath);
    if (stats.isDirectory()) {
      result[item] = getDirectoryStructure(itemPath);
    } else {
      if (isImage(item)) {
        const fileContent = fs.readFileSync(itemPath);
        const base64Content = fileContent.toString("base64");
        if (itemPath.includes(".svg")) {
          result[item] = svgToBase64(fileContent);
        } else {
          result[item] = `data:image/${path
            .extname(item)
            .slice(1)};base64,${base64Content}`;
        }
      } else {
        const fileContent = fs.readFileSync(itemPath, "utf-8");
        if (itemPath.includes(".md")) {
          result[item] = marked.parse(fileContent);
        } else {
          result[item] = fileContent;
        }
      }
    }
  });
  return result;
}

function getCodesDirectoryStructure() {
  const codesDirPath = path.join(__dirname, "codes");
  const codesDirs = fs.readdirSync(codesDirPath);
  const result = {};
  codesDirs.forEach((dir) => {
    const dirPath = path.join(codesDirPath, dir);
    const stats = fs.statSync(dirPath);
    if (stats.isDirectory()) {
      result[dir] = getDirectoryStructure(dirPath);
    }
  });
  return result;
}

const structure = getCodesDirectoryStructure();

const templateContent = fs.readFileSync("./templates/edit.html", "utf-8");

let uniqueId = 0;

function convertToHTML(structure, parentPath = "") {
  let html = "<ul>";
  for (const key in structure) {
    if (structure.hasOwnProperty(key)) {
      uniqueId++;
      const currentPath = parentPath ? `${parentPath}/${key}` : key;
      if (typeof structure[key] === "object") {
        html += `<li>${key}${convertToHTML(structure[key], currentPath)}</li>`;
      } else {
        html += `<li data-id="${uniqueId}" data-path="${currentPath}">${key}</li>`;
      }
    }
  }
  html += "</ul>";
  return html;
}

let urls = [];

for (const key in structure) {
  const len = Object.keys(structure[key]).length;
  const hasHtml = !!structure[key]['index.html']
  const tempHTML = ejs.render(templateContent, {
    content: convertToHTML(structure[key]),
    datas: structure[key],
    key,
    preview: `/codes/${key}`,
    hasHtml,
    len
  });
  const sanitizedKey = key.replace(/\s+/g, "_");
  const htmlName = `${sanitizedKey}.html`;
  const outputFilePath = path.join(__dirname, htmlName);
  fs.writeFileSync(outputFilePath, tempHTML, "utf-8");
  urls.push({
    htmlName,
    key,
  });
}

const homeTemplateContent = fs.readFileSync("./templates/home.html", "utf-8");

const homeOutputFilePath = path.join(__dirname, `index.html`);

let homeHTML = `<ul>`;
for (let i = 0; i < urls.length; i++) {
  const url = urls[i];
  homeHTML += `<li><a href="${url.htmlName}">${url.key}</a></li>`;
}

homeHTML += `</ul>`;

const homeTempHTML = ejs.render(homeTemplateContent, {
  listsHTML: homeHTML,
});
fs.writeFileSync(homeOutputFilePath, homeTempHTML, "utf-8");
