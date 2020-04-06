import React, { useState, useEffect } from 'react';
import { Form, Input, Modal, Select, InputNumber, TimePicker, Icon, Upload, message } from 'antd';
import domain from '../../../../config/conf';
import Bmap from '../../Merchant/Bmap';

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
  const { modalVisible, onSubmit: handleAdd, onCancel } = props;
  let [picUrl, setPicUrl] = useState('');
  let [openTime, setOpenTime] = useState('');
  let [closeTime, setCloseTime] = useState('');
  let [stationName, setStationName] = useState('');
  let [pos, setPos] = useState({ point: { lng: '', lat: '' }, address: '' });
  let [contactName, setContactName] = useState('');
  let [mobile, setMobile] = useState('');
  const okHandle = async () => {
    const fieldsValue = await form.validateFields();
    form.resetFields();
    fieldsValue.picUrl = picUrl;
    fieldsValue.openTime = openTime;
    fieldsValue.closeTime = closeTime;
    if (!pos || !pos.address) {
      return message.error('请在地图上选择的店铺地址');
    }
    if (!contactName) {
      return message.error('请填写店铺联系人信息');
    }
    if (!stationName) {
      return message.error('请填写店铺名');
    }
    if (!mobile) {
      return message.error('请填写店铺联系人电话');
    }
    fieldsValue.brandAddress = {
      stationName,
      cityName: pos.addressComponents && pos.addressComponents.city,
      areaName: pos.addressComponents && pos.addressComponents.district,
      stationAddress: pos.address,
      contactName,
      mobile,
      lng: (pos && pos.point && pos.point.lng) || '',
      lat: (pos && pos.point && pos.point.lat) || '',
    };
    handleAdd(fieldsValue);
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
  const onOpenChange = (e, timeString) => {
    console.log(timeString);
    setOpenTime(timeString);
  };
  const onCloseChange = (e, timeString) => {
    console.log(timeString);
    setCloseTime(timeString);
  };

  const changeShopName = ({ target: { value } }) => {
    setStationName(value);
  };
  const changeName = ({ target: { value } }) => {
    setContactName(value);
  };
  return (
    <Modal
      destroyOnClose
      title="新建品牌"
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
          label="品牌名"
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
          label="位置"
        >
          <Bmap
            value={pos}
            onChange={(pos, stationName) => {
              console.log(pos);
              setPos(pos);
              setStationName(stationName);
            }}
          />
        </FormItem>
        <FormItem
          labelCol={{
            span: 5,
          }}
          wrapperCol={{
            span: 15,
          }}
          label="经度"
        >
          <Input disabled value={(pos && pos.point && pos.point.lng) || ''} />
        </FormItem>
        <FormItem
          labelCol={{
            span: 5,
          }}
          wrapperCol={{
            span: 15,
          }}
          label="纬度"
        >
          <Input disabled value={(pos && pos.point && pos.point.lat) || ''} />
        </FormItem>
        <FormItem
          labelCol={{
            span: 5,
          }}
          wrapperCol={{
            span: 15,
          }}
          label="店铺名称"
        >
          <Input placeholder="请输入" value={stationName} onChange={changeShopName} />
        </FormItem>
        <FormItem
          labelCol={{
            span: 5,
          }}
          wrapperCol={{
            span: 15,
          }}
          label="店铺详细地址"
        >
          <Input disabled value={(pos && pos.address) || ''} />
        </FormItem>
        <FormItem
          labelCol={{
            span: 5,
          }}
          wrapperCol={{
            span: 15,
          }}
          label="店铺联系人"
        >
          <Input value={contactName} onChange={changeName} />
        </FormItem>
        <FormItem
          labelCol={{
            span: 5,
          }}
          wrapperCol={{
            span: 15,
          }}
          label="店铺联系人电话"
        >
          <Input
            value={mobile}
            onChange={({ target: { value } }) => {
              setMobile(value);
            }}
          />
        </FormItem>
        <FormItem
          labelCol={{
            span: 5,
          }}
          wrapperCol={{
            span: 15,
          }}
          label="品牌图片"
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
          label="配送需满金额"
          name="deliveryThreshold"
          rules={[
            {
              required: true,
              message: '不能为空',
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
          label="权重"
          name="weight"
          rules={[
            {
              required: true,
              message: '不能为空',
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
          label="品牌联系方式"
          name="phone"
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
          label="描述"
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
          label="营业时间"
        >
          <>
            <TimePicker onChange={onOpenChange} />-
            <TimePicker onChange={onCloseChange} />
          </>
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
          <Select>
            <Option value={0}>开启</Option>
            <Option value={1}>关闭</Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>
  );
};

export default CreateForm;
