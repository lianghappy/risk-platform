import React from 'react';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Layout, Input, Form, Select, Tree, Button, message } from 'antd';
import { DURATION } from 'utils/constants';
import treeConvert from 'utils/treeConvert';
import style from './index.scss';

const FormItem = Form.Item;
const Option = Select.Option;
const TreeNode = Tree.TreeNode;

class AddRole extends React.PureComponent {
    static propTypes ={
        form: PropTypes.object.isRequired,
        dispatch: PropTypes.func.isRequired,
        list: PropTypes.array.isRequired,
        sysId: PropTypes.string.isRequired,
        loading: PropTypes.bool.isRequired,
    };
    state = {
        expandedKeys: ['0-0-0', '0-0-1'],
        autoExpandParent: true,
        checkedKeys: [],
        selectedKeys: [],
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
            Object.assign(values, { menuId });
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
                this.props.history.push('/role');
            });
        });
    }
 onExpand = (expandedKeys) => {
     console.log('onExpand', arguments);
     // if not set autoExpandParent to false, if children expanded, parent can not collapse.
     // or, you can remove all expanded children keys.
     this.setState({
         expandedKeys,
         autoExpandParent: false,
     });
 }
  onCheck = (checkedKeys, e) => {
      console.log('onCheck', checkedKeys, e.node);
      this.setState({ checkedKeys });
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
          return <TreeNode {...item} key={item.key} />;
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
      } = this.props;
      const {
          getFieldDecorator,
      } = form;
      const data = this.props.list;
      const treeDatas = [{
          title: '系统管理',
          key: 'M_system',
          children: treeConvert({
              pId: 'pid',
              rootId: 'M_system',
              id: 'id', // 原始数据Id
              name: 'name',
              tId: 'key',
              tName: 'title',
          }, data),
      }, {
          title: '应用管理',
          key: 'M_application',
          children: treeConvert({
              pId: 'pid',
              rootId: 'M_application',
              id: 'id', // 原始数据Id
              name: 'name',
              tId: 'key',
              tName: 'title',
          }, data),
      }, {
          title: '决策引擎',
          key: 'M_policy',
          children: treeConvert({
              pId: 'pid',
              rootId: 'M_policy',
              id: 'id', // 原始数据Id
              name: 'name',
              tId: 'key',
              tName: 'title',
          }, data),
      }, {
          title: '策略沙箱',
          key: 'M_sandboxie',
          children: treeConvert({
              pId: 'pid',
              rootId: 'M_sandboxie',
              id: 'id', // 原始数据Id
              name: 'name',
              tId: 'key',
              tName: 'title',
          }, data),
      }, {
          title: '黑白名单',
          key: 'M_blackAndWhite',
          children: treeConvert({
              pId: 'pid',
              rootId: 'M_blackAndWhite',
              id: 'id', // 原始数据Id
              name: 'name',
              tId: 'key',
              tName: 'title',
          }, data),
      }];
      // const system = treeConvert({
      //     pId: 'pid',
      //     rootId: 'M_system',
      //     id: 'id', // 原始数据Id
      //     name: 'name',
      //     tId: 'key',
      //     tName: 'title',
      // }, data);
      return (
          <Layout className={style.container}>
              <Form layout="vertical" onSubmit={this.onQuery}>
                  <FormItem label="角色类型" {...formItemLayout}>
                      {
                          getFieldDecorator('type')(<Select><Option value="公司内">公司内</Option><Option value="公司外">公司外</Option></Select>)
                      }
                  </FormItem>
                  <FormItem label="角色名称" {...formItemLayout}>
                      {
                          getFieldDecorator('roleName')(<Input />)
                      }
                  </FormItem>
                  <FormItem label="角色权限" {...formItemLayout}>
                      {
                          getFieldDecorator('menuId')(<Tree
                              checkable
                              onExpand={this.onExpand}
                              expandedKeys={this.state.expandedKeys}
                              autoExpandParent={this.state.autoExpandParent}
                              onCheck={this.onCheck}
                              checkedKeys={this.state.checkedKeys}
                              onSelect={this.onSelect}
                              selectedKeys={this.state.selectedKeys}
                          >{this.renderTreeNodes(treeDatas)}
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

const mapStateToProps = (state) => ({
    list: state.tree.list,
    sysId: state.tree.sysId,
    loading: state.loading.models.tree,
});
export default connect(mapStateToProps)(Form.create()(CSSModules(AddRole)));
