# 云服务器相关操作（CentOS）

- ssh
- 云服务器安装mysql
- 云服务器安装nodejs + pm2
- nginx 配置

### ssh
```
// 远程登录云服务器
ssh root@106.54.87.199
// 批量远程上传文件夹
scp -r ~/demo root@106.54.87.199:/data/www
// 批量远程上传文件夹下面的所有文件和文件夹
scp -r ./_book/* root@106.54.87.199:/data/www/gitbook/summary
// 批量远程下载文件夹
scp -r root@106.54.87.199:/data/www/gitbook/share/_book ./Desktop/test
// 批量远程下载文件夹
scp -r root@106.54.87.199:/data/www/gitbook/share/_book/* ./Desktop/test
// 远程云服务器重装系统，删除known_hosts记录
vim ~/.ssh/known_hosts
```
### 云服务器安装mysql

###### 1. 从MySQL社区Yum Repository下载所需MySQL版本的RPM

```
wget https://dev.mysql.com/get/mysql57-community-release-el7-9.noarch.rpm
```

###### 2. 安装RPM软件包

```
rpm -ivh mysql57-community-release-el7-9.noarch.rpm
```

###### 3. 开始安装MySQL

```
yum install mysql-server
```

###### 4. 启动MySQL，并验证是否已启动

```
# systemctl start mysqld
# systemctl status mysqld
```

###### 5. 获取默认的root密码

```
grep 'temporary password' /var/log/mysqld.log
```

###### 6. 获取默认密码后，运行MySQL安全脚本

```
mysql_secure_installation
```

###### 7. 测试MySQL服务

```
mysqladmin -u root -p version
```

###### 8. 修改密码

```
// 1. 先登录
mysql -u root -p

// 2. 降低密码强度
set global validate_password_policy=LOW;
set global validate_password_length=6;

// 3. 设置新密码
set password for root@localhost = password('tomgou');
```

###### 9. 本地Mysql Workbench远程连接云服务器中的MySQL

```
// 让用户从任何主机连接到mysql服务器
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY 'tomgou' WITH GRANT OPTION;
FLUSH PRIVILEGES;

// 允许用户从ip为118.184.1.3的主机连接到mysql服务器
GRANT ALL PRIVILEGES ON *.* TO 'root'@'118.184.1.3' IDENTIFIED BY 'tomgou' WITH GRANT OPTION;
FLUSH PRIVILEGES;
```

### 云服务器安装nodejs + pm2

###### 1. 新建安装目录

```
cd / && mkdir app && cd app
```

###### 2. 下载node压缩包

```
wget https://npm.taobao.org/mirrors/node/v8.9.3/node-v8.9.3-linux-x64.tar.xz
```

###### 3. 解压并重命名

```
tar -xvf node-v8.9.3-linux-x64.tar.xz
mv node-v8.9.3-linux-x64 nodejs
```

###### 4. 建立node全局链接

```
ln -s /app/nodejs/bin/npm /usr/local/bin/
ln -s /app/nodejs/bin/node /usr/local/bin/
```

###### 5. 检查node是否生效

```
node -v
```

###### 6. 安装pm2

```
npm install -g pm2
```

###### 7. 建立pm2全局链接

```
ln -s /app/nodejs/bin/pm2 /usr/local/bin/pm2
```

###### 8. pm2 守护node进程

```
cd /data/www/think/demo
pm2 list 
pm2 start production.js
pm2 stop production.js
pm2 delete production.js
pm2 reload all
pm2 delete 0   
```

### 云服务器安装nginx

###### 1. gcc 安装

```
rpm -qa|grep gcc
```

###### 2. PCRE pcre-devel 安装

```
yum install gcc-c++
```

###### 3. zlib 安装

```
yum install -y pcre pcre-devel
```

###### 4. OpenSSL 安装

```
yum install -y openssl openssl-devel
```

###### 5. wget 命令下载安装包

```
wget -c https://nginx.org/download/nginx-1.10.1.tar.gz
```

###### 6. 解压安装包

```
tar -zxvf nginx-1.10.1.tar.gz
mv nginx-1.10.1 nginx
cd nginx
./configure
```

###### 7. 编译安装

```
make
make install
// 查找安装路径
whereis nginx
```

###### 8. 修改nginx路由
```
location / {
  root   /data/www/gitbook/_book;
  index  index.html index.htm;
}
```

###### 9. 启动、停止nginx

```
cd /usr/local/nginx/sbin/
./nginx 
./nginx -s stop
./nginx -s quit
./nginx -s reload
```

### 常用命令

###### 1. curl(client + URL)

```JS
// -v参数输出通信的整个过程，用于调试。
curl -v http://127.0.0.1:80

// --trace参数也可以用于调试，还会输出原始的二进制数据。
curl --trace - http://127.0.0.1:80
```

###### 2. chmod 修改权限

```js
// 修改权限
chmod -R 777 /usr

// 查看权限
ls -l index.js

// 删除文件
rm -rf *
```

###### 2. which 查看安装目录

```js
which vue
```
