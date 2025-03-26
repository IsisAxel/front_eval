import React, { useState, useMemo, useEffect } from 'react';
import {
  DesktopOutlined,
  FileOutlined,
  LogoutOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Avatar, Breadcrumb, Layout, Menu, theme } from 'antd';
import FormTemplate from '../FormTemplate/FormTemplate';
import CRMData from '../CRMData/CRMData';
import TableTemplate from '../TableTemplate/TableTemplate';
import { fetchDataGet, fetchDataPost, setupInterceptors } from '../../util/util';
import { useNavigate } from 'react-router-dom';
import Loading from '../Loading/Loading';
import UploadFile from '../UploadFile/UploadFile';
import Campaign from '../Campaign/Campaign';
import Budget from '../Budget/Budget';
import Expense from '../Expense/Expense';
import BudgetAlertForm from '../BudgetAlertForm/BudgetAlertForm';

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const Dashboard: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState<keyof typeof COMPONENTS>('1');
  const [user, setUser] = useState("Admin");
  const [isLoading, setIsLoading] = useState(true);
  const [crmData, setCrmData] = useState(null);
  const [campaignList, setCampaignList] = useState<any[]>([]);
  const [budgetList, setBudgetList] = useState<any[]>([]);
  const [expenseList, setExpenseList] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [expenseByCampaign, setExpenseByCampaign] = useState<any[]>([]);
  const [budgetByCampaign, setBudgetByCampaign] = useState<any[]>([]);
  const navigate = useNavigate();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    setupInterceptors(navigate);

    fetchDataGet('http://localhost:8080/dashboard/getCRMData')
      .then((response: any) => {
        setCrmData(response.data.crmDashboard);
      })
      .catch((error: any) => {
        console.error(error);
      });

      fetchDataGet('http://localhost:8080/campaign/all')
      .then((response: any) => {
        console.log(response.data);
        setCampaignList(response.data);
      })
      .catch((error: any) => {
        console.error(error);
      });

      fetchDataGet('http://localhost:8080/campaign/revenueSummary')
      .then((response: any) => {
        console.log(response.data);
        setRevenueData(response.data);
      })
      .catch((error: any) => {
        console.error(error);
      });

      fetchDataGet('http://localhost:8080/budget/all')
      .then((response: any) => {
        setBudgetList(response.data);
      })
      .catch((error: any) => {
        console.error(error);
      });

      fetchDataGet('http://localhost:8080/expense/all')
      .then((response: any) => {
        setExpenseList(response.data);
      })
      .catch((error: any) => {
        console.error(error);
      });

      fetchDataGet('http://localhost:8080/budget/budgetByCampaign')
      .then((response: any) => {
        setBudgetByCampaign(response.data);
      })
      .catch((error: any) => {
        console.error(error);
      });

      fetchDataGet('http://localhost:8080/expense/expenseAmountByCampaign')
      .then((response: any) => {
        console.log(response.data);
        setExpenseByCampaign(response.data);
      })
      .catch((error: any) => {
        console.error(error);
      });

    if (!localStorage.getItem('accessToken')) {
      navigate('/unauthorized');
    }

    setUser(localStorage.getItem('firstName') || 'Admin');
    setIsLoading(false);
  }, [navigate]);

  const logout = () => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('accessToken');
    
    fetchDataPost('http://localhost:8080/authentification/logout', { userId, token })
      .then(() => {
        localStorage.clear();
        navigate('/');
      })
      .catch((error: any) => console.error(error));
  };

  const handleCampaignClick = () => {
    setSelectedKey('6');
  };
  const handleBudgetClick = () => {
    setSelectedKey('8');
  };
  const handleExpenseClick = () => {
    setSelectedKey('7');
  };

  const COMPONENTS: { [key: string]: React.FC | undefined } = {
    '1': () => crmData  && revenueData && budgetByCampaign && expenseByCampaign ? <CRMData data={crmData} expenseByCampaign={expenseByCampaign} budgetByCampaign={budgetByCampaign} onCampaignClick={handleCampaignClick} onBudgetClick={handleBudgetClick} onExpenseClick={handleExpenseClick} revenueData={revenueData} /> : <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Loading /> </div>,
    '2': () => <BudgetAlertForm/>,
    // '3': () => <TableTemplate />,
    // '4': () => <FormTemplate />,
    // '5': () => <div>Contenu pour Alex</div>,
    '6': () => campaignList ? <Campaign data={campaignList} setData={setCampaignList}/> : <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Loading /> </div>,
    '7': () => expenseList ? <Expense data={expenseList} setData={setExpenseList}/> : <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Loading /> </div>,
    '8': () => budgetList ? <Budget data={budgetList} setData={setBudgetList}/> : <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Loading /> </div>,
    '9': () => <UploadFile />,
  };

  const items: MenuItem[] = [
    { key: '1', icon: <PieChartOutlined />, label: 'Dashboard' },
    { key: '2', icon: <DesktopOutlined />, label: 'Budget Alert Rate' },
    // {
    //   key: 'sub1',
    //   icon: <UserOutlined />,
    //   label: 'User',
    //   children: [
    //     { key: '3', label: 'Table' },
    //     { key: '4', label: 'Formulaire' },
    //     { key: '5', label: 'Alex' },
    //   ],
    // },
    {
      key: 'sub2',
      icon: <TeamOutlined />,
      label: 'Team',
      children: [
        { key: '8', label: 'Budget' },
        { key: '6', label: 'Compaign' },
        { key: '7', label: 'Expense' },
      ],
    },
    { key: '9', icon: <FileOutlined />, label: 'Files' },
  ];

  const SelectedComponent = COMPONENTS[selectedKey];

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Loading />
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme="light" collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <Menu theme="light" defaultSelectedKeys={['1']} mode="inline" items={items} onClick={({ key }) => setSelectedKey(key)} />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer , marginBottom: '1vh' }}>
          <LogoutOutlined onClick={logout} style={{ verticalAlign: 'middle', float: 'right', margin: '2vh 1vw' }} />
          <Avatar style={{ backgroundColor: '#7265e6', float: 'right', margin: '1vh 1vw' }} size="large">
            {user}
          </Avatar>
        </Header>
        <Content style={{ margin: '0 16px' }}>
          <div style={{ padding: 24, minHeight: 360, background: colorBgContainer, borderRadius: borderRadiusLG }}>
            {SelectedComponent ? <SelectedComponent /> : 'Sélectionnez une option dans le menu latéral.'}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Copyright ©{new Date().getFullYear()}</Footer>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
