# GitLab CI/CD

### 一、CentOS 环境下安装 gitlab-runner

* JDK 安装: https://www.oracle.com/java/technologies/downloads/#jdk19-mac

> m1: Arm 64 DMG INSTALLER

> intel: X64 DMG INSTALLER

```
(base) ➜  ~ java --version
java 19.0.2 2023-01-17
Java(TM) SE Runtime Environment (build 19.0.2+7-44)
Java HotSpot(TM) 64-Bit Server VM (build 19.0.2+7-44, mixed mode, sharing)
```

* 安装 Homebrew

```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

* 安装 gitlab-runner

```
sudo brew install gitlab-runner
```

* 注册 gitlab-runner

> URL + TOKEN: gitlab -> settings - CI/CD - Runners

```
sudo gitlab-runner register

# 将 gitlab-runner 加入 docker 用户组
(base) ➜  ~ usermod -aG docker gitlab-runner
```

* 启动 gitlab-runner

```
sudo gitlab-runner start
```

### 二、GitLab CI/CD 流水线语法

- &、＜＜、 *: 重复的节点（对象）首先由锚（&）定义别名，然后用星号（*）引用别名, <<:用来把符号后面的内容插入该节点

- variables 环境变量:

  > 变量可以分为全局变量和局部变量；全局变量是整个流水线可以用的，局部变量是仅在作业中生效的

  > 局部变量优先级高于全局变量

  ```yml
  variables:
    DEPLOY_ENV: "dev"

  deploy_job:
    stage: deploy
    tags:
      - maven
    variables:
      DEPLOY_ENV: "test"
    script:
      - echo  ${DEPLOY_ENV}
  ```

```yml
.commons:
  commons_cache: &commons_cache # 声明cache
    key:
      files:
        # 用此文件作为cache的key,只要此文件不变,node_modules不会变
        - yarn.lock
    paths:
      # 声明cache的目录
      - node_modules/
      - .yarn
    # 声明cache策略
    policy: pull-push

  commons_build: &commons_build
    allow_failure: true
    ## 使用node:lts docker 镜像运行
    image: node:lts
    cache:
      <<: *commons_cache
    tags:
      ## 选择打了相应 tag 的 runner 来跑这个job
      - tommy-runner
    artifacts: ## 产物
      paths: ## 产物的路径
        - storybook-static
      expire_in: 10 mins ## 过期时间

  commons_deploy: &commons_deploy
    allow_failure: true
    image: registry.cn-shenzhen.aliyuncs.com/ctirobot/aliyun-oss:v1
    ## 使用 aliyun-oss镜像
    tags:
      ## 声明使用的runner
      - frontend-crsp-cicd

stages:
  - dep
  - dev:build
  - dev:deploy
  - simulation-production:build
  - simulation-production:deploy

variables:
  DOCKER_IMAGE_NAME: tong-frontend-demo
  DOCKER_TLS_CERTDIR: ''
  CI_REGISTRY: registry.cn-shenzhen.aliyuncs.com
  DOCKER_HOST: tcp://docker:2375
  MINIO_BUCKET_DEV_NAME: tong-frontend-demo
  MINIO_HOST: http://company-pvt.minio.ctirobot.com:9100

dep:
  stage: dep
  image: company-pvt.harbor.ctirobot.com/yarnpkg/node-yarn:node7
  cache:
    policy: pull-push
    <<: *commons_cache
  tags:
    - tommy-runner
  # 只有当 yarn.lock 被修改时，才执行 yarn install
  only:
    changes:
      - yarn.lock
  script:
    - npm config set registry http://192.168.14.248:8181/repository/npm-groups/
    - yarn config set registry http://192.168.14.248:8181/repository/npm-groups/
    - npm config get registry && yarn config get registry
    # - yarn install --cache-folder .yarn --prefer-offline
    - yarn install

dev:build:
  <<: *commons_build
  when: manual
  dependencies:
    - dep
  stage: dev:build
  script: ## 执行的脚本
    # - yarn install --cache-folder .yarn --prefer-offline
    - npm config set registry http://192.168.14.248:8181/repository/npm-groups/
    - yarn config set registry http://192.168.14.248:8181/repository/npm-groups/
    - npm config get registry && yarn config get registry
    - yarn
    - ls -al
    - rm -rf storybook-static
    - yarn run build-storybook
  allow_failure: false

dev:deploy:
  <<: *commons_deploy
  stage: dev:deploy
  when: on_success
  dependencies:
    - dev:build
  before_script:
    - mc alias set minio $MINIO_HOST $MINIO_ACCESS_KEY  $MINIO_SECRET_KEY
    - mc rm --recursive --force minio/$MINIO_BUCKET_DEV_NAME
  script:
    - mc cp -r storybook-static/ minio/$MINIO_BUCKET_DEV_NAME
  after_script:
    - 'curl "$QYWEIXIN_DEVOPS_URL" -H "Content-Type: application/json" -d "{\"msgtype\": \"markdown\",\"markdown\": {\"content\": \"动效组件库已发布.\n >Env: Development\n >Application: tong-frontend-demo \"} }"'
  needs:
    - dev:build

```