import React from 'react';
// 引入 echarts 主模块。
import * as echarts from 'echarts/dist/echarts';
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
        const sleuthTargetName = this.state.datas && this.state.datas.length > 0 ? this.state.datas[0].sleuthTargetName : '';
        let DW = '万分位';
        if (this.state.datas && this.state.datas.length > 0) {
            DW = this.state.datas[0].sleuthTargetId === '1' || this.state.datas[0].sleuthTargetId === '5' ? '数量' : '万分位';
        }
        // 基于准备好的dom，初始化 echarts 实例并绘制图表。
        this.setOption(myChart, Xdata, Ydata, sleuthTargetName, DW);
        window.onresize = myChart.resize;
    }
    componentWillReceiveProps(nextProps) {
        const container = this.line;
        this.setState({
            datas: nextProps.datas,
        });

        const myChart = echarts.init(container);
        const Xdata = nextProps.datas && nextProps.datas.length > 0 ? nextProps.datas.map(item => item.sleuthTime) : [];
        const Ydata = nextProps.datas && nextProps.datas.length > 0 ? nextProps.datas.map(item => item.value) : [];
        const sleuthTargetName = nextProps.datas && nextProps.datas.length > 0 ? nextProps.datas[0].sleuthTargetName : '';
        let DW = '万分位';
        if (nextProps.datas && nextProps.datas.length > 0) {
            DW = nextProps.datas[0].sleuthTargetId === '1' || nextProps.datas[0].sleuthTargetId === '5' ? '数量' : '万分位';
        }
        // 基于准备好的dom，初始化 echarts 实例并绘制图表。
        this.setOption(myChart, Xdata, Ydata, sleuthTargetName, DW);

        window.onresize = myChart.resize;
    }
    setOption(myChart, Xdata, Ydata, sleuthTargetName, DW) {
        myChart.setOption({
            title: {
                text: `单位：${DW}`,
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
                data: [sleuthTargetName],
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: Xdata,
            },
            yAxis: {
                type: 'value',
            },
            dataZoom: [
                {
                    type: 'inside',
                    start: 0,
                    end: 10,
                    show: true,
                    xAxisIndex: [0],
                }, {
                    start: 0,
                    end: 10,
                    handleSize: '80%',
                    handleStyle: {
                        color: '#fff',
                        shadowBlur: 3,
                        shadowColor: 'rgba(0, 0, 0, 0.6)',
                        shadowOffsetX: 2,
                        shadowOffsetY: 2
                    },
                }
            ],
            series: [{
                name: sleuthTargetName,
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
