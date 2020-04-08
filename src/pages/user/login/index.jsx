import { AlipayCircleOutlined, TaobaoCircleOutlined, WeiboCircleOutlined } from '@ant-design/icons';
import { Alert, Checkbox, message } from 'antd';
import React, { useState } from 'react';
import { Link } from 'umi';
import { connect } from 'dva';
import styles from './style.less';
import LoginFrom from './components/Login';
import request from '../../../utils/fetch';
import MD5 from '@/utils/MD5';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = LoginFrom;

const LoginMessage = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login = props => {
  const { userLogin = {}, submitting } = props;
  const { status, type: loginType } = userLogin;
  const [autoLogin, setAutoLogin] = useState(true);
  const [flag, setFlag] = useState(true);
  const [type, setType] = useState('account');

  const handleSubmit = values => {
    const { dispatch } = props;
    dispatch({
      type: 'login/login',
      payload: { ...values, type },
    });
  };

  const updatePwd = async values => {
    if (values.updatePwd !== values.confirmPwd) {
      return message.error('修改密码与确认密码不一致');
    }
    let data = {
      userName: values.userName,
      password: MD5(values.password),
      updatePwd: MD5(values.updatePwd),
    };
    let res = await request('/admin/updatePwd', {
      method: 'POST',
      data,
    });
    if (res.code === 200 && res.data === true) {
      message.info('修改密码成功');
      setFlag(true);
    }
  };

  return (
    <div className={styles.main}>
      {flag ? (
        <LoginFrom activeKey={type} onTabChange={setType} onSubmit={handleSubmit}>
          {status === 'error' && loginType === 'account' && !submitting && (
            <LoginMessage content="账户或密码错误（admin/ant.design）" />
          )}

          <UserName
            name="userName"
            placeholder="用户名"
            rules={[
              {
                required: true,
                message: '请输入用户名!',
              },
            ]}
          />
          <Password
            name="password"
            placeholder="密码"
            rules={[
              {
                required: true,
                message: '请输入密码！',
              },
            ]}
          />
          <a
            style={{ textAlign: 'right' }}
            onClick={() => {
              setFlag(false);
            }}
          >
            修改密码
          </a>
          <Submit loading={submitting}>登录</Submit>
        </LoginFrom>
      ) : (
        <LoginFrom onSubmit={updatePwd}>
          <h3>修改密码</h3>
          <UserName
            name="userName"
            placeholder="请输入您的用户名"
            rules={[
              {
                required: true,
                message: '请输入用户名!',
              },
            ]}
          />
          <Password
            name="password"
            placeholder="您的当前密码"
            rules={[
              {
                required: true,
                message: '请输当前密码！',
              },
            ]}
          />
          <Password
            name="updatePwd"
            placeholder="请输入您要修改密码"
            rules={[
              {
                required: true,
                message: '请输入密码！',
              },
            ]}
          />
          <Password
            name="confirmPwd"
            placeholder="再次确认要修改密码"
            rules={[
              {
                required: true,
                message: '请输入确认密码！',
              },
            ]}
          />
          <a
            style={{ textAlign: 'right' }}
            onClick={() => {
              setFlag(true);
            }}
          >
            返回登录
          </a>
          <Submit loading={submitting}>修改密码</Submit>
        </LoginFrom>
      )}
    </div>
  );
};

export default connect(({ login, loading }) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Login);
