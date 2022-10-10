const api = require('./app')
const cheerio = require('cheerio')
const book = require('./book')
var item = {
    base: 'https://www.hetushu.com',
    source: '和图书',
    name: '重来1992',
    author: '/ 初雨彩虹 /',
    intro: '新一轮创业潮正式开启。曾经只想要家人过得好一点，此时想着让我们的时代提前降临。从卤肉摊到食品工业，从农机厂到世界级工业企业，补短板强优势，只为心中梦！',
    cover: '/book/cover.pic/cover_6356.jpg',
    href: '/book/6356/index.html'
}
// book.forEach(i => {
//     api.search(i, "1").then(res => {
//         const $ = cheerio.load(res);
//         let list = []
//         $(i.search.list).each(function () {
//             list.push({
//                 base: i.url,
//                 source: i.name,
//                 name: $(this).find($(i.search.name)).text(),
//                 author: $(this).find($(i.search.author)).text(),
//                 intro: $(this).find($(i.search.intro)).text(),
//                 cover: $(this).find($(i.search.cover)).attr('src'),
//                 href: $(this).find($(i.search.href)).attr('href')
//             })
//         })
//         console.log(list)
//     })
// })
// api.getChapter(item).then((res) => {
//     const $ = cheerio.load(res);
//     let a = book.find(i => i.url == item.base)
//     let list = []
//     $(a.chapter.list).each(function () {
//         list.push({
//             base: a.url,
//             title: $(this).find($(a.chapter.title)).text(),
//             href: $(this).find($(a.chapter.href)).attr('href')
//         })
//     })
//     console.log(list)
// })
var cc = {
    base: 'https://www.hetushu.com',
    title: '第0002章 自己给自己压岁钱',
    href: '/book/6356/4671224.html'
}
api.getContent(cc).then(res => {
    const $ = cheerio.load(res);
    let a = book.find(i => i.url == item.base)
    let list = []
    $(a.content.list).each(function () {
        let value = $(this).text()
        if (value) {
            list.push(value)
        }
    })
    console.log(list)
})



