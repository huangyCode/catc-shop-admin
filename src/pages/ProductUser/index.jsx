import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import {
  queryRule,
  updateRule,
  addRule,
  removeRule,
  updateStatus,
  classesList,
  updateVerifyStatus,
} from './service';
import { shelve } from '../Product/service';

/**
 * 添加节点
 * @param fields
 */

const handleAdd = async fields => {
  const hide = message.loading('正在添加');

  try {
    fields.brandId = Number(localStorage.getItem('brandId'));
    let res = await addRule(fields);
    if (res.code === 200) {
      message.success('添加成功');
      hide();
      return true;
    } else return false;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};
/**
 * 更新节点
 * @param fields
 */

const handleUpdate = async fields => {
  const hide = message.loading('正在配置');

  try {
    fields.brandId = Number(localStorage.getItem('brandId'));
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
/**
 *  删除节点
 * @param selectedRows
 */

const handleRemove = async uid => {
  const hide = message.loading('正在删除');
  try {
    let res = await removeRule(uid);
    hide();
    if (res.code === 200) message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const ProductUser = () => {
  const [modalVisible, handleModalVisible] = useState(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [classes, setClasses] = useState([]);
  const actionRef = useRef();
  const getClasses = async () => {
    let res = await classesList();
    setClasses(res);
  };

  const audit = async () => {};
  const onSubmit = async params => {
    queryRule(params);
  };
  useEffect(() => {
    getClasses();
  }, []);
  const setStatus = async param => {
    await updateStatus(param);
    actionRef.current.reload();
  };
  const columns = [
    {
      title: '商品名',
      dataIndex: 'name',
    },
    {
      title: '英文名',
      dataIndex: 'enName',
      hideInSearch: true,
    },
    {
      title: '商品图',
      dataIndex: 'picUrl',
      render: (_, record) => (
        <>
          <img src={_} style={{ height: 60, width: 60 }} />
        </>
      ),
      hideInSearch: true,
    },
    {
      title: '描述',
      dataIndex: 'desc',
      hideInSearch: true,
    },
    {
      title: '所属品牌',
      dataIndex: 'brandName',
      hideInSearch: true,
    },
    {
      title: '价格',
      dataIndex: 'price',
      hideInSearch: true,
    },
    {
      title: '价格单位',
      dataIndex: 'priceUnit',
      hideInSearch: true,
    },
    {
      title: '单位',
      dataIndex: 'unit',
      hideInSearch: true,
    },
    {
      title: '上架状态',
      dataIndex: 'status',
      valueEnum: {
        0: {
          text: '新建',
          status: 'Default',
        },
        1: {
          text: '已上架',
          status: 'Success',
        },
        2: {
          text: '已下架',
          status: 'Error',
        },
      },
    },
    {
      title: '审核状态',
      dataIndex: 'verifyStatus',
      valueEnum: {
        0: {
          text: '待审批',
          status: 'Default',
        },
        1: {
          text: '通过',
          status: 'Success',
        },
        2: {
          text: '驳回',
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
        <>
          <Button
            onClick={() => {
              setStepFormValues(record);
              handleUpdateModalVisible(true);
            }}
          >
            修改
          </Button>
          {record.verifyStatus === 1 ? (
            <Button
              type={'primary'}
              danger={record.status === 1}
              onClick={() =>
                setStatus({
                  productId: record.id,
                  status: record.status === 1 ? 2 : 1,
                })
              }
            >
              {record.status === 1 ? '下架' : '上架'}
            </Button>
          ) : null}
        </>
      ),
    },
  ];
  return (
    <PageHeaderWrapper>
      <ProTable
        headerTitle="商品列表"
        actionRef={actionRef}
        rowKey={record => record.id}
        toolBarRender={(action, { selectedRows }) => [
          <Button
            type="primary"
            onClick={() => {
              handleModalVisible(true);
            }}
          >
            新建商品
          </Button>,
          selectedRows && selectedRows.length > 0 && (
            <Button
              onClick={async () => {
                let productIds = [];
                for (let item of selectedRows) {
                  if (item.verifyStatus === 1 && item.status !== 1) productIds.push(item.id);
                }
                if (productIds.length) {
                  await shelve({ productIds, status: 1 });
                  if (actionRef.current) {
                    actionRef.current.reload();
                  }
                }
              }}
            >
              批量上架
            </Button>
          ),
        ]}
        tableAlertRender={(selectedRowKeys, selectedRows) => (
          <div>
            已选择{' '}
            <a
              style={{
                fontWeight: 600,
              }}
            >
              {selectedRowKeys.length}
            </a>{' '}
            项
          </div>
        )}
        request={params => queryRule(params)}
        columns={columns}
        onSubmit={onSubmit}
        rowSelection={{}}
      />
      <CreateForm
        onSubmit={async value => {
          let success = await handleAdd(value);
          if (success) {
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        classes={classes}
        onCancel={() => {
          setStepFormValues({});
          handleModalVisible(false);
        }}
        modalVisible={modalVisible}
      />
      {stepFormValues && Object.keys(stepFormValues).length ? (
        <UpdateForm
          onSubmit={async value => {
            const success = await handleUpdate(value);
            if (success) {
              handleModalVisible(false);
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
    </PageHeaderWrapper>
  );
};

export default ProductUser;
