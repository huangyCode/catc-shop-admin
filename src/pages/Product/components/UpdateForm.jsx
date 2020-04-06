import React, { useState } from 'react';
import { Form, Input, Modal, Select, Upload, Icon, InputNumber, message } from 'antd';
import domain from '../../../../config/conf';

const FormItem = Form.Item;
const { Option } = Select;

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}

const CreateForm = props => {
  const [form] = Form.useForm();
  const { updateModalVisible, onSubmit, onCancel, values } = props;
  let [picUrl, setPicUrl] = useState(values.picUrl);

  const okHandle = async () => {
    const fieldsValue = await form.validateFields();
    form.resetFields();
    fieldsValue.id = props.values.id;
    fieldsValue.picUrl = picUrl;
    onSubmit(fieldsValue);
  };
  const handleChange = info => {
    if (info.file.status === 'done') {
      setPicUrl((info.file.response && info.file.response.data) || '');
    }
  };
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
            className="avatar-uploader"
            listType="picture-card"
            name="imageFileName"
            action={domain + '/file/upload/uploadImage'}
            headers={{ token: localStorage.getItem('token') }}
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
          label="选择品牌"
          name="brandId"
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
          label="选择分类"
          name="productSortId"
        >
          <Select>
            {props.classes &&
              props.classes.length &&
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
          label="开启状态"
          name="status"
        >
          <Select>
            <Option value={0}>新建</Option>
            <Option value={1}>上架</Option>
            <Option value={2}>下架</Option>
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
          <Select>
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
