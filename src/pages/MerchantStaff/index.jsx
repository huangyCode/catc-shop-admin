import {DownOutlined, PlusOutlined} from '@ant-design/icons';
import React, {useState, useRef, useEffect} from 'react';
import {
  Form,
  Input,
  Modal,
  InputNumber,
  TimePicker,
  Icon,
  Upload,
  message,
  Col,
  Button,
  Row,
  Tag,
  Tooltip,
} from 'antd';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import {getDetail, update, add} from './service';
import domain from '../../../config/conf';
import moment from 'moment/moment';
import './style.less';

const FormItem = Form.Item;
const {TextArea} = Input;

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

const handleRemove = async selectedRows => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;

  try {
    await removeRule({
      key: selectedRows.map(row => row.key),
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

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
  const [dataDetail, setDataDetail] = useState(null);
  let [inputVisible, setInputVisible] = useState(false);
  let [inputValue, setInputValue] = useState('');
  let [previewVisible, setPreviewVisible] = useState(false);
  let [previewImage, setPreviewImage] = useState('');
  let [imgs, setImgs] = useState([]);
  let [avatar, setAvatar] = useState('');
  let [input, setInput] = useState(null);
  const handleChange = info => {
    if (info.file.status === 'done') {
      setAvatar(
        (info.file.response && info.file.response.data && info.file.response.data.url) || '',
      );
    }
  };
  const getInfo = async () => {
    let res = await getDetail();
    if (res.imgs && res.imgs.length) {
      let arr = [];
      res.imgs.map((value, index) => {
        arr.push({uid: index, url: value});
      });
      setImgs(arr);
    }
    if (res.avatar) {
      setAvatar(res.avatar)
    }
    let reg = new RegExp("&nbsp;", "g"); //创建正则RegExp对象
    if (res.content && res.content.length) {
      res.content.map(value => {
        if (!value.type) {
          value.msg = value.msg.replace(reg, " ");
        }
      })
    }
    setDataDetail({...res});
  };

  const handleFiles = ({file, fileList, event}) => {
  };
  const uploadButton = (
    <div>
      <Icon type={'plus'}/>
      <div className="ant-upload-text">上传图片</div>
    </div>
  );
  const saveInputRef = input => setInput(input);

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

  const okHandle = async () => {
    const fieldsValue = await form.validateFields();
    if (imgs.length) {
      fieldsValue.imgs = [];
      for (let item of imgs) {
        fieldsValue.imgs.push(item.url);
      }
    }
    if (avatar)
      fieldsValue.avatar = avatar
    let param = Object.assign(dataDetail, fieldsValue);
    let reg = new RegExp(' ', 'g'); //创建正则RegExp对象
    if (param.content && param.content.length) {
      param.content.map(value => {
        if (!value.type) {
          value.msg = value.msg.replace(reg, '&nbsp;');
        }
      });
      let len = param.content.length;
      let tmp;
      for (let j = 0; j < len - 1; j++) {
        //循环9次
        for (let i = 0; i < len - 1 - j; i++) {
          //每次比较10-j-1次数
          if (!param.content[i].index) param.content[i].index = 0;
          if (!param.content[i + 1].index) param.content[i + 1].index = 0;
          if (param.content[i].index > param.content[i + 1].index) {
            tmp = param.content[i + 1];
            param.content[i + 1] = param.content[i];
            param.content[i] = tmp;
          }
        }
      }
    }
    let res
    if (param && param.id) res = await update(param);
    else res = await add(param);
    if (res.result) {
      message.info('保存成功');
    }
  };
  const handleTagClose = removedTag => {
    let data = {...dataDetail};
    let tags = data.tags ? [...data.tags] : [];
    tags = tags.filter(tag => tag !== removedTag);
    data.tags = tags;
    setDataDetail(data);
  };
  const handleInputChange = e => {
    setInputValue(e.target.value);
  };
  const handleInputConfirm = () => {
    let data = {...dataDetail};
    let tags = data.tags ? [...data.tags] : [];
    if (!tags || (tags && !tags.length)) tags = [];
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    data.tags = tags;
    setDataDetail(data);
    setInputVisible(false);
    setInputValue('');
  };
  const showInput = () => {
    setInputVisible(true);
    input && input.focus();
  };
  const onTextAreaChange = ({target: {value}}, index) => {
    let data = {...dataDetail};
    if (data.content && data.content.length) data.content[index].msg = value;
    else {
      data.content = [{type: 0, msg: value}];
    }
    setDataDetail(data);
  };

  const imgChange = (info, index) => {
    if (info.file.status === 'done') {
      let data = {...dataDetail};
      let img =
        (info.file.response && info.file.response.data && info.file.response.data.url) || '';
      if (data.content && data.content.length) data.content[index].img = img;
      else {
        data.content = [{type: 1, img}];
      }
      setDataDetail(data);
    }
  };

  const addText = () => {
    let data = {...dataDetail};
    if (data.content && data.content.length) data.content.push({type: 0, msg: ''});
    else data.content = [{type: 0, msg: ''}];
    setDataDetail(data);
  };

  const addImg = () => {
    let data = {...dataDetail};
    if (data.content && data.content.length) data.content.push({type: 1, img: ''});
    else data.content = [{type: 1, img: ''}];
    setDataDetail(data);
  };

  const delItem = index => {
    let data = {...dataDetail};
    data.content.splice(index, 1);
    setDataDetail(data);
  };

  const indexChange = (value, index) => {
    let data = {...dataDetail};
    if (data.content && data.content.length) {
      data.content[index].index = value;
      setDataDetail(data);
    }
  };
  useEffect(() => {
    getInfo();
  }, []);
  return (
    <PageHeaderWrapper>
      {dataDetail ? (
        <Form form={form} initialValues={dataDetail}>
          <FormItem
            labelCol={{
              span: 5,
            }}
            wrapperCol={{
              span: 15,
            }}
            label="姓名"
            name="name"
          >
            <Input placeholder="请输入姓名"/>
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
            <Input placeholder="请输入描述"/>
          </FormItem>
          <FormItem
            labelCol={{
              span: 5,
            }}
            wrapperCol={{
              span: 15,
            }}
            label="职位"
            name="post"
          >
            <Input placeholder="请输入职位"/>
          </FormItem>
          <FormItem
            labelCol={{
              span: 5,
            }}
            wrapperCol={{
              span: 15,
            }}
            label="头像展示"
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
              {avatar ? (
                <img src={avatar} alt="avatar" style={{width: '100%'}}/>
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
            label="轮播图"
          >
            <Upload
              action={domain + '/file/upload'}
              listType="picture-card"
              multiple={true}
              fileList={imgs}
              onChange={handleFiles}
              onPreview={handlePreview}
              onSuccess={e => {
                let arr = [...imgs];
                let pic = e.data && e.data.url;
                arr.push({uid: arr.length + 1, url: pic});
                setImgs(arr);
              }}
            >
              {dataDetail.imgs && dataDetail.imgs.length >= 6 ? null : uploadButton}
            </Upload>
          </FormItem>
          <FormItem
            labelCol={{
              span: 5,
            }}
            wrapperCol={{
              span: 15,
            }}
            label="形象标签"
          >
            <div>
              {dataDetail.tags && dataDetail.tags.length
                ? dataDetail.tags.map((tag, index) => {
                  const isLongTag = tag.length > 20;
                  const tagElem = (
                    <Tag key={tag} closable={true} onClose={() => handleTagClose(tag)}>
                      {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                    </Tag>
                  );
                  return isLongTag ? (
                    <Tooltip title={tag} key={tag}>
                      {tagElem}
                    </Tooltip>
                  ) : (
                    tagElem
                  );
                })
                : null}
              {inputVisible && (
                <Input
                  ref={saveInputRef}
                  type="text"
                  size="small"
                  style={{width: 78}}
                  value={inputValue}
                  onChange={handleInputChange}
                  onBlur={handleInputConfirm}
                  onPressEnter={handleInputConfirm}
                />
              )}
              {!inputVisible && (
                <Tag className="site-tag-plus" onClick={showInput}>
                  + New Tag
                </Tag>
              )}
            </div>
          </FormItem>
          <FormItem
            labelCol={{
              span: 5,
            }}
            wrapperCol={{
              span: 15,
            }}
            label="介绍内容"
          >
            <div style={{marginLeft: 40}}>
              {dataDetail.content &&
              dataDetail.content.length &&
              dataDetail.content.map((value, index) => {
                if (value.type) {
                  return (
                    <div style={{display: 'flex'}} key={index}>
                      <div style={{flex: 1}}>
                        <Upload
                          action="http://120.55.60.49:9980/file/upload"
                          listType="picture-card"
                          showUploadList={false}
                          multiple={true}
                          beforeUpload={beforeUpload}
                          onChange={e => {
                            imgChange(e, index);
                          }}
                        >
                          {value.img ? (
                            <img src={value.img} alt="avatar" style={{width: 375}}/>
                          ) : (
                            uploadButton
                          )}
                        </Upload>
                      </div>
                      <div style={{flex: 1}}>
                        <div onClick={() => delItem(index)}>
                          <Button>删除</Button>
                        </div>
                        <div>
                          <InputNumber
                            value={value.index || 0}
                            onChange={value => indexChange(value, index)}
                          />
                          <span>排序</span>
                        </div>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div style={{display: 'flex'}} key={index}>
                        <TextArea
                          style={{width: 375}}
                          value={value.msg}
                          autoSize
                          onChange={e => {
                            onTextAreaChange(e, index);
                          }}
                        />
                      <div>
                        <div style={{marginLeft: 20}} onClick={() => delItem(index)}>
                          <Button>删除</Button>
                        </div>
                        <div style={{marginLeft: 20}}>
                          <InputNumber
                            value={value.index || 0}
                            onChange={value => indexChange(value, index)}
                          />
                          <span>排序</span>
                        </div>
                      </div>
                    </div>
                  );
                }
              })}
              <div style={{marginTop: 10}}>
                <Button style={{marginRight: 15}} onClick={addText}>
                  添加类容
                </Button>
                <Button onClick={addImg}>添加图片</Button>
              </div>
            </div>
          </FormItem>
          <FormItem wrapperCol={{offset: 5, span: 15}}>
            <Button type="primary" htmlType="submit" onClick={okHandle}>
              保存
            </Button>
          </FormItem>
        </Form>
      ) : null}
      <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
        <img alt="example" style={{width: '100%'}} src={previewImage}/>
      </Modal>
    </PageHeaderWrapper>
  );
};

export default Merchant;
