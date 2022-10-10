import { useState, useEffect } from "react";
import "./assets/styles/main.scss";
import {
  Input,
  Table,
  Button,
  Drawer,
  message,
  Form,
  Modal,
  Radio,
} from "antd";
import http from "./assets/utils/http.js";
import newWindow from "./samples/newWindow";
import { SettingOutlined, SyncOutlined } from "@ant-design/icons";
var evtSource = null;
let list = [];
let value = "";
let lastIndex = -1;
const App = () => {
  const { Search } = Input;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [chapter, setchapter] = useState([]);
  const [open, setOpen] = useState(false);
  const [item, setItem] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formInitialValues, setFormInitialValues] = useState({});
  const [mode, setMode] = useState("1");
  const [bookshelf, setBookshelf] = useState([]);
  const [chapterLoading, setChapterLoading] = useState(false);
  const [chapterLoadingIndex, setChapterLoadingIndex] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    let obj = localStorage.getItem("form");
    let bookshelfData = localStorage.getItem("bookshelf");
    bookshelfData && setBookshelf(JSON.parse(bookshelfData));
    setFormInitialValues(JSON.parse(obj));
  }, []);
  const columns = [
    {
      title: "名称",
      dataIndex: "name",
      width: "200px",
      ellipsis: true,
    },
    {
      title: "作者",
      dataIndex: "author",
      width: "100px",
      ellipsis: true,
    },
    // {
    //   title: "来源",
    //   dataIndex: "originName",
    //   width: "100px",
    //   ellipsis: true,
    // },
    {
      title: "最新章节",
      dataIndex: "latestChapterTitle",
      ellipsis: true,
    },
    {
      title: (
        <>
          <span style={{ paddingRight: "20px" }}>操作</span>
          <SettingOutlined
            onClick={() => {
              openModal();
            }}
          />
        </>
      ),
      width: "230px",
      key: "operation",
      dataIndex: "operation",
      ellipsis: true,
      render: (_, record, index) => {
        return (
          <div className="btns">
            <Button
              type="primary"
              onClick={() => {
                if (mode == "1") {
                  message.success("操作成功");
                  bookshelf.splice(index, 1);
                } else {
                  let l = bookshelf.filter((i) => i.bookUrl == record.bookUrl);
                  if (l.length == 0) {
                    bookshelf.push(record);
                    message.success("操作成功");
                  } else {
                    message.error("书架已存在该书籍");
                  }
                }
                setBookshelf([...bookshelf]);
                localStorage.setItem("bookshelf", JSON.stringify(bookshelf));
              }}
            >
              {mode == "1" ? "移除书架" : "加入书架"}
            </Button>
            <Button
              onClick={() => getChapterList(record, index)}
              loading={chapterLoading && chapterLoadingIndex == index}
            >
              章节目录
            </Button>
          </div>
        );
      },
    },
  ];
  const onClose = () => {
    setOpen(false);
  };
  const getChapterList = (item, index) => {
    setChapterLoadingIndex(index);
    setChapterLoading(true);
    setItem({ ...item });
    http
      .post("/getChapterList", {
        bookSourceUrl: item.origin,
        url: item.bookUrl,
      })
      .then((res) => {
        if (res.data) {
          setchapter(res.data);
          localStorage.setItem("ChapterList", JSON.stringify(res.data));
          setOpen(true);
        } else {
          message.error("获取章节失败");
        }
        setChapterLoading(false);
      })
      .catch(() => {
        message.error("获取章节失败");
        setChapterLoading(false);
      });
  };
  const handleOk = () => {
    let obj = form.getFieldValue();
    localStorage.setItem("form", JSON.stringify(obj));
    setFormInitialValues(obj);
    setIsModalOpen(false);
  };
  const openModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const onSearch = (v, refresh) => {
    if (refresh) lastIndex = -1;
    value = v;
    if (loading) {
      return false;
    }
    setMode("2");
    setLoading(true);
    list = [];
    setData([]);
    evtSource = new EventSource(
      `http://42.194.173.140:8080/reader3/searchBookMultiSSE?key=${encodeURI(
        value
      )}&concurrentCount=36&lastIndex=${lastIndex}&page=1`
    );
    evtSource.addEventListener("message", (e) => {
      let res = JSON.parse(e.data);
      if (res.data.length > 0) {
        let newData = [...list, ...res.data];
        list = newData;
        setData(list);
      }
    });
    evtSource.addEventListener("end", (e) => {
      let res = JSON.parse(e.data);
      console.log(res);
      lastIndex = res.lastIndex;
      evtSource.close();
      evtSource = null;
      setLoading(false);
    });
    evtSource.addEventListener("error", (e) => {
      message.error("没有更多了!");
      evtSource.close();
      evtSource = null;
      setLoading(false);
    });
  };
  return (
    <div className="home">
      <Search
        placeholder="请输入需要查找的书籍名称"
        onSearch={onSearch}
        className="search"
      />
      <div className="table">
        <div>
          <Radio.Group
            onChange={(e) => {
              setMode(e.target.value);
            }}
            value={mode}
            style={{ marginBottom: 10 }}
          >
            <Radio.Button value="1">书架</Radio.Button>
            <Radio.Button value="2">搜索</Radio.Button>
          </Radio.Group>
          {loading ? (
            <SyncOutlined spin className="SyncOutlined" />
          ) : (
            <SyncOutlined
              className="SyncOutlined"
              onClick={() => onSearch(value, true)}
            />
          )}
        </div>

        <Table
          columns={columns}
          rowKey={(record) => record.bookUrl}
          dataSource={mode == 1 ? bookshelf : data}
          bordered={true}
          pagination={false}
        />
      </div>
      <Drawer title={item.name} placement="right" onClose={onClose} open={open}>
        <ul className="Chapter">
          {chapter.map((i, index) => (
            <li
              key={index}
              onClick={() => {
                newWindow(i, index, formInitialValues);
              }}
            >
              {i.title}
            </li>
          ))}
        </ul>
      </Drawer>
      <Modal
        title="设置阅读样式"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form name="basic" form={form} initialValues={formInitialValues}>
          <Form.Item label="背景宽度" name="width">
            <Input />
          </Form.Item>
          <Form.Item label="背景高度" name="height">
            <Input />
          </Form.Item>
          <Form.Item label="字体颜色" name="color">
            <Input />
          </Form.Item>
          <Form.Item label="字体大小" name="fontSize">
            <Input />
          </Form.Item>
          <Form.Item label="字体透明" name="opacity">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default App;
