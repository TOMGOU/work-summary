# docker

## docker常用命令

```
docker pull
docker push
docker images
docker run -d -p 8080:80 nginx
docker exec -it 92 bash
docker ps
docker rm -f 92
docker commit 92 tomgou
docker tag image username/repository:tag
docker push username/repository:tag
docker run -d -p 8080:80 username/repository:tag
docker build -t tomgou .
echo hello > index.html
cat index.html

vim dockerfile
// vim编辑dockerfile

mkdir page
// 创建page文件夹

touch index.js
// 创建index.js文件

rm index.js
删除index.js文件

rm -r page
// 删除page文件夹

mv ~/Downloads/geckodriver  /usr/local/bin/
// 将geckodriver文件从~/Downloads/移到/usr/local/bin/

pbcopy < ~/Downloads/geckodriver
// 复制geckodriver文件

pbpaste > /usr/local/bin/
// 粘贴到/usr/local/bin/

chmod u+x,g+x,o+x geckodriver
// u：所有者; g：所属组; o：其他人 a：所有人; 
// +：为用户增加权限; -：为用户减少权限; =：为用户赋予权限;
// r：读权限; w：写权限; x：执行权限;

ls -l geckodriver
// 查看geckodriver文件的权限信息
```

### Dockerfile

```
FROM: 基础镜像
RUN：让它干啥（命令加上RUN）
WORKDIR：当前工作目录
EXPOSE：打开的端口
ADD：加点文件，会自动解压
VOLUME：目录挂载，存文件的地方
COPY：
CMD：
```

## docker-compose常用命令
```
docker-compose --help
docker-compose up --help

docker-compose up -d
// 创建并启动容器

docker-compose -f docker-kafka.yml up -d
// 指定docker-compose文件名

docker-compose up -d db
//单独启动db服务

docker-compose down
// 停止并移除容器镜像

docker-compose exec db bash
// 进入db容器中

docker-compose restart db
// 重启db容器

docker-compose build db
// 构建db镜像

docker-compose logs db
// 查看db的日志

docker-compose logs -f db
// 验证（docker-compose.yml）文件配置，当配置正确时，不输出任何内容，当文件配置错误，输出错误信息

docker-compose pause db
// 暂停db服务

docker-compose unpause db
// 恢复db服务

docker-compose stop db
// 停止db服务

docker-compose start db
// 启动db服务

docker-compose rm db
// 删除db容器
```

### docker-compose.yml 

```
image: 从指定的镜像中启动容器，如果镜像不存在，Compose 会自动拉去镜像;

container_name: 指定自定义容器名称，而不是生成的默认名称;

ports: 定义端口映射，比如80:9901将容器上的公开端口 80 转接到主机上的外部端口 9901;

volumes: 挂载一个目录或者一个已存在的数据卷容器;

env_file: 定义环境变量的文件， 从这个文件中读取变量设置为容器中的环境变量；

environment: 定义容器的环境变量， 可以覆盖 env_file 的值；

restart: 定义容器自动重启策略(restart_policy)

environment: 定义环境变量和配置；

depends_on: 定义依赖关系, 也就是容器启动顺序；

```

# docker 实战

## 1.创建 Dockerfile 文件

```Dockerfile
FROM nginx

COPY dist/ /usr/share/nginx/html

COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
```

## 2.nginx 配置文件

```nginx
server {
    listen       80;
    server_name  localhost;

    root /usr/share/nginx/html/;
    index index.html index.htm;
    location / {
        try_files $uri $uri/ /index.html;
    }

    location = /health {
        default_type  text/plain;
        access_log  off;
        error_log  off;
        return 200 'ok\n';
    }

    #error_page  404              /404.html;

    # redirect server error pages to the static page /50x.html
    #
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }
}
```

- 监听 80 端口，并设置虚拟主机为 localhost。
- 将网站根目录设置为 /usr/share/nginx/html，并设置默认文档为 index.html 或 index.htm。
- 配置了一个 location 规则用于处理除了 /health 之外的所有请求，该规则将尝试匹配请求的文件，如果不存在则重定向到 /index.html。
- 配置了另一个 location 规则用于处理 /health 请求，并返回一个 200 OK 响应。
- 配置了一个自定义错误页面 /50x.html 用于处理 500、502、503、504 等错误，如果出现这些错误则会显示该页面。

## 3.构建镜像

```js
docker build -t nginx-test . 
```

## 4.启动镜像容器

```js
docker run -p 8080:80 -it nginx-test 
```

## 5.浏览器访问页面

http://localhost:8080/


## 6.编写 docker-compose.yml

```yml
version: '3'
services:
  web:
    image: nginx-test
    volumes:
      - ./dist:/usr/share/nginx/html
      - ./nginx/nginx.conf:/etc/nginx/conf.d/default.conf
    ports:
      - "8080:80"
```

## 7.docker-compose 启动容器

```js
docker-compose up
```

## 8.浏览器访问页面

http://localhost:8080/