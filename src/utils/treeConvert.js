/**
 * 树对象数据操作
 *
 * @author  WeiJun_Xiang <xiangweijun@jimistore.com>
 * @date    2018/04/15
 */

/**
 * 树对象数据结构转换
 *
 * @param  {object} attributes 配置参数
 * @param  {array} source 原始数据-有层级关系的数组
 * @return {array} treeData 树对象数据结构数组
 */
export default function (attributes = {}, source = []) {
    const {
        rootId, // 根节点Id
        pId, // 原始数据父Id
        id = 'id', // 原始数据Id
        name = 'name', // 原始数据名称
        tId = 'id', // 树节点Id
        tName = 'name', // 树节点名称
        otherKeys = [], // 其他属性
    } = attributes;
    const restData = [...source]; // 原始数据
    const treeData = []; // 树对象数据结构数组

    // 根节点解析
    for (let i = 0, iLen = restData.length; i < iLen; i++) {
        if (restData[i][pId] === rootId) {
            const node = {
                [tId]: restData[i][id],
                [tName]: restData[i][name],
            };
            otherKeys.forEach((key) => {
                Object.assign(node, {
                    [key]: restData[i][key],
                });
            });
            treeData.push(node);
            restData.splice(i, 1);
            iLen -= 1;
            i -= 1;
        }
    }

    // 子节点解析
    const pickChild = (node) => {
        if (restData.length !== 0) {
            for (let i = 0, iLen = node.length; i < iLen; i++) {
                for (let j = 0, jLen = restData.length; j < jLen; j++) {
                    if (node[i][tId] === restData[j][pId]) {
                        if (!node[i].children) {
                            Object.assign(node[i], {
                                children: [],
                            });
                        }
                        const child = {
                            [tId]: restData[j][id],
                            [tName]: restData[j][name],
                        };
                        otherKeys.forEach((key) => {
                            Object.assign(child, {
                                [key]: restData[j][key],
                            });
                        });
                        node[i].children.push(child);
                        restData.splice(j, 1);
                        jLen -= 1;
                        j -= 1;
                    }
                }
                if (node[i].children) pickChild(node[i].children);
            }
        }
    };

    pickChild(treeData);

    return treeData;
}

/**
 * 树对象数据提取
 *
 * @param  {array} treeData 原数树对象数据
 * @param  {array} values 原始值
 * @return {object} attributes 配置参数
 * @return {array} newValues 提取的数据
 */
export function treePick(treeData = [], values = [], attributes = {}) {
    const {
        from = 'id', // 原始数据key
        to = 'name', // 提取数据key
    } = attributes;
    const newValues = [];
    const pick = (source = [], index = 0) => {
        source.some((item) => {
            if (item[from] === values[index]) {
                newValues.push(item[to]);
                if (item.children) {
                    pick(item.children, index + 1);
                }
                return true;
            }
            return false;
        });
    };

    pick(treeData);

    return newValues;
}
