function parseField(field) { //解析entry[name]符号
    return field.split(/\[|\]/).filter((s) => s);
}

function getField(req, field) { //基于parseField()的结果查找属性
    let val = req.body;
    field.forEach(prop => {
        val = val[prop]
    });
    return val;
}
exports.required = (field) => {
    field = parseField(field);
    return (req, res, next) => {
        if (getField(req, field)) {
            next(); //如果有，进入下一个中间件
        } else {
            //如果没有，显示错误
            req.error(`${field.join('  ')} is required`);
            res.redirect('back');
        }
    }
}
exports.lengthAbove = (field, len) => {
    return (req, res, next) => {
        if (getField(req, field).length > len) {
            next();
        } else {
            const fields = field.join(' ');
            res.error(`${fields} must have more than ${len} charactors`);
            res.redirect('back');
        }
    }
}