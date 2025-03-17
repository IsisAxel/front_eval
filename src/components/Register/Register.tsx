import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Typography, Alert } from 'antd';
import axios from 'axios';

const { Title } = Typography;

const Register: React.FC = () => {
  const [error, setError] = useState<any | null>(null);
  const navigate = useNavigate();

  const onFinish = (values: any) => {
    const { username, password } = values;
    axios.post('http://localhost:8080/admin/register', { username, password })
      .then((response) =>{
        console.log(response);
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
        <Title level={2} style={{ color: '#1890ff', marginBottom: '20px' }}>Register</Title>

        {error && typeof error === "object" && !Array.isArray(error) && error !== null ? (
          <>
            {error.username && <Alert message={`${error.username}`} type="error" showIcon style={{ marginBottom: '15px' }} />}
            {error.password && <Alert message={`${error.password}`} type="error" showIcon style={{ marginBottom: '15px' }} />}
          </>
        ) : (
          error && <Alert message={error} type="error" showIcon style={{ marginBottom: '15px' }} />
        )}


        <Form name="login" initialValues={{ remember: true }} onFinish={onFinish}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your Username!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button block type="primary" htmlType="submit">
              Register
            </Button>
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
              or <a href="/">Log in now!</a>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Register;
