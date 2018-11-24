const chalk = require('chalk');
const figures = require('figures');

const prefix = `${chalk.gray('next-optimized-images')} ${chalk.red(figures.pointer)}`;

/**
 * Output a warning when images should get optimized (prod build) but no optimization
 * package is installed.
 */
const showWarning = () => console.log( // eslint-disable-line no-console
  `${prefix} ${chalk.red('WARNING!')}
${prefix} ${chalk.red('No package found which can optimize images.')}
${prefix} Starting from version ${chalk.cyan('2')} of ${chalk.cyan('next-optimized-images')}, all optimization is optional and you can choose which ones you want to use.
${prefix} For help during the setup and installation, please read ${chalk.underline('https://github.com/cyrilwanner/next-optimized-images#optimization-packages')}

${prefix} If you recently ${chalk.cyan('updated from v1 to v2')}, please read ${chalk.underline('https://github.com/cyrilwanner/next-optimized-images/blob/master/UPGRADING.md')}
${prefix} If this is on purpose and you don't want this plugin to optimize the images, set the option ${chalk.cyan('`optimizeImages: false`')} to hide this warning.
`,
);

module.exports = {
  showWarning,
};
