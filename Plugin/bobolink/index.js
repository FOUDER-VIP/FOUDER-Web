{
    let oHead = document.getElementsByTagName('HEAD').item(0);
    let oScript = document.createElement("script");
    oScript.type = "text/javascript";
    oScript.src = "https://cdn.jsdelivr.net/npm/require.js@1.0.0/require.min.js";
    oHead.appendChild(oScript);
}

//-------------------------------------------------------------------------------constants
define('bobolink_constants', [], function () {
    const constants = {
        TIMEOUT_FLAG: 'bobolink_timeout',
        // 只用于内部状态判断，表明需要重试
        RETRY_FLAG: 'bobolink_retry',
        UNKNOWN_ERR: 'bobolink_unknown_error',
        EXCEEDED: 'bobolink_exceeded_maximum_task_number',
        INVALID: 'bobolink_invalid',
        // 按频率调度模式
        SCHEDULE_MODE_FREQUENCY: 'frequency',
        // 立即调度模式
        SCHEDULE_MODE_IMMEDIATELY: 'immediately',
        // 饱和策略：终止
        SATURATION_POLICY_ABORT: 'abort',
        // 饱和策略：丢弃最早任务
        SATURATION_POLICY_DISCARD_OLDEST: 'discardOldest',
        // 任务模型，表明put进来的数据
        TASK_MODE_DATA: 'data',
        // 任务模型，表明put进来的是函数
        TASK_MODE_FUNCTION: 'function',
        TASK_ERROR: 'bobolink_unsupported_task_type',
        // 任务被移除
        DISCARD: 'bobolink_discard',
        EMPTY_ELEMENTS: 'bobolink_empty_elements'
    };
    return constants
});

//-------------------------------------------------------------------------------utils
define('bobolink_utils', ['bobolink_constants'], function (constants) {
    let autoIncrement = 0;

    let instance = {};

    function getAndIncrement(digits = 8) {
        let r = (new Array(digits).fill(0).join('') + autoIncrement).slice(-1 * digits);
        if (autoIncrement >= (Math.pow(10, digits) - 1)) {
            autoIncrement = 0;
        } else {
            autoIncrement++;
        }
        return r;
    }

    // 提取最大公约数
    instance.getGCD = function (a, b) {
        if (b === 0) {
            return a;
        }
        return instance.getGCD(b, a % b);
    }


    // 生成唯一id
    instance.genId = function (digits) {
        return Date.now() + getAndIncrement(digits);
    }

    // 一定时间后失败
    instance.delayPromise = function (ms) {
        return new Promise((_, reject) => {
            setTimeout(() => {
                reject(constants.TIMEOUT_FLAG);
            }, ms);
        });
    }

    // 获取值或在检测不成立时返回默认值
    instance.getOrDefault = function (value, type, condition, defaultValue) {
        if (typeof value === type && condition) {
            return value;
        }
        return defaultValue;
    }

    return instance
});

//-------------------------------------------------------------------------------options
define('bobolink_options', ['bobolink_constants', 'bobolink_utils'], function (constants, utils ) {
    //-------------------------------------------------------------------------------options
    /**
     * @typedef  {Object}   options                     - 配置项
     * @property {number}   [concurrency=5]             - 任务的并发数量，默认为5
     * @property {number}   [timeout=15000]             - 任务的超时时间（ms），默认为15000，设置为0则不超时
     * @property {number}   [retry=0]                   - 任务失败时的重试次数，默认为0
     * @property {boolean}  [retryPrior=false]          - 是否优先处理重试任务，默认为false，如果设置为true，则失败重试的任务会被放置到队列头部
     * @property {boolean}  [newPrior=false]            - 是否优先处理新任务，默认为false，如果设置为true，则新加入的任务会被放置到队列头部
     * @property {function} [catch=]                    - 任务失败时的抓取函数，默认为null，任务多次失败重试会回调多次catch
     * @property {number}   [max=65536]                 - 任务队列的上限，-1为没有上限，默认为65536
     * @property {string}   [scheduleMode=immediately]  - 任务调度模式。
     * - frequency（按频率调度，每秒）
     * - immediately（立即调度，任务提交立即执行）
     * @property {number}   [countPerTimeScale=100]     - 当调度模式为frequency时，可通过此参数指定每个时间刻度调度的任务数，默认为100。真实的并发数不会超过concurrency。
     * - 设置为-1则每次都调度队列中的所有任务
     * @property {number}   [timeScale=1]               - 时间刻度（s），默认为1s
     * @property {string}   [taskMode=]                 - 指明任务模式。
     * - 可选值为data（put数据）和function（put函数）。
     * - 没有设置时将根据第一个任务的类型自行推断。
     * @property {function} [handler=]                  - 当任务模式为data时，每次执行任务将回调handler，并传入当次任务对应的data。
     * - 要求返回一个Promise。
     * @property {string}   [saturationPolicy=abort]    - 队列饱和时提交任务的策略，默认为abort。
     * - abort（终止并抛出异常）
     * - discardOldest（剔除最早的任务以腾出空间执行新任务）。
     * 
     */

    /**
     * 
     * 关于选项的描述
     * 
     * 用于设值时的校验
     * 
     */
    const optionsSchema = {};

    optionsSchema.concurrency = {
        type: 'number',
        condition: v => v > 0,
        default: 5
    };

    optionsSchema.timeout = {
        type: 'number',
        condition: v => v >= 0,
        default: 15000
    };

    optionsSchema.retry = {
        type: 'number',
        condition: v => v >= 0,
        default: 0
    }

    optionsSchema.retryPrior = {
        type: 'boolean',
        default: false
    }

    optionsSchema.newPrior = {
        type: 'boolean',
        default: false,
        update: false
    }

    optionsSchema.catch = {
        type: 'function',
        default: null
    }

    optionsSchema.max = {
        type: 'number',
        condition: v => v > 0,
        default: 2 << 15
    }

    optionsSchema.scheduleMode = {
        type: 'string',
        condition: v => v === constants.SCHEDULE_MODE_FREQUENCY || v === constants.SCHEDULE_MODE_IMMEDIATELY,
        default: constants.SCHEDULE_MODE_IMMEDIATELY,
        final: true
    }

    optionsSchema.countPerTimeScale = {
        type: 'number',
        condition: v => {
            return v >= 1 || v === -1;
        },
        translate: v => ~~v,
        default: 100,
        fianl: true
    }

    optionsSchema.timeScale = {
        type: 'number',
        condition: v => v >= 1,
        translate: v => ~~v,
        default: 1
    }

    optionsSchema.taskMode = {
        type: 'string',
        condition: v => v === constants.TASK_MODE_DATA || v === constants.TASK_MODE_FUNCTION,
        default: undefined
    }

    optionsSchema.handler = {
        type: 'function',
        default: () => Promise.resolve()
    }

    optionsSchema.saturationPolicy = {
        type: 'string',
        condition: v => v === constants.SATURATION_POLICY_ABORT || v === constants.SATURATION_POLICY_DISCARD_OLDEST,
        default: constants.SATURATION_POLICY_ABORT
    }

    /**
     * @param {options} options 
     * 
     * @returns {options}
     */
    function Options(options) {

        let self = this;

        // 初始化选项
        for (let option in optionsSchema) {
            let optionSchema = optionsSchema[option];
            let optionValue = options && options[option];
            let condition = optionSchema.condition ? optionSchema.condition(optionValue) : true;
            let curOptionValue = utils.getOrDefault(optionValue, optionSchema.type, condition, optionSchema.default);
            self[option] = optionSchema.translate ? optionSchema.translate(curOptionValue) : curOptionValue;
        }

        /**
         * 更新配置
         * @param {options} newOptions 
         */
        function update(newOptions) {
            if (newOptions) {
                let allowOptions = {};
                for (let option in newOptions) {
                    if (optionsSchema[option] && !optionsSchema[option].final && newOptions[option] !== undefined) {
                        let optionSchema = optionsSchema[option];
                        let condition = optionSchema.condition ? optionSchema.condition(newOptions[option]) : true;
                        let curOptionValue = utils.getOrDefault(newOptions[option], optionSchema.type, condition, optionSchema.default);
                        allowOptions[option] = optionSchema.translate ? optionSchema.translate(curOptionValue) : curOptionValue;
                    }
                }
                Object.assign(self, allowOptions);
            }
        }

        /**
         * @function
         */
        this.update = update;

    }
    return Options
});

//-------------------------------------------------------------------------------Bobolink
define('bobolink', ['bobolink_constants', 'bobolink_utils', 'bobolink_options'], function (constants, utils, Options) {
    /**
     * 创建一个执行队列
     * @param { import("./options").options } options 
     * @class bobolink
     */
    Bobolink = function Bobolink(options) {

        let self = this;

        // 生成配置
        let queueOptions = new Options(options);

        let queueTasks = [];

        this.runningTasksCount = 0;

        let taskTag = {};

        let frequencyController;

        /**
         * 
         * 调度模式的行为描述
         * 
         * putThenRun: 表明任务提交是否立即执行
         * replenish: 表明任务执行完成是否补充执行
         * init: 对应模式的初始化函数
         * 
         */
        let schedulingModes = {};

        // 按频率调度
        schedulingModes[constants.SCHEDULE_MODE_FREQUENCY] = {
            putThenRun: false,
            replenish: false,
            init: () => {
                // 求公约数
                let gcd = utils.getGCD(queueOptions.timeScale * 1000, queueOptions.countPerTimeScale);
                // 得到以毫秒为单位的一个调度频率
                let interval = queueOptions.timeScale * 1000 / gcd;
                // 得到每个调度频率内需要调度的任务数
                let taskNumber = queueOptions.countPerTimeScale / gcd;
                // 每个调度频率调度期望的任务数
                frequencyController = setInterval(() => {
                    // 剩余可并发的任务数
                    let rest = queueOptions.concurrency - self.runningTasksCount;
                    if (rest > 0) {
                        runTask(Math.min(rest, queueOptions.countPerTimeScale === -1 ? queueTasks.length : taskNumber));
                    }
                }, queueOptions.countPerTimeScale === -1 ? queueOptions.timeScale * 1000 : interval);
            }
        };

        // 及时调度
        schedulingModes[constants.SCHEDULE_MODE_IMMEDIATELY] = {
            putThenRun: true,
            replenish: true
        };

        initSchedulingMode();

        /**
         * @param { import("./options").options } newOptions 
         */
        this.setOptions = function (newOptions) {
            return queueOptions.update(newOptions);
        };

        /**
         * 获取当前队列中的任务数
         */
        this.queueTaskSize = 0;

        /**
         * 获取当前队列的配置
         */
        this.options = null;

        function initSchedulingMode() {
            let mode = schedulingModes[queueOptions.scheduleMode];
            mode.init && mode.init();
        }

        Object.defineProperty(this, 'queueTaskSize', {
            get: () => {
                return queueTasks.length;
            }
        });

        Object.defineProperty(this, 'options', {
            get: () => {
                return queueOptions;
            }
        });

        function putTask(task, prior) {
            if (queueOptions.newPrior || prior) {
                queueTasks.unshift(task);
            } else {
                queueTasks.push(task);
            }
        }

        // 移除若干个旧任务
        function discardOldest(len) {
            let discardLen = Math.min(len, queueTasks.length);
            // 如果是新任务优先的策略，则队尾为旧任务
            if (queueOptions.newPrior) {
                queueTasks.length = queueTasks.length - discardLen;
            } else {
                // 否则队头为新任务
                let oldestTasks = queueTasks.splice(0, discardLen);
                oldestTasks.forEach(task => {
                    if (task.tag) {
                        taskTag[task.tag].remainingCount--;
                        // 将任务标识为取消
                        taskTag[task.tag].results[task.index] = getRes(constants.DISCARD, undefined, Date.now() - task.putTime, 0, 0);
                        if (taskTag[task.tag].remainingCount === 0) {
                            resolveTaskTag(task);
                        }
                    }
                });
            }
        }

        /**
         * 销毁实例
         */
        this.destory = function () {
            // 移除定时器
            if (frequencyController) {
                clearInterval(frequencyController);
            }
            // 清理未执行任务
            discardOldest(queueTasks.length);
        }

        function resolveTaskTag(task) {
            let results = taskTag[task.tag].results;
            let runTime = Date.now() - taskTag[task.tag].startTime;
            let waitingTime = taskTag[task.tag].startTime - taskTag[task.tag].putTime;
            delete taskTag[task.tag];
            task.resolve(getRes(undefined, results, waitingTime, runTime));
        }

        /**
         * @typedef {object}  ts    - 任务
         * @property {any}    err   - 错误信息，err === undefined时说明没有任务成功
         * @property {any}    res   - 任务的返回数据
         * @property {number} waitingTime   - 任务在队列中等待的时间（ms）
         * @property {number} runTime       - 任务的执行时间
         * @property {number} retry         - 任务的重试次数 
         */

        /**
         * 提交一个或一组任务
         * 
         * @param {any|any[]} datas           - 提交数据或可执行函数，可函数要求执行后返回一个Promise。
         * @param {boolean}   [prior=false]   - 此任务是否优先执行
         * @returns {Promise<ts>}
         */
        this.put = this.push = function (datas, prior) {
            if (Array.isArray(datas) && datas.length == 0) {
                return Promise.reject(constants.EMPTY_ELEMENTS);
            }
            // 饱和状态
            if (queueOptions.max !== -1 && (queueTasks.length + (Array.isArray(datas) ? datas.length : 1) > queueOptions.max)) {
                // 终止时，直接抛出异常
                if (queueOptions.saturationPolicy === constants.SATURATION_POLICY_ABORT) {
                    return Promise.reject(constants.EXCEEDED);
                } else if (queueOptions.saturationPolicy === constants.SATURATION_POLICY_DISCARD_OLDEST) {
                    let len = Array.isArray(datas) ? datas.length : 1;
                    // 如果一次放入的任务数大于队列的最大数，直接剔除掉头部任务（一组任务，应该是队头的任务时间最早）
                    if (len > queueOptions.max) {
                        len = queueOptions.max;
                        datas.splice(0, len);
                    }
                    discardOldest(len);
                }
            }
            // 没有设置过任务模式的话，从第一次的任务中推断
            if (!queueOptions.taskMode) {
                let firstTask = Array.isArray(datas) ? datas[0] : datas;
                initTaskMode(firstTask);
            }
            return new Promise((resolve, reject) => {
                // 检验任务是否符合当前任务模式
                if (Array.isArray(datas)) {
                    let tag = utils.genId();
                    // 筛选任务，函数模式时，应剔除所有非函数的任务
                    let validData = datas.filter(task => {
                        if (queueOptions.taskMode === constants.TASK_MODE_FUNCTION) {
                            return task instanceof Function;
                        } else {
                            return !(task instanceof Function);
                        }
                    });
                    // 整组任务都是不符合期望的任务类型
                    if (validData.length === 0) {
                        return reject(constants.TASK_ERROR);
                    }
                    let putTime = Date.now();
                    taskTag[tag] = {
                        results: new Array(validData.length),
                        remainingCount: validData.length,
                        putTime
                    };
                    for (let i = 0, len = validData.length; i < len; i++) {
                        let index = prior ? (len - i - 1) : i;
                        let data = validData[index];
                        putTask({
                            resolve,
                            reject,
                            data,
                            tag,
                            index,
                            retry: 0,
                            putTime
                        }, prior);
                    }
                } else {
                    if (queueOptions.taskMode === constants.TASK_MODE_FUNCTION && !(datas instanceof Function)) {
                        return reject(constants.TASK_ERROR);
                    } else if (queueOptions.taskMode === constants.TASK_MODE_DATA && datas instanceof Function) {
                        return reject(constants.TASK_ERROR);
                    }
                    putTask({
                        resolve,
                        reject,
                        data: datas,
                        retry: 0,
                        putTime: Date.now()
                    }, prior);
                }
                if (schedulingModes[queueOptions.scheduleMode].putThenRun) {
                    let newTaskCount = queueOptions.concurrency - self.runningTasksCount;
                    if (newTaskCount < 1) {
                        return;
                    }
                    runTask(newTaskCount);
                }
            });

        }

        function initTaskMode(firstTask) {
            // 首次添加任务，如果是函数，则设置为函数模式，否则设置为数据模式
            if (firstTask instanceof Function) {
                queueOptions.update({
                    taskMode: constants.TASK_MODE_FUNCTION
                });
            } else {
                queueOptions.update({
                    taskMode: constants.TASK_MODE_DATA
                });
            }
        }

        function get(count = 1) {
            return queueTasks.splice(0, count);
        }

        function runTask(count) {
            let newTasks = get(count);
            newTasks.forEach(task => {
                self.runningTasksCount++;
                // 根据任务模式决定执行函数
                let taskFunc = queueOptions.taskMode === constants.TASK_MODE_FUNCTION ? task.data() : queueOptions.handler(task.data);
                let p = (queueOptions.timeout > 0 ? Promise.race([utils.delayPromise(queueOptions.timeout), taskFunc]) : taskFunc);
                taskHandler(task, p);
            });
        }

        function taskHandler(task, p) {
            let startTime = Date.now();
            // 组任务第一次执行时标记开始时间
            task.tag && !(taskTag[task.tag].startTime) && (taskTag[task.tag].startTime = startTime);
            p.then(res => {
                self.runningTasksCount--;
                return getRes(undefined, res, startTime - task.putTime, Date.now() - startTime, task.retry);
            }).catch((err = constants.UNKNOWN_ERR) => {
                if (queueOptions.catch) {
                    setTimeout(() => {
                        queueOptions.catch(err);
                    }, 0);
                }
                self.runningTasksCount--;
                if (queueOptions.retry > task.retry) {
                    task.retry++;
                    if (queueOptions.retryPrior) {
                        queueTasks.unshift(task);
                    } else {
                        queueTasks.push(task);
                    }
                    return constants.RETRY_FLAG;
                } else {
                    return getRes(err, null, startTime - task.putTime, Date.now() - startTime, task.retry);
                }
            }).then(res => {
                // 是否主动补充任务
                if (schedulingModes[queueOptions.scheduleMode].replenish) {
                    runTask(1);
                }
                if (res !== constants.RETRY_FLAG) {
                    if (task.tag) {
                        taskTag[task.tag].remainingCount--;
                        taskTag[task.tag].results[task.index] = res;
                        if (taskTag[task.tag].remainingCount === 0) {
                            resolveTaskTag(task);
                        }
                    } else {
                        task.resolve(res);
                    }
                }
            });
        }

        function getRes(err, res, waitingTime = 0, runTime = 0, retry = 0) {
            return {
                err,
                res,
                waitingTime,
                runTime,
                retry
            }
        }

    }

    /**
     * 超时标识
     */
    Bobolink.TIMEOUT_FLAG = constants.TIMEOUT_FLAG;

    /**
     * 任务抛出异常，但没有具体错误信息时将得到此标识
     */
    Bobolink.UNKNOWN_ERR = constants.UNKNOWN_ERR;

    /**
     * 队列已满标识
     */
    Bobolink.EXCEEDED = constants.EXCEEDED;

    /**
     * 按频率调度模式
     */
    Bobolink.SCHEDULE_MODE_FREQUENCY = constants.SCHEDULE_MODE_FREQUENCY;

    /**
     * 立即调度模式
     */
    Bobolink.SCHEDULE_MODE_IMMEDIATELY = constants.SCHEDULE_MODE_IMMEDIATELY;

    /**
     * 饱和策略：终止
     */
    Bobolink.SATURATION_POLICY_ABORT = constants.SATURATION_POLICY_ABORT;

    /**
     * 饱和策略：移除最早任务
     */
    Bobolink.SATURATION_POLICY_DISCARD_OLDEST = constants.SATURATION_POLICY_DISCARD_OLDEST;

    /**
     * 任务模型，表明put进来的数据
     */
    Bobolink.TASK_MODE_DATA = constants.TASK_MODE_DATA;

    /**
     * 任务模型，表明put进来的是函数
     */
    Bobolink.TASK_MODE_FUNCTION = constants.TASK_MODE_FUNCTION;

    /**
     * 任务不支持，通常在往一个数据模型的队列放置函数或函数模型的队列中放置非函数时会得到此错误
     */
    Bobolink.TASK_ERROR = constants.TASK_ERROR;

    /**
     * 任务被取消（在饱和策略设置为丢弃最早任务时才会出现）
     */
    Bobolink.DISCARD = constants.DISCARD;

    /**
     * 提交了一个空数组时报错
     */
    Bobolink.EMPTY_ELEMENTS = constants.EMPTY_ELEMENTS;

    return Bobolink;
});