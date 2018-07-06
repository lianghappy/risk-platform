import React from 'react';
// 引入 echarts 主模块。
import * as echarts from 'echarts/lib/echarts';
// 引入折线图。
import 'echarts/lib/chart/line';
// 引入提示框组件、标题组件、工具箱组件。
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/toolbox';

export default class Line extends React.PureComponent {
    componentDidMount() {
        const container = this.line;
        // 基于准备好的dom，初始化 echarts 实例并绘制图表。
        echarts.init(container).setOption({
            title: {
                text: '单位：人/次',
                textStyle: {
                    fontSize: '13px',
                    color: 'rgba(0, 0, 0, 0.65)',
                    lineHeight: '28px',
                },
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true,
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['邮件营销'],
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
            },
            yAxis: {
                type: 'value',
            },
            series: [{
                name: '邮件营销',
                type: 'line',
                smooth: true,
                data: [2, 3, 4, 5, 6, 7, 8]
            }]
        });
    }
    render() {
        return (
            <div style={{ width: '100%', height: '100%' }} ref={(c) => { this.line = c; }}></div>
        );
    }
}
