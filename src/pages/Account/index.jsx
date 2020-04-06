import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Divider, message } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import { queryRule, updateRule, addRule, removeRule, queryBrand } from './service';

/**
 * 添加节点
 * @param fields
 */

const handleAdd = async fields => {
  const hide = message.loading('正在添加');

  try {
    fields.brand = { id: fields.brand };
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
    fields.brand = { id: fields.brand };
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
    if (res.code === 200) {
      message.success('删除成功，即将刷新');
      hide();
      return true;
    } else return false;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const Account = () => {
  const [modalVisible, handleModalVisible] = useState(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [brands, setBrands] = useState([]);
  const actionRef = useRef();
  const getBrand = async () => {
    let res = await queryBrand();
    setBrands(res);
  };
  useEffect(() => {
    getBrand();
  }, []);
  const columns = [
    {
      title: '用户名',
      dataIndex: 'name',
    },
    {
      title: '密码',
      dataIndex: 'pwd',
    },
    {
      title: '品牌',
      dataIndex: 'brand',
      renderText: val => {
        return `${(val && val.name) || ''}`;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: {
        0: {
          text: '关闭',
          status: 'Default',
        },
        1: {
          text: '开启',
          status: 'Processing',
        },
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
    },
    {
      title: '修改时间',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              let data = {
                id: record.id,
                name: record.name,
                pwd: record.pwd,
                status: record.status,
                brand: (record.brand && record.brand.id) || 0,
              };
              setStepFormValues(data);
              handleUpdateModalVisible(true);
            }}
          >
            修改
          </a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              if (!record.brand.id) {
                message.error('admin不允许删除');
              }
              handleRemove(record.id);
              actionRef.current.reload();
            }}
          >
            删除
          </a>
        </>
      ),
    },
  ];
  return (
    <PageHeaderWrapper>
      <ProTable
        headerTitle="账号列表"
        actionRef={actionRef}
        rowKey={record => record.id}
        toolBarRender={() => [
          <Button
            type="primary"
            onClick={() => {
              handleModalVisible(true);
            }}
          >
            新建账户
          </Button>,
        ]}
        search={false}
        request={params => queryRule(params)}
        columns={columns}
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
          brands={brands}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setStepFormValues({});
          }}
          updateModalVisible={updateModalVisible}
          values={stepFormValues}
        />
      ) : null}
    </PageHeaderWrapper>
  );
};

export default Account;
