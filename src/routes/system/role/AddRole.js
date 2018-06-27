import React from 'react';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Layout, Input, Form, Select, Tree, Button, message } from 'antd';
import { DURATION } from 'utils/constants';
import { setPath } from 'utils/path';
import style from './index.scss';

const FormItem = Form.Item;
const Option = Select.Option;
const TreeNode = Tree.TreeNode;

const mapStateToProps = (state) => ({
    list: state.tree.list,
    sysId: state.tree.sysId,
    loading: state.loading.models.tree,
    datas: state.tree.datas,
});
@connect(mapStateToProps)
class AddRole extends React.PureComponent {
    static propTypes ={
        form: PropTypes.object.isRequired,
        dispatch: PropTypes.func.isRequired,
        list: PropTypes.array.isRequired,
        sysId: PropTypes.string.isRequired,
        loading: PropTypes.bool.isRequired,
    };
    state = {
        checkedKeys: [],
    }
    onQuery = (e) => {
        e.preventDefault();
        const {
            loading,
            form,
        } = this.props;
        console.log(this.props.list);

        if (loading) return;
        form.validateFields((errors, values) => {
            const menuId = this.state.checkedKeys;
            const menus = [];
            const menuIds = [];
            this.props.datas.forEach(item => {
                if (menuId.includes(item.id)) {
                    menus.push(item.id);
                    if (item.pid) {
                        menus.push(item.pid);
                    }
                }
            });
            this.props.datas.forEach(item => {
                if (menus.includes(item.id)) {
                    menuIds.push(item.id);
                    if (item.pid) {
                        menuIds.push(item.pid);
                    }
                }
            });
            const menu = Array.from(new Set(menuIds));

            Object.assign(values, { menuId: menu });
            Object.assign(values, { sysId: 'risk' });
            new Promise((resolve) => {
                this.props.dispatch({
                    type: 'tree/add',
                    payload: {
                        data: { ...values },
                        resolve,
                    },
                });
            }).then(() => {
                message.success('操作成功', DURATION);
                this.props.history.push(setPath('/role'));
            });
        });
    }
  onCheck = (keys) => {
      console.log(keys);
      this.setState({ checkedKeys: keys });
  }
  cancelS = () => {
      window.history.back(-1);
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
                          getFieldDecorator('type',
                              { rules: [{ required: true, message: '请选择角色类型' }] }
                          )(<Select><Option value="风控策略部" >风控策略部</Option><Option value="风控执行部" >风控执行部</Option><Option value="技术研发部" >技术研发部</Option></Select>)
                      }
                  </FormItem>
                  <FormItem label="角色名称" {...formItemLayout}>
                      {
                          getFieldDecorator('roleName',
                              { rules: [{ required: true, message: '请输入角色名称' }] }
                          )(<Input placeholder="请输入角色名称" />)
                      }
                  </FormItem>
                  <FormItem label="角色权限" {...formItemLayout}>
                      {
                          getFieldDecorator('menuId')(
                              <Tree
                              // defaultExpandAll
                                  checkable
                                  checkedKeys={this.state.checkedKeys}
                                  onCheck={(checkedKeys) => this.onCheck(checkedKeys)}
                              >{this.renderTreeNodes(list)}
                              </Tree>
                          )
                      }
                  </FormItem>
                  <FormItem>
                      <Button type="primary" htmlType="submit" disabled={this.props.loading} className={style.save}>保存</Button>
                      <Button onClick={() => this.cancelS()}>取消</Button>
                  </FormItem>
              </Form>
          </Layout>
      );
  }
}

export default Form.create()(CSSModules(AddRole));
