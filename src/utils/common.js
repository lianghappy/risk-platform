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
