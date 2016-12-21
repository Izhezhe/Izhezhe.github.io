// 设置项目属性
fis.set('project.charset', 'utf8');
fis.set('project.name', 'fis3-backstage');
fis.set('project.static', '/app/static');
fis.set('project.files', ['app/**/*.html', 'map.json', '/test/*']);
//重定位 by hsky

// 引入模块化开发插件，设置规范为 commonJs 规范。

fis.hook('commonjs', {
    baseUrl: './app',
    extList: ['.js']
});
//真的不需要es

/*************************目录规范*****************************/

// 开启同名依赖
// 主要页面部分
fis.match('/app/pages/**', {
    useSameNameRequire: true
});
//widget部分 同名依赖
fis.match('/app/widget/**', {
    useSameNameRequire: true
});


// ------ 配置components
fis.match('/components/**', {
    release: '${project.static}/$&'
});
fis.match('/components/**.css', {
    isMod: true,
    release: '${project.static}/$&'
});
fis.match('/components/**.js', {
    isMod: true,
    release: '${project.static}/$&'
});
// ------- 配置libs
fis.match('/app/assets/libs/(**).js', {
    release: '${project.static}/js/$1'
});
fis.match('/app/assets/libs/(**)/(*).css', {
    isMod: true,
    release: '${project.static}/js/$1/$2'
});
fis.match('/app/assets/libs/(**)/(*).js', {
    isMod: true,
    release: '${project.static}/js/$1/$2'
});
// 配置scss
fis.match(/^\/app\/assets\/css\/(.*\.scss)$/i, {
    rExt: '.css',
    isMod: true,
    release: '${project.static}/css/$1',
    parser: fis.plugin('node-sass', {
        include_paths: [
            './app/assets/css',
            'components'
        ], // 加入文件查找目录
        sourceMap: true,
        sourceMapEmbed: true
    }),
    postprocessor: fis.plugin('autoprefixer', {
        browsers: ['> 1% in CN', "last 2 versions", "IE >= 8"] // pc
        // browsers: ["Android >= 4", "ChromeAndroid > 1%", "iOS >= 6"] // wap
    })
});
fis.match(/^\/app\/pages\/(.*\.scss)$/i, {
    rExt: '.css',
    isMod: true,
    release: '${project.static}/css/$1',
    parser: fis.plugin('node-sass', {
        include_paths: [
            './app/pages',
            'components'
        ], // 加入文件查找目录
        sourceMap: true,
        sourceMapEmbed: true
    }),
    postprocessor: fis.plugin('autoprefixer', {
        browsers: ['> 1% in CN', "last 2 versions", "IE >= 8"] // pc
        // browsers: ["Android >= 4", "ChromeAndroid > 1%", "iOS >= 6"] // wap
    })
});
// 引入css的话
fis.match(/^\/app\/pages\/(.*\.css)$/i, {
    isMod: true,
    release: '${project.static}/$1',
    postprocessor: fis.plugin('autoprefixer', {
        browsers: ['> 1% in CN', "last 2 versions", "IE >= 8"] // pc
        // browsers: ["Android >= 4", "ChromeAndroid > 1%", "iOS >= 6"] // wap
    })
});
fis.match(/^\/app\/assets\/imgs\/(.*\.(?:png|jpg|gif))$/i, {
    release: '${project.static}/images/$1'
});

fis.match(/^\/app\/pages\/(.*\.js)$/i, {
    isMod: true,
    release: '${project.static}/js/$1'
});

fis.match('/app/pages/(**)/views/(*.js)', {
    isMod: true,
    release: '${project.static}/js/$1/tpl.$1'
});

// 用DOT不好吗
fis.match('*.dot', {
    parser: fis.plugin('dot-compiler', {
        varname: 'it'
    }),
    rExt: '.js'
});


// ------ 配置模拟数据
fis.match('/test/**', {
    release: '$0'
});
fis.match('/test/server.conf', {
    release: '/config/server.conf'
});


/*************************打包规范*****************************/

// 因为是纯前端项目，依赖不能自断被加载进来，所以这里需要借助一个 loader 来完成，
// 注意：与后端结合的项目不需要此插件!!!
fis.match('::package', {
    // npm install [-g] fis3-postpackager-loader
    // 分析 __RESOURCE_MAP__ 结构，来解决资源加载问题
    postpackager: fis.plugin('loader', {
        resourceType: 'commonJs',
        useInlineMap: true // 资源映射表内嵌
    })
});

// 发布产品库
fis.media('prod')
    .match('**.{es,js}', {
        optimizer: fis.plugin('uglify-js')
    })
    .match('**.{scss,css}', {
        optimizer: fis.plugin('clean-css', {
            'keepBreaks': true //保持一个规则一个换行
        })
    })
    .match('/app/assets/imgs/(*.png)', {
        release: '/pkg/imgs/$1'
    })
    // 启用打包插件，必须匹配 ::package
    .match('::package', {
        spriter: fis.plugin('csssprites', {
            layout: 'matrix',
            // scale: 0.5, // 移动端二倍图用
            margin: '10'
        }),
        postpackager: fis.plugin('loader', {
            // allInOne: true,
        })
    })
    .match('/components/**.css', {
        packTo: '/pkg/aio.css'
    })
    .match('/components/**.js', {
        packTo: '/pkg/aio.js'
    })
    .match('/app/assets/libs/mod.js', {
        packTo: '/pkg/aio.js'
    })
    .match('/app/assets/libs/es5-{shim,sham}.js', {
        packTo: '/pkg/es5-shim.js'
    })
    .match('/app/assets/libs/(**)/(*).js', {
        packTo: '/pkg/aio.js'
    })
    .match('/app/pages/(**)/(*).js', {
        packTo: '/pkg/aio.js'
    })
    .match(/^\/app\/assets\/css\/(.*\.scss)$/i, {
        rExt: '.css',
        isMod: true,
        packTo: '/pkg/css/aio.css',
        parser: fis.plugin('node-sass', {
            include_paths: [
                './app/assets/css',
                'components'
            ], // 加入文件查找目录
        }),
        postprocessor: fis.plugin('autoprefixer', {
            browsers: ['> 1% in CN', "last 2 versions", "IE >= 8"] // pc
            // browsers: ["Android >= 4", "ChromeAndroid > 1%", "iOS >= 6"] // wap
        })
    })
    .match(/^\/app\/pages\/(.*\.scss)$/i, {
        rExt: '.css',
        isMod: true,
        packTo: '/pkg/css/aio.css',
        parser: fis.plugin('node-sass', {
            include_paths: [
                './app/pages',
                'components'
            ], // 加入文件查找目录
        }),
        postprocessor: fis.plugin('autoprefixer', {
            browsers: ['> 1% in CN', "last 2 versions", "IE >= 8"] // pc
            // browsers: ["Android >= 4", "ChromeAndroid > 1%", "iOS >= 6"] // wap
        })
    })
    .match('/app/assets/libs/(**)/(*).css', {
        packTo: '/pkg/aio.css'
    })



