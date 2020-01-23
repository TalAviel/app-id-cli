const chalk = require('chalk');

class Logger {
    static getLogger() {
        return {
            info: function() {
                console.log(...arguments);
            },
            debug: function() {
                if (process.env.DEBUG) {
                    let result = '';
                    for (let arg of arguments) {
                        if (typeof (arg) === 'object') {
                            result += JSON.stringify(arg) + '';
                        } else {
                            result += arg;
                        }
                    }
                    // console.debug(chalk.gray(...arguments));
                    console.debug(chalk.gray(result));
                }
            },
            error: function () {
                // console.error(chalk.red(...arguments));
                console.error(...arguments);
            }
        }
    }
}
module.exports = Logger;
