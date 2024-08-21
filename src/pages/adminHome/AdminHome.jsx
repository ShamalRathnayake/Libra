import { Breadcrumb, Layout, Menu } from 'antd';
import { Content, Header } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';
import React from 'react';
import styles from './AdminHome.module.scss';

const AdminHome = () => {
  return (
    <>
      <div className={styles.homeWrapper}>
        <div className={styles.imageBackground}></div>
        <div className={styles.layoutContainer}>
          <Layout className={styles.bgTransparent}>
            <Header className={styles.layoutHeader}>
              <div className="demo-logo" />
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
            </Header>
            <Layout className={styles.layoutBody}>
              <Sider width={200} className={styles.bgTransparent}>
                <Menu
                  mode="inline"
                  defaultSelectedKeys={['1']}
                  defaultOpenKeys={['sub1']}
                  style={{
                    height: '100%',
                    borderRight: 0,
                  }}
                  items={[]}
                />
              </Sider>
              <Layout
                style={{
                  padding: '0 24px 24px',
                }}
                className={styles.bgTransparent}
              >
                <Breadcrumb
                  style={{
                    margin: '16px 0',
                  }}
                >
                  <Breadcrumb.Item>Home</Breadcrumb.Item>
                  <Breadcrumb.Item>List</Breadcrumb.Item>
                  <Breadcrumb.Item>App</Breadcrumb.Item>
                </Breadcrumb>
                <Content
                  style={{
                    padding: 24,
                    margin: 0,
                    minHeight: 280,
                  }}
                >
                  Content
                </Content>
              </Layout>
            </Layout>
          </Layout>
        </div>
      </div>
    </>
  );
};

export default AdminHome;
