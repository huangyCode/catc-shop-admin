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
  queryBrand,
  classesList,
  check,
  updateVerifyStatus,
  updateStatus,
  shelve,
} from './service';
import MD5 from '@/utils/MD5';
import { ColumnsState } from '@ant-design/pro-table/lib/Table';

/**
 * 添加节点
 * @param fields
 */

const handleAdd = async fields => {
  const hide = message.loading('正在添加');

  try {
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

const Product = () => {
  const [modalVisible, handleModalVisible] = useState(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [brands, setBrands] = useState([]);
  const [brandEum, setBrandEum] = useState({});
  const [classes, setClasses] = useState([]);
  const actionRef = useRef();
  const getBrand = async () => {
    let res = await queryBrand();
    let obj = {};
    if (res && res.length) {
      for (let item of res) {
        obj[item.id] = item.name;
      }
      setBrandEum(obj);
      setBrands(res);
    }
  };
  const getClasses = async () => {
    let res = await classesList();
    setClasses(res);
  };

  const audit = async ids => {
    await check({ ids, verifyStatus: 1 });
    if (actionRef.current) {
      actionRef.current.reload();
    }
  };
  const onSubmit = async params => {
    if (params.brandName) {
      params.brandId = params.brandName;
      delete params.brandName;
    }
    queryRule(params);
  };
  useEffect(() => {
    getBrand();
    getClasses();
  }, []);
  const columns = [
    {
      title: '商品名',
      dataIndex: 'name',
    },
    {
      title: '商品英文名',
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
      valueEnum: brandEum,
    },
    {
      title: '价格',
      dataIndex: 'price',
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
      fixed: 'right',
      width: 100,
      render: (_, record) => (
        <Button
          onClick={() => {
            setStepFormValues(record);
            handleUpdateModalVisible(true);
          }}
        >
          修改
        </Button>
      ),
    },
  ];
  return (
    <PageHeaderWrapper>
      <ProTable
        scroll={{ x: 1800 }}
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
              onClick={() => {
                console.log(selectedRows);
                let arr = [];
                for (let item of selectedRows) {
                  arr.push(item.id);
                }
                audit(arr);
              }}
            >
              批量审核通过
            </Button>
          ),
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
        brands={brands}
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
            if (stepFormValues.status != value.status) {
              await updateStatus({ productId: value.id, status: value.status });
            }
            if (stepFormValues.verifyStatus != value.verifyStatus) {
              await updateVerifyStatus({ productId: value.id, verifyStatus: value.verifyStatus });
            }
            let success = await handleUpdate(value);
            if (success) {
              handleModalVisible(false);
              setStepFormValues({});

              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          brands={brands}
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

export default Product;
