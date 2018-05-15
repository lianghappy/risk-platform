import React from 'react';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Layout, Input, Form, Select, Tree, Button } from 'antd';
import style from './index.scss';

const FormItem = Form.Item;
const Option = Select.Option;
const TreeNode = Tree.TreeNode;

const treeData = [{
    title: '系统管理',
    key: '0-0',
    children: [{
        title: '系统管理',
        key: '0-0-0',
        children: [
            { title: '0-0-0-0', key: '0-0-0-0' },
            { title: '0-0-0-1', key: '0-0-0-1' },
            { title: '0-0-0-2', key: '0-0-0-2' },
        ],
    }, {
        title: '应用管理',
        key: '0-0-1',
        children: [
            { title: '0-0-1-0', key: '0-0-1-0' },
            { title: '0-0-1-1', key: '0-0-1-1' },
            { title: '0-0-1-2', key: '0-0-1-2' },
        ],
    }, {
        title: '决策引擎',
        key: '0-0-2',
    }],
}, {
    title: '应用管理',
    key: '0-1',
    children: [
        { title: '0-1-0-0', key: '0-1-0-0' },
        { title: '0-1-0-1', key: '0-1-0-1' },
        { title: '0-1-0-2', key: '0-1-0-2' },
    ],
}, {
    title: '决策引擎',
    key: '0-2',
}];
class AddRole extends React.PureComponent {
    static propTypes ={
        dispatch: PropTypes.func.isRequired,
        list: PropTypes.array.isRequired,
        sysId: PropTypes.string.isRequired,
    };
    state = {
        expandedKeys: ['0-0-0', '0-0-1'],
        autoExpandParent: true,
        checkedKeys: ['0-0-0'],
        selectedKeys: [],
    }
    onQuery = () => {
        const {
            dispatch,
            sysId,
        } = this.props;
        dispatch({
            type: 'account/getAccountListSuc',
            payload: {
                sysId,
            },
        });
    };
 onExpand = (expandedKeys) => {
     // console.log('onExpand', arguments);
     // if not set autoExpandParent to false, if children expanded, parent can not collapse.
     // or, you can remove all expanded children keys.
     this.setState({
         expandedKeys,
         autoExpandParent: false,
     });
 }
  onCheck = (checkedKeys) => {
      console.log('onCheck', checkedKeys);
      this.setState({ checkedKeys });
  }
  onSelect = (selectedKeys, info) => {
      console.log('onSelect', info);
      this.setState({ selectedKeys });
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
          list: dataSource,
      } = this.props;
      console.log(dataSource);
      return (
          <Layout className={style.container}>
              <Form layout="vertical">
                  <FormItem label="角色类型" {...formItemLayout}>
                      <Select defaultValue="请选择角色类型">
                          <Option value="公司内">公司内</Option>
                          <Option value="公司外">公司外</Option>
                      </Select>
                  </FormItem>
                  <FormItem label="角色名称" {...formItemLayout}>
                      <Input placeholder="请输入角色名称" />
                  </FormItem>
                  <FormItem label="角色权限" {...formItemLayout}>
                      <Tree
                          checkable
                          onExpand={this.onExpand}
                          expandedKeys={this.state.expandedKeys}
                          autoExpandParent={this.state.autoExpandParent}
                          onCheck={this.onCheck}
                          checkedKeys={this.state.checkedKeys}
                          onSelect={this.onSelect}
                          selectedKeys={this.state.selectedKeys}
                      >
                          {this.renderTreeNodes(treeData)}
                      </Tree>
                  </FormItem>
                  <FormItem>
                      <Button type="primary" className={style.save}>保存</Button>
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
});
export default connect(mapStateToProps)(CSSModules(AddRole));
