import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Divider, message, Modal } from 'antd';
import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import { queryRule, updateRule, addRule, removeRule } from './service';
import { ExclamationCircleOutlined } from '@ant-design/icons';

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

const { confirm } = Modal;
const MerchantBand = () => {
  const [createModalVisible, handleModalVisible] = useState(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef();
  const showDeleteConfirm = id => {
    confirm({
      title: '删除',
      icon: <ExclamationCircleOutlined />,
      content: '确定删除该商户吗',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        handleRemove(id);
      },
    });
  };
  const columns = [
    {
      title: '品牌名',
      dataIndex: 'name',
    },
    {
      title: '品牌描述',
      dataIndex: 'desc',
    },
    {
      title: '品牌图片',
      dataIndex: 'picUrl',
      render: (_, record) => (
        <>
          <img src={_} style={{ height: 60, width: 60 }} />
        </>
      ),
    },
    {
      title: '品牌手机号',
      dataIndex: 'phone',
    },
    {
      title: '营业时间',
      dataIndex: '',
      renderText: val => `${val.openTime + '-' + val.closeTime}`,
    },
    {
      title: '权重',
      dataIndex: 'weight',
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: {
        1: {
          text: '关闭',
          status: 'Default',
        },
        0: {
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
              handleUpdateModalVisible(true);
              setStepFormValues(record);
            }}
          >
            修改
          </a>
        </>
      ),
    },
  ];
  return (
    <PageHeaderWrapper>
      <ProTable
        headerTitle="品牌列表"
        actionRef={actionRef}
        toolBarRender={() => [
          <Button type="primary" onClick={() => handleModalVisible(true)}>
            新建商户品牌
          </Button>,
        ]}
        rowKey={record => record.id}
        search={false}
        request={params => queryRule(params)}
        columns={columns}
      />
      <CreateForm
        onSubmit={async value => {
          const success = await handleAdd(value);

          if (success) {
            handleModalVisible(false);

            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => handleModalVisible(false)}
        modalVisible={createModalVisible}
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
          updateModalVisible={updateModalVisible}
          values={stepFormValues}
        />
      ) : null}
    </PageHeaderWrapper>
  );
};

export default MerchantBand;
