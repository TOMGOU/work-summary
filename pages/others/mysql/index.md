# mysql
- 基本操作
- 重置密码

### 基本操作

操作              | 语句
---------------- |-------------------------------
登录              | mysql -u root -p
退出              | exit or quit
查询数据库         | show databases;
创建数据库         | create database test character set utf8 collate utf8_general_ci;
删除数据库         | drop database test;
连接数据库         | use test;
创建数据表         | CREATE TABLE IF NOT EXISTS `USER`();
查看数据表         | show tables;
删除数据表         | truncate table user;
查看表字段         | desc user;
修改表名称         | RENAME TABLE USER TO USERS;
修改表字段         | ALTER TABLE USER MODIFY COLUMN name  VARCHAR(20);
插入记录           | INSERT INTO USER (name, score) VALUES ('Tommy', 80);
查看记录           | SELECT * FROM USER WHERE name = 'Tommy';
修改记录           | UPDATE USER SET score = 100 WHERE name = 'Tommy';
删除记录           | DELETE FROM USER WHERE name = 'Tommy';
条件查询           | SELECT name, score FROM USER WHERE score > 60 ORDER BY score DESC;
按组查询           | SELECT name, AVG(score) FROM USER GROUP BY name;
连表查询           | SELECT a.name, a.score, b.position FROM USER a LEFT JOIN POSITION b ON a.name=b.name;

##### 1. 创建数据库：create database test character set utf8 collate utf8_general_ci;

> create database test：代表的是创建数据库 test。

> character set utf8：代表的是将该库的默认编码格式设置为utf8格式。

> collate utf8_general_ci：代表的是数据库校对规则。

  - utf8_bin将字符串中的每一个字符用二进制数据存储，区分大小写。

  - utf8_general_ci不区分大小写，ci为case insensitive的缩写，即大小写不敏感。

  - utf8_general_cs区分大小写，cs为case sensitive的缩写，即大小写敏感。

##### 2. 创建表格：CREATE TABLE IF NOT EXISTS `USER`(id INT UNSIGNED AUTO_INCREMENT, name VARCHAR(100) NOT NULL, score INT UNSIGNED NOT NULL, PRIMARY KEY (id));

> id INT UNSIGNED AUTO_INCREMENT：字段 id 整型自增。

> name VARCHAR(100) NOT NULL：字段 name 100长字符型。

> score INT UNSIGNED NOT NULL：字段 score 整型不为空。

> PRIMARY KEY (id)：以 id 为 primary key。

##### 3. 条件查询：SELECT name, score FROM USER WHERE name = 'Tommy' AND score > 60 ORDER BY score DESC;

> SELECT name, score FROM USER：查询字段 name, score。

> WHERE name = 'Tommy' AND score > 60：2个条件，名字为 Tommy，分数大于 60。

> ORDER BY score DESC：排序, DESC 为降序，ASC 为升序。

##### 4. 连表查询：SELECT a.name, a.score, b.position FROM USER a LEFT JOIN POSITION b ON a.name=b.name;

> SELECT a.name, a.score, b.position：查询字段，a 和 b为别名。

> FROM USER a：user 表对应别名 a。

> LEFT JOIN POSITION b：position 表对应别名 b，LEFT JOIN 表示左关联，以 a 为主表，b 为副标。

> ON a.name=b.name：关联条件为 name 相同。

##### 5. 字段类型

> 1．INT[(M)] 型： 正常大小整数类型。

> 2．DOUBLE[(M,D)] [ZEROFILL] 型： 正常大小(双精密)浮点数字类型。

> 3．DATE 日期类型：支持的范围是1000-01-01到9999-12-31。MySQL以YYYY-MM-DD格式来显示DATE值，但是允许你使用字符串或数字把值赋给DATE列。

> 4．CHAR(M) 型：定长字符串类型，当存储时，总是是用空格填满右边到指定的长度。

> 5．BLOB TEXT类型，最大长度为65535(2^16-1)个字符。

> 6．VARCHAR型：变长字符串类型。


### 重置密码
##### 1. 偏好设置中找到MySQL，关闭MySQL

##### 2. 跳过权限认证

```
// 进入数据库指令文件
cd /usr/local/mysql/bin
// 跳过权限认证
sudo ./mysqld_safe --skip-grant-tables

```

##### 3. 免密码进入数据库, 在上述指令运行后，新开一个终端，同时保持原来那个终端也开着，在新的终端输入指令如下：

```
//  执行mysql指令
/usr/local/mysql/bin/mysql
// 进入名为<mysql>的数据库
use mysql
// 刷新权限
flush privileges;
// 修改密码 但不适用于8.0+的版本
set password for 'root'@'localhost' = password('新的密码');
// 8.0+版本修改密码
alter user 'root'@'localhost' identified by '新密码';

// 退出mysql
exit
```
