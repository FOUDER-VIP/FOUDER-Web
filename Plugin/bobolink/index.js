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
        // ֻ�����ڲ�״̬�жϣ�������Ҫ����
        RETRY_FLAG: 'bobolink_retry',
        UNKNOWN_ERR: 'bobolink_unknown_error',
        EXCEEDED: 'bobolink_exceeded_maximum_task_number',
        INVALID: 'bobolink_invalid',
        // ��Ƶ�ʵ���ģʽ
        SCHEDULE_MODE_FREQUENCY: 'frequency',
        // ��������ģʽ
        SCHEDULE_MODE_IMMEDIATELY: 'immediately',
        // ���Ͳ��ԣ���ֹ
        SATURATION_POLICY_ABORT: 'abort',
        // ���Ͳ��ԣ�������������
        SATURATION_POLICY_DISCARD_OLDEST: 'discardOldest',
        // ����ģ�ͣ�����put����������
        TASK_MODE_DATA: 'data',
        // ����ģ�ͣ�����put�������Ǻ���
        TASK_MODE_FUNCTION: 'function',
        TASK_ERROR: 'bobolink_unsupported_task_type',
        // �����Ƴ�
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

    // ��ȡ���Լ��
    instance.getGCD = function (a, b) {
        if (b === 0) {
            return a;
        }
        return instance.getGCD(b, a % b);
    }


    // ����Ψһid
    instance.genId = function (digits) {
        return Date.now() + getAndIncrement(digits);
    }

    // һ��ʱ���ʧ��
    instance.delayPromise = function (ms) {
        return new Promise((_, reject) => {
            setTimeout(() => {
                reject(constants.TIMEOUT_FLAG);
            }, ms);
        });
    }

    // ��ȡֵ���ڼ�ⲻ����ʱ����Ĭ��ֵ
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
     * @typedef  {Object}   options                     - ������
     * @property {number}   [concurrency=5]             - ����Ĳ���������Ĭ��Ϊ5
     * @property {number}   [timeout=15000]             - ����ĳ�ʱʱ�䣨ms����Ĭ��Ϊ15000������Ϊ0�򲻳�ʱ
     * @property {number}   [retry=0]                   - ����ʧ��ʱ�����Դ�����Ĭ��Ϊ0
     * @property {boolean}  [retryPrior=false]          - �Ƿ����ȴ�����������Ĭ��Ϊfalse���������Ϊtrue����ʧ�����Ե�����ᱻ���õ�����ͷ��
     * @property {boolean}  [newPrior=false]            - �Ƿ����ȴ���������Ĭ��Ϊfalse���������Ϊtrue�����¼��������ᱻ���õ�����ͷ��
     * @property {function} [catch=]                    - ����ʧ��ʱ��ץȡ������Ĭ��Ϊnull��������ʧ�����Ի�ص����catch
     * @property {number}   [max=65536]                 - ������е����ޣ�-1Ϊû�����ޣ�Ĭ��Ϊ65536
     * @property {string}   [scheduleMode=immediately]  - �������ģʽ��
     * - frequency����Ƶ�ʵ��ȣ�ÿ�룩
     * - immediately���������ȣ������ύ����ִ�У�
     * @property {number}   [countPerTimeScale=100]     - ������ģʽΪfrequencyʱ����ͨ���˲���ָ��ÿ��ʱ��̶ȵ��ȵ���������Ĭ��Ϊ100����ʵ�Ĳ��������ᳬ��concurrency��
     * - ����Ϊ-1��ÿ�ζ����ȶ����е���������
     * @property {number}   [timeScale=1]               - ʱ��̶ȣ�s����Ĭ��Ϊ1s
     * @property {string}   [taskMode=]                 - ָ������ģʽ��
     * - ��ѡֵΪdata��put���ݣ���function��put��������
     * - û������ʱ�����ݵ�һ����������������ƶϡ�
     * @property {function} [handler=]                  - ������ģʽΪdataʱ��ÿ��ִ�����񽫻ص�handler�������뵱�������Ӧ��data��
     * - Ҫ�󷵻�һ��Promise��
     * @property {string}   [saturationPolicy=abort]    - ���б���ʱ�ύ����Ĳ��ԣ�Ĭ��Ϊabort��
     * - abort����ֹ���׳��쳣��
     * - discardOldest���޳�������������ڳ��ռ�ִ�������񣩡�
     * 
     */

    /**
     * 
     * ����ѡ�������
     * 
     * ������ֵʱ��У��
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

        // ��ʼ��ѡ��
        for (let option in optionsSchema) {
            let optionSchema = optionsSchema[option];
            let optionValue = options && options[option];
            let condition = optionSchema.condition ? optionSchema.condition(optionValue) : true;
            let curOptionValue = utils.getOrDefault(optionValue, optionSchema.type, condition, optionSchema.default);
            self[option] = optionSchema.translate ? optionSchema.translate(curOptionValue) : curOptionValue;
        }

        /**
         * ��������
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
     * ����һ��ִ�ж���
     * @param { import("./options").options } options 
     * @class bobolink
     */
    Bobolink = function Bobolink(options) {

        let self = this;

        // ��������
        let queueOptions = new Options(options);

        let queueTasks = [];

        this.runningTasksCount = 0;

        let taskTag = {};

        let frequencyController;

        /**
         * 
         * ����ģʽ����Ϊ����
         * 
         * putThenRun: ���������ύ�Ƿ�����ִ��
         * replenish: ��������ִ������Ƿ񲹳�ִ��
         * init: ��Ӧģʽ�ĳ�ʼ������
         * 
         */
        let schedulingModes = {};

        // ��Ƶ�ʵ���
        schedulingModes[constants.SCHEDULE_MODE_FREQUENCY] = {
            putThenRun: false,
            replenish: false,
            init: () => {
                // ��Լ��
                let gcd = utils.getGCD(queueOptions.timeScale * 1000, queueOptions.countPerTimeScale);
                // �õ��Ժ���Ϊ��λ��һ������Ƶ��
                let interval = queueOptions.timeScale * 1000 / gcd;
                // �õ�ÿ������Ƶ������Ҫ���ȵ�������
                let taskNumber = queueOptions.countPerTimeScale / gcd;
                // ÿ������Ƶ�ʵ���������������
                frequencyController = setInterval(() => {
                    // ʣ��ɲ�����������
                    let rest = queueOptions.concurrency - self.runningTasksCount;
                    if (rest > 0) {
                        runTask(Math.min(rest, queueOptions.countPerTimeScale === -1 ? queueTasks.length : taskNumber));
                    }
                }, queueOptions.countPerTimeScale === -1 ? queueOptions.timeScale * 1000 : interval);
            }
        };

        // ��ʱ����
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
         * ��ȡ��ǰ�����е�������
         */
        this.queueTaskSize = 0;

        /**
         * ��ȡ��ǰ���е�����
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

        // �Ƴ����ɸ�������
        function discardOldest(len) {
            let discardLen = Math.min(len, queueTasks.length);
            // ��������������ȵĲ��ԣ����βΪ������
            if (queueOptions.newPrior) {
                queueTasks.length = queueTasks.length - discardLen;
            } else {
                // �����ͷΪ������
                let oldestTasks = queueTasks.splice(0, discardLen);
                oldestTasks.forEach(task => {
                    if (task.tag) {
                        taskTag[task.tag].remainingCount--;
                        // �������ʶΪȡ��
                        taskTag[task.tag].results[task.index] = getRes(constants.DISCARD, undefined, Date.now() - task.putTime, 0, 0);
                        if (taskTag[task.tag].remainingCount === 0) {
                            resolveTaskTag(task);
                        }
                    }
                });
            }
        }

        /**
         * ����ʵ��
         */
        this.destory = function () {
            // �Ƴ���ʱ��
            if (frequencyController) {
                clearInterval(frequencyController);
            }
            // ����δִ������
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
         * @typedef {object}  ts    - ����
         * @property {any}    err   - ������Ϣ��err === undefinedʱ˵��û������ɹ�
         * @property {any}    res   - ����ķ�������
         * @property {number} waitingTime   - �����ڶ����еȴ���ʱ�䣨ms��
         * @property {number} runTime       - �����ִ��ʱ��
         * @property {number} retry         - ��������Դ��� 
         */

        /**
         * �ύһ����һ������
         * 
         * @param {any|any[]} datas           - �ύ���ݻ��ִ�к������ɺ���Ҫ��ִ�к󷵻�һ��Promise��
         * @param {boolean}   [prior=false]   - �������Ƿ�����ִ��
         * @returns {Promise<ts>}
         */
        this.put = this.push = function (datas, prior) {
            if (Array.isArray(datas) && datas.length == 0) {
                return Promise.reject(constants.EMPTY_ELEMENTS);
            }
            // ����״̬
            if (queueOptions.max !== -1 && (queueTasks.length + (Array.isArray(datas) ? datas.length : 1) > queueOptions.max)) {
                // ��ֹʱ��ֱ���׳��쳣
                if (queueOptions.saturationPolicy === constants.SATURATION_POLICY_ABORT) {
                    return Promise.reject(constants.EXCEEDED);
                } else if (queueOptions.saturationPolicy === constants.SATURATION_POLICY_DISCARD_OLDEST) {
                    let len = Array.isArray(datas) ? datas.length : 1;
                    // ���һ�η�������������ڶ��е��������ֱ���޳���ͷ������һ������Ӧ���Ƕ�ͷ������ʱ�����磩
                    if (len > queueOptions.max) {
                        len = queueOptions.max;
                        datas.splice(0, len);
                    }
                    discardOldest(len);
                }
            }
            // û�����ù�����ģʽ�Ļ����ӵ�һ�ε��������ƶ�
            if (!queueOptions.taskMode) {
                let firstTask = Array.isArray(datas) ? datas[0] : datas;
                initTaskMode(firstTask);
            }
            return new Promise((resolve, reject) => {
                // ���������Ƿ���ϵ�ǰ����ģʽ
                if (Array.isArray(datas)) {
                    let tag = utils.genId();
                    // ɸѡ���񣬺���ģʽʱ��Ӧ�޳����зǺ���������
                    let validData = datas.filter(task => {
                        if (queueOptions.taskMode === constants.TASK_MODE_FUNCTION) {
                            return task instanceof Function;
                        } else {
                            return !(task instanceof Function);
                        }
                    });
                    // ���������ǲ�������������������
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
            // �״������������Ǻ�����������Ϊ����ģʽ����������Ϊ����ģʽ
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
                // ��������ģʽ����ִ�к���
                let taskFunc = queueOptions.taskMode === constants.TASK_MODE_FUNCTION ? task.data() : queueOptions.handler(task.data);
                let p = (queueOptions.timeout > 0 ? Promise.race([utils.delayPromise(queueOptions.timeout), taskFunc]) : taskFunc);
                taskHandler(task, p);
            });
        }

        function taskHandler(task, p) {
            let startTime = Date.now();
            // �������һ��ִ��ʱ��ǿ�ʼʱ��
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
                // �Ƿ�������������
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
     * ��ʱ��ʶ
     */
    Bobolink.TIMEOUT_FLAG = constants.TIMEOUT_FLAG;

    /**
     * �����׳��쳣����û�о��������Ϣʱ���õ��˱�ʶ
     */
    Bobolink.UNKNOWN_ERR = constants.UNKNOWN_ERR;

    /**
     * ����������ʶ
     */
    Bobolink.EXCEEDED = constants.EXCEEDED;

    /**
     * ��Ƶ�ʵ���ģʽ
     */
    Bobolink.SCHEDULE_MODE_FREQUENCY = constants.SCHEDULE_MODE_FREQUENCY;

    /**
     * ��������ģʽ
     */
    Bobolink.SCHEDULE_MODE_IMMEDIATELY = constants.SCHEDULE_MODE_IMMEDIATELY;

    /**
     * ���Ͳ��ԣ���ֹ
     */
    Bobolink.SATURATION_POLICY_ABORT = constants.SATURATION_POLICY_ABORT;

    /**
     * ���Ͳ��ԣ��Ƴ���������
     */
    Bobolink.SATURATION_POLICY_DISCARD_OLDEST = constants.SATURATION_POLICY_DISCARD_OLDEST;

    /**
     * ����ģ�ͣ�����put����������
     */
    Bobolink.TASK_MODE_DATA = constants.TASK_MODE_DATA;

    /**
     * ����ģ�ͣ�����put�������Ǻ���
     */
    Bobolink.TASK_MODE_FUNCTION = constants.TASK_MODE_FUNCTION;

    /**
     * ����֧�֣�ͨ������һ������ģ�͵Ķ��з��ú�������ģ�͵Ķ����з��÷Ǻ���ʱ��õ��˴���
     */
    Bobolink.TASK_ERROR = constants.TASK_ERROR;

    /**
     * ����ȡ�����ڱ��Ͳ�������Ϊ������������ʱ�Ż���֣�
     */
    Bobolink.DISCARD = constants.DISCARD;

    /**
     * �ύ��һ��������ʱ����
     */
    Bobolink.EMPTY_ELEMENTS = constants.EMPTY_ELEMENTS;

    return Bobolink;
});