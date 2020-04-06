import React from 'react';
import { Form, Input, Modal, Select } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;
const CreateForm = props => {
  const [form] = Form.useForm();
  const { modalVisible, onSubmit: handleAdd, onCancel } = props;

  const okHandle = async () => {
    const fieldsValue = await form.validateFields();
    form.resetFields();
    handleAdd(fieldsValue);
  };

  const handleSelectChange = () => {};
  return (
    <Modal
      destroyOnClose
      title="新建账号"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => onCancel()}
    >
      <Form form={form}>
        <FormItem
          labelCol={{
            span: 5,
          }}
          wrapperCol={{
            span: 15,
          }}
          label="用户名"
          name="desc"
          rules={[
            {
              required: true,
              message: '请输入至少五个字符的规则描述！',
              min: 5,
            },
          ]}
        >
          <Input placeholder="请输入" />
        </FormItem>
        <FormItem
          labelCol={{
            span: 5,
          }}
          wrapperCol={{
            span: 15,
          }}
          label="密码"
          name="desc"
          rules={[
            {
              required: true,
              message: '不能为空',
            },
          ]}
        >
          <Input placeholder="请输入" />
        </FormItem>
        <FormItem
          labelCol={{
            span: 5,
          }}
          wrapperCol={{
            span: 15,
          }}
          label="选择品牌"
          name="brand"
        >
          <Select value={1} onChange={handleSelectChange}>
            <Option value={1}>aa</Option>
            <Option value={2}>bb</Option>
          </Select>
        </FormItem>
        <FormItem
          labelCol={{
            span: 5,
          }}
          wrapperCol={{
            span: 15,
          }}
          label="开启状态"
          name="brand"
        >
          <Select value={1} onChange={handleSelectChange}>
            <Option value={0}>关闭</Option>
            <Option value={1}>开启</Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>
  );
};

export default CreateForm;
