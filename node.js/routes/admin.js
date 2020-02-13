/**
 * 管理员读取位置信息
 * @type {createApplication}
 * 最后修改时间: 2020年2月8日02:35:52
 */

const fs = require('fs');
const path = require('path');

let {
    recentPositionDir,
    getFileDir,
    formatDate,
    formatDateTime,
    root_dir_name
} = require('../baseFunc')


const express = require('express');
const router = express.Router();


const adminInfo = {
    account:'zp***', // 账号现在没什么用
    password:'zp******'
}


// 管理员账号密码验证
router.post('/verifyAdmin', function (req, res){
    var {account, password} = req.body
    console.log(account, password);
    
    
    function verifyAdmin(account, password){
        if (adminInfo.account === account && adminInfo.password === password) return true;
        return false;
    }

    if (verifyAdmin(account, password)) {
        res.send({loginResult:true})
    } else {
        res.send({loginResult:false})
    }
})


router.get('/', function (req, res){
    res.send('admin ok')
})



// 改变首页
router.post('/changeHomePage', function (req, res){
    const {src} = req.body
    
    var fileDirName = path.join(root_dir_name,'data','homePage.json');
    
    fs.readFile(fileDirName, function (err, content) {
        if (err) {console.log("err: ", err);return;}
        content = JSON.parse(content.toString())
        content.homePage = src
        
        fs.writeFile(fileDirName, JSON.stringify(content), function(err){
	        if (err) {console.log("err: ", err);return;}
	        res.send('ok changeHomePage')
	    })
    })
    

})




// 管理员按userName和date读数据
router.post('/positionInfo', function (req, res) {
    // console.log(req.body);

    var pwd = req.body.password
    if (!pwdVerify(pwd)) {
        return;
    }

    var userName = req.body.userName
    var date = req.body.date
    var fileDirName = getFileDir(date);
    console.log("fileDirName: ", fileDirName);

    if (fs.existsSync(fileDirName)) {
        fs.readFile(fileDirName, function (err, content) {
            if (err) {console.log("err: ", err);return;}
            content = JSON.parse(content.toString())
            res.send(content[userName])
        })
    } else {
        res.send('文件路径不存在')
    }
})



// 管理员读最近的位置数据
router.post('/recentPositionInfo', function (req, res) {
    console.log(req.body);
    var pwd = req.body.password
    if (!pwdVerify(pwd)) {
        return;
    }
    var pageNumber = req.body.pageNumber
    var pageSize = req.body.pageSize



    var fileDirName = recentPositionDir
    // console.log("fileDirName: ", fileDirName);

    if (fs.existsSync(fileDirName)) {
        fs.readFile(fileDirName, function (err, content) {
            if (err) {console.log("err: ", err);return;}
            content = content.toString()


            res.send(JSON.parse(content))
        })
    } else {
        res.send('文件路径不存在')
    }

})


// 管理员按日期获取当天的用户名
router.post('/allUserName', function (req, res) {
    var pwd = req.body.password
    if (!pwdVerify(pwd)) {
        return;
    }

    var date = req.body.date
    var fileDirName = getFileDir(date);

    if (fs.existsSync(fileDirName)) {
        fs.readFile(fileDirName, function (err, content) {
            if (err) {console.log("err: ", err);return;}
            content = JSON.parse(content.toString())

            var allUserName = []
            for(let d in content) {
                allUserName.push(d)
            }

            res.send(allUserName)
        })
    } else {
        res.send('文件路径不存在')
    }
})


// 管理员获取当天的整个位置文件
router.post('/getJsonFile', function (req, res) {
    var pwd = req.body.password
    if (!pwdVerify(pwd)) {
        return;
    }

    var date = req.body.date
    var fileDirName = getFileDir(date);

    if (fs.existsSync(fileDirName)) {
        res.sendFile(fileDirName)
    } else {
        res.send('文件路径不存在')
    }
})


// 每一次请求都要验证密码
function pwdVerify(pwd){
    if (pwd === adminInfo.password) return true ;
    return false;
}



module.exports = router;

