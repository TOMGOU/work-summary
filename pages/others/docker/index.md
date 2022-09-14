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
