import React, { useState } from 'react';
import { Form, Input, Modal, Select, Upload, Icon, message, InputNumber } from 'antd';
import domain from '../../../../config/conf';
const FormItem = Form.Item;
const { Option } = Select;

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('只能上传 JPG/PNG 类型的文件!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('图片大小必须小于 2MB!');
  }
  return isJpgOrPng && isLt2M;
}

const CreateForm = props => {
  const [form] = Form.useForm();
  const { updateModalVisible, onSubmit, onCancel, values } = props;
  let [picUrl, setPicUrl] = useState(values.picUrl);

  const okHandle = async () => {
    const fieldsValue = await form.validateFields();
    if (props.values.status == 1) {
      return message.error('修改商品需把状态跳转为下架！');
    }
    fieldsValue.id = props.values.id;
    fieldsValue.picUrl = picUrl;
    form.resetFields();
    onSubmit(fieldsValue);
  };
  const handleChange = info => {
    if (info.file.status === 'done') {
      setPicUrl((info.file.response && info.file.response.data) || '');
    }
  };
  let flag = !(props.values && props.values.verifyStatus == 1);
  const uploadButton = (
    <div>
      <Icon type={'plus'} />
      <div className="ant-upload-text">Upload</div>
    </div>
  );
  return (
    <Modal
      destroyOnClose
      title={'商品账户'}
      visible={updateModalVisible}
      onOk={okHandle}
      onCancel={() => {
        onCancel();
      }}
    >
      <Form form={form} initialValues={props.values}>
        <FormItem
          labelCol={{
            span: 5,
          }}
          wrapperCol={{
            span: 15,
          }}
          label="商品名"
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
          label="商品英文名"
          name="enName"
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
          label="商品描述"
          name="desc"
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
          label="单位名"
          name="unit"
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
          label="价格"
          name="price"
          rules={[
            {
              required: true,
              message: '不能为空！',
            },
          ]}
        >
          <InputNumber placeholder="请输入" />
        </FormItem>
        <FormItem
          labelCol={{
            span: 5,
          }}
          wrapperCol={{
            span: 15,
          }}
          label="商品图片"
        >
          <Upload
            name="imageFileName"
            action={domain + '/file/upload/uploadImage'}
            headers={{ token: localStorage.getItem('token') }}
            className="avatar-uploader"
            listType="picture-card"
            showUploadList={false}
            multiple={true}
            beforeUpload={beforeUpload}
            onChange={handleChange}
          >
            {picUrl ? <img src={picUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
          </Upload>
        </FormItem>
        <FormItem
          labelCol={{
            span: 5,
          }}
          wrapperCol={{
            span: 15,
          }}
          label="选择分类"
          name="productSortId"
        >
          <Select>
            {props.classes.length &&
              props.classes.map(value => {
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
          label="审核状态"
          name="verifyStatus"
        >
          <Select disabled>
            <Option value={0}>待审批</Option>
            <Option value={1}>通过</Option>
            <Option value={2}>驳回</Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>
  );
};

export default CreateForm;
