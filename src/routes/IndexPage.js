import React from 'react';
import CSSModules from 'react-css-modules';
import styles from './IndexPage.css';
import welcome from '../assets/images/欢迎页面.svg';
import smile from '../assets/images/笑脸.svg';

class IndexPage extends React.PureComponent {
    render() {
        return (
            <section styleName="welcome">
                <img src={welcome} alt="welcome" styleName="bigImg" />
                <div>
                    <img src={smile} alt="smile" styleName="smallImg" />
                    <p styleName="texts">
                        <span styleName="top">Welcome back</span>
                        <span styleName="bottom">欢迎使用机蜜PLD风控系统</span>
                    </p>
                </div>
            </section>
        );
    }
}

export default CSSModules(IndexPage, styles, { allowMultiple: true });
