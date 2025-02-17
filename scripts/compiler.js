// 关闭 import 规则
/* eslint import/no-extraneous-dependencies: 0 */

const babel = require('@babel/core');


function transform(code, options) {
    const result = babel.transformSync(code, options);
    return result.code;
}

function transformNodeCode(code) {
    return transform(code, {
        presets: [
            ['@babel/preset-env', {
                modules: 'cjs',
                targets: { node: '12' }
            }]
        ]
    });
}

function transformBrowserCode(code) {
    // 因为 fes.js 在生产打包的时候，会处理所有的 node_modules 下的文件，确保不会丢失必要 polyfill
    // 因此这里不对 polyfill 进行处理，避免全局污染
    return transform(code, {
        presets: [
            ['@babel/preset-env', {
                modules: false,
                useBuiltIns: false,
                targets: { chrome: '51' }
            }]
        ]
    });
}

function compiler(code, config) {
    if (!config.target || config.target === 'node') {
        return transformNodeCode(code);
    }
    if (config.target === 'browser') {
        return transformBrowserCode(code);
    }
    throw new Error(`config target error: ${config.target}, only can use 'node' and 'browser'`);
}


module.exports = compiler;
