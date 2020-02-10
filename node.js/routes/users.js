const path = require('path');
const fs = require('fs');
const express = require('express');
const router = express.Router();


let {
    recentPositionDir,
    getFileDir,
    formatDate,
    formatDateTime,
    root_dir_name
} = require('../baseFunc')


router.get('/', function (req, res){
    res.send('users ok')
})

// 获取首页
router.get('/homePage', homePageHandler)
// 获取聊天的首页
router.get('/chatUrl', chatUrlHandler)
// 用户账号密码验证
router.post('/verifyUsers', verifyUsersHandler)
// 保存用户的位置信息
router.post('/positionInfo', positionInfoHandler)




function homePageHandler(req, res){
    var fileDirName = path.join(root_dir_name,'data', 'homePage.json');
    fs.readFile(fileDirName, function(err, content){
        if (err) {console.log(err); return}
        content = JSON.parse(content.toString())
        res.send({src: content.homePageUrl})
    })
}


function chatUrlHandler(req, res){
    var fileDirName = path.join(root_dir_name,'data', 'homePage.json');
    fs.readFile(fileDirName, function(err, content){
        if (err) {console.log(err); return}
        content = JSON.parse(content.toString())
        res.send({src: content.chatUrl})
    })
}


function verifyUsersHandler(req, res){
    var {account, password} = req.body
    var fileDirName = path.join(root_dir_name,'data', './users.json');
    fs.readFile(fileDirName, (err, content) => {
        if (err) {console.log(err); return}
        var allUserList = JSON.parse(content.toString())
        
        function verifyUsers(account, password){
            for (let d of allUserList) {
                if (d.account == account && d.password == password) return true;
            }
            return false;
        }

        if (verifyUsers(account, password)) {
            res.send({loginResult:true})
        } else {
            res.send({loginResult:false})
        }

    })

    
}






// 保存所有用户最近的位置信息
function recent(arr_item){
    // 服务器最多保存100条信息
    var max_content = 100
    var fileDirName = recentPositionDir
    

    arr_item = JSON.parse(arr_item)

    if (fs.existsSync(fileDirName)) {
        // console.log('文件已存在');
        fs.readFile(fileDirName, function (err, content) {
            if (err) {console.log("err: ", err);return;}

            content = content.toString();
            if (content.trim() === '') {
                content = '[]'
            }
            content = JSON.parse(content)
            // console.log(content);
            

            content.push(arr_item)

            if (content.length > max_content) {
                content = content.slice(-max_content)
            }

            fs.writeFile(fileDirName, JSON.stringify(content), function (err) {
                if (err) {console.log("err: ", err);return;}
            })
        })
    } else {
        // console.log('文件不存在');
        fs.writeFile(fileDirName, JSON.stringify([]), function (err) {
            if (err) {console.log("err: ", err);return;}
        })
    }


}




// 保存所有用户所有的位置信息,每天的位置信息保存为一个日期命名的json文件
function positionInfoHandler (req, res) {
    var positionData = req.body;
    var userName = positionData.userName
    console.log("userName: ", userName);

    // 添加时间信息
    positionData.time = formatDateTime( new Date() )
    // positionData.timestamp = new Date().getTime()


    // 保存最近所有用户的位置信息, JSON.stringify是为了深拷贝,和原对象脱离关系
    recent(JSON.stringify(positionData))


    // 后面可以不需要保存用户名, 可以删除userName
    // Reflect.deleteProperty(positionData, 'userName')


    var fileDirName = getFileDir()
    // console.log("fileDirName: ", fileDirName);

    if (fs.existsSync(fileDirName)) {
        // console.log('文件已存在');
        writeData();
    } else {
        // console.log('文件不存在');
        fs.writeFile(fileDirName, JSON.stringify({}), function (err) {
            if (err) {console.log("err: ", err);return;}
            writeData()
        })
    }

    // 按用户名保存位置信息
    function writeData(){
        fs.readFile(fileDirName, function (err, content) {
            if (err) {console.log("err: ", err);return;}
            content = content.toString();
            if (content.trim() === '') {
                content = '{}'
            }
            content = JSON.parse(content)

            if (!content[userName]) {
                content[userName] = []
            }

            content[userName].push(positionData)
            fs.writeFile(fileDirName, JSON.stringify(content), function (err) {
                if (err) {console.log("err: ", err);return;}
                res.send('ok')
            })
        })
    }

}

module.exports = router;
