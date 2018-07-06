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
            title: { text: 'Line Chart' },
            tooltip: {},
            toolbox: {
                feature: {
                    dataView: {},
                    saveAsImage: {
                        pixelRatio: 2
                    },
                    restore: {}
                }
            },
            xAxis: {},
            yAxis: {},
            series: [{
                type: 'line',
                smooth: true,
                data: [[12, 5], [24, 20], [36, 36], [48, 10], [60, 10], [72, 20]]
            }]
        });
    }
    render() {
        return (
            <div style={{ width: '100%', height: '100%' }} ref={(c) => { this.line = c; }}></div>
        );
    }
}
