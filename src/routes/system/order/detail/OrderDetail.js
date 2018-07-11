import React from 'react';
import { Layout, Menu } from 'antd';
import MenuItem from 'antd/lib/menu/MenuItem';
import Basic from './Basic';
import LinkOrder from './LinkOrder';
import RiskReport from './RiskReport';


export default class OrderDetail extends React.PureComponent {
    state = {
        current: 'basic',
    }
      handleClick = (e) => {
          this.setState({
              current: e.key,
          });
      }
      render() {
          return (
              <Layout className="layoutMar">
                  <Menu
                      mode="horizontal"
                      onClick={this.handleClick}
                      selectedKeys={[this.state.current]}
                  >
                      <MenuItem key="basic">
                    订单基本信息
                      </MenuItem>
                      <MenuItem key="risk">
                    风控报告
                      </MenuItem>
                      <MenuItem key="order">
                    关联订单
                      </MenuItem>
                  </Menu>
                  {
                      this.state.current === 'basic' &&
                      <Basic />
                  }
                  {
                      this.state.current === 'risk' &&
                      <RiskReport />
                  }
                  {
                      this.state.current === 'order' &&
                      <LinkOrder {...this.props} />
                  }
              </Layout>
          );
      }
}
