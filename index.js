var ghmd = require("./markdown-it-gh.js");
var fcb = require("./markdown-it-fcb.js");
const AssetsOptimizer = require("./utils/AssetsOptimizer");
const { path } = require('@vuepress/shared-utils');

function replaceUnsafeChar(ch) {
  return HTML_REPLACEMENTS[ch];
}

var HTML_REPLACEMENTS = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;'
};

function escapeHtml(str) {
  if (/[&<>"]/.test(str)) {
    return str.replace(/[&<>"]/g, replaceUnsafeChar);
  }
  return str;
}

module.exports = (opts, ctx) => {
  return {
    plugins: [
      require('./plugin-frontmatter.js'),
      ...["warning", "tip", "danger"].map(type => [
        "container",
        { type, defaultTitle: false }
      ]),
      [
        '@vuepress/plugin-palette',
        { preset: 'stylus' },
      ],
    ],
    extendsMarkdown: md => {
      md.use(ghmd)
      md.use(fcb)
      md.use(require('markdown-it-attrs'), {
        allowedAttributes: ['prereq', 'hide', 'synopsis']
      })
    },
    layouts: path.resolve(__dirname, './layouts'),
    clientAppEnhanceFiles: path.resolve(__dirname, 'enhanceApp.js'),
    async onPrepared() {
      // called on build and dev
      const assetsOptimizer = new AssetsOptimizer(opts.assetsOptimization.breakpoints || [], opts.assetsOptimization.blacklist || []);
      assetsOptimizer.optimize();
    }
  }
}
