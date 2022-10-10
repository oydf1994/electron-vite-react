const request = require('superagent')
require('superagent-charset')(request)
const UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1"
module.exports = {
    search: (book, value) => {
        return new Promise((resolve, reject) => {
            let url = book.search.url.replace("{{key}}", encodeURI(value))
            request.get(url).charset(book.search.charset)
                .set("User-Agent", UA)
                .buffer(true)
                .end((err, res) => {
                    if (err) reject()
                    resolve(res.text)
                })
        })

    },
    getChapter: (item) => {
        return new Promise((resolve, reject) => {
            let url = item.base + item.href
            request.get(url).charset(item.charset)
                .set("User-Agent", UA)
                .buffer(true)
                .end((err, res) => {
                    if (err) reject()
                    resolve(res.text)
                })
        })
    },
    getContent: (item) => {
        return new Promise((resolve, reject) => {
            let url = item.base + item.href
            request.get(url).charset(item.charset)
                .set("User-Agent", UA)
                .buffer(true)
                .end((err, res) => {
                    if (err) reject()
                    resolve(res.text)
                })
        })
    }
}