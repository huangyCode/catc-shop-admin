import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Button, Modal, Input } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import UpdateForm from './components/UpdateForm';
import { queryRule, getQrUrl, checkPay, mineSum } from './service';
import { WechatOutlined } from '@ant-design/icons';
var QRCode = require('qrcode.react');
import NumericInput from './components/NumericInput';
import { queryBrand } from '../Order/service';

/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async fields => {
  const hide = message.loading('正在配置');

  try {
    let res = await updateRule(fields);
    if (res.code === 200) {
      message.success('配置成功');
      hide();
      return true;
    } else return false;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};

const DadaAccount = () => {
  const [visible, handleModalVisible] = useState(false);
  const [classes, setClasses] = useState([]);
  const [nextFlag, setNextFlag] = useState(0);
  const [amount, setAmount] = useState(null);
  const [qrUrl, setQrUrl] = useState('');
  const [sum, setSum] = useState(0);
  const actionRef = useRef();
  const [brandEum, setBrandEum] = useState({});
  const onSubmit = async params => {
    queryRule(params);
  };
  const okHandle = () => {};
  const getSum = async () => {
    let res = await mineSum();
    setSum((res && res.deliverBalance) || 0);
  };
  const getBrand = async () => {
    let res = await queryBrand();
    let obj = {};
    if (res && res.length) {
      for (let item of res) {
        obj[item.id] = item.name;
      }
      setBrandEum(obj);
    }
  };
  useEffect(() => {
    getSum();
    getBrand();
  }, []);

  const columns = [
    {
      title: '品牌商',
      dataIndex: 'brandName',
      valueEnum: brandEum,
    },
    {
      title: '订单号',
      dataIndex: 'orderCode',
    },
    {
      title: '记录名称',
      dataIndex: 'inOut',
      //1:收入(充值),2:支出,3:支出回退
      valueEnum: {
        1: {
          text: '充值',
          status: 'Default',
        },
        2: {
          text: '运费支出',
          status: 'Processing',
        },
        3: {
          text: '运费回退',
          status: 'Processing',
        },
      },
    },
    {
      title: '金额',
      dataIndex: 'amount',
      render: (_, record) => <>{_}元</>,
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInSearch: true,
    },
  ];
  const trunList = orderCode => {
    setTimeout(async () => {
      let result = await checkPay(orderCode);
      if (result.data && result.data.status && result.data.status === 1) {
        onCancel();
        message.success('支付成功');
        return true;
      } else {
        trunList();
        return false;
      }
    }, 500);
  };
  const onCancel = () => {
    handleModalVisible(false);
    setQrUrl('');
    setAmount(null);
    setNextFlag(0);
  };
  return (
    <PageHeaderWrapper>
      <ProTable
        headerTitle="达达记录"
        actionRef={actionRef}
        rowKey={record => record.id}
        request={params => queryRule(params)}
        columns={columns}
        onSubmit={onSubmit}
        toolBarRender={() => [<span>达达余额：{sum}</span>]}
      />
    </PageHeaderWrapper>
  );
};

export default DadaAccount;
