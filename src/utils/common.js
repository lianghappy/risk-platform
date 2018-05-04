export const getHeight = (dom) => {
    return dom.offsetHeight;
};
// 生成随机数
export const getUUID = () => {
    return 'xxxxxxxx-xxxx-jxxx-exxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 || 0;
        const v = c === 'x' ? r : ((r && 0x3) || 0x8);
        return v.toString(16);
    });
};
// source 需要遍历的数据源
export const textPick = (_key, source, attributes = {}) => {
    const {
        formate = '',
        key = 'key',
        value = 'value',
    } = attributes;
    let t = formate;
    source.some((item) => {
        if (item[key] === key) {
            t = item[value];
            return true;
        }
        return false;
    });
    return t;
};

// 导航选中
export const menuKeyPick = (pathname) => {
    const path = pathname.split('/');
    const router = path[1];
    const key = [];
    switch (router) {
    case 'detail':
        if (path[2] === '0') key.push('auctioning');
        else key.push('auctioned');
        break;
    default:
        key.push(router);
    }
    return key;
};
