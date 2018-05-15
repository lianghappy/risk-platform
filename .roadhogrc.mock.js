const mock = require('mockjs').mock;

const resultSuc = {
    code: '200',
    data: '成功',
};

export default {
    'POST /api/risk/manager/policy/norm/list/v1': (req, res) => {
        res.send(mock({
            code: '200',
            'data|10': [{
                'id|11': /[0-9a-zA-Z]/,
                'ruleId|11': /[0-9a-zA-Z]/,
                'name|6-12': '',
                'categoryId|11': /[0-9a-zA-Z]/,
                'categoryName|6-12': '',
                'code|6-12': '',
                'channel|1': ['索伦', '同盾'],
                'valueType|2-5': '',
                'judgeKey|1-2': /[1-9]/,
                'compareSymbol|1': ['<', '>', '=', '<=', '>=', '<>'],
                'judgeValue|1-2': /[1-9]/,
                'weight|1-2': /[1-9]/,
                'score|1-2': /[1-9]/,
                'stageId|11': /[0-9a-zA-Z]/,
            }],
        }));
    },
    'POST /api/risk/manager/policy/norm/delete/v1': (req, res) => {
        res.send(resultSuc);
    },
    'POST /api/risk/manager/policy/norm/create/v1': (req, res) => {
        setTimeout(() => {
            res.send(resultSuc);
        }, 5000);
    },
    'POST /api/risk/manager/policy/norm/update/v1': (req, res) => {
        setTimeout(() => {
            res.send(resultSuc);
        }, 5000);
    },
    'POST /api/risk/manager/policy/norm/clone/v1': (req, res) => {
        res.send(resultSuc);
    },
};
