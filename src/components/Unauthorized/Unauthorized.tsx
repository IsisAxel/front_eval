import React from 'react';
import { Button, Result } from 'antd';

const Unauthorized: React.FC = () => (
  <Result
    status="403"
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={<Button href='/' type="primary">Login</Button>}
  />
);

export default Unauthorized;