import { ipcRenderer } from 'electron'
const newWindow = (data, index, view) => {
    localStorage.setItem("ChapterIndex", index);
    ipcRenderer.send("new", data, view)
}
export default newWindow;