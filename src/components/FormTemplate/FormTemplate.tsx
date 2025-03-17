import React from "react";
import { Button, Checkbox, DatePicker, Form, Input, InputNumber, Radio, Select, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";

const { RangePicker } = DatePicker; // ✅ Extraire RangePicker ici

const App: React.FC = () => {
  const onFinish = (value: object) => {
    console.log(value);
  };

  const options = [
    { value: 1, label: "Value 1" },
    { value: 2, label: "Value 2" },
    { value: 3, label: "Value 3" },
    { value: 4, label: "Value 4" },
    { value: 5, label: "Value 5" },
  ];

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <Form name="form_item_path" layout="vertical" onFinish={onFinish} initialValues={{ radio: 2, select: 2 }}>
      <Form.Item name="firstName" label="First Name">
        <Input style={{ width: "100%", height: "4vh" }} />
      </Form.Item>

      <Form.Item name="lastName" label="Last Name">
        <Input style={{ width: "100%", height: "4vh" }} />
      </Form.Item>

      <Form.Item name="age" label="Age">
        <InputNumber style={{ width: "100%", height: "4vh" }} min={0} max={100} />
      </Form.Item>

      <Form.Item name="check" label="Check" valuePropName="checked">
        <Checkbox>Check</Checkbox>
      </Form.Item>

      <Form.Item name="radio" label="radio">
        <Radio.Group
          options={[
            { value: 1, label: "A" },
            { value: 2, label: "B" },
            { value: 3, label: "C" },
          ]}
        />
      </Form.Item>

      <Form.Item label="Select" name="select">
        <Select>
          {options.map((option) => (
            <Select.Option key={option.value} value={option.value}>
              {option.label}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="date" label="DatePicker">
        <DatePicker />
      </Form.Item>

      <Form.Item
        name="dates"
        label="Choisissez une plage de dates"
        rules={[{ required: true, message: 'Veuillez sélectionner une plage de dates !' }]}
      >
        <RangePicker />
      </Form.Item>

      <Form.Item name="textarea" label="TextArea">
        <TextArea rows={4} />
      </Form.Item>

      <Form.Item name="uploadFile" label="Upload" valuePropName="fileList" getValueFromEvent={normFile}>
        <Upload action="/upload.do" listType="picture-card" >
          <button style={{ color: "inherit", cursor: "inherit", border: 0, background: "none" }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </button>
        </Upload>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default App;
