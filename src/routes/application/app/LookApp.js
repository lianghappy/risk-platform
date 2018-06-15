import React from 'react';
import { Menu, Layout, Form, Divider, message } from 'antd';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { DURATION } from 'utils/constants';
import style from './LookApp.scss';
import Product from './Product';
import OldProduct from './oldProduct';
import AddApp from './AddApp';

class AppIndex extends React.PureComponent {
    static propTypes ={
        dispatch: PropTypes.func.isRequired,
        list: PropTypes.array.isRequired,
        loading: PropTypes.bool.isRequired,
        pageNum: PropTypes.number.isRequired,
        pageSize: PropTypes.number.isRequired,
        listSign: PropTypes.array.isRequired,
        appItem: PropTypes.array.isRequired,
        listNoSign: PropTypes.array.isRequired,
    };
    state = {
        current: '.$del',
        url: 'lookApp/queryListSign',
    }
  handleClick = (e) => {
      const {
          pageSize,
          pageNum,
      } = this.props;
      this.setState({
          current: e.key,
      });
      if (e.key === '.$add') {
          this.query({
              pageSize,
              pageNum,
              appId: this.props.list.id,
          }, 'lookApp/queryListNoSign');
          this.setState({
              url: 'lookApp/queryListNoSign',
          });
      } else {
          this.query({
              pageSize,
              pageNum,
              appId: this.props.list.id,
          }, 'lookApp/queryListSign');
          this.setState({
              url: 'lookApp/queryListSign',
          });
      }
  }
    modalOk = (data, callback) => {
        const {
            dispatch,
            pageSize,
            pageNum,
        } = this.props;
        const content = '更新成功';
        const url = 'app/updata';

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
            this.query({
                appId: this.props.list.id,
                pageNum,
                pageSize,
            }, this.state.url);
            this.querys({
                id: this.props.list.id,
            });
        });
    };
    query(payload, url) {
        this.props.dispatch({
            type: url,
            payload,
        });
    }
    querys(payload) {
        this.props.dispatch({
            type: 'lookApp/getAppDetailList',
            payload,
        });
    }
    render() {
        const {
            pageSize,
            pageNum,
            list: dataSource,
            listSign,
            loading,
            listNoSign,
        } = this.props;
        return (
            <Layout className={style.container}>
                <div className={style.tops}>
                    <div className={style.edits}>
                        <h1 className={style.title}>应用基本信息</h1>
                        <AddApp
                            type="edit"
                            record={dataSource}
                            onOk={this.modalOk}
                            appItem={this.props.appItem}
                            modalData={{ imgUrl: dataSource.img }}
                        >
                            <span className={style.edit}>编辑</span>
                        </AddApp>
                    </div>
                    <Divider type="horizontal" />
                    <div className={style.content}>
                        <div className={style.marg}>
                            <span>公司名称：</span>
                            <span>{dataSource.partnerName}</span>
                        </div>
                        <div className={style.marg}>
                            <span>应用名称：</span>
                            <span>{dataSource.name}</span>
                        </div>
                        <div>
                            <span>应用图标：</span>
                            <img alt="logo" src={dataSource.img} className={style.imgs} />
                        </div>
                    </div>
                </div>
                <Menu
                    onClick={this.handleClick}
                    selectedKeys={[this.state.current]}
                    mode="horizontal"
                    className={style.containers}
                >
                    <Menu.Item key="del">
                        已选产品
                    </Menu.Item>
                    <Menu.Item key="add">
                        未选产品
                    </Menu.Item>
                </Menu>
                {
                    this.state.current === '.$del' ?
                        <OldProduct
                            loading={loading}
                            dataSource={listSign}
                            current={pageNum}
                            pageSize={pageSize}
                            type={this.state.current}
                            pageNum={pageNum}
                            appId={this.props.list.id}
                            history={this.props.history}
                        />
                        :
                        <Product
                            loading={loading}
                            dataSource={listNoSign}
                            current={pageNum}
                            pageSize={pageSize}
                            type={this.state.current}
                            pageNum={pageNum}
                            appId={this.props.list.id}
                        />
                }
            </Layout>);
    }
}
const mapStateToProps = (state) => ({
    list: state.lookApp.list,
    sysId: state.lookApp.sysId,
    loading: state.loading.models.lookApp,
    pageNum: state.lookApp.pageNum,
    pageSize: state.lookApp.pageSize,
    listSign: state.lookApp.listSign,
    appItem: state.lookApp.appItem,
    listNoSign: state.lookApp.listNoSign,
});
export default connect(mapStateToProps)(Form.create()(CSSModules(AppIndex)));
