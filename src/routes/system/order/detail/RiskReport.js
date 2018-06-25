import React from 'react';
import { Layout } from 'antd';
import styles from './index.scss';

export default class RiskReport extends React.PureComponent {
    render() {
        return (
            <Layout className={styles.riskReport}>
                <div className={styles.lists}>
                    <div className={styles.headers}>
                        <span>阶段排序：</span>
                        <span>阶段名称：</span>
                        <span>阶段模式：</span>
                        <span>阶段得分：</span>
                        <span>阶段审核结果：</span>
                    </div>
                </div>
            </Layout>
        );
    }
}
