import React from 'react';
import CSSModules from 'react-css-modules';
import { Layout, Menu } from 'antd';
import StartExper from './experiment/StartExperiment';
import OldExpr from './experiment/OldExpr';
import style from './index.scss';

class Exper extends React.PureComponent {
    state = {
        current: '.$new',
    }
 handleClick = (e) => {
     this.setState({
         current: e.key,
     });
 }
 render() {
     return (
         <Layout className={style.container}>
             <Menu
                 onClick={this.handleClick}
                 selectedKeys={[this.state.current]}
                 mode="horizontal"
             >
                 <Menu.Item key="new">
                        选择新样本
                 </Menu.Item>
                 <Menu.Item key="old">
                        选择已有样本
                 </Menu.Item>
             </Menu>
             {
                 this.state.current === '.$new' ?
                     <StartExper {...this.props} />
                     :
                     <OldExpr {...this.props} />
             }
         </Layout>
     );
 }
}

export default CSSModules(Exper);
