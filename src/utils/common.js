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
    case 'apps':
        if (path[2] === '0') key.push('app');
        else key.push('app');
        break;
    case 'strategy':
        if (path[2] === '0') key.push('policy');
        else key.push('policy');
        break;
    case 'strategies':
        if (path[2] === '0') key.push('sandboxie');
        else key.push('sandboxie');
        break;
    case 'experiment':
        if (path[2] === '0') key.push('sandboxie');
        else key.push('sandboxie');
        break;
    case 'regular':
        if (path[2] === '0') key.push('policy');
        else key.push('policy');
        break;
    default:
        key.push(router);
    }
    return key;
};

// abtd表格勾选框操作
export const rowSelect = {
    onSelect(attributes, record, selected) {
        const selectedRows = [...attributes.selectedRows];
        const selectedRowKeys = [...attributes.selectedRowKeys];
        const { key = 'id' } = attributes;

        if (selected) {
            selectedRows.push(record);
            selectedRowKeys.push(record[key]);
        } else {
            selectedRows.some((item, index) => {
                if (item[key] === record[key]) {
                    selectedRows.splice(index, 1);
                    return true;
                }
                return false;
            });

            selectedRowKeys.some((value, index) => {
                if (value === record[key]) {
                    selectedRowKeys.splice(index, 1);
                    return true;
                }
                return false;
            });
        }

        return {
            selectedRows,
            selectedRowKeys,
        };
    },
    onSelectAll(attributes, selected, changeRows) {
        const selectedRows = [...attributes.selectedRows];
        const selectedRowKeys = [...attributes.selectedRowKeys];
        const { key = 'id' } = attributes;

        if (selected) {
            changeRows.forEach((item) => {
                selectedRows.push(item);
                selectedRowKeys.push(item[key]);
            });
        } else {
            changeRows.forEach((item) => {
                for (let i = selectedRows.length; i--;) {
                    if (item[key] === selectedRows[i][key]) {
                        selectedRows.splice(i, 1);
                        selectedRowKeys.splice(i, 1);
                        break;
                    }
                }
            });
        }

        return {
            selectedRows,
            selectedRowKeys,
        };
    },
    onDelete(attributes, keyValue) {
        const selectedRows = [...attributes.selectedRows];
        const selectedRowKeys = [...attributes.selectedRowKeys];
        const { key = 'id' } = attributes;

        selectedRows.some((item, index) => {
            if (item[key] === keyValue) {
                selectedRows.splice(index, 1);
                return true;
            }
            return false;
        });

        selectedRowKeys.some((value, index) => {
            if (value === keyValue) {
                selectedRowKeys.splice(index, 1);
                return true;
            }
            return false;
        });

        return {
            selectedRows,
            selectedRowKeys,
        };
    },
};
