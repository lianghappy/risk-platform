/**
 * @author  WeiJun_Xiang <xiangweijun@jimistore.com>
 * @date    2018/04/15
 *
 *
 * 树对象数据结构转换
 *
 * @param  {object} attributes
 * @param  {array} data
 * @return {array} 树对象数据结构数组
 */

export default function (attributes, data = []) {
    const {
        pId, // 原始数据父Id
        rootId = null, // 根Id
        id = 'id', // 原始数据Id
        name = 'name', // 原始数据名称
        tId = 'id', // 树节点Id
        tName = 'name', // 树节点名称
    } = attributes;
    const restData = [...data]; // 原始数据
    const treeData = []; // 树对象数据结构数组

    // 根节点解析
    for (let i = 0, iLen = restData.length; i < iLen; i++) {
        if (restData[i][pId] === rootId) {
            treeData.push({
                [tId]: restData[i][id],
                [tName]: restData[i][name],
            });
            restData.splice(i, 1);
            iLen -= 1;
            i -= 1;
        }
    }

    pickChild(treeData);

    // 子节点解析
    function pickChild(node) {
        if (restData.length !== 0) {
            for (let i = 0, iLen = node.length; i < iLen; i++) {
                for (let j = 0, jLen = restData.length; j < jLen; j++) {
                    if (node[i][tId] === restData[j][pId]) {
                        if (!node[i].children) node[i].children = [];
                        node[i].children.push({
                            [tId]: restData[j][id],
                            [tName]: restData[j][name],
                        });
                        restData.splice(j, 1);
                        jLen -= 1;
                        j -= 1;
                    }
                }
                if (node[i].children) pickChild(node[i].children);
            }
        }
    }

    return treeData;
}
