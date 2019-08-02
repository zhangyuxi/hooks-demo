# 前端node模板项目（midway-tmpl）使用文档

## 环境依赖
- node 6.x.x

## 项目使用步骤

ps：本文档中，假定项目名为demo，实际使用请对应修改，在新建gitlab项目时会加上前缀"midway-"，表示使用了node层的项目

### 创建项目
- 在gitlab中，新建项目midway-demo并创建readme.md文件初始化项目
- 在gitlab中，基于master新建dev和test-dev分支（该步骤可根据团队开发规范和流程改动）
- 本地，git clone刚新建的midway-demo，并切换到dev分支（该步骤可根据团队开发规范和流程改动）

### 使用模板
- 本地，git clone（已经clone过的，拉取最新代码）midway-tmpl
- 本地，复制midway-tmpl所有文件（除去.git配置文件夹）到midway-demo中
- 本地，修改midway-demo配置
    - midway.json中，修改"version"为当前项目版本号，修改"xxx"为"demo"、修改"port"
        ```
        {
            "version": "1.0.0",
            "configurations": {
                "defaultModule": "demo",
                "project": "iot_demo",
                "port": 10086
            }
        }
        ```
    - package.json中，修改"name"、"description"、"version": "1.0.0"、"repository"、"author"，根据项目中实际使用到的依赖增减"dependencies"、"devDependencies"
    - www文件夹中，管理静态资源文件
        - 修改"xxx"目录为"demo"并清空该目录，存放由前端管理的下载资源，如：用户需要上传的导入模板文件
        - static目录中，根据团队规范管理静态资源
    - view文件夹中，管理视图文件
        - components，项目自定义组件，根据项目适当增减
        - helper，项目辅助文件，根据项目适当增减
        - "xxx"目录改为"demo"
            - components，页面自定义组件，根据项目适当增减
            - routes目录，页面视图，参照login新建页面，多个子页面时可参照midway-lushang项目新建
            - routes.html，HTML模板文件，根据项目修改title等
            - routes.js，路由管理，参照login，新增新建页面路由
    - src文件夹中，node层配置及转发逻辑处理
        - common，基本继承自midway-base，只需修改配置
            - bootstrap中global.js，配置全局变量
            - config中，修改env目录下对应的环境配置，修改session中的"name"为"iot_demo"
        - xxx目录，项目的controller，文件名更改为"demo"
            - 根据项目业务，修改各个控制器

### 启动项目
- 本地，项目根目录，执行`yarn`，按照package中的依赖，生成yarn.lock封版文件，后续执行yarn命令则根据yarn.lock中文件来安装
- 待yarn成功结束，执行`npm start` or `npm run dev`或者vscode中F5启动项目

### 调试项目
- 项目启动成功后，在浏览器中访问127.0.0.1:10086/demo/login检查最终是否启动成功
- 修改代码，会自动重新编译改动文件，如无特殊情况无需重启项目

### 推送代码
- 待第一版本成功启动后，可推送到git远端
- 根据项目规范，进行版本研发

---

### 编译 `npm run release [type]`

编译有多种模式[type=update]

* local：输出到output目录
* ~~update：输出为update.tgz包，覆盖上线~~
* ~~all：输出为tgz包（包含依赖包，依赖包从打包目录直接copy），安装上线~~
* ~~i：输出为tgz包（包含依赖包，依赖包使用 `npm install` 加载），安装上线~~
* ~~c：输出为copy.tgz包（包含依赖包，依赖包从打包目录直接copy），覆盖上线~~
* online：输出为copy.tgz包（包含依赖包，依赖包使用 `npm install` 加载），覆盖上线。 ps: 该编译项应在线上环境的相似环境中进行

## 编译说明

该项目的编译为fis和webpack相结合的混合编译。

- webpack负责浏览器端使用的 js 和 css 的编译和 boundle，js 和 css 为单一入口
- fis负责代码（即html）中引用资源的合并、资源路径的替换，和 src 、 view 中 babel 编译处理。

### 编译流程：

1. 处理 package.json 和 npm-shrinkwrap.json 或 yarn.lock
2. `npm install` 或 `yarn` 处理依赖
3. `npm run cp-lib release` 处理库脚本
4. `npm run trans-antd-mobile release` 处理 antd-mobile
5. `npm run webpack.production` 进行 webpack 编译。输出到 `www/static/build`
6. `npm run fis` 进行 fis 编译。输出到 `output`

## 开发规范

### 样式

1. 尽量使用弹性盒子进行布局，避免使用浮动进行布局
2. page需要使用id限定样式作用域
3. 样式在 main.less 中进行引入
4. 尽量避免 inlineStyle

### 脚本

1. 使用 `classnames` 处理类名
2. 使用 `<Link to="/">` 处理站内链接
3. 使用 `props.location` 替代 `window.location`
4. 使用 `apiInfo` 进行异步请求
5. `require.ensure` 需传入第三个命名的参数
6. 静态资源使用 `__uri()` 引用

### note

- server 端数据通过全局变量传递给 client 端
- 全局数据通过 ContextProvider 放入 context，router 要用全局数据时，采用函数传参形式传入

### 组件

- 页面中尽可能使用 antd 和 antd-mobile 的组件。使用 `import { Toast } from 'antd-mobile'` 的方式进行引用
