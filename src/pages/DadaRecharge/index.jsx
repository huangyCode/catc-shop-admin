import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Button, Modal, Input, Divider } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import UpdateForm from './components/UpdateForm';
import { queryRule, getQrUrl, mineSum, process } from './service';
import { WechatOutlined } from '@ant-design/icons';

let QRCode = require('qrcode.react');
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

const DadaRecharge = () => {
  const [stepFormValues, setStepFormValues] = useState({});
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [visible, handleModalVisible] = useState(false);
  const [amount, setAmount] = useState(null);
  const [qrUrl, setQrUrl] = useState('');
  const [sum, setSum] = useState(0);
  const actionRef = useRef();
  const [brandEum, setBrandEum] = useState({});

  const onSubmit = async params => {
    console.log(params);
    if (params.brandName) {
      params.brandId = params.brandName;
      delete params.brandName;
    }
    queryRule(params);
  };
  const getSum = async () => {
    let res = await mineSum();
    setSum((res && res.deliverBalance) || 0);
  };
  useEffect(() => {
    getBrand();
    getSum();
  }, []);
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
  const okHandle = () => {};
  const columns = [
    {
      title: '订单号',
      dataIndex: 'orderCode',
    },
    {
      title: '品牌商',
      dataIndex: 'brandName',
      valueEnum: brandEum,
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: {
        0: {
          text: '未支付',
          status: 'Default',
        },
        1: {
          text: '已支付',
          status: 'Processing',
        },
      },
    },
    {
      title: 'Links代充状态',
      dataIndex: 'platformStatus',
      valueEnum: {
        0: {
          text: '未支付',
          status: 'Default',
        },
        1: {
          text: '正在充值...',
          status: 'Processing',
        },
        2: {
          text: '充值完成',
          status: 'Success',
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
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          {record.platformStatus !== 2 && record.status === 1 ? (
            <Button
              type="primary"
              onClick={async () => {
                process(record.id, 1);
                handleNext(record.amount);
              }}
            >
              充值
            </Button>
          ) : null}
          {record.platformStatus === 1 && record.status === 1 ? (
            <Button
              type="success"
              onClick={async () => {
                await process(record.id, 2);
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }}
            >
              充值完成
            </Button>
          ) : null}
        </>
      ),
    },
  ];
  const handleNext = async amount => {
    if (amount) {
      let res = await getQrUrl(amount);
      window.location.href = res.url;
    } else {
      message.error('请输入金额');
    }
  };
  const onCancel = () => {
    handleModalVisible(false);
    setQrUrl('');
    setAmount(null);
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
      {stepFormValues && Object.keys(stepFormValues).length ? (
        <UpdateForm
          onSubmit={async value => {
            const success = await handleUpdate(value);

            if (success) {
              handleUpdateModalVisible(false);
              setStepFormValues({});

              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setStepFormValues({});
          }}
          updateModalVisible={updateModalVisible}
          values={stepFormValues}
        />
      ) : null}
      <Modal
        destroyOnClose
        title={'新建商品'}
        visible={visible}
        onOk={okHandle}
        onCancel={() => {
          onCancel();
        }}
      >
        {qrUrl ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <QRCode value={qrUrl} />
            <div>请支付宝或微信扫码支付{amount}元</div>
          </div>
        ) : null}
      </Modal>
    </PageHeaderWrapper>
  );
};

export default DadaRecharge;
