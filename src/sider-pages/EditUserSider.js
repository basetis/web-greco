import React from 'react';
import { Layout } from 'antd';
import './Sider.css';
import MenuHeader from './MenuHeader';
import EditUser from '../header/userMenu/EditUser';
import SiderMenu from './SiderMenu'


const { Header, Content, Sider } = Layout;

const PublicMappingSider = (props) => {

  localStorage.setItem("lastPage", localStorage.getItem("actualPage"))
  localStorage.setItem("actualPage", "/edit-user-details-sider")

  return (
    <Layout>
      <Sider
        id="sider-layout"
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => { console.log(broken); }}
        onCollapse={(collapsed, type) => { console.log(collapsed, type); }}
        theme="light"
      >

        <SiderMenu key={"Edit user"} />

      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: 0 }} >
          <MenuHeader />
        </Header>
        <Content style={{ margin: '-16px 0 0 0' }}>
          <div style={{ background: '#eaedf1', minHeight: 360 }}>

            <EditUser />

          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default PublicMappingSider