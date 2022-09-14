# iTerm 配置

> https://www.jianshu.com/p/ba08713c2b19

### 插件

```
高亮插件位置：/Users/tangyong/.oh-my-zsh/custom/plugins/zsh-syntax-highlighting
【插件可以放到两个位置：1./Users/tangyong/.oh-my-zsh/custom/plugins；2./Users/tangyong/.oh-my-zsh/plugins/；】
git地址：https://github.com/zsh-users/zsh-syntax-highlighting.git

配置文件位置：/Users/tangyong/.zshrc
source ~/.oh-my-zsh/custom/plugins/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh

环境变量配置文件位置：/Users/tangyong/.bash_profile
生效：source ~/.bash_profile
```

### 安装步骤

- step-1: 切换到 zsh-syntax-highlighting 安装目录

```js
cd /Users/tangyong/.oh-my-zsh/custom/plugins

or 

cd /Users/tangyong/.oh-my-zsh/plugins
```

- step-2: clone 仓库

```js
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git

cho "source ${(q-)PWD}/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh" >> ${ZDOTDIR:-$HOME}/.zshrc
```

- step-3: 激活语法高亮

```js
source ./zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
```

- step-4: 使用 vscode 打开环境变量配置文件

```js
code /Users/tangyong/.bash_profile
```

- step-5: 激活配置

```js
source ~/.bash_profile
```

### HotKey Window配置

```
路径：iterm2 -> preferences -> keys -> configure HotKey Window
```