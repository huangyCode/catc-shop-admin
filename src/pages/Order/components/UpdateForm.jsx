import React, { useState, useEffect } from 'react';
import { Icon, Drawer, Row, Col, Button, Timeline, Select, Input } from 'antd';
import { Radio } from 'antd';
import { message } from 'antd/lib/index';

const { TextArea } = Input;

const { Option } = Select;
const CreateForm = props => {
  const { updateModalVisible, onSubmit, onCancel, values, reason, cancel } = props;
  const { orderAddress, orderDelivery = {} } = values;

  let [cancelReason, setCancelReason] = useState('');

  let [orderDeliveryTraceList, setOrderDeliveryTraceList] = useState([]);

  useEffect(() => {
    if (orderDelivery.orderDeliveryTraceList && orderDelivery.orderDeliveryTraceList.length) {
      setOrderDeliveryTraceList(orderDelivery.orderDeliveryTraceList);
    }
  }, []);
  const [deliverType, setDeliverType] = useState(values.deliverType);
  const [cancelId, setCancelId] = useState(null);
  const okHandle = async () => {
    let obj = { orderCode: values.code };
    if (deliverType === 1 && values.status == 2) {
      obj.status = Number(values.status) + 2;
    } else {
      obj.status = Number(values.status) + 1;
    }
    obj.deliverType = deliverType;
    onSubmit(obj);
  };
  const cancelhandle = async () => {
    let obj = { orderCode: values.code, status: 6 };
    onSubmit(obj);
  };
  return (
    <Drawer
      width={720}
      title="订单信息"
      placement="right"
      closable={false}
      onClose={() => {
        onCancel();
      }}
      visible={updateModalVisible}
    >
      <div>下单店铺：{values.brandName}</div>
      <div>订单编号：{values.code}</div>
      <div>下单时间：{values.createTime}</div>
      <div>下单用户：{orderAddress.contactUser}</div>
      <div>用户电话：{orderAddress.phone}</div>
      <div>
        收货地址：{orderAddress.province + ' ' + orderAddress.city + ' ' + orderAddress.area}
      </div>
      <div>详细地址：{orderAddress.addressDetail}</div>
      <div>
        支付状态：
        {values.payStatus == 0
          ? '未支付'
          : values.payStatus == 1
          ? '已支付'
          : values.payStatus == 2
          ? '已退款'
          : '已取消'}
      </div>
      <h3 style={{ marginTop: 10 }}>订单商品</h3>
      {values.orderGoodsList &&
        values.orderGoodsList.map(value => {
          return (
            <Row>
              <Col span={6}>{value.productType + ': ' + value.productName}</Col>
              <Col span={6}>x {value.productNumber}</Col>
              <Col span={6}>{value.productPrice} 元</Col>
            </Row>
          );
        })}
      <div style={{ marginTop: 5, marginBottom: 5 }}>总价：{values.amount}</div>
      <div style={{ marginBottom: 10 }}>备注：{values.desc || '暂无信息'}</div>
      <div style={{ marginTop: 5, marginBottom: 5 }}>
        取餐方式：{deliverType === 1 ? '到店取餐' : '外卖配送'}
      </div>
      {deliverType !== 1 ? (
        <div style={{ marginTop: 5, marginBottom: 5 }}>
          配送方式：
          <Radio.Group
            onChange={e => {
              setDeliverType(e.target.value);
            }}
            value={deliverType}
          >
            <Radio value={2} disabled={values.status != 0}>
              自行配送
            </Radio>
            <Radio value={3} disabled={values.status != 0}>
              达达配送
            </Radio>
          </Radio.Group>
        </div>
      ) : null}
      {
        //0:初创,待接单＝1,待取货＝2,配送中＝3,已完成＝4,已取消＝5, 已过期＝7,指派单=8,妥投异常之物品返回中=9, 妥投异常之物品返回完成=10,骑士到店=100,创建达达运单失败=1000
      }
      <div>
        <span>
          订单状态：
          {values.status == 0
            ? '等待商家确认'
            : values.status == 1
            ? '已接单'
            : values.status == 2
            ? '配餐完成'
            : values.status == 3
            ? '配送中'
            : values.status == 4
            ? '订单完成'
            : values.status == 5
            ? '用户已取消'
            : values.status == 6
            ? '商家已取消'
            : '未支付取消'}
        </span>
        {values.payStatus == 1 &&
        (values.status == 0 || values.status == 1 || values.status == 2 || values.status == 3) ? (
          <Button style={{ marginLeft: 10 }} type="primary" onClick={okHandle}>
            {values.status == 0
              ? '商家接单'
              : values.status == 1
              ? '配餐完成'
              : values.status == 2
              ? deliverType == 1
                ? '用户到店'
                : '去配送'
              : values.status == 3
              ? '订单完成'
              : ''}
          </Button>
        ) : null}
        {values.payStatus == 1 &&
        !(values.status == 5 || values.status == 6 || values.status == 7) ? (
          <Button style={{ marginLeft: 10 }} type="primary" onClick={cancelhandle}>
            退款取消订单
          </Button>
        ) : null}
      </div>
      {deliverType === 3 && Number(values.status) > 0 ? (
        <div>
          <h3 style={{ marginTop: 10 }}>达达信息</h3>
          <div>达达单号：{orderDelivery.deliveryNum}</div>
          <div>订单状态：{orderDelivery.statusDesc}</div>
          <div>运费支出：{orderDelivery.fee}元</div>
          <div>创建时间：{orderDelivery.createTime}</div>
          <div>更新时间：{orderDelivery.updateTime}</div>
          <div>
            物流信息：{' '}
            {orderDeliveryTraceList.length ? (
              <Timeline>
                {orderDeliveryTraceList.map(value => {
                  return (
                    <Timeline.Item>
                      {value.statusDesc} {value.dadaUpdateTime}{' '}
                      {value.dmName
                        ? '(' + value.dmId + '号 骑手:' + value.dmName + ' ' + value.dmMobile + ')'
                        : ''}
                    </Timeline.Item>
                  );
                })}
              </Timeline>
            ) : (
              '暂无信息'
            )}
          </div>
          {orderDelivery.status !== 5 ? (
            <div>
              <div>
                <Select
                  defaultValue="选择取消原因"
                  style={{ width: 250 }}
                  onChange={id => {
                    setCancelId(id);
                  }}
                >
                  {reason &&
                    reason.length &&
                    reason.map(value => {
                      return (
                        <Option value={value.id} key={value.id}>
                          {value.reason}
                        </Option>
                      );
                    })}
                </Select>
                <Button
                  type="error"
                  onClick={() => {
                    if (!cancelId) return message.error('请选择取消原因');
                    if (cancelId == 10000 && !cancelReason) return message.error('请填写其他原因');
                    cancel({
                      order_id: values.code,
                      cancel_reason_id: cancelId,
                      cancel_reason: cancelReason,
                      orderCode: values.code,
                    });
                  }}
                >
                  取消配送单
                </Button>
              </div>
              {cancelId === 10000 ? (
                <div>
                  <TextArea
                    placeholder="取消原因"
                    style={{ width: 250 }}
                    value={cancelReason}
                    allowClear
                    onChange={({ target: { value } }) => {
                      setCancelReason(value);
                    }}
                  />
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </Drawer>
  );
};

export default CreateForm;
