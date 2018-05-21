import React from 'react';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Layout } from 'antd';
import Start from './Start';
import Select from './Select';
import style from '../index.scss';


class StartExper extends React.PureComponent {
    static propTypes ={
        dispatch: PropTypes.func.isRequired,
        loading: PropTypes.bool.isRequired,
        list: PropTypes.object.isRequired,
    };
    state = {
        orderTimes: -1,
        orderTimee: -1,
        values: {},
    }
    handleValue = (values) => {
        this.setState({ values });
    }
    render() {
        return (
            <Layout className={style.container}>
                <Select
                    handleValue={(value) => this.handleValue(value)}
                    {...this.props}
                />
                {
                    this.props.list.total && this.state.orderTimes && this.state.orderTimee &&
                        <Start
                            total={this.props.list.total}
                            values={this.state.values}
                            {...this.props}
                        />
                }
            </Layout>
        );
    }
}

const mapStateToProps = (state) => ({
    list: state.experiment.list,
    sysId: state.experiment.sysId,
    loading: state.loading.models.experiment,
});
export default connect(mapStateToProps)((CSSModules(StartExper)));
