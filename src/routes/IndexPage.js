import React from 'react';
import CSSModules from 'react-css-modules';
import styles from './IndexPage.css';

class IndexPage extends React.PureComponent {
    render() {
        return (
            <section styleName="welcome">
                <div className={styles.lists}>
                    <h2>• V 2.2  （2018年8月7日）</h2>
                    <div className={styles.content}>
                        <p>1.  完善管理中心：新增订单管理，可以查看订单的基本信息、风控报告等信息。</p>
                        <p>2. 新增报警中心：报警规则、报警收件人等。</p>
                        <p>3. 新增监控中心：监控大盘、报警历史。</p>
                        <p>4. 优化实验中心：优化策略沙箱等。</p>
                    </div>
                </div>
                <div className={styles.lists}>
                    <h2>• V 2.1  （2018年7月10日）</h2>
                    <div className={styles.content}>
                        <p>1.  新增决策引擎：策略管理、类别管理、规则库管理</p>
                        <p>2.  新增策略沙箱：实验样本、实验记录、沙箱样本</p>
                        <p>3.  新增应用中心：应用管理 </p>
                        <p>4.  新增系统管理：账号管理、角色管理、权限管理</p>
                        <p>5.  新增黑白名单：黑名单、白名单、灰名单</p>
                    </div>
                </div>
            </section>
        );
    }
}

export default CSSModules(IndexPage, styles, { allowMultiple: true });
