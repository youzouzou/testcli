#! /usr/bin/env node
console.log('hello test-cli')

const download = require('download-git-repo');

const inquirer = require("inquirer");

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
            message: "请选择源码",
            choices: ["vue-element-admin", "api-easy-mock"],
        }
    ])
    .then((res) => {
        console.log(res);
        const { project, source } = res;
        if (source === "vue-element-admin") {
            download('direct:https://gitee.com/panjiachen/vue-element-admin.git', project, { clone: true }, function (err) {
                console.log(err ? 'vue-element-admin下载失败' : 'vue-element-admin下载成功')
            })
        } else if (source === "api-easy-mock") {
            download('github:https://github.com:youzouzou/api-easy-mock#main', project, { clone: true }, function (err) {
                console.log(err ? 'api-easy-mock下载失败' : 'api-easy-mock下载成功')
            })
        }
    });