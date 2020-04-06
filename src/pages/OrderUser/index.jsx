import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Button, Select } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import UpdateForm from './components/UpdateForm';
import { queryRule, updateRule, classesList, detail, getReason, sendReason } from './service';
import { router } from 'umi';
import ding from '../../assets/ding.mp3';

const { Option } = Select;
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

const Order = () => {
  const [stepFormValues, setStepFormValues] = useState({});
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [classes, setClasses] = useState([]);
  const [dingFlag, setDingFlag] = useState(false);
  const [reason, setReason] = useState([]);
  const [rowDeliverType, setRowDeliverType] = useState(0);
  const [openId, setOpenId] = useState(0);

  const actionRef = useRef();
  const getClasses = async () => {
    let res = await classesList();
    setClasses(res);
  };
  const onSubmit = async params => {
    if (params.code) {
      params.orderCode = params.code;
    }
    queryRule(params);
  };
  const cancel = async param => {
    let res = await sendReason(param);
    if (res.code === 200) {
      let res = await detail({ orderCode: param.orderCode });
      setStepFormValues(res.data || {});
    }
  };
  const timer = () => {
    setTimeout(() => {
      actionRef.current.reload();
      if (location.pathname === '/orderuser') timer();
    }, 30000);
  };
  const reasonList = async () => {
    let res = await getReason();
    setReason(res.data);
  };
  useEffect(() => {
    getClasses();
    reasonList();
    timer();
  }, []);
  const columns = [
    {
      title: '订单号',
      dataIndex: 'code',
    },
    {
      title: '价格',
      dataIndex: 'amount',
      render: (_, record) => <>{_}元</>,
      hideInSearch: true,
    },
    {
      title: '购买人',
      dataIndex: 'buyerName',
      hideInSearch: true,
    },
    {
      title: '购买电话',
      dataIndex: 'buyerPhone',
      hideInSearch: true,
    },
    {
      title: '取餐方式',
      dataIndex: 'deliverType',
      valueEnum: {
        0: {
          text: '默认外卖',
          status: 'Default',
        },
        1: {
          text: '到店取餐',
          status: 'Processing',
        },
        2: {
          text: '自行配送',
          status: 'Processing',
        },
        3: {
          text: '达达配送',
          status: 'Processing',
        },
      },
    },
    //0 等待商家确认 1已接单 2做酒完成 3配送中 4 订单完成 5 已取消 6 支付后商家取消
    {
      title: '订单状态',
      dataIndex: 'status',
      valueEnum: {
        0: {
          text: '等待商家确认',
          status: 'Default',
        },
        1: {
          text: '已接单',
          status: 'Processing',
        },
        2: {
          text: '配餐完成',
          status: 'Processing',
        },
        3: {
          text: '配送中',
          status: 'Processing',
        },
        4: {
          text: '订单完成',
          status: 'Success',
        },
        5: {
          text: '用户已取消',
          status: 'Error',
        },
        6: {
          text: '支付后商家取消',
          status: 'Error',
        },
        7: {
          text: '未支付取消',
          status: 'Error',
        },
      },
      render: (_, record) => {
        let deliverType = record.deliverType;
        return (
          <>
            {_}
            {record.status == 0 ||
            record.status == 1 ||
            record.status == 2 ||
            record.status == 3 ? (
              <>
                {record.deliverType != 1 ? (
                  <Select
                    defaultValue={record.status == 0 ? '配送方式' : deliverType}
                    disabled={record.status != 0}
                    style={{ width: 100 }}
                    onChange={value => {
                      deliverType = value;
                      setRowDeliverType(value);
                      setOpenId(record.id);
                    }}
                  >
                    <Option value={2}>自行配送</Option>
                    <Option value={3}>达达配送</Option>
                  </Select>
                ) : null}
                <Button
                  style={{ marginLeft: 10 }}
                  type="primary"
                  onClick={async () => {
                    if (record.deliverType == 0 && !rowDeliverType) {
                      return message.error('请选择配送方式');
                    }
                    if (record.deliverType == 0 && openId != record.id) {
                      return message.error('请先操作您之前修改的条目');
                    }
                    let obj = { orderCode: record.code };
                    if (record.deliverType == 0 && openId == record.id && rowDeliverType) {
                      obj.deliverType = rowDeliverType;
                    } else {
                      obj.deliverType = record.deliverType;
                    }
                    setRowDeliverType(0);
                    setOpenId(0);
                    if (obj.deliverType === 1 && record.status == 2) {
                      obj.status = Number(record.status) + 2;
                    } else {
                      obj.status = Number(record.status) + 1;
                    }
                    const success = await handleUpdate(obj);
                    if (success) {
                      handleUpdateModalVisible(false);
                      setStepFormValues({});

                      if (actionRef.current) {
                        actionRef.current.reload();
                      }
                    }
                  }}
                >
                  下一步
                </Button>
              </>
            ) : null}
          </>
        );
      },
    },
    // 0 已支付 1 未支付 2 已退款 3 取消支付
    {
      title: '支付状态',
      dataIndex: 'payStatus',
      valueEnum: {
        0: {
          text: '未支付',
          status: 'Success',
        },
        1: {
          text: '已支付',
          status: 'Processing',
        },
        2: {
          text: '已退款',
          status: 'Error',
        },
        3: {
          text: '取消支付',
          status: 'Error',
        },
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '修改时间',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <a
          onClick={async () => {
            let res = await detail({ orderCode: record.code });
            console.log(res);
            setStepFormValues(res.data || {});
            handleUpdateModalVisible(true);
          }}
        >
          修改
        </a>
      ),
    },
  ];
  return (
    <PageHeaderWrapper>
      <ProTable
        headerTitle="订单列表"
        actionRef={actionRef}
        rowKey={record => record.id}
        request={params => queryRule(params)}
        postData={data => {
          if (data && data.length && data[0].payStatus == 1 && data[0].status == 0) {
            setDingFlag(true);
            console.log(1111);
            setTimeout(() => {
              setDingFlag(false);
            }, 4000);
          }
          return data;
        }}
        columns={columns}
        onSubmit={onSubmit}
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
          cancel={cancel}
          reason={reason}
          classes={classes}
          updateModalVisible={updateModalVisible}
          values={stepFormValues}
        />
      ) : null}
      {dingFlag ? <audio src={ding} autoPlay={true}></audio> : null}
    </PageHeaderWrapper>
  );
};

export default Order;
