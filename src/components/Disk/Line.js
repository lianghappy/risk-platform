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
    state={
        datas: this.props.datas || [],
    }
    componentDidMount() {
        const container = this.line;
        const myChart = echarts.init(container);
        const Xdata = this.state.datas.length > 0 ? this.state.datas.map(item => item.sleuthTime) : [];
        const Ydata = this.state.datas.length > 0 ? this.state.datas.map(item => item.value) : [];
        // 基于准备好的dom，初始化 echarts 实例并绘制图表。
        this.setOption(myChart, Xdata, Ydata);
        window.onresize = myChart.resize;
    }
    componentWillReceiveProps(nextProps) {
        const container = this.line;
        this.setState({
            datas: nextProps.datas,
        });
        const myChart = echarts.init(container);
        const Xdata = nextProps.datas.length > 0 ? nextProps.datas[0].dataByOneHour.map(item => item.sleuthTime) : [];
        const Ydata = nextProps.datas.length > 0 ? nextProps.datas[0].dataByOneHour.map(item => item.value) : [];
        // 基于准备好的dom，初始化 echarts 实例并绘制图表。
        this.setOption(myChart, Xdata, Ydata);
    }
    setOption(myChart, Xdata, Ydata) {
        myChart.setOption({
            noDataLoadingOption:
            {
                text: '暂无数据',
                effect: 'bubble',
                effectOption:
                {
                    effect:
                    {
                        n: 0
                    }
                }
            },
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
                data: Xdata,
            },
            yAxis: {
                type: 'value',
            },
            series: [{
                name: '邮件营销',
                type: 'line',
                smooth: true,
                data: Ydata
            }]
        });
    }
    render() {
        return (
            <div style={{ width: '100%', height: '100%' }} ref={(c) => { this.line = c; }}></div>
        );
    }
}
