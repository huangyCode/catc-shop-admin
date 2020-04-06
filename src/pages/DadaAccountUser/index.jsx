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

const DadaAccountUser = () => {
  const [stepFormValues, setStepFormValues] = useState({});
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [visible, handleModalVisible] = useState(false);
  const [classes, setClasses] = useState([]);
  const [nextFlag, setNextFlag] = useState(0);
  const [amount, setAmount] = useState(null);
  const [qrUrl, setQrUrl] = useState('');
  const [sum, setSum] = useState(0);
  const actionRef = useRef();
  const onSubmit = async params => {
    queryRule(params);
  };
  const okHandle = () => {};
  const getSum = async () => {
    let res = await mineSum();
    setSum((res && res.amount) || 0);
  };
  useEffect(() => {
    getSum();
  }, []);

  const columns = [
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
      title: '订单号',
      dataIndex: 'orderCode',
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
  const handleNext = async () => {
    setNextFlag(1);
    let res;
    if (amount) {
      res = await getQrUrl(amount);
      setQrUrl(res.code_url);
      if (res.order_code) trunList(res.order_code);
    } else {
      message.error('请输入金额');
    }
  };
  const trunList = orderCode => {
    setTimeout(async () => {
      let result = await checkPay(orderCode);
      console.log(result);
      if (result && result.status && result.status == 1) {
        onCancel();
        message.success('支付成功');
        setTimeout(() => {
          if (actionRef.current) {
            actionRef.current.reload();
          }
        }, 1500);
        return true;
      } else {
        if (visible) trunList(orderCode);
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
  const renderFooter = () => {
    return (
      <Button type="primary" onClick={() => handleNext()}>
        下一步
      </Button>
    );
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
        toolBarRender={() => [
          <span>余额：{sum}</span>,
          <Button
            type="primary"
            onClick={() => {
              handleModalVisible(true);
            }}
          >
            充值
          </Button>,
        ]}
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
          classes={classes}
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
        footer={!nextFlag ? renderFooter() : null}
      >
        {!nextFlag ? (
          <div style={{ marginLeft: 70 }}>
            充值金额：
            <NumericInput
              style={{ width: 200 }}
              value={amount}
              onChange={v => {
                setAmount(v);
              }}
            />
            元
          </div>
        ) : qrUrl ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <QRCode value={qrUrl} />
            <div>
              <WechatOutlined />
              请微信扫码支付{amount}元
            </div>
          </div>
        ) : null}
      </Modal>
    </PageHeaderWrapper>
  );
};

export default DadaAccountUser;
