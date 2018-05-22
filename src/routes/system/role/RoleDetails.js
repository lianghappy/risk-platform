import React from 'react';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Layout, Input, Form, Select, Tree, Button, message } from 'antd';
import { DURATION } from 'utils/constants';
import style from './index.scss';

const FormItem = Form.Item;
const Option = Select.Option;
const TreeNode = Tree.TreeNode;

const mapStateToProps = (state) => ({
    list: state.tree.list,
    sysId: state.tree.sysId,
    loading: state.loading.models.tree,
    details: state.tree.details,
});
@connect(mapStateToProps)
class RoleDetail extends React.PureComponent {
    static propTypes ={
        form: PropTypes.object.isRequired,
        dispatch: PropTypes.func.isRequired,
        list: PropTypes.array.isRequired,
        sysId: PropTypes.string.isRequired,
        loading: PropTypes.bool.isRequired,
    };
    state = {
        checkedKeys: this.props.details.menus,
    }
    onQuery = (e) => {
        e.preventDefault();
        const {
            loading,
            form,
        } = this.props;
        if (loading) return;
        form.validateFields((errors, values) => {
            const menuId = this.state.checkedKeys;
            const id = this.props.details.id;
            Object.assign(values, { menuId });
            Object.assign(values, { sysId: 'risk' });
            Object.assign(values, { id });
            new Promise((resolve) => {
                this.props.dispatch({
                    type: 'tree/update',
                    payload: {
                        data: { ...values },
                        resolve,
                    },
                });
            }).then(() => {
                message.success('操作成功', DURATION);
                this.props.history.push('/role');
            });
        });
    }
  onCheck = (keys) => {
      this.setState({ checkedKeys: keys });
  }
  renderTreeNodes = (data) => {
      return data.map((item) => {
          if (item.children) {
              return (
                  <TreeNode title={item.title} key={item.key} dataRef={item}>
                      {this.renderTreeNodes(item.children)}
                  </TreeNode>
              );
          }
          return <TreeNode key={item.key} title={item.title} dataRef={item} />;
      });
  }
  render() {
      const formItemLayout = {
          labelCol: {
              span: 3,
          },
          wrapperCol: {
              span: 8,
          },
      };
      const {
          form,
          details,
          list,
      } = this.props;
      const {
          getFieldDecorator,
      } = form;
      return (
          <Layout className={style.container}>
              <Form layout="vertical" onSubmit={this.onQuery}>
                  <FormItem label="角色类型" {...formItemLayout}>
                      {
                          getFieldDecorator('type', {
                              initialValue: details.type,
                          })(<Select><Option value="公司内">公司内</Option><Option value="公司外">公司外</Option></Select>)
                      }
                  </FormItem>
                  <FormItem label="角色名称" {...formItemLayout}>
                      {
                          getFieldDecorator('roleName', {
                              initialValue: details.name,
                          })(<Input />)
                      }
                  </FormItem>
                  <FormItem label="角色权限" {...formItemLayout}>
                      {
                          getFieldDecorator('menuId')(<Tree
                              // defaultExpandAll
                              checkable
                              checkedKeys={this.state.checkedKeys}
                              onCheck={(checkedKeys) => this.onCheck(checkedKeys)}
                          >{this.renderTreeNodes(list)}
                                                      </Tree>)
                      }
                  </FormItem>
                  <FormItem>
                      <Button type="primary" htmlType="submit" disabled={this.props.loading} className={style.save}>保存</Button>
                      <Button>取消</Button>
                  </FormItem>
              </Form>
          </Layout>
      );
  }
}

export default Form.create()(CSSModules(RoleDetail));
