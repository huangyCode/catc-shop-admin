import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import React, { useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { queryRule } from './service';

const Customer = () => {
  const actionRef = useRef();
  const columns = [
    {
      title: '用户名',
      dataIndex: 'nickName',
    },
    {
      title: '用户头像',
      dataIndex: 'avatarUrl',
      hideInSearch: true,
      render: (_, record) => (
        <>
          <img src={_} style={{ height: 60, width: 60 }} />
        </>
      ),
    },
    {
      title: '用户性别',
      dataIndex: 'gender',
      valueEnum: {
        0: {
          text: '未知',
          status: 'Default',
        },
        1: {
          text: '男',
          status: 'Processing',
        },
        2: {
          text: '女',
          status: 'Processing',
        },
      },
      hideInSearch: true,
    },
    {
      title: '电话号码',
      dataIndex: 'phone',
    },
    {
      title: '省份',
      dataIndex: 'province',
      hideInSearch: true,
    },
    {
      title: '市',
      dataIndex: 'city',
      hideInSearch: true,
    },
    {
      title: 'openId',
      dataIndex: 'openId',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInSearch: true,
    },
  ];
  return (
    <PageHeaderWrapper>
      <ProTable
        headerTitle="用户列表"
        params={['phone']}
        actionRef={actionRef}
        rowKey={record => record.id}
        request={params => queryRule(params)}
        columns={columns}
      />
    </PageHeaderWrapper>
  );
};

export default Customer;
