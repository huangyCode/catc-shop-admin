import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import React, { useState, useRef, useEffect } from 'react';
import {
  Form,
  Input,
  Modal,
  Select,
  InputNumber,
  TimePicker,
  Icon,
  Upload,
  message,
  Col,
  Button,
  Row,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { getDetail, updateDetail, getServices } from './service';
import domain from '../../../config/conf';
import moment from 'moment/moment';

const FormItem = Form.Item;
const { Option } = Select;
import Bmap from './Bmap';

/**
 *  删除节点
 * @param selectedRows
 */

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

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

const Merchant = () => {
  const [form] = Form.useForm();

  const [dataDetail, setDataDetail] = useState({});
  const [pos, setPos] = useState({});
  let [coverImg, setCoverImg] = useState(null);
  let [service, setService] = useState([]);
  let [serviceList, setServiceList] = useState([]);
  let [envImgList, setEnvImgList] = useState([]);
  let [openTime, setOpenTime] = useState('');
  let [closeTime, setCloseTime] = useState('');
  let [previewVisible, setPreviewVisible] = useState(false);
  let [previewImage, setPreviewImage] = useState('');
  let [addServiceId, setAddServiceId] = useState(null);
  const onOpenChange = (e, timeString) => {
    setOpenTime(timeString);
  };
  const onCloseChange = (e, timeString) => {
    setCloseTime(timeString);
  };
  const handleChange = info => {
    if (info.file.status === 'done') {
      setCoverImg(
        (info.file.response && info.file.response.data && info.file.response.data.url) || '',
      );
    }
  };
  const getShop = async () => {
    let res = await getDetail();

    if (res) {
      let pos = { point: { lng: res.longitude, lat: res.latitude }, address: res.address };
      setPos(pos);
      setOpenTime(res.openTime);
      setCloseTime(res.closeTime);
      setCoverImg(res.coverImg);
      setCloseTime(res.closeTime);
      setOpenTime(res.openTime);
      setService(res.service);
      if (res.envImgs && res.envImgs.length) {
        let arr = [];
        for (let url of res.envImgs) {
          arr.push({ uid: 1, url });
        }
        setEnvImgList(arr);
      }
    }
    setDataDetail(res);
  };
  const fetchService = async () => {
    let res = await getServices();
    setServiceList(res);
  };
  const handleFiles = ({ file, fileList, event }) => {};
  const uploadButton = (
    <div>
      <Icon type={'plus'} />
      <div className="ant-upload-text">上传图片</div>
    </div>
  );

  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewVisible(true);
    setPreviewImage(file.url || file.preview);
  };
  const handleCancel = () => {
    setPreviewVisible(false);
    setPreviewImage('');
  };
  const addSerivce = () => {
    if (addServiceId) {
      let item = {};
      for (let i of serviceList) {
        if (i.id === addServiceId) {
          item = i;
          break;
        }
      }
      let list = [...service];
      if (list && list.length) {
        for (let s of list) {
          if (s.id == addServiceId) return message.error('已添加过该服务');
        }
        list.push(item);
      } else list = [item];
      setService(list);
    }
  };
  const onChangePrice = (index, value) => {
    service[index].price = value;
    setService(service);
  };
  const handleDel = removedTag => {
    if (service && service.length) {
      let tags = service.filter(tag => tag.id !== removedTag.id);
      setService(tags);
    }
  };
  const okHandle = async () => {
    const fieldsValue = await form.validateFields();
    form.resetFields();

    if (envImgList && envImgList.length) {
      fieldsValue.envImgs = [];
      envImgList.map(value => {
        fieldsValue.envImgs.push((value.response && value.response.data.url) || value.url);
      });
    } else {
      return message.error('请选择门店图片');
    }
    console.log(fieldsValue.envImgs);
    if (!pos || !pos.address) {
      return message.error('请在地图上选择的店铺地址');
    }
    if (pos.addressComponents && pos.addressComponents.city) {
      fieldsValue.city = pos.addressComponents.city;
    }
    if (pos.addressComponents && pos.addressComponents.district) {
      fieldsValue.district = pos.addressComponents.district;
    }
    if (pos.addressComponents && pos.addressComponents.province) {
      fieldsValue.province = pos.addressComponents.province;
    }
    fieldsValue.address = pos.address;
    fieldsValue.longitude = (pos && pos.point && pos.point.lng) || '';
    fieldsValue.latitude = (pos && pos.point && pos.point.lat) || '';
    fieldsValue.coverImg = coverImg;
    fieldsValue.openTime = openTime;
    fieldsValue.closeTime = closeTime;
    fieldsValue.service = service;
    fieldsValue.id = dataDetail.id;
    await updateDetail(fieldsValue);
    await getShop();
  };
  useEffect(() => {
    getShop();
    fetchService();
  }, []);
  return (
    <PageHeaderWrapper>
      {dataDetail && dataDetail.id ? (
        <Form form={form} initialValues={dataDetail}>
          <FormItem
            labelCol={{
              span: 5,
            }}
            wrapperCol={{
              span: 15,
            }}
            label="店铺名称"
            name="shopName"
          >
            <Input placeholder="请输入店铺名" />
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
              onChange={pos => {
                setPos(pos);
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
            label="店铺地址"
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
            label="店铺地址详情"
            name="addressDetail"
          >
            <Input />
          </FormItem>
          <FormItem
            labelCol={{
              span: 5,
            }}
            wrapperCol={{
              span: 15,
            }}
            label="背景图"
          >
            <Upload
              action={domain + '/file/upload'}
              className="avatar-uploader"
              listType="picture-card"
              showUploadList={false}
              multiple={true}
              beforeUpload={beforeUpload}
              onChange={handleChange}
            >
              {coverImg ? (
                <img src={coverImg} alt="avatar" style={{ width: '100%' }} />
              ) : (
                uploadButton
              )}
            </Upload>
          </FormItem>
          <FormItem
            labelCol={{
              span: 5,
            }}
            wrapperCol={{
              span: 15,
            }}
            label="店铺电话"
            name="shopPhone"
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
              <TimePicker
                defaultValue={moment(openTime || 0, 'HH:mm:ss')}
                onChange={onOpenChange}
              />
              -
              <TimePicker
                defaultValue={moment(closeTime || 0, 'HH:mm:ss')}
                onChange={onCloseChange}
              />
            </>
          </FormItem>
          <FormItem
            labelCol={{
              span: 5,
            }}
            wrapperCol={{
              span: 15,
            }}
            label="轮播图"
          >
            <Upload
              action={domain + '/file/upload'}
              listType="picture-card"
              multiple={true}
              fileList={envImgList}
              onChange={handleFiles}
              onPreview={handlePreview}
              onSuccess={e => {
                let arr = [...envImgList];
                console.log(arr);
                let pic = e.data && e.data.url;
                arr.push({ uid: arr.length + 1, url: pic });
                setEnvImgList(arr);
              }}
            >
              {envImgList && envImgList.length >= 6 ? null : uploadButton}
            </Upload>
          </FormItem>
          <FormItem
            labelCol={{
              span: 5,
            }}
            wrapperCol={{
              span: 15,
            }}
            label="服务类型"
          >
            <div>
              <div>
                <Select
                  value={addServiceId}
                  style={{ width: 200 }}
                  onChange={e => {
                    setAddServiceId(e);
                  }}
                >
                  {serviceList.length &&
                    serviceList.map(value => {
                      return (
                        <Option key={'service' + value.id} value={value.id}>
                          {value.name}
                        </Option>
                      );
                    })}
                </Select>
                <Button onClick={addSerivce}>添加</Button>
              </div>
              {service && service.length
                ? service.map((value, index) => {
                    return (
                      <Row style={{ width: 400, marginTop: 5 }}>
                        <Col span={3} style={{ lineHeight: 2 }}>
                          {value.name}
                        </Col>
                        <Col span={9}>
                          <InputNumber
                            onChange={e => {
                              onChangePrice(index, e);
                            }}
                            value={value.price}
                          />
                          <span> 元/只</span>
                        </Col>
                        <Col span={6}>
                          <Button type="primary" onClick={() => handleDel(value)}>
                            删除
                          </Button>
                        </Col>
                      </Row>
                    );
                    // return <Tag key={'tag'+value.id} closable onClose={() => this.handleClose(value)}>{value.name}</Tag>
                  })
                : null}
            </div>
          </FormItem>
          <FormItem wrapperCol={{ offset: 5, span: 15 }}>
            <Button type="primary" htmlType="submit" onClick={okHandle}>
              保存
            </Button>
          </FormItem>
        </Form>
      ) : null}
      <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </PageHeaderWrapper>
  );
};

export default Merchant;
