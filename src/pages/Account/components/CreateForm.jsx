import React, { useState, useEffect } from 'react';
import { Form, Input, Modal, Select } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;
const CreateForm = props => {
  const [form] = Form.useForm();
  const { modalVisible, onSubmit, onCancel } = props;
  const okHandle = async () => {
    const fieldsValue = await form.validateFields();
    form.resetFields();
    onSubmit(fieldsValue);
  };

  return (
    <Modal
      destroyOnClose
      title={'新建账户'}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => {
        onCancel();
      }}
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
          name="name"
          rules={[
            {
              required: true,
              message: '不能为空！',
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
          name="pwd"
          rules={[
            {
              required: true,
              message: '不能小于5个字符',
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
          label="选择品牌"
          name="brand"
          rules={[
            {
              required: true,
              message: '不能为空',
            },
          ]}
        >
          <Select>
            {props.brands &&
              props.brands.length &&
              props.brands.map(value => {
                if (value.id)
                  return (
                    <Option value={value.id} key={value.id}>
                      {value.name}
                    </Option>
                  );
              })}
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
          name="status"
        >
          <Select>
            <Option value={0}>关闭</Option>
            <Option value={1}>开启</Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>
  );
};

export default CreateForm;
