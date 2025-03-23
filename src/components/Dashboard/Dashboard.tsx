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
import MyForm from '../MyFrom/MyForm';
import TableTemplate from '../TableTemplate/TableTemplate';
import { fetchDataGet, fetchDataPost, setupInterceptors } from '../../util/util';
import { useNavigate } from 'react-router-dom';
import Loading from '../Loading/Loading';
import UploadFile from '../UploadFile/UploadFile';

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

// Configuration des composants
const COMPONENTS = {
  '1': () => <MyForm />,
  '2': () => <div>Contenu pour Option 2</div>,
  '3': () => <TableTemplate />,
  '4': () => <FormTemplate />,
  '5': () => <div>Contenu pour Alex</div>,
  '6': () => <div>Contenu pour Team 1</div>,
  '8': () => <div>Contenu pour Team 2</div>,
  '9': () => <UploadFile/>,
};

const siderStyle: React.CSSProperties = {
  overflow: 'auto',
  height: '100vh',
  position: 'sticky',
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: 'thin',
  scrollbarGutter: 'stable',
};

function getItem(
  label: React.ReactNode,
  key: keyof typeof COMPONENTS | 'sub1' | 'sub2',
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('Dashboard', '1', <PieChartOutlined />),
  getItem('Option 2', '2', <DesktopOutlined />),
  getItem('User', 'sub1', <UserOutlined />, [
    getItem('Table', '3'),
    getItem('Formulaire', '4'),
    getItem('Alex', '5'),
  ]),
  getItem('Team', 'sub2', <TeamOutlined />, [
    getItem('Team 1', '6'),
    getItem('Team 2', '8'),
  ]),
  getItem('Files', '9', <FileOutlined />),
];

// Crée une map pour retrouver les éléments du menu par leur clé
type MenuItemMap = {
  label: React.ReactNode;
  parentKey?: string;
};

const createMenuMap = (items: MenuItem[]): Map<string, MenuItemMap> => {
  const map = new Map<string, MenuItemMap>();

  const processItems = (items: MenuItem[], parentKey?: string) => {
    items.forEach((item : any) => {
      if (item && item.key && item.label) {
        map.set(item.key.toString(), {
          label: item.label,
          parentKey: parentKey,
        });
        
        if (item.children) {
          processItems(item.children, item.key.toString());
        }
      }
    });
  };

  processItems(items);
  return map;
};

const menuMap = createMenuMap(items);

// Récupère le chemin hiérarchique d'une clé
const getBreadcrumbPath = (key: string): string[] => {
  const path: string[] = [];
  let currentKey: string | undefined = key;

  while (currentKey) {
    const item = menuMap.get(currentKey);
    if (!item) break;
    
    path.unshift(item.label?.toString() || currentKey);
    currentKey = item.parentKey;
  }

  return path;
};

const Dashboard: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState<keyof typeof COMPONENTS>('1');
  const [user , setUser] = useState("Admin");
  const [isLoading , setIsLoading] = useState(true);
  const navigate = useNavigate();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const SelectedComponent = COMPONENTS[selectedKey];
  const breadcrumbPath = useMemo(() => getBreadcrumbPath(selectedKey), [selectedKey]);

  const logout = () => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('accessToken');
    fetchDataPost('http://localhost:8080/authentification/logout', { userId , token })
    .then((response : any) =>{
      localStorage.removeItem('accessToken');
      localStorage.removeItem('avatar');
      localStorage.removeItem('companyName');
      localStorage.removeItem('email');
      localStorage.removeItem('firstName');
      localStorage.removeItem('lastName');
      localStorage.removeItem('menuNavigation');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('roles');
      localStorage.removeItem('userId');
      navigate('/'); 
    })
    .catch((error : any) => {
      console.log(error);

    });
  }

  useEffect(() => {
    setupInterceptors(navigate);
    if (localStorage.getItem('accessToken') === null) {
      navigate('/unauthorized');
    }
    setUser(localStorage.getItem('firstName') || 'Admin');
    setIsLoading(false);
  }, [navigate]);

  const styles = {
    centered: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
    },
  };
  
  if (isLoading) {
    return (
      <div style={styles.centered}>
        <Loading/>
      </div>
    );
  }
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        theme="light"
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        style={siderStyle}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="light"
          defaultSelectedKeys={['1']}
          mode="inline"
          items={items}
          onClick={({ key }) => setSelectedKey(key as typeof selectedKey)}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} >
          <LogoutOutlined onClick={logout} style={{ verticalAlign: 'middle' , float: 'right' , marginTop:'2vh' , marginRight:'1vw' }}/>
          <Avatar style={{ backgroundColor: '#7265e6',verticalAlign: 'middle' , float: 'right' , marginTop:'1vh' , marginRight: '1vw' }} size="large">
            {user}
          </Avatar>
        </Header>
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Navigation</Breadcrumb.Item>
            {breadcrumbPath.map((label, index) => (
              <Breadcrumb.Item key={index}>{label}</Breadcrumb.Item>
            ))}
          </Breadcrumb>
          <div
            style={{ 
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {SelectedComponent ? <SelectedComponent /> : 'Sélectionnez une option dans le menu latéral.'}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Copyright ©{new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Dashboard;