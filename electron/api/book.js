module.exports = [
    {
        name: "和图书",
        url: "https://www.hetushu.com",
        search: {
            url: "https://www.hetushu.com/book/search.php?word={{key}}",
            list: ".list dd",
            charset: "utf-8",
            name: "h4 a",
            href: "h4 a",
            author: "h4 span",
            intro: ".intro",
            cover: "img"
        },
        chapter: {
            list: "#dir dd",
            charset: "utf-8",
            href: "a",
            title: "a"
        },
        content: {
            list: "#content div",
            text: ""
        }
    }
]