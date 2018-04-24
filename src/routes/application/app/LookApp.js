import React from 'react';
import { Menu, Layout, Form, Divider, message } from 'antd';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { DURATION } from 'utils/constants';
import style from './LookApp.scss';
import Product from './Product';

class AppIndex extends React.PureComponent {
    static propTypes ={
        dispatch: PropTypes.func.isRequired,
        // list: PropTypes.array.isRequired,
        // sysId: PropTypes.string.isRequired,
        // loading: PropTypes.bool.isRequired,
        pageNum: PropTypes.number.isRequired,
        pageSize: PropTypes.number.isRequired,
    };
    state = {
        current: 'mail',
    }
  handleClick = (e) => {
      console.log('click ', e);
      this.setState({
          current: e.key,
      });
  }
    modalOk = (data, callback) => {
        const {
            dispatch,
            pageSize,
            pageNum,
            form,
        } = this.props;
        const content = data.id !== undefined ? '更新成功' : '新增成功';
        const url = data.id !== undefined ? 'app/updata' : 'company/add';

        new Promise((resolve) => {
            dispatch({
                type: url,
                payload: {
                    data,
                    resolve,
                },
            });
        }).then(() => {
            callback();
            message.success(content, DURATION);
            form.validateFields((errors, values) => {
                this.query({
                    ...values,
                    pageNum,
                    pageSize,
                });
            });
        });
    };
    query(payload) {
        this.props.dispatch({
            type: 'app/getAppList',
            payload,
        });
    }
    render() {
        // const {
        //     pageSize,
        //     pageNum,
        //     list: dataSource,
        //     loading,
        // } = this.props;

        return (
            <Layout className={style.container}>
                <h1>应用基本信息</h1>
                <Divider type="horizontal" />
                <div className={style.content}>
                    <div>
                        <span>公司名称：</span>
                        <span></span>
                    </div>
                    <div>
                        <span>公司名称：</span>
                        <span></span>
                    </div>
                    <div>
                        <span>公司名称：</span>
                        <img alt="logo" />
                    </div>
                </div>
                <Menu
                    onClick={this.handleClick}
                    selectedKeys={[this.state.current]}
                    mode="horizontal"
                >
                    <Menu.Item key="del">
                        已选产品
                    </Menu.Item>
                    <Menu.Item key="add">
                        未选产品
                    </Menu.Item>
                </Menu>
                <Product />
            </Layout>);
    }
}
const mapStateToProps = (state) => ({
    list: state.lookApp.list,
    sysId: state.lookApp.sysId,
    loading: state.loading.models.lookApp,
    pageNum: state.lookApp.pageNum,
    pageSize: state.lookApp.pageSize,
});
export default connect(mapStateToProps)(Form.create()(CSSModules(AppIndex)));
