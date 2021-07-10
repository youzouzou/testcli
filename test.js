#! /usr/bin/env node
const figlet = require('figlet');
const process = require('child_process');
const inquirer = require("inquirer");
const Git = require("nodegit");
const program = require('commander');

const stores = [
    {
        name: "vue",
        url: "https://github.com/vuejs/vue.git"
    },
    {
        name: "react",
        url: "https://github.com/facebook/react.git"
    }
]

const init = ()=>{
    figlet('My CLI!', {horizontalLayout:"full"}, function(err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data)
    ask()
});
}


/** 克隆远程仓库代码 */
const gitClone = (url, path, cb)=>{
    console.log("正在下载远程仓库代码...")
    console.log(url)
    Git.Clone(url, path)
       .then(function(res) {
            console.log("下载完成")
            cb(true)
        })
        .catch(function(err) { console.log("下载失败"+err);cb(false) });
}

/** 下载 */
const install = (path)=>{
    console.log("正在安装依赖包...")
    const cmd = 'cd '+path+' && yarn';
    process.exec(cmd, function(error, stdout, stderr) {
        console.log(error);
        console.log(stdout);
        console.log(stderr);
        console.log("安装完成")
    });
}

const ask = ()=>{
    inquirer
    .prompt([
        {
            type: "input",
            name: "project",
            message: "项目名称",
        },
        {
            type: "list",
            name: "tpl",
            message: "请选择模板",
            choices: ["vue", "react"],
        }
    ])
    .then((res) => {
        console.log(res);
        const { project, tpl } = res;
        stores.forEach(item=>{
            if(item.name === tpl){
            gitClone(item.url, project, (isSuccess)=>{
                if(isSuccess){
                    install(project)
                }
            })
            }
        })
    });
}



program.version('0.0.1')
    .option("-V, --version", "查看版本号信息")
    .option("-l, --list", "查看可用模版列表");

// 查看模板列表
if (program.opts() && program.opts().list) {
    console.log();
    stores.forEach((item,index)=>{
          console.log("["+(index+1)+"] "+item.name)
    })
}

// 解析参数指令
const ps = program.parse(process.argv);
if(ps?.args && ps.args[0]){
    switch (ps.args[0]) {
        case "i":
        case "init":
            init();
            break;
        default:
            figlet('Halo', {horizontalLayout:"full"}, (err, data)=>{
                console.log(data);
                console.warn("无效指令。");
            });
    }
}else{
    init();
}
