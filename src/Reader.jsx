import { useEffect, useState } from "react";
import { ipcRenderer } from "electron";
import "./assets/styles/reader.scss";
import http from "./assets/utils/http.js";
var list = [];
const Reader = () => {
  const [content, setContent] = useState([]);
  const [index, setIndex] = useState(0);
  const [fontStyle, setFontStyle] = useState({});
  let isDown = false; // 鼠标状态
  let baseX = 0,
    baseY = 0; //监听坐标
  useEffect(() => {
    let ChapterIndex = localStorage.getItem("ChapterIndex");
    list = localStorage.getItem("ChapterList");
    list = JSON.parse(list);
    let obj = localStorage.getItem("form");
    obj = JSON.parse(obj);
    ipcRenderer.on("next", () => {
      let reader = document.querySelector(".reader");
      reader.scrollTo({
        top: reader.scrollTop + obj.height / 3,
        behavior: "smooth",
      });
    });
    setFontStyle(obj || {});
    setIndex(ChapterIndex);
    getContent(list[ChapterIndex]);
  }, []);
  const pageDown = (j) => {
    let page = Number(index) + j;
    setIndex(page);
    console.log(page);
    getContent(list[page]);
  };
  const getContent = (item) => {
    http
      .post("/getBookContent", {
        index: item.index,
        url: item.bookUrl,
      })
      .then((res) => {
        let contentArr = res.data.split(/[(\r\n)\r\n]+/);
        setContent(contentArr);
        let reader = document.querySelector(".reader");
        reader.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });
  };
  useEffect(() => {
    let readerDom = document.querySelector(".reader");
    readerDom.addEventListener("mousedown", function (e) {
      isDown = true;
      baseX = e.x;
      baseY = e.y;
    });
    readerDom.addEventListener("mouseup", () => {
      isDown = false;
    });
    readerDom.addEventListener("mousemove", function (e) {
      if (isDown) {
        const x = e.screenX - baseX;
        const y = e.screenY - baseY;
        ipcRenderer.send("move-application", {
          posX: x,
          posY: y,
        });
      }
    });
  }, []);
  return (
    <div
      className="reader"
      style={{
        opacity: fontStyle.opacity,
      }}
    >
      {content.map((i, j) => (
        <p
          key={j}
          style={{ fontSize: fontStyle.fontSize, color: fontStyle.color }}
        >
          {i.trim()}
        </p>
      ))}
      <button onClick={() => pageDown(-1)}>-1</button>
      <button onClick={() => pageDown(1)}>+1</button>
    </div>
  );
};
export default Reader;
