# 电商后台管理系统

## 部署后端服务器和数据库
server目录下的vueShop-api-server

1）该目录下 npm  i 安装依赖

2）创建数据库：（数据库文件存放在db -> mysdb.sql）

3）在config -> default.json 中修改user和Password字段为自己数据库的用户名和密码

4）在vueShop-api-server中执行node ./app.js



## 运行前端项目

返回源目录

① npm i 

② npm run serve

```
登录用户名：admin 密码：123456
```



## 部署前端项目

① 源目录下

1）npm run build

2)  将生成在源目录的dist文件复制

② server文件下的vue-shop-go

1）将文件复制到该目录下

2）npm i安装依赖

2）执行node ./app.js

```
或者可以使用pm2进行管理
添加：pm2 start ./app.js --name 项目名
查看：pm2 ls
删除：pm2 delete 对应id名
```



## 联系方式

wx:czj0412 	qq:1090780023