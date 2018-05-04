import React from 'react';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Layout, Input, Form, Button } from 'antd';
// import { DURATION } from 'utils/constants';
// import createHistory from 'history/createBrowserHistory';
import style from '../index.scss';
// import AddPolicy from './AddPolicy';

const FormItem = Form.Item;

class Sandboxie extends React.PureComponent {
    static propTypes ={
        dispatch: PropTypes.func.isRequired,
        loading: PropTypes.bool.isRequired,
    };
    query(payload) {
        this.props.dispatch({
            type: 'sandboxie/getPolicyList',
            payload,
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Layout className={style.container}>
                <Form layout="inline" className={style.inputs} onSubmit={this.onQuery}>
                    <FormItem label="身份证号前6位" >
                        {
                            getFieldDecorator('id')(<Input placeholder="请输入策略名称" />)
                        }
                    </FormItem>
                    <FormItem label="手机号前7位" >
                        {
                            getFieldDecorator('status')(<Input placeholder="请输入策略名称" />)
                        }
                    </FormItem>
                    <FormItem label="策略名称" >
                        {
                            getFieldDecorator('name')(<Input placeholder="请输入策略名称" />)
                        }
                    </FormItem>
                    <FormItem>
                        <Button type="primary" htmlType="submit" disabled={this.props.loading} className={style.save}>选择样本</Button>
                    </FormItem>
                </Form>
            </Layout>
        );
    }
}

const mapStateToProps = (state) => ({
    list: state.sandboxie.list,
    sysId: state.sandboxie.sysId,
    loading: state.loading.models.sandboxie,
    pageNum: state.sandboxie.pageNum,
    pageSize: state.sandboxie.pageSize,
});
export default connect(mapStateToProps)(Form.create()(CSSModules(Sandboxie)));
