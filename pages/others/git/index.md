# git 操作

## git 配置流程

- step-1: 设置 git 的 user name 和 email

```js
// 配置
git config --global user.name "tommy.tang"
git config --global user.email "1071679828@qq.com"

// 查看是否配置成功
code ~/.gitconfig
```

- 生成SSH密钥

```js
// 生成 SSH 密钥
ssh-keygen -t rsa

// 查看是否生成成功
cd ~/.ssh
```

- 复制公钥到 github 设置中

```js
// 查看 id_rsa.pub 里面的公钥
code ~/.ssh/id_rsa.pub

// github 配置路径
https://github.com/ -> 右上角的头像 setting -> SSH and GPG keys -> New SSH key

// github 配置路径
https://gitlab.lixinio.com/ -> 右上角的头像 setting -> SSH Keys
```

- 测试是否链接成功

```js
ssh git@github.com

ssh -T git@gitlab.lixinio.com
```

## git 常用操作

> 核心：一次修改一次提交 一个功能一次提交  以少见细  避免出现复杂情况操作

```
git status  可以让我们时刻掌握仓库当前的状态

git diff +(文件路径)        可以让我们查看difference  文件上一次的修改

git add +(修改文件的路径)   把文件添加进去，实际上就是把文件修改添加到暂存区；

git commit -m "当次修改的说明"    提交更改，实际上就是把暂存区的所有内容提交到当前分支。

git reset +(文件路径)  撤销本次操作 不写表示全部撤销

git reset HEAD file可以把暂存区的修改撤销掉（unstage），重新放回工作区

git reset --hard HEAD^ 回退到上一个版本   HEAD^^ 回退两次  HEAD~100 回退多次   3628164 commitID

git log      可以查看提交历史，以便确定要回退到哪个版本

git reflog    查看命令历史，以便确定要回到未来的哪个版本。用来记录你的每一次命令 版本回退时的查询时间点

git cheackout -b dev 创建并切换到dev的分支

git branch -m oldbranchname newbranchname  修改本地分支名称

git checkout -- filename 可以丢弃工作区的修改,让这个文件回到最近一次git commit或git add时的状态其实是用版本库里的版本替换工作区的版本，无论工作区是修改还是删除，都可以“一键还原”。

git rm test.txt + git commit：文件就从版本库中被删除了

git stash 可用来暂存当前正在进行的工作， 先stash, 使返回到自己上一个commit, 改完bug之后再stash pop, 继续原来的工作。
基础命令：git stash —》 “do some work”—》 git stash pop 

git remote prune origin 移除本地对应线上某个被删除的分支。（也就是说你可以刷新本地仓库与远程仓库的保持这些改动的同步）

git fetch 

对于已有的工程，可以通过git remote set-url origin来设置新的git remote 地址。 如对于ros/qiye-web工程： 
git remote set-url origin git@gitlab.cheanjiait.com:ros/qiye-web.git

如果install出现npm ERR! Unexpected token < in JSON at position 3973，可执行rm package-lock.json。再install一下就好了

git log --graph --decorate --oneline --all --abbrev-commit

git remote prune origin

查看分支git branch [-r | -a]：

1.git branch查看本地所有分支

2.git branch -r查看远程所有分支

3.git branch -a查看本地和远程所有分支

删除远程分支
git push origin --delete <branchName>
git push origin :<branchName>


查看分支：git branch

创建分支：git branch <name>

切换分支：git checkout <name>

创建+切换分支：git checkout -b <name>

合并某分支到当前分支：git merge <name>

删除分支：git branch -d <name>

第一次：
git push -u origin +(分支号)
之后：
git push origin +(分支号)

用git remote -v  要查看远程库的信息，显示更详细的信息：

    
总结：


1.要随时掌握工作区的状态，使用git status命令

2.git status告诉你有文件被修改过，用git diff可以查看修改内容。

场景1：当你改乱了工作区某个文件的内容，想直接丢弃工作区的修改时，用命令git checkout -- file。

场景2：当你不但改乱了工作区某个文件的内容，还添加到了暂存区时，想丢弃修改，分两步，第一步用命令git reset HEAD file，就回到了场景1，第二步按场景1操作。

场景3：已经提交了不合适的修改到版本库时，想要撤销本次提交，参考版本回退一节，不过前提是没有推送到远程库。
```

## git rebase

1. git rebase的两种用法：【==变基 + 合并多个分支==】

2. vim下多行同时编辑与删除技巧

### git rebase变基应用场景

```
git rebase master 替代 git merge master

// 自己的分支合并主分支的时候将基准变为master， 合并后主分支的更新就不算自己的修改，方便code review
```

### git rebase合并多个分支

```
step-1: git rebase -i [某次commit的hash]
step-2: 进入vi界面【pick -> squash】
    # Commands:
    # p, pick <commit> = use commit
    # r, reword <commit> = use commit, but edit the commit message
    # e, edit <commit> = use commit, but stop for amending
    # s, squash <commit> = use commit, but meld into previous commit
    # f, fixup <commit> = like "squash", but discard this commit's log message
    # x, exec <command> = run command (the rest of the line) using shell
    # b, break = stop here (continue rebase later with 'git rebase --continue')
    # d, drop <commit> = remove commit
    # l, label <label> = label current HEAD with a name
    # t, reset <label> = reset HEAD to a label
    # m, merge [-C <commit> | -c <commit>] <label> [# <oneline>]
step-3: 编辑commit message
step-4: git push -f 更新远程仓库
```

### vim下多行同时编辑与删除技巧

```
// i: 进入插入模式
// esc: 推出插入模式
// shift + 冒号： 进入底行模式
// wq: write & quite 强制写入然后退出
// ctrl + v: 进入进入visual block模式
// 【在visual block模式下， j(jump)代表选中行， l(line)代表选中列， d(delete)代表删除】
// %s/pick/s: 将pick全部替换成s
```

## 先建项目再创建远程 git 仓库

```
git init 

git remote add origin <url>  => 【git remote add origin git@github.com:TOMGOU/demo.git】

// my-token: github icon => Settings => Personal access tokens => Generate new token

// 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

git remote add origin https://<my-token>@github.com/TOMGOU/candela-smart-city
git remote set-url origin https://<my-token>@github.com/TOMGOU/candela-smart-city

git remote add origin https://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@github.com/TOMGOU/candela-smart-city
git remote set-url origin https://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@github.com/TOMGOU/candela-smart-city

git push --set-upstream origin master
```

## 回退版本

```
git reflog

git reset 541366a
```

## 将 dist 推送到 gh-pages 分支

```
git subtree push --prefix dist origin gh-pages

git push origin `git subtree split --prefix dist master`:gh-pages --force 
```

## 使用chmod修改.sh的权限

```
chmod u+x *.sh
```