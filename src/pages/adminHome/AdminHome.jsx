import { Button, Layout, Menu } from 'antd';
import { Content, Header } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';
import React, { useEffect, useState } from 'react';
import styles from './AdminHome.module.scss';
import stackLogo from '../../assets/stack.png';
import cx from 'classnames';
import {
  BookOutlined,
  CreditCardOutlined,
  HomeOutlined,
  LogoutOutlined,
  SwapOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import ConfirmationModal from '../../core/confirmationModal/ConfirmationModal';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice/authSlice';
import { showNotification } from '../../store/notificationSlice/notificationSlice';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { setLoading } from '../../store/settingsSlice/settingsSlice';

const AdminHome = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [isLogoutModelOpen, setIsLogoutModelOpen] = useState(false);
  const [selectedSidebarItem, setSelectedSidebarItem] = useState('1');

  useEffect(() => {
    dispatch(setLoading(true));
    const path = location.pathname;
    if (path.includes('/admin/books')) {
      setSelectedSidebarItem('2');
    } else if (path.includes('/admin/authors')) {
      setSelectedSidebarItem('3');
    } else if (path.includes('/admin/users')) {
      setSelectedSidebarItem('4');
    } else if (path.includes('/admin/lending')) {
      setSelectedSidebarItem('5');
    } else if (path.includes('/admin/fines')) {
      setSelectedSidebarItem('6');
    } else {
      setSelectedSidebarItem('1');
    }

    dispatch(setLoading(false));
  }, [location]);

  const handleLogoutClick = () => {
    setIsLogoutModelOpen(true);
  };

  const handleUserLogout = async () => {
    try {
      dispatch(setLoading(true));
      dispatch(logout());
      dispatch(
        showNotification({
          type: 'success',
          message: 'Logout Successful',
          description: '',
        }),
      );
    } catch (error) {
      console.log('🚀 ~ handleUserLogout ~ error:', error);
      dispatch(
        showNotification({
          type: 'error',
          message: 'Error',
          description: error.message || error?.data?.message,
        }),
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleSidebarSelect = async (e) => {
    try {
      dispatch(setLoading(true));
      console.log('🚀 ~ handleSidebarSelect ~ e:', e);
      setSelectedSidebarItem(e.key);
      console.log(selectedSidebarItem);

      switch (e.key) {
        case '1':
          navigate('/admin/');
          break;
        case '2':
          navigate('/admin/books');
          break;
        case '3':
          navigate('/admin/authors');
          break;
        case '4':
          navigate('/admin/users');
          break;
        case '5':
          navigate('/admin/lending');
          break;
        case '6':
          navigate('/admin/fines');
          break;

        default:
          break;
      }

      dispatch(setLoading(false));
    } catch (error) {
      console.log('🚀 ~ handleSidebarSelect ~ error:', error);
    }
  };

  return (
    <div className={styles.homeWrapper}>
      <div className={styles.imageBackground}></div>
      <div className={styles.layoutContainer}>
        <Layout className={styles.bgTransparent}>
          <Header className={styles.layoutHeader}>
            <div className={styles.logoContainer}>
              <img src={stackLogo} alt="" className={styles.stackLogo} />
              <p className={styles.titleText}>Libra</p>
            </div>
            <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={['2']}
              items={[]}
              style={{
                flex: 1,
                minWidth: 0,
              }}
            />
            <div className={styles.logoContainer}>
              <Button
                type="primary"
                danger
                icon={<LogoutOutlined />}
                size={'small'}
                onClick={handleLogoutClick}
              >
                <p className={styles.logoutText}>Logout</p>
              </Button>

              <ConfirmationModal
                title={'Logout'}
                content={'Are you sure?'}
                confirmText={'Yes'}
                handleCancel={() => setIsLogoutModelOpen(false)}
                handleConfirm={handleUserLogout}
                isModelActive={isLogoutModelOpen}
                type={'danger'}
              />
            </div>
          </Header>
          <Layout className={styles.layoutBody}>
            <Sider
              width={300}
              className={cx(styles.bgTransparent, styles.sidebar)}
            >
              <Menu
                mode="inline"
                defaultSelectedKeys={['1']}
                style={{
                  height: '100%',
                  borderRight: 0,
                }}
                selectedKeys={[selectedSidebarItem]}
                onClick={handleSidebarSelect}
              >
                <Menu.Item
                  key="1"
                  className={cx(
                    styles.sideBarItem,
                    selectedSidebarItem === '1' && styles.selectedSidebarItem,
                  )}
                  icon={<HomeOutlined />}
                >
                  Dashboard
                </Menu.Item>
                <Menu.Item
                  key="2"
                  className={cx(
                    styles.sideBarItem,
                    selectedSidebarItem === '2' && styles.selectedSidebarItem,
                  )}
                  icon={<BookOutlined />}
                >
                  Books
                </Menu.Item>
                <Menu.Item
                  key="3"
                  className={cx(
                    styles.sideBarItem,
                    selectedSidebarItem === '3' && styles.selectedSidebarItem,
                  )}
                  icon={<TeamOutlined />}
                >
                  Authors
                </Menu.Item>
                <Menu.Item
                  key="4"
                  className={cx(
                    styles.sideBarItem,
                    selectedSidebarItem === '4' && styles.selectedSidebarItem,
                  )}
                  icon={<UserOutlined />}
                >
                  Users
                </Menu.Item>
                <Menu.Item
                  key="5"
                  className={cx(
                    styles.sideBarItem,
                    selectedSidebarItem === '5' && styles.selectedSidebarItem,
                  )}
                  icon={<SwapOutlined />}
                >
                  Lending
                </Menu.Item>
                <Menu.Item
                  key="6"
                  className={cx(
                    styles.sideBarItem,
                    selectedSidebarItem === '6' && styles.selectedSidebarItem,
                  )}
                  icon={<CreditCardOutlined />}
                >
                  Fines
                </Menu.Item>
              </Menu>
            </Sider>
            <Layout
              style={{
                padding: '0 24px 24px',
              }}
              className={cx(
                styles.bgTransparent,
                styles.textWhite,
                styles.overflowHidden,
              )}
            >
              <Content className={cx(styles.textWhite, styles.outletWrapper)}>
                <Outlet />
              </Content>
            </Layout>
          </Layout>
        </Layout>
      </div>
    </div>
  );
};

export default AdminHome;
