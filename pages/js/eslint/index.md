# ESlint

> 官网：https://eslint.bootcss.com/

> 优秀文章：http://t.csdn.cn/hMWyT

# ESlint 的作用

- 统一团队编码规范
- 减少 git 不必要的提交: 结合 husky，在 commit 的时候运行校验程序
- 避免低级错误
- 在编译时检查语法，而不是等JS引擎运行时才检查

## 基础使用

- step-1: 安装 eslint 包

  > node_moduels 中下载了很多包

    * .bin/eslint 脚本文件，内部通过 nodejs 执行 eslint运行包 的代码【#!/usr/bin/env node: Shebang 指明执行这个脚本文件的解释器是 node, /usr/bin/env 是告诉系统可以在PATH目录中查找, 解决不同的用户 node 路径不同的问题】

    * @eslint包 用来规范 eslint配置文件

    * eslint开头的包 是 eslint运行包，包含eslint代码

- step-2: 生成 eslint 配置文件
  
  * 包含完整脚本路径的命令：./node_modules/.bin/eslint --init

  * 也可以用 npx 来执行 (推荐)：npx eslint --init 【npx 的作用：1. 调用项目安装的模块（node_modules/.bin路径和环境变量$PATH）；2. 避免全局安装模块，npx 将模块下载到一个临时目录，使用以后再删除。】

  * 具体配置：

    - 配置文件格式，加载的优先级： js > yaml > json，所以我们最好选择 js格式

    - JS格式使用模式：我们开发时，一般使用的是 vue脚手架，内部webpack打包默认用的是CommonJS

- step-3: 修改 eslint 配置文件


## 配置说明

* env 节点：未在页面内声明，但是运行环境自带的变量，需要告诉 eslint

  - 浏览器中的 **window/document** 等

  - nodejs中的 **__dirname** 等

  - es2021中的 **WeakRef** 等

* globals 节点：访问当前源文件内未定义的变量, 需要在 ESLint 中定义全局变量

```json
"globals": {
  "_": true,  // 可以读取，可以修改
  "$": false, // 可以读取，不能修改
  "Component": "readonly" // 可以读取，不能修改
}
```

* extends 节点：

  - 配置 extends 时，可以省略 eslint-config-，直接写成 standard

  - 严格程度：all > airbnb-base > standard > recommended

```json
"extends": [
  "standard", // "eslint-config-standard"
  "plugin:vue/essential",
  "airbnb-base",
]

```

* parserOptions 节点：eslint 解析器 解析代码时，可以指定 用哪个 js 的版本

* rules 节点：如果不使用 extend 节点配置整套的规范，也可以在 rules节点中直接配置

## 原理探究

- 源码地址：node_modules/eslint/lib/rules

- meta: 配置文件: 分类，校验规则，报错信息等

- create 函数: 对源码进行分析。

```js
module.exports = {
    meta: {
        type: "layout",

        docs: {
            description: "enforce linebreaks after opening and before closing array brackets",
            category: "Stylistic Issues",
            recommended: false,
            url: "https://eslint.org/docs/rules/array-bracket-newline"
        },

        fixable: "whitespace",

        schema: [
            {
                oneOf: [
                    {
                        enum: ["always", "never", "consistent"]
                    },
                    {
                        type: "object",
                        properties: {
                            multiline: {
                                type: "boolean"
                            },
                            minItems: {
                                type: ["integer", "null"],
                                minimum: 0
                            }
                        },
                        additionalProperties: false
                    }
                ]
            }
        ],

        messages: {
            unexpectedOpeningLinebreak: "There should be no linebreak after '['.",
            unexpectedClosingLinebreak: "There should be no linebreak before ']'.",
            missingOpeningLinebreak: "A linebreak is required after '['.",
            missingClosingLinebreak: "A linebreak is required before ']'."
        }
    },

    create(context) {
        const sourceCode = context.getSourceCode();


        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------

        /**
         * Normalizes a given option value.
         * @param {string|Object|undefined} option An option value to parse.
         * @returns {{multiline: boolean, minItems: number}} Normalized option object.
         */
        function normalizeOptionValue(option) {
            let consistent = false;
            let multiline = false;
            let minItems = 0;

            if (option) {
                if (option === "consistent") {
                    consistent = true;
                    minItems = Number.POSITIVE_INFINITY;
                } else if (option === "always" || option.minItems === 0) {
                    minItems = 0;
                } else if (option === "never") {
                    minItems = Number.POSITIVE_INFINITY;
                } else {
                    multiline = Boolean(option.multiline);
                    minItems = option.minItems || Number.POSITIVE_INFINITY;
                }
            } else {
                consistent = false;
                multiline = true;
                minItems = Number.POSITIVE_INFINITY;
            }

            return { consistent, multiline, minItems };
        }

        /**
         * Normalizes a given option value.
         * @param {string|Object|undefined} options An option value to parse.
         * @returns {{ArrayExpression: {multiline: boolean, minItems: number}, ArrayPattern: {multiline: boolean, minItems: number}}} Normalized option object.
         */
        function normalizeOptions(options) {
            const value = normalizeOptionValue(options);

            return { ArrayExpression: value, ArrayPattern: value };
        }

        /**
         * Reports that there shouldn't be a linebreak after the first token
         * @param {ASTNode} node The node to report in the event of an error.
         * @param {Token} token The token to use for the report.
         * @returns {void}
         */
        function reportNoBeginningLinebreak(node, token) {
            context.report({
                node,
                loc: token.loc,
                messageId: "unexpectedOpeningLinebreak",
                fix(fixer) {
                    const nextToken = sourceCode.getTokenAfter(token, { includeComments: true });

                    if (astUtils.isCommentToken(nextToken)) {
                        return null;
                    }

                    return fixer.removeRange([token.range[1], nextToken.range[0]]);
                }
            });
        }

        /**
         * Reports that there shouldn't be a linebreak before the last token
         * @param {ASTNode} node The node to report in the event of an error.
         * @param {Token} token The token to use for the report.
         * @returns {void}
         */
        function reportNoEndingLinebreak(node, token) {
            context.report({
                node,
                loc: token.loc,
                messageId: "unexpectedClosingLinebreak",
                fix(fixer) {
                    const previousToken = sourceCode.getTokenBefore(token, { includeComments: true });

                    if (astUtils.isCommentToken(previousToken)) {
                        return null;
                    }

                    return fixer.removeRange([previousToken.range[1], token.range[0]]);
                }
            });
        }

        /**
         * Reports that there should be a linebreak after the first token
         * @param {ASTNode} node The node to report in the event of an error.
         * @param {Token} token The token to use for the report.
         * @returns {void}
         */
        function reportRequiredBeginningLinebreak(node, token) {
            context.report({
                node,
                loc: token.loc,
                messageId: "missingOpeningLinebreak",
                fix(fixer) {
                    return fixer.insertTextAfter(token, "\n");
                }
            });
        }

        /**
         * Reports that there should be a linebreak before the last token
         * @param {ASTNode} node The node to report in the event of an error.
         * @param {Token} token The token to use for the report.
         * @returns {void}
         */
        function reportRequiredEndingLinebreak(node, token) {
            context.report({
                node,
                loc: token.loc,
                messageId: "missingClosingLinebreak",
                fix(fixer) {
                    return fixer.insertTextBefore(token, "\n");
                }
            });
        }

        /**
         * Reports a given node if it violated this rule.
         * @param {ASTNode} node A node to check. This is an ArrayExpression node or an ArrayPattern node.
         * @returns {void}
         */
        function check(node) {
            const elements = node.elements;
            const normalizedOptions = normalizeOptions(context.options[0]);
            const options = normalizedOptions[node.type];
            const openBracket = sourceCode.getFirstToken(node);
            const closeBracket = sourceCode.getLastToken(node);
            const firstIncComment = sourceCode.getTokenAfter(openBracket, { includeComments: true });
            const lastIncComment = sourceCode.getTokenBefore(closeBracket, { includeComments: true });
            const first = sourceCode.getTokenAfter(openBracket);
            const last = sourceCode.getTokenBefore(closeBracket);

            const needsLinebreaks = (
                elements.length >= options.minItems ||
                (
                    options.multiline &&
                    elements.length > 0 &&
                    firstIncComment.loc.start.line !== lastIncComment.loc.end.line
                ) ||
                (
                    elements.length === 0 &&
                    firstIncComment.type === "Block" &&
                    firstIncComment.loc.start.line !== lastIncComment.loc.end.line &&
                    firstIncComment === lastIncComment
                ) ||
                (
                    options.consistent &&
                    openBracket.loc.end.line !== first.loc.start.line
                )
            );

            /*
             * Use tokens or comments to check multiline or not.
             * But use only tokens to check whether linebreaks are needed.
             * This allows:
             *     var arr = [ // eslint-disable-line foo
             *         'a'
             *     ]
             */

            if (needsLinebreaks) {
                if (astUtils.isTokenOnSameLine(openBracket, first)) {
                    reportRequiredBeginningLinebreak(node, openBracket);
                }
                if (astUtils.isTokenOnSameLine(last, closeBracket)) {
                    reportRequiredEndingLinebreak(node, closeBracket);
                }
            } else {
                if (!astUtils.isTokenOnSameLine(openBracket, first)) {
                    reportNoBeginningLinebreak(node, openBracket);
                }
                if (!astUtils.isTokenOnSameLine(last, closeBracket)) {
                    reportNoEndingLinebreak(node, closeBracket);
                }
            }
        }

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return {
            ArrayPattern: check,
            ArrayExpression: check
        };
    }
};
```