const redis = require('redis');
const db = redis.createClient(); //创建redis客户端实例

class Entry {
    static getRange(from, to, cb) {
        db.lrange('entries', from, to, (err, items) => {
            if (err) return cb(err);
            let entries = [];
            items.forEach(item => {
                entries.push(JSON.parse(item));
            })
            cb(null, entries);
        })
    }
    constructor(obj) {
        for (let key in obj) {
            this[key] = obj[key];
        }
    }
    save(cb) {
        const entryJSON = JSON.stringify(this);
        db.lpush(
            'entries',
            entryJSON, //将JSON字符串保存到Redis列表中
            (err) => {
                if (err) return cb(err);
                cb(null, entries);
            }
        )
    }
}
module.exports = Entry;