import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Typography, Alert } from 'antd';
import { fetchDataPost } from '../../util/util';

const { Title } = Typography;

const Login: React.FC = () => {
  const [error, setError] = useState<any | null>(null);
  const navigate = useNavigate();

  const onFinish = (values: any) => {
    const { email, password } = values;
    fetchDataPost('http://localhost:8080/authentification/login', { email, password })
      .then((response) =>{
        const userData = response.data;
        localStorage.setItem('accessToken', userData.accessToken);
        localStorage.setItem('avatar', userData.avatar);
        localStorage.setItem('companyName', userData.companyName);
        localStorage.setItem('email', userData.email);
        localStorage.setItem('firstName', userData.firstName);
        localStorage.setItem('lastName', userData.lastName);
        localStorage.setItem('menuNavigation', JSON.stringify(userData.menuNavigation));
        localStorage.setItem('refreshToken', userData.refreshToken);
        localStorage.setItem('roles', JSON.stringify(userData.roles));
        localStorage.setItem('userId', userData.userId);
        navigate('/dashboard'); 
      })
      .catch((error) => {
        console.log(error);
        if (error.response) {
          const err = error.response.data;
          if (err) {
            setError(err);
          } else {
            setError(error.message);
          } 
        } else {
          setError(error.message);
        }
      });
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      backgroundColor: '#f0f2f5' 
    }}>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '24px', 
        borderRadius: '8px', 
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', 
        width: '100%', 
        maxWidth: '360px', 
        textAlign: 'center' 
      }}>
        <Title level={2} style={{ color: '#1890ff', marginBottom: '20px' }}>Login</Title>

        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: '15px' }} />}

        <Form name="login" initialValues={{ remember: true }} onFinish={onFinish}>
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please input your Email!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button block type="primary" htmlType="submit">
              Log in
            </Button>
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
              or <a href="/register">Register now!</a>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
