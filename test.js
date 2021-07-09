#! /usr/bin/env node
const figlet = require('figlet');
figlet('My CLI!', {horizontalLayout:"full"}, function(err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data)
    ask()
});

const inquirer = require("inquirer");
const Git = require("nodegit");
const process = require('child_process');

/** 克隆远程仓库代码 */
const gitClone = (url, path, cb)=>{
    console.log("正在下载远程仓库代码...")
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
        if(error){
            console.log(error);
        }
        if(stdout){
            console.log(stdout);
        }
        if(stderr){
            console.log(stderr);
        }
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
            name: "source",
            message: "请选择模板",
            choices: ["vue", "react"],
        }
    ])
    .then((res) => {
        console.log(res);
        const { project, source } = res;
        if (source === "vue") {
            gitClone("https://github.com/vuejs/vue.git", project, (isSuccess)=>{
                if(isSuccess){
                    install(project)
                }
            })
        } else if (source === "react") {
            gitClone("https://github.com/facebook/react.git", project, (isSuccess)=>{
                if(isSuccess){
                    install(project)
                }
            })
        }
    });
}

