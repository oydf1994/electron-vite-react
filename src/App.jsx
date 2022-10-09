import { useState, useEffect } from "react";
import "./assets/styles/main.scss";
import { Input, Table, Button, Drawer, message, Form, Modal } from "antd";
import http from "./assets/utils/http.js";
import newWindow from "./samples/newWindow";
import { SettingOutlined } from "@ant-design/icons";
var evtSource = null;
let list = [];
// new EventSource("sse.php");
const App = () => {
  const { Search } = Input;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [chapter, setchapter] = useState([]);
  const [open, setOpen] = useState(false);
  const [item, setItem] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formInitialValues, setFormInitialValues] = useState({});
  const [form] = Form.useForm();
  let lastIndex = -1;
  useEffect(() => {
    let obj = localStorage.getItem("form");
    setFormInitialValues(JSON.parse(obj));
  }, []);
  const columns = [
    {
      title: "名称",
      dataIndex: "name",
      width: "100px",
    },
    {
      title: "作者",
      dataIndex: "author",
      width: "100px",
    },
    {
      title: "来源",
      dataIndex: "originName",
      width: "100px",
    },
    {
      title: "最新章节",
      dataIndex: "latestChapterTitle",
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
      key: "operation",
      dataIndex: "operation",
      render: (_, record) => {
        return (
          <div className="btns">
            <Button type="primary">加入书架</Button>
            <Button onClick={() => getChapterList(record)}>章节目录</Button>
          </div>
        );
      },
    },
  ];
  const onClose = () => {
    setOpen(false);
  };
  const getChapterList = (item) => {
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
  const onSearch = (value) => {
    if (loading) {
      return false;
    }
    setLoading(true);
    list = [];
    setData([]);
    evtSource = new EventSource(
      `http://42.194.173.140:8080/reader3/searchBookMultiSSE?key=${encodeURI(
        value
      )}&concurrentCount=120&lastIndex=${lastIndex}&page=1`
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
      lastIndex = res.lastIndex;
      evtSource.close();
      evtSource = null;
      setLoading(false);
    });

    // http
    //   .get(
    //     `/searchBookMulti?key=${encodeURI(
    //       value
    //     )}&concurrentCount=120&lastIndex=${lastIndex}&page=1`
    //   )
    //   .then((res) => {
    //     lastIndex = res.data.lastIndex;
    //     setLoading(false);
    //     setData(res.data.list);
    //   });
  };
  return (
    <div className="home">
      <Search
        placeholder="请输入需要查找的书籍名称"
        onSearch={onSearch}
        className="search"
      />
      <div className="table">
        <Table
          columns={columns}
          rowKey={(record) => record.bookUrl}
          dataSource={data}
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
