const { Text } = require("scenegraph");
const clipboard = require("clipboard");
const { alert, error } = require("./lib/dialogs.js");

let master = {};

/**
 * マスターデータを取得する
 */
function fetchData () {
    return new Promise((resolve, reject) => {
        if (Object.keys(master).length > 0) {
            resolve();
        }
        fetch('icons.json').then(res => res.json())
            .then(data => master = data)
            .finally(() => resolve())
    });
}

/**
 * フォントのデータを全て取得
 * @param {*} selection 
 * @param {*} documentRoot 
 */
function copyFontawesomeTag (selection, documentRoot) {
    return fetchData().then(() => {
        for (let i = 0; i < selection.items.length; i++) {
            let item = selection.items[i]
            if (item instanceof Text) {
                const unicode = item.text.charCodeAt().toString(16);
                let target = null;
                let targetKey = '';
                const isMatch = Object.keys(master).some(key => {
                    if (master[key].unicode == unicode) {
                        targetKey = key;
                        target = master[key];
                        return true;
                    } else {
                        return false;
                    }
                });
                if (isMatch) {
                    const tag = `<i class="fa${target.styles[0].charAt(0)} fa-${targetKey}"></i>`;
                    clipboard.copyText(tag);
                    alert('Copy fontawesome tag', 'Fontawesomeのタグをコピーしました!');
                } else {
                    console.log('見つかりませんでした');
                    error('Copy fontawesome tag', 'コピーに失敗しました! 該当のアイコンが見つかりませんでした。')
                }
            } else {
                error('Copy fontawesome tag', 'コピーに失敗しました! テキストを選択してください。')
            }
        }
    })
}


module.exports = {
    commands: {
        copyFontawesomeTag: copyFontawesomeTag
    }
}