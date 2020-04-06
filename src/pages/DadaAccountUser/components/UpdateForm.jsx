import React from 'react';
import { Icon, Drawer, Row, Col, Button } from 'antd';

const CreateForm = props => {
  const { updateModalVisible, onSubmit, onCancel, values } = props;
  const { orderAddress } = values;

  const okHandle = async () => {
    let obj = { orderCode: values.code, status: Number(values.status) + 1 };
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
        {values.payStatus == 1
          ? '已支付'
          : values.payStatus == 0
          ? '未支付'
          : values.payStatus == 2
          ? '已退款'
          : '已取消'}
      </div>
      <h3 style={{ marginTop: 10 }}>订单商品</h3>
      {/*productId: 1*/}
      {/*productName: "酒水"*/}
      {/*productNumber: 1*/}
      {/*productPrice: 100*/}
      {/*productType: "啤酒"*/}
      {/*productTypeId: 2*/}
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
              ? '去配送'
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
    </Drawer>
  );
};

export default CreateForm;
