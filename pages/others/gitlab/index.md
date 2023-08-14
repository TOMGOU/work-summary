# GitLab CI/CD

## 一、CentOS 环境下安装 gitlab-runner

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

> https://www.freesion.com/article/79431185053/

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
sudo gitlab-runner install --user=gitlab-runner

sudo gitlab-runner start
```

---

## 二、GitLab CI/CD 流水线语法

> https://www.shuzhiduo.com/A/A2dm8kmA5e/

> https://zhuanlan.zhihu.com/p/510820543

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

- 常用的内置变量：
  * $CI_COMMIT_BRANCH：当前提交所在的分支名称。
  * $CI_COMMIT_SHA：当前提交的 SHA 值。
  * $CI_COMMIT_MESSAGE：当前提交的提交消息。
  * $CI_PIPELINE_ID：当前流程的 ID。
  * $CI_PROJECT_DIR：GitLab CI/CD 系统中当前项目的根目录。

- job: 作业，每个作业独立执行，必须有唯一的名称（不能使用关键字）且只包含一个 script，script 可以是 shell 命令。

```yml
stages:
  - dep
  - build
  - deploy

dep:
  stage: dep
  script:
    - yarn install --quite --registry=http://192.168.14.248:8181/repository/npm-groups/

build: 
  stage: build
  script:
    - yarn --registry=http://192.168.14.248:8181/repository/npm-groups/
    - ls -al
    - rm -rf dist/pre
    - yarn run build:pre

deploy: 
  stage: deploy
  before_script:
    - mc alias set minio $MINIO_HOST $MINIO_ACCESS_KEY  $MINIO_SECRET_KEY
    - mc rm --recursive --force minio/$MINIO_BUCKET_DEV_NAME
  script:
    - mc cp -r dist/pre/ minio/$MINIO_BUCKET_DEV_NAME
```

- 作业运行的顺序控制：整体由 stages 控制，单个可以借助 dependencies 和 needs
  * dependencies: deploy 依赖于 build 打包到 dist 目录下的文件
  * needs: 是一个数组，比如：pre:deploy 的 needs: ['pre:build']; prod:deploy 的 needs: ['prod:build'];

- .pre & .post: .pre 始终是整个 pipeline 的第一个运行阶段，.post 始终是整个 pipeline 的最后一个运行阶段，无法修改，用户自定义的 stage 则在这两者之间，如果一个 pipeline 仅包含 .pre 和 .post，则不会创建 pipeline

- tags: 用于指定特定的 job 在特定的 runner 运行，如果 job 不指定 tags，则默认在共享的 runner 运行

- allow_failure: allow_failure 表示是否允许作业失败，默认值 false 不允许失败，改为 true 后，如果该作业失败也不会被阻塞

- when: 用于控制作业运行, 比如指定手动运行
  * on_success：前面阶段的所有作业成功才执行该作业，默认 on_success
  * on_failure：前面阶段出现失败时执行
  * always：总是执行作业
  * manual：手动执行作业
  * delayed：延迟执行作业

- retry：配置作业失败后重试作业的次数，比如由于网络差的原因导致安装依赖失败，从而主动退出作业流程，可以适当设置重试次数解决这个问题

- rules：允许按顺序评估单个规则，直到匹配为止

  * when：指定作业运行方式

  ```yml
  variables:
	DOMAIN: example.com
  test:
    stage: test
    script:
      - "..."
    rules:	# DOMAIN值匹配,则手动运行,否则
      - if: '$DOMAIN == "example.com"'
        when: manual
      - if: '$DOMAIN == "example2.com"'
        when: delayed
        start_in: '5'
      - when: on_success
  ```

  * changes: 指定文件发生变化

  ```yml
  test:
    stage: test
    script:
      - "..."
    rules:
      - changes:
        - fimeName # 文件名
        when: manual
      - when: on_success
  ```

  * exists：指定文件存在

  ```yml
  job1:
    stage: test
    script:
      - "..."
    rules:
      - exists:
        - fimeName # 文件名
        when: manual
      - when: on_success
  ```
- workflow-rules：适用于整个管道，并确定是否创建管道

```yml
stages:
  - dep
  - build
  - deploy

variables:
  MINIO_BUCKET_DEV_NAME: cti-scheduling-admin-dev
  MINIO_BUCKET_PROD_NAME: cti-scheduling-admin-prod
  MINIO_HOST: http://company-pvt.minio.ctirobot.com:9100

workflow:
	rules:
		- if: '$CI_COMMIT_BRANCH == "master"'
		  when: always	# 默认always,可以设置never
		- when: never
```

- cache: 存储编译项目时所需的运行时依赖项，指定项目工作空间中需要在 job 之间缓存的文件或目录; 全局 cache 定义在 job 之外，针对所有 job 生效，job 中的 cache 优于全局
  * key：用于指定缓存项的键值
  * paths: 缓存目录地址
  * policy: 缓存策略
    - pull: 每次流程运行时都会尝试从先前的流程缓存中拉取缓存。如果找不到任何缓存，则将创建一个新的缓存。
    - push: 在流程完成后，会将所有缓存项推送到 GitLab CI/CD 系统中，并将其存储在该项目的缓存池中。在下次流程运行时，将从该缓存池中提取缓存。
    - pull-push 表示只有当本地没有相应的镜像或者镜像过期时，才会从远程仓库拉取镜像，并且如果存在本地镜像，会先删除本地镜像然后再从远程仓库拉取最新的镜像，并将拉取到的镜像推送到 GitLab 内置容器镜像仓库，以供后续使用。
    - pull+push 表示不管本地是否存在相应的镜像，每次都会从远程仓库拉取最新的镜像，并将拉取到的镜像推送到 GitLab 内置容器镜像仓库，以供后续使用
  * expires_in: 缓存项的过期时间。例如 1 day、2 weeks 或 3 months

```yml
cache:
	paths:	# 在全局定义缓存
		- my/files
job:
	script: "npm install"
	cache:
		key: job	# 为缓存设置唯一key,会为该job分配一个独立的cache
		paths:	# 在job中定义缓存,缓存target目录下的所有.jar文件,该缓存将覆盖全局缓存
			- node_modules/
		policy: pull # pull:不下载缓存,push不上传缓存,默认会在job执行之前下载缓存,并在结束之后上传缓存
    expires_in: 10 months
```

- artifacts：用于指定作业成功或失败时应附加到作业的文件或目录的列表，可以轻松地将文件和数据传递到下一个 Job 或 Pipeline 阶段，从而实现更高级别的自动化和持续集成/交付流程。
  * paths: 作业的文件或目录列表
  * expire_in: 作业的文件或目录过期时间
  * name: 指定持久化文件的名称。如果未指定，则使用默认名称 artifacts.
  * untracked: 是否包含未被 Git 跟踪的文件。默认情况下，artifacts 只包含已被 Git 跟踪的文件。
  * when: 指定何时保存持久化文件。默认情况下，只有在 Job 成功执行时才会保存。
  * reports: 定义需要在 Job 结束后保存为报告的路径或文件。类似于 paths，但这些文件被标记为报告，并且可以通过 GitLab UI 查看。
  * expose_as: 将指定路径或文件公开为构建的 artifact，使其可供外部使用。
  * dependencies: 定义需要在此 Job 执行前完成的 Jobs，以便在此 Job 中使用其 artifacts。

```yml
artifacts: ## 产物
  paths: ## 产物的路径
    - dist
  expire_in: 10 mins ## 过期时间
```

- extends: 继承作业配置，相同配置覆盖，不同则继承

```yml
.tests:
	script: mvn test
	stage: test
	only:
		refs:
			- tags
test-job:
	extends: .tests
	script: mvn clean test
	only:
		variables:
			- $RSPEC
```

- image: 首先注册一个工作类型为 docker 的 runner，只要使用该类型的 runner，所有运行操作都会在容器中运行

```yml
image: cr.lixinio.com/frontend/node:12.16.2
```

- parallel：表示作业的并行度，可以是一个整数或一个字符串表达式。例如，parallel: 2 表示在一个 runner 中最多有两个并行的作业在运行，而 parallel: "10/5/3" 表示在三个 runner 中，第一个可以运行10个并行的作业，第二个可以运行5个并行的作业，第三个可以运行3个并行的作业。

```yml
stages:
  - build
  - test
  - deploy

build:
  stage: build
  script:
    - npm run build
  tags:
    - docker

test_job_1:
  dependencies:
		- build
  stage: test
  script:
    - echo "Running test job 1"
  tags:
    - docker

test_job_2:
  dependencies:
		- build
  stage: test
  script:
    - echo "Running test job 2"
  tags:
    - docker

test_job_3:
  dependencies:
		- build
  stage: test
  script:
    - echo "Running test job 3"
  tags:
    - docker

.parallel: 3

deploy:
  stage: deploy
  script:
    - cho "deploy..."
  needs:
    - ['test_job_1', 'test_job_2', 'test_job_3']
```

---

## 三、当前项目中存在的问题：

### 问题-1：部分项目依赖安装的作业流程每次都会运行，浪费大量时间

- 原因分析：未设置依赖安装的作业流程的运行条件

- 解决方案：只有当 yarn.lock 被修改时，才执行 yarn install

```yml
dep:
  stage: dep
  image: company-pvt.harbor.ctirobot.com/yarnpkg/node-yarn:node7
  cache:
    policy: pull-push
    <<: *commons_cache
  tags:
    - frontend-crsp-cicd
  # 只有当 yarn.lock 被修改时，才执行 yarn install
  only:
    changes:
      - yarn.lock
  script:
    - yarn install --quite --registry=http://192.168.14.248:8181/repository/npm-groups/
```

### 问题-2：部分项目打包失败也能将错误的代码部署到线上

- 原因分析：allow_failure: true

- 解决方案：allow_failure: true -> allow_failure: false

### 问题-3：不同环境的作业流程无法同时运行，浪费了等待的时间和并发作业运行时间

- 原因分析：预发布环境和正式环境都打包到 dist 目录，导致无法同时部署

- 解决方案：对不同环境的打包目录进行隔离，并针对不同环境的作业流程使用不同的 runner

  * 对不同环境的打包目录进行隔离:

    - vite 打包

    ```js
    import { defineConfig } from 'vite';
    import react from '@vitejs/plugin-react';

    export default ({ mode }) => defineConfig({
      base: mode === 'production' ? '/prod' : '/stag',
      build: {
        outDir: mode === 'production' ? 'dist/prod' : 'dist/stag'
      },
      plugins: [react()],
      ...
    });
    ```

    - umi 打包

    ```js
    import { defineConfig } from 'umi';

    // pre 环境
    export default defineConfig({
      outputPath: 'dist/pre',
      ....
    });

    // prod 环境
    export default defineConfig({
      outputPath: 'dist/prod',
      ....
    });
    ```

  * ci 改造: 1. 打包目录修改；2. 使用不同的 runner 加速作业运行

  ```yml
  stag:build:
  <<: *commons_build
  when: manual
  stage: stag:build
  dependencies:
    - dep
  tags: ## 使用不同的 runner
    - docker
  script: 
    - yarn install --cache-folder .yarn --prefer-offline
    - rm -rf dist/stag ## 打包目录修改
    - yarn run build:stag

  prod:build:
  <<: *commons_build
  when: manual
  dependencies:
    - dep
  stage: prod:build
  tags: ## 使用不同的 runner
    - frontend-crsp-cicd
  script: 
    - yarn install --cache-folder .yarn --prefer-offline
    - rm -rf dist/prod ## 打包目录修改
    - yarn run build:prod

  ```

### 问题-4: master 未受保护，任何分支都能直接部署代码到正式环境，弱化了 gitlab 用户角色权限，同时给项目带来了极大的风险

- 原因分析：未对正式环境的作业流行设置分支条件

- 解决方案：对正式环境的作业流行设置分支条件，同时加强对 gitlab 用户角色权限的管理，做到一个项目只能一个人有发布正式环境的权限，其他人只能提 MR。

```yml
prod:build:
  <<: *commons_build
  when: manual
  dependencies:
    - dep
  stage: build
  script:
    - yarn --registry=http://192.168.14.248:8181/repository/npm-groups/
    - ls -al
    - rm -rf dist/prod
    - yarn run build:prod
  rules:
    - if: '$CI_COMMIT_BRANCH == "master"' ## 只有 master 分支才能运行此作业

prod:deploy:
  <<: *commons_deploy
  stage: deploy
  when: on_success
  dependencies:
    - prod:build
  before_script:
    - mc alias set minio $MINIO_HOST $MINIO_ACCESS_KEY  $MINIO_SECRET_KEY
    - mc rm --recursive --force minio/$MINIO_BUCKET_PROD_NAME
  script:
    - mc cp -r dist/prod/ minio/$MINIO_BUCKET_PROD_NAME
  after_script:
    - 'curl "$QYWEIXIN_DEVOPS_URL" -H "Content-Type: application/json" -d "{\"msgtype\": \"markdown\",\"markdown\": {\"content\": \"调度系统的管理后台版本已发布.\n >Env: Development\n >Application: candela-ota-system \"} }"'
  needs:
    - ['prod:build']
  rules:
    - if: '$CI_COMMIT_BRANCH == "master"' ## 只有 master 分支才能运行此作业
```

### 其他潜在优化：

- GitLab Runner: shell executor VS image executor

- parallel 并发运行提升效率

```yml
stages:
  - build
  - test
  - deploy

build:
  stage: build
  script:
    - npm run build
  tags:
    - docker

test_job_1:
  dependencies:
		- build
  stage: test
  script:
    - echo "Running test job 1"
  tags:
    - docker

test_job_2:
  dependencies:
		- build
  stage: test
  script:
    - echo "Running test job 2"
  tags:
    - docker

test_job_3:
  dependencies:
		- build
  stage: test
  script:
    - echo "Running test job 3"
  tags:
    - docker

.parallel: 3

deploy:
  stage: deploy
  script:
    - cho "deploy..."
  needs:
    - ['test_job_1', 'test_job_2', 'test_job_3']
```

---

## 四、gitlab-runner image executor

- step-1: 从服务器上下载 docker 镜像

```
docker pull gitlab/gitlab-runner
```

- step-2: 运行 docker 版 gitlab-runner

```
docker run -d --name gitlab-runner gitlab/gitlab-runner:latest
```

- step-3: gitlab runnser 注册

```
docker exec gitlab-runner gitlab-runner register -n \
       --url http://company-pvt.gitlab.ctirobot.com/ \
       --registration-token xxxxxxxxxxxxxxxxxxxxxxxx \
       --tag-list runInDocker \
       --executor docker \
       --docker-image docker \
       --description "runInDocker"
```

---

## 五、实际项目例子

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

### 特别注意：使用本地 runner，并且设置了 npm 私服，其他项目安装依赖需要重置 registry，此处建议设置淘宝源。

- 终端里输入 npm config list 来获取npm的配置

```
npm config list
```

- 找到userconfig一项，打开 .npmrc 文件

```
code /Users/dsc/.npmrc
```

- 删除私服设置

```
# registry=http://192.168.14.248:8181/repository/npm-groups/
```