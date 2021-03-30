function createDappPluginContainer() {
    var DappPluginContainer = {
        _ispligindebug: true//基础设置---基础参数
        , _ethWei: Math.pow(10, 18)//不会改变
        , _ethWeiShow: 1//根据合约设置改变
        , _usdtWei: Math.pow(10, 6)//不会改变
        , _ettWei: Math.pow(10, 18)//不会改变
        , _usdt_ett_Ratio: Math.pow(10, 12)//不会改变
        , _univ2Wei: Math.pow(10, 6)//不会改变
        //token合约地址/ABI
        , _ContractAddress_USDT: null
        , _ContractDecimals_USDT: null

        , _ContractAddress_ETT1: null
        , _ContractDecimals_ETT1: null

        , _ContractAddress_ETT2: null
        , _ContractDecimals_ETT2: null

        , _ContractAddress_ETT3: null
        , _ContractDecimals_ETT3: null

        , _ContractAddress_ETT_NFT: null
        , _ContractDecimals_ETT_NFT: null

        //trongridKey
        // 每个项目都要去https://www.trongrid.io/ 申请IDkey 不要混用
        , _trongridKey: null
        //合约地址
        , _ContractAddress: null
        //合约ABI
        , _ContractABI: null
        //合约运行网络
        //1：以太坊主网 https://cn.etherscan.com/
        //3：Ropsten测试链 https://ropsten.etherscan.io/
        //42：Kovan测试链 https://kovan.etherscan.io/
        //4：Rinkeby测试链 https://rinkeby.etherscan.io/
        //5：Goerli测试链 https://goerli.etherscan.io/
        , _ContractRunNetwork: '1'//主网

        //默认推荐码
        , _ContractRecommendCode: ''
        , _ContractInitAddr: ''

        //余额显示精度
        , _AccountDisplayPrecision: 6
        //合约显示精度——奖金数据等
        , _ContractDisplayPrecision: 6

        //页面定义istest 网络环境
        , _istest: window._istest || 0
        //页面定义_isNotAuthorize 账户授权
        , _isNotAuthorize: window._isNotAuthorize

        //基础插件参数
        , _dappBaseOptions : {
            transaction: {
                Decimals: 18,//精度 转出金额扩大精度默认18位
                //ContractAddress: null,//ERC20合约地址
                //ContractABI:null,//RRC20代币合约ABI
            },
            msgTips: function (msg) {
                //定义消息处理
                //alert(msg)
                window.msgtips && window.msgtips(msg)
            },
            initCallBack: function (e, defaultAccount, isEthereum, isNotFirst) {
                var _this = DappPluginContainer
                //初始化完成后回调/网络变更回调/账号变更回调
                _this._ispligindebug && console.log('2.BaseInit:' + defaultAccount)

                //在这里处理 账号余额信息
                typeof _this.HandleUserInfo === "function" && _this.HandleUserInfo(e, defaultAccount, isEthereum)
            },
            initHandleNetworkType: function (e, networkType, networkName, networkScan) {
                var _this = DappPluginContainer
                //1：以太坊主网 https://cn.etherscan.com/
                //3：Ropsten测试链 https://ropsten.etherscan.io/
                //42：Kovan测试链 https://kovan.etherscan.io/
                //4：Rinkeby测试链 https://rinkeby.etherscan.io/
                //5：Goerli测试链 https://goerli.etherscan.io/
                //初始化完成后回调/网络变更回调
                _this._ispligindebug && console.log('1.NetworkType:' + networkType + ', NetworkName:' + networkName + ', NetworkScan:' + networkScan)

                //在这里处理 网络相关信息
                typeof _this.HandleNetworkType === "function" && _this.HandleNetworkType(e, networkType, networkName, networkScan)
            },
            networkChangeEventCallBack: function (e, networkType, networkName, networkScan) {
                var _this = DappPluginContainer
                //1：以太坊主网 https://cn.etherscan.com/
                //3：Ropsten测试链 https://ropsten.etherscan.io/
                //42：Kovan测试链 https://kovan.etherscan.io/
                //4：Rinkeby测试链 https://rinkeby.etherscan.io/
                //5：Goerli测试链 https://goerli.etherscan.io/
                //网络变更后回调
                _this._ispligindebug && console.log('networkChanged: new Network: NetworkType:' + networkType + ', NetworkName:' + networkName + ', NetworkScan:' + networkScan)
            },
            accountsChangedEventCallBack: function (e, defaultAccount) {
                var _this = DappPluginContainer
                //账号变更事件
                _this._ispligindebug && console.log('accountsChangedEvent: new accounts:' + defaultAccount)
            },
            isAuthorize: !this._isNotAuthorize,//启用授权
            defaultNetwork: this._ContractRunNetwork,//默认网络
            trongridKey: this.trongridKey,
        }
        //合约插件参数
        , _dappContractOptions : {
            contract: {
                ContractAddress: this._ContractAddress,//合约地址
                //合约ABI
                ContractABI: this._ContractABI,
            },
            msgTips: function (msg) {
                //定义消息处理
                //alert(msg)
                window.msgtips && window.msgtips(msg)
            },
            initCallBack: function (e, networkType, networkName, networkScan) {
                var _this = DappPluginContainer
                //初始化完成后回调/网络变更回调
                _this._ispligindebug && console.log("3.ContractTnit: Contract init succeed! " + 'NetworkType:' + networkType + ', NetworkName:' + networkName + ', NetworkScan:' + networkScan)

                e.getContractLink(null, function (contractLink) {
                    var contractAddress = e.getContractAddress()

                    //在这里处理 合约基础信息
                    typeof _this.HandleContractBaseInfo === "function" && _this.HandleContractBaseInfo(e, networkType, contractLink, contractAddress)
                })
            },
            initAuthorizeCallBack: function (e, defaultAccount, isAuthorize) {
                var _this = DappPluginContainer
                //初始化完成后授权回调/网络变更回调/账号变更回调
                _this._ispligindebug && console.log("4.AuthorizeCallBack:" + isAuthorize + ",defaultAccount" + defaultAccount)

                //在这里处理 合约账号信息
                e.getNetworkType(function (networkType) {
                    typeof _this.HandleContractUserInfo === "function" && _this.HandleContractUserInfo(e, isAuthorize, networkType, defaultAccount)
                })
            },
            accountsChangedEventCallBack: function (e, defaultAccount, isShowdefaultAccount) {
                var _this = DappPluginContainer
                //账号变更事件
                _this._ispligindebug && console.log('accountsChangedEvent: new accounts:' + defaultAccount)
            },
        }
        , _updateOptions: function () {
            var _this = this
            //_dappBaseOptions
            _this._dappBaseOptions.isAuthorize = !_this._isNotAuthorize
            _this._dappBaseOptions.defaultNetwork = _this._ContractRunNetwork
            _this._dappBaseOptions.trongridKey = _this._trongridKey
            //_dappContractOptions
            _this._dappContractOptions.contract.ContractAddress = _this._ContractAddress
            _this._dappContractOptions.contract.ContractABI = _this._ContractABI
        }
        //-----------------------------------------------------------
        //初始化插件---创建自定义插件
        , init: function () {
            var _this = this
            if (_this._istest) {
                //测试设置
                //_this._ethWeiShow = 0.01//100倍测试
                _this._ContractRunNetwork = '4'//nile测试链
                _this._ContractAddress = 'TYGzBo5ZDkuwTFMXY1Pzs6JsrqN1wX3ayz'
                _this._ContractABI = [{ "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "time", "type": "uint256" }], "name": "DigOreEvent", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": true, "internalType": "address", "name": "code", "type": "address" }, { "indexed": true, "internalType": "address", "name": "rCode", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "time", "type": "uint256" }], "name": "LoanEvent", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnerTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "operator", "type": "address" }], "name": "RoleAdded", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "operator", "type": "address" }], "name": "RoleRemoved", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "time", "type": "uint256" }], "name": "SettleGlobleAwardEvent", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "index", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "count", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "time", "type": "uint256" }], "name": "SettleLoanEvent", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "_from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "_to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "_value", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "time", "type": "uint256" }], "name": "TransferEvent", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "_token", "type": "address" }, { "indexed": true, "internalType": "address", "name": "_from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "_to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "_value", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "time", "type": "uint256" }], "name": "TransferTokenEvent", "type": "event" }, { "inputs": [{ "internalType": "address", "name": "_dbAddr", "type": "address" }, { "internalType": "address", "name": "_USDTAddr", "type": "address" }], "name": "__Constructor_init", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_operator", "type": "address" }], "name": "addAddressToWhitelist", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint32", "name": "_index", "type": "uint32" }], "name": "cashDigOreETT", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint32", "name": "_index", "type": "uint32" }], "name": "cashLoanETT", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint32", "name": "_day", "type": "uint32" }], "name": "getDigOreAmounts", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "addr", "type": "address" }, { "internalType": "uint32", "name": "_Index", "type": "uint32" }], "name": "getDigOreAmounts", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint32", "name": "index", "type": "uint32" }], "name": "getDigOreDayInfo", "outputs": [{ "internalType": "uint256[7]", "name": "", "type": "uint256[7]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "addr", "type": "address" }, { "internalType": "uint32", "name": "index", "type": "uint32" }, { "internalType": "uint8", "name": "ore", "type": "uint8" }], "name": "getDigOreRecord", "outputs": [{ "internalType": "uint256[9]", "name": "", "type": "uint256[9]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "addr", "type": "address" }, { "internalType": "uint32", "name": "index", "type": "uint32" }], "name": "getDirectAwardRecord", "outputs": [{ "internalType": "uint256[2]", "name": "", "type": "uint256[2]" }, { "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "addr", "type": "address" }, { "internalType": "uint32", "name": "index", "type": "uint32" }], "name": "getGlobalAwardRecord", "outputs": [{ "internalType": "uint256[3]", "name": "", "type": "uint256[3]" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getGloleRanking", "outputs": [{ "internalType": "address[15]", "name": "", "type": "address[15]" }, { "internalType": "uint256[5][15]", "name": "", "type": "uint256[5][15]" }, { "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "uid", "type": "uint256" }], "name": "getIndexMapping", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint32", "name": "index", "type": "uint32" }], "name": "getLoanDayInfo", "outputs": [{ "internalType": "uint256[4]", "name": "", "type": "uint256[4]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "addr", "type": "address" }, { "internalType": "uint32", "name": "index", "type": "uint32" }], "name": "getLoanRecord", "outputs": [{ "internalType": "uint256[6]", "name": "", "type": "uint256[6]" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getLoanRunDays", "outputs": [{ "internalType": "uint32", "name": "", "type": "uint32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getMineRunDays", "outputs": [{ "internalType": "uint32", "name": "", "type": "uint32" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_index", "type": "uint256" }], "name": "getParam", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "rCode", "type": "address" }], "name": "getRCodeMappingLength", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "addr", "type": "address" }], "name": "getUserInfo", "outputs": [{ "internalType": "uint256[1]", "name": "", "type": "uint256[1]" }, { "internalType": "address", "name": "", "type": "address" }, { "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint32", "name": "index", "type": "uint32" }, { "internalType": "uint32", "name": "_dayIndx", "type": "uint32" }], "name": "getYestodayLoans", "outputs": [{ "internalType": "uint256[6]", "name": "", "type": "uint256[6]" }, { "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "isLoanOpen", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "isMineOpen", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "code", "type": "address" }], "name": "isUsedCode", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_operator", "type": "address" }], "name": "isWhitelist", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }, { "internalType": "address", "name": "", "type": "address" }, { "internalType": "uint256[]", "name": "", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "", "type": "uint256[]" }, { "internalType": "bytes", "name": "", "type": "bytes" }], "name": "onERC1155BatchReceived", "outputs": [{ "internalType": "bytes4", "name": "", "type": "bytes4" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }, { "internalType": "address", "name": "", "type": "address" }, { "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "bytes", "name": "", "type": "bytes" }], "name": "onERC1155Received", "outputs": [{ "internalType": "bytes4", "name": "", "type": "bytes4" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_operator", "type": "address" }], "name": "removeAddressFromWhitelist", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint32", "name": "_index", "type": "uint32" }], "name": "returnLoanETT", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint32", "name": "_index", "type": "uint32" }], "name": "returnUinv2ETT", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_taddr", "type": "address" }, { "internalType": "address", "name": "_addr", "type": "address" }, { "internalType": "uint256", "name": "_val", "type": "uint256" }], "name": "sendTokenToAddr", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_taddr", "type": "address" }, { "internalType": "address", "name": "_addr", "type": "address" }, { "internalType": "uint256", "name": "_id", "type": "uint256" }, { "internalType": "uint256", "name": "_val", "type": "uint256" }], "name": "sendTokenToAddr_1155", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_taddr", "type": "address" }, { "internalType": "address", "name": "_addr", "type": "address" }, { "internalType": "uint256", "name": "_val", "type": "uint256" }], "name": "sendTokenToAddr_USDT", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token1", "type": "address" }, { "internalType": "address", "name": "token2", "type": "address" }], "name": "setETTAddress", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_NFT1155Addr", "type": "address" }], "name": "setNFTAddress", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_index", "type": "uint256" }, { "internalType": "uint256", "name": "_value", "type": "uint256" }], "name": "setParam", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "time", "type": "uint256" }, { "internalType": "uint256", "name": "index", "type": "uint256" }], "name": "setStartTime", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token3", "type": "address" }], "name": "setSwapAddress", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "settleGlobleAward", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint32", "name": "index", "type": "uint32" }, { "internalType": "uint32", "name": "count", "type": "uint32" }], "name": "settleLoanETTs", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "stateView", "outputs": [{ "internalType": "uint256[22]", "name": "", "type": "uint256[22]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes4", "name": "interfaceId", "type": "bytes4" }], "name": "supportsInterface", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "money", "type": "uint256" }], "name": "toDigOre", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "money", "type": "uint256" }, { "internalType": "address", "name": "rCode", "type": "address" }], "name": "toLoan", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "addr", "type": "address" }], "name": "userView", "outputs": [{ "internalType": "uint256[25]", "name": "", "type": "uint256[25]" }, { "internalType": "address", "name": "", "type": "address" }, { "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "stateMutability": "payable", "type": "receive" }]
                _this._ContractRecommendCode = ''
                _this._ContractInitAddr = ''

                _this._ContractAddress_USDT = "TU3m8u9jZufgHynrevfMtUG9JikjJheBnx"
                _this._ContractDecimals_USDT = 6

                _this._ContractAddress_ETT1 = "TCdb1eNCxLeybzXxax4JCdF6xzNf51KavG"
                _this._ContractDecimals_ETT1 = 18

                _this._ContractAddress_ETT2 = "TKXJcnnXCDKe57zbQ1C4DJjRk78x8qfXZ4"
                _this._ContractDecimals_ETT2 = 18

                _this._ContractAddress_ETT3 = "TM45wihtkzSemsnXiuopGUK9uFzPqJWcoN"
                _this._ContractDecimals_ETT3 = 6

                _this._ContractAddress_ETT_NFT = "TUKQbHLfSrYv7amo8KDJLKxe8iYBWtpDdr"
                _this._ContractDecimals_ETT_NFT = 18
            } else {
                //主网设置
                _this._trongridKey = "73b7566d-9af1-4337-8171-0efcb842a84e" // 每个项目都要去https://www.trongrid.io/ 申请IDkey 不要混用
                //_this._ContractRunNetwork = '1'//主网
                _this._ContractAddress = 'TV8gLm3mwVi8Ntnf3wokkDXyhtmRmg9NwB'//填入主网合约地址
                _this._ContractABI = [{ "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "time", "type": "uint256" }], "name": "DigOreEvent", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": true, "internalType": "address", "name": "code", "type": "address" }, { "indexed": true, "internalType": "address", "name": "rCode", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "time", "type": "uint256" }], "name": "LoanEvent", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnerTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "operator", "type": "address" }], "name": "RoleAdded", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "operator", "type": "address" }], "name": "RoleRemoved", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "time", "type": "uint256" }], "name": "SettleGlobleAwardEvent", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "index", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "count", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "time", "type": "uint256" }], "name": "SettleLoanEvent", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "_from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "_to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "_value", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "time", "type": "uint256" }], "name": "TransferEvent", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "_token", "type": "address" }, { "indexed": true, "internalType": "address", "name": "_from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "_to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "_value", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "time", "type": "uint256" }], "name": "TransferTokenEvent", "type": "event" }, { "inputs": [{ "internalType": "address", "name": "_dbAddr", "type": "address" }, { "internalType": "address", "name": "_USDTAddr", "type": "address" }], "name": "__Constructor_init", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_operator", "type": "address" }], "name": "addAddressToWhitelist", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint32", "name": "_index", "type": "uint32" }], "name": "cashDigOreETT", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint32", "name": "_index", "type": "uint32" }], "name": "cashLoanETT", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint32", "name": "_day", "type": "uint32" }], "name": "getDigOreAmounts", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "addr", "type": "address" }, { "internalType": "uint32", "name": "_Index", "type": "uint32" }], "name": "getDigOreAmounts", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint32", "name": "index", "type": "uint32" }], "name": "getDigOreDayInfo", "outputs": [{ "internalType": "uint256[7]", "name": "", "type": "uint256[7]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "addr", "type": "address" }, { "internalType": "uint32", "name": "index", "type": "uint32" }, { "internalType": "uint8", "name": "ore", "type": "uint8" }], "name": "getDigOreRecord", "outputs": [{ "internalType": "uint256[9]", "name": "", "type": "uint256[9]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "addr", "type": "address" }, { "internalType": "uint32", "name": "index", "type": "uint32" }], "name": "getDirectAwardRecord", "outputs": [{ "internalType": "uint256[2]", "name": "", "type": "uint256[2]" }, { "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "addr", "type": "address" }, { "internalType": "uint32", "name": "index", "type": "uint32" }], "name": "getGlobalAwardRecord", "outputs": [{ "internalType": "uint256[3]", "name": "", "type": "uint256[3]" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getGloleRanking", "outputs": [{ "internalType": "address[15]", "name": "", "type": "address[15]" }, { "internalType": "uint256[5][15]", "name": "", "type": "uint256[5][15]" }, { "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "uid", "type": "uint256" }], "name": "getIndexMapping", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint32", "name": "index", "type": "uint32" }], "name": "getLoanDayInfo", "outputs": [{ "internalType": "uint256[4]", "name": "", "type": "uint256[4]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "addr", "type": "address" }, { "internalType": "uint32", "name": "index", "type": "uint32" }], "name": "getLoanRecord", "outputs": [{ "internalType": "uint256[6]", "name": "", "type": "uint256[6]" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getLoanRunDays", "outputs": [{ "internalType": "uint32", "name": "", "type": "uint32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getMineRunDays", "outputs": [{ "internalType": "uint32", "name": "", "type": "uint32" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_index", "type": "uint256" }], "name": "getParam", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "rCode", "type": "address" }], "name": "getRCodeMappingLength", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "addr", "type": "address" }], "name": "getUserInfo", "outputs": [{ "internalType": "uint256[1]", "name": "", "type": "uint256[1]" }, { "internalType": "address", "name": "", "type": "address" }, { "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint32", "name": "index", "type": "uint32" }, { "internalType": "uint32", "name": "_dayIndx", "type": "uint32" }], "name": "getYestodayLoans", "outputs": [{ "internalType": "uint256[6]", "name": "", "type": "uint256[6]" }, { "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "isLoanOpen", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "isMineOpen", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "code", "type": "address" }], "name": "isUsedCode", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_operator", "type": "address" }], "name": "isWhitelist", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }, { "internalType": "address", "name": "", "type": "address" }, { "internalType": "uint256[]", "name": "", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "", "type": "uint256[]" }, { "internalType": "bytes", "name": "", "type": "bytes" }], "name": "onERC1155BatchReceived", "outputs": [{ "internalType": "bytes4", "name": "", "type": "bytes4" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }, { "internalType": "address", "name": "", "type": "address" }, { "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "bytes", "name": "", "type": "bytes" }], "name": "onERC1155Received", "outputs": [{ "internalType": "bytes4", "name": "", "type": "bytes4" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_operator", "type": "address" }], "name": "removeAddressFromWhitelist", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint32", "name": "_index", "type": "uint32" }], "name": "returnLoanETT", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint32", "name": "_index", "type": "uint32" }], "name": "returnUinv2ETT", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_taddr", "type": "address" }, { "internalType": "address", "name": "_addr", "type": "address" }, { "internalType": "uint256", "name": "_val", "type": "uint256" }], "name": "sendTokenToAddr", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_taddr", "type": "address" }, { "internalType": "address", "name": "_addr", "type": "address" }, { "internalType": "uint256", "name": "_id", "type": "uint256" }, { "internalType": "uint256", "name": "_val", "type": "uint256" }], "name": "sendTokenToAddr_1155", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_taddr", "type": "address" }, { "internalType": "address", "name": "_addr", "type": "address" }, { "internalType": "uint256", "name": "_val", "type": "uint256" }], "name": "sendTokenToAddr_USDT", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token1", "type": "address" }, { "internalType": "address", "name": "token2", "type": "address" }], "name": "setETTAddress", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_NFT1155Addr", "type": "address" }], "name": "setNFTAddress", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_index", "type": "uint256" }, { "internalType": "uint256", "name": "_value", "type": "uint256" }], "name": "setParam", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "time", "type": "uint256" }, { "internalType": "uint256", "name": "index", "type": "uint256" }], "name": "setStartTime", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token3", "type": "address" }], "name": "setSwapAddress", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "settleGlobleAward", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint32", "name": "index", "type": "uint32" }, { "internalType": "uint32", "name": "count", "type": "uint32" }], "name": "settleLoanETTs", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "stateView", "outputs": [{ "internalType": "uint256[22]", "name": "", "type": "uint256[22]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes4", "name": "interfaceId", "type": "bytes4" }], "name": "supportsInterface", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "money", "type": "uint256" }], "name": "toDigOre", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "money", "type": "uint256" }, { "internalType": "address", "name": "rCode", "type": "address" }], "name": "toLoan", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "addr", "type": "address" }], "name": "userView", "outputs": [{ "internalType": "uint256[25]", "name": "", "type": "uint256[25]" }, { "internalType": "address", "name": "", "type": "address" }, { "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "stateMutability": "payable", "type": "receive" }]
                _this._ContractRecommendCode = ''
                _this._ContractInitAddr = ''

                _this._ContractAddress_USDT = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"
                _this._ContractDecimals_USDT = 6

                _this._ContractAddress_ETT1 = "THRV4oVfNksstU7HhNBpd2TLyiywjX8PJJ"
                _this._ContractDecimals_ETT1 = 18

                _this._ContractAddress_ETT2 = "TC7TR4umoXVtzSDG7wCZ6EjVzTRUVVSsiq"
                _this._ContractDecimals_ETT2 = 18

                _this._ContractAddress_ETT3 = "TPAMzqCReawxygioTBUFgNYaWT9weAFtF9"
                _this._ContractDecimals_ETT3 = 6

                _this._ContractAddress_ETT_NFT = "TEZwC4GZHaakCYN4X5UfoGbH6i7Ztx48ZM"
                _this._ContractDecimals_ETT_NFT = 18
            }
            _this._updateOptions()
            _this._DappContractPlugin = InitDappContract(_this._dappContractOptions, _this._dappBaseOptions)
        }
        //-----------------------------------------------------------
        //定义显示数据刷新触发事件
        , HandleShowChangeLoad
        //定义显示数据方法
        , HandleShowContractInfo

        , HandleShowContractUserInfo

        //定义处理代币授权方法
        , HandleShowTokenApproveLoad
        //定义处理交易提示提示方法
        , HandleShowTransactionProcessingLoad

        //初始化插件处理事件---初始化相关处理
        //处理网络相关 优先级1
        , HandleNetworkType: function (e, networkType, networkName, networkScan) {
            var _this = this;
            //e 为DappBase基础对象

            //显示合约运行网络名称
            var showContractRunNetworkName = _this._ContractRunNetwork != 1 ? e._getNetworkName(_this._ContractRunNetwork) + '网络' : '主网'
            $('.data-networkFullName').html(showContractRunNetworkName)

            if (networkType == _this._ContractRunNetwork) {
                //显示投资按钮
                $('.data-contractNetworkNormal').show()
                $('.data-switchNetwork').hide()
            } else {
                //运行网限制
                //显示切换网络
                $('.data-contractNetworkNormal').hide()
                $('.data-switchNetwork').show()

                //提示
                var msgtipsswitchNetwork = "合约运行在 " + showContractRunNetworkName + ' 请切换为 ' + showContractRunNetworkName
                window.msgtips3 && window.msgtips3(msgtipsswitchNetwork)
            }

            //显示当前网络名称
            $('.data-networkName').html(networkName + ' Net')
            //设置当前网络区块浏览器链接
            $('.data-networkScan').attr('href', networkScan)
        }

        //处理账号余额信息 优先级2
        , HandleUserInfo: function (e, defaultAccount, isEthereum, isShowdefaultAccount) {
            var _this = this;
            //e 为DappBase基础对象
            if (!isEthereum) {
                //显示安装兼容钱包
                $('.data-installationSupport').show()
            } else {
                $('.data-installationSupport').hide()
            }
            $('.data-defaultAccount').html("--")
            $('.data-balance-usdt').html("--")
            $('.data-balance-ett1').html("--")
            $('.data-balance-ett2').html("--")
            $('.data-balance-ett3').html("--")
            $('.data-contractbalance-nft-ett').html("--")
            $('.data-contractbalance-nft-count').html("--")
            if (defaultAccount) {
                $('.data-defaultAccount').html(defaultAccount).data("account", defaultAccount)

                //设置账户地址区块浏览器链接
                e.getAccountLink(defaultAccount, function (accountLink) {
                    $('.data-accountLink').attr('href', accountLink)
                })

                //初始化显示
                //显示当前账号eth余额-项目不用到
                //e.getBalance(function (_balance) {
                //    _this._ispligindebug && console.log('2.1.HandleUserInfo:' + _balance)
                //    //$('.data-balance').html(_balance.toFloor(_this._AccountDisplayPrecision))
                //}, defaultAccount)

                //获取用户usdt代币余额
                e.getTokenBalance(function (_balance) {
                    $('.data-balance-usdt').html(_balance.toFloor(_this._AccountDisplayPrecision))
                    $('.data2-balance-usdt').html(_balance.toFloor(_this._AccountDisplayPrecision))
                }, defaultAccount, _this._ContractAddress_USDT, null, _this._ContractDecimals_USDT)

                //获取用户ett1代币余额
                e.getTokenBalance(function (_balance) {
                    $('.data-balance-ett1').html(_balance.toFloor(_this._AccountDisplayPrecision))
                    $('.data2-balance-ett1').html(_balance.toFloor(_this._AccountDisplayPrecision))
                }, defaultAccount, _this._ContractAddress_ETT1, null, _this._ContractDecimals_ETT1)

                //获取用户ett2代币余额
                e.getTokenBalance(function (_balance) {
                    $('.data-balance-ett2').html(_balance.toFloor(_this._AccountDisplayPrecision))
                }, defaultAccount, _this._ContractAddress_ETT2, null, _this._ContractDecimals_ETT2)

                //获取用户ett3代币余额
                e.getTokenBalance(function (_balance) {
                    $('.data-balance-ett3').html(_balance.toFloor(_this._AccountDisplayPrecision))
                }, defaultAccount, _this._ContractAddress_ETT3, null, _this._ContractDecimals_ETT3)

                //获取用户ERC1155指定同质化代币余额
                e.getTokenBalance_ERC1155(function (_balance) {
                    $('.data-balance-nft-ett').html(_balance.toFloor(_this._AccountDisplayPrecision))
                    $('.data2-balance-nft-ett').html(_balance.toFloor(_this._AccountDisplayPrecision))
                }, defaultAccount, e.getTokenIndex_ERC1155(1, 0), _this._ContractAddress_ETT_NFT, null, _this._ContractDecimals_ETT_NFT)
                //获取用户ERC1155指定同非质化代币数量统计
                e.getTokenBalance_ERC1155(function (_balance) {
                    $('.data-balance-nft-count').html(_balance.toFloor(_this._AccountDisplayPrecision))
                    $('.data2-balance-nft-count').html(_balance.toFloor(_this._AccountDisplayPrecision))
                }, defaultAccount, e.getTokenIndex_ERC1155(0, 1), _this._ContractAddress_ETT_NFT, null)

                //提示显示当前账号
                isShowdefaultAccount && window.msgtips2 && window.msgtips2(defaultAccount, '当前账户')
            }
        }

        //处理合约基础信息 优先级3
        , HandleContractBaseInfo: function (e, networkType, contractLink, contractAddress) {
            var _this = this;
            //e 为DappContract对象

            _this.HandleShowChangeLoad && _this.HandleShowChangeLoad()

            _this._ispligindebug && console.log('3.1.HandleUserInfo:' + contractLink)

            //设置合约区块浏览器验证地址链接
            $('.data-contractLink').attr('href', contractLink)

            //初始化显示
            $('.data-mainContractAddress').html("--") //合约地址
            $('.data-stateView0').html("--") //平台会员总数
            $('.data-stateView1').html("--") //平台在投资借贷USDT数量
            $('.data-stateView2').html("--") //平台累计投资借贷USDT数量
            $('.data-stateView3').html("--") //累计已发全球奖励数量
            $('.data-stateView4').html("--") //平台累计借ETT数量
            $('.data-stateView5').html("--") //平台累计销毁ETT数量
            $('.data-stateView6').html("--") //平台累计流动univ2 token
            $('.data-stateView7').html("--") //平台当前在流动univ2 token 
            $('.data-stateView8').html("--") //平台剩余可借出ETT_1数量
            $('.data-stateView9').html("--") //平台剩余可挖矿ETT2数量
            $('.data-stateView12').html("--") //全球总数奖励池
            $('.data-stateView13').html("--") //已产CAMT数量
            $('.data-stateView20').html("--") //平台剩余可挖矿NFT碎片数量
            $('.data-stateView21').html("--") //已产NFT碎片数量
            //合约运行网络一致
            if (networkType == _this._ContractRunNetwork) {
                $('.data-mainContractAddress').html(_this._ContractAddress) //合约地址

                //显示合约状态-页面中间
                _this.Dapp_getContractState(function (resulr, rdata) {
                    if (resulr) {
                        $('.data-stateView0').html(rdata[0]) //平台会员总数
                        $('.data-stateView1').html(rdata[1].div(_this._usdtWei).toFloor(_this._ContractDisplayPrecision)) //平台在投资借贷USDT数量
                        $('.data-stateView2').html(rdata[2].div(_this._usdtWei).toFloor(_this._ContractDisplayPrecision)) //平台累计投资借贷USDT数量
                        $('.data-stateView3').html(rdata[3].div(_this._ettWei).toFloor(_this._ContractDisplayPrecision)) //累计已发全球奖励数量
                        $('.data-stateView4').html(rdata[4].div(_this._ettWei).toFloor(_this._ContractDisplayPrecision)) //平台累计借ETT数量
                        $('.data-stateView5').html(rdata[5].div(_this._ettWei).toFloor(_this._ContractDisplayPrecision)) //平台累计销毁ETT数量
                        $('.data-stateView6').html(rdata[6].div(_this._univ2Wei).toFloor(_this._ContractDisplayPrecision)) //平台累计流动univ2 token
                        $('.data-stateView7').html(rdata[7].div(_this._univ2Wei).toFloor(_this._ContractDisplayPrecision)) //平台当前在流动univ2 token 
                        $('.data-stateView8').html(rdata[8].div(_this._ettWei).toFloor(_this._ContractDisplayPrecision)) //平台剩余可借出ETT_1数量
                        $('.data-stateView9').html(rdata[9].div(_this._ettWei).toFloor(_this._ContractDisplayPrecision)) //平台剩余可挖矿ETT2数量
                        $('.data-stateView12').html(rdata[12].div(_this._ettWei).toFloor(_this._ContractDisplayPrecision)) //全球总数奖励池
                        $('.data-stateView13').html(rdata[13].div(_this._ettWei).toFloor(_this._ContractDisplayPrecision)) //已产CAMT数量
                        $('.data-stateView20').html(rdata[20].div(_this._ettWei).toFloor(_this._ContractDisplayPrecision)) //平台剩余可挖矿NFT碎片数量
                        $('.data-stateView21').html(rdata[21].div(_this._ettWei).toFloor(_this._ContractDisplayPrecision)) //已产NFT碎片数量
                        //相关业务处理
                        $('#data-countDownTime').data("days", rdata[16])
                        $('#data-countDownTime').data("times", rdata[18])
                        $('#loan-USDT-Amount').data("min", rdata[10].div(_this._usdtWei))
                        $('#loan-USDT-Amount').data("max", rdata[11].div(_this._usdtWei))

                        _this.HandleShowContractInfo && _this.HandleShowContractInfo()
                    }
                })
            }
        }

        //处理合约账号信息 优先级4
        , HandleContractUserInfo: function (e, isAuthorize, networkType, defaultAccount) {
            var _this = this;
            //e 为DappContract对象

            //初始化显示
            $('.data-userinfo1').html("--")//在投USDT总数
            $('.data-userinfo3').html("--")//已提PAMT总数
            $('.data-userinfo6').html("--")//推荐奖收益
            $('.data-userinfo7').html("--")//管理奖收益
            $('.data-userinfo18').html("--")//全球奖收益
            $('.data-userinfo8').html("--")//在投令牌总数
            $('.data-userinfo10').html("--")//已产CAMT总数
            $('.data-userinfo16').html("--")//直推伙伴人数
            $('.data-userinfo17').html("--")//团队伙伴人数
            $('.data-userinfo21').html("--")//已产NFT碎片数量

            //鉴权成功且合约运行网络一致
            if (isAuthorize && networkType == _this._ContractRunNetwork) {
                //获取用户信息
                _this.Dapp_getContractUserInfo(function (resulr, rdata) {
                    if (resulr) {
                        var tempUserInfoData = rdata[0]
                        $('.data-userinfo1').html(tempUserInfoData[1].div(_this._usdtWei).toFloor(_this._ContractDisplayPrecision))//在投USDT总数
                        $('.data-userinfo3').html(tempUserInfoData[3].div(_this._ettWei).toFloor(_this._ContractDisplayPrecision))//已提PAMT总数
                        $('.data-userinfo6').html(tempUserInfoData[6].div(_this._usdtWei).toFloor(_this._ContractDisplayPrecision))//推荐奖收益
                        $('.data-userinfo7').html(tempUserInfoData[7].div(_this._usdtWei).toFloor(_this._ContractDisplayPrecision))//管理奖收益
                        $('.data-userinfo18').html(tempUserInfoData[18].div(_this._ettWei).toFloor(_this._ContractDisplayPrecision))//全球奖收益
                        $('.data-userinfo8').html(tempUserInfoData[8].div(_this._univ2Wei).toFloor(_this._ContractDisplayPrecision))//在投令牌总数
                        $('.data-userinfo10').html(tempUserInfoData[10].div(_this._ettWei).toFloor(_this._ContractDisplayPrecision))//已产CAMT总数
                        $('.data-userinfo16').html(tempUserInfoData[16])//直推伙伴人数
                        $('.data-userinfo17').html(tempUserInfoData[17])//团队伙伴人数
                        $('.data-userinfo21').html(tempUserInfoData[21].div(_this._ettWei).toFloor(_this._ContractDisplayPrecision))//已产CAMT总数

                        _this.HandleShowContractUserInfo && _this.HandleShowContractUserInfo()
                    }
                })
            }
        }
        //-----------------------------------------------------------
        //合约方法---ABI 交互实现
        //获取合约信息
        , Dapp_getContractState: function (cb) {
            var _this = this;
            try {
                _this._DappContractPlugin.ContractObj.methods
                    .stateView()
                    .call(_this._DappContractPlugin.DappBaseObj.options._callParam)
                    .then(function (rdata) {
                        rdata = _HandleRdata(rdata)
                        //回调处理
                        typeof cb === "function" && cb(true, rdata)
                    })

                function _HandleRdata(rdata) {
                    var o_rdata = rdata

                    for (var i = 0; i < o_rdata.length; i++) {
                        rdata[i] = o_rdata[i].toString()
                    }

                    return rdata
                }
            } catch (e) {
                console.log(e)
                typeof cb === "function" && cb(false, e.message || e)
            }
        }

        //获取用户合约信息
        , Dapp_getContractUserInfo: function (cb, addr) {
            var _this = this;
            try {
                if (addr) {
                    _this._DappContractPlugin.ContractObj.methods
                        .userView(addr)
                        .call(_this._DappContractPlugin.DappBaseObj.options._callParam)
                        .then(function (rdata) {
                            //回调处理
                            rdata = _HandleRdata(rdata)
                            typeof cb === "function" && cb(true, rdata)
                        })
                } else {
                    _this._DappContractPlugin.getCurrentAccount(function (_addr) {
                        _this._DappContractPlugin.ContractObj.methods
                            .userView(_addr)
                            .call(_this._DappContractPlugin.DappBaseObj.options._callParam)
                            .then(function (rdata) {
                                rdata = _HandleRdata(rdata)
                                //回调处理
                                typeof cb === "function" && cb(true, rdata)
                            })
                    })
                }
                function _HandleRdata(rdata) {
                    var o_rdata = rdata

                    for (var i = 0; i < o_rdata[0].length; i++) {
                        rdata[0][i] = o_rdata[0][i].toString()
                    }

                    rdata[1] = _this._DappContractPlugin.getAddressFromHex(o_rdata[1].toString())
                    rdata[2] = _this._DappContractPlugin.getAddressFromHex(o_rdata[2].toString())

                    return rdata
                }
            } catch (e) {
                console.log(e)
                typeof cb === "function" && cb(false, e.message || e)
            }
        }

        //检查注册码是否被使用
        , Dapp_isUsedCode: function (code, cb) {
            var _this = this;
            try {
                _this._DappContractPlugin.ContractObj.methods
                    .isUsedCode(code)
                    .call(_this._DappContractPlugin.DappBaseObj.options._callParam)
                    .then(function (rdata) {
                        //回调处理
                        typeof cb === "function" && cb(true, rdata)
                    })
            } catch (e) {
                console.log(e)
                typeof cb === "function" && cb(false, e.message || e)
            }
        }

        //借款投资
        , Dapp_invest: function (money, code, rCode, cb) {
            var _this = this;
            try {
                _this.HandleShowTransactionProcessingLoad && _this.HandleShowTransactionProcessingLoad(true)
                if (!money) {
                    throw { cede: 401, message: "请输入金额" }
                }
                if (!code) {
                    throw { cede: 401, message: "请输入邀请码" }
                }
                if (!rCode) {
                    throw { cede: 401, message: "请输入推荐码" }
                }
                if (rCode == 'rCode') {
                    rCode = ''
                }

                var money = money.mul(_this._usdtWei)
                var _to = _this._DappContractPlugin.getContractAddress()

                _this._DappContractPlugin.getCurrentAccount(function (_from) {
                    var params = {
                        to: _to,
                        from: _from,
                        value: 0,
                    }
                    params = $.extend({}, _this._DappContractPlugin.DappBaseObj.options._sendParam, params)//将一个空对象做为第一个参数

                    _this._DappContractPlugin.ContractObj.methods
                        .toLoan(money, rCode)
                        .send(params)
                        .then(function (rdata) {
                            console.log(rdata)
                            //回调处理
                            _this.HandleShowTransactionProcessingLoad && _this.HandleShowTransactionProcessingLoad(false)
                            typeof cb === "function" && cb(true, rdata)

                            //监听到账
                            _this._DappContractPlugin.DappBaseObj.checkTransactionReceipt(rdata, function (receipt) {
                                console.log(receipt)
                                //完成回调
                                //完成刷新会员信息
                                //直接调用账户变更事件进行更新页面数据
                                _this._DappContractPlugin.getNetworkType(function (networkType) {
                                    _this._DappContractPlugin.DappBaseObj._networkChangedEvent(networkType)
                                })
                            })
                        }, function (err) {
                            console.log(err)
                            _this.HandleShowTransactionProcessingLoad && _this.HandleShowTransactionProcessingLoad(false)
                            typeof cb === "function" && cb(false, err)
                        })
                })
            } catch (e) {
                console.log(e)
                _this.HandleShowTransactionProcessingLoad && _this.HandleShowTransactionProcessingLoad(false)
                typeof cb === "function" && cb(false, e.message || e)
            }
        }

        //提取借款代币
        , Dapp_cashLoanETT: function (id, cb) {
            var _this = this;
            try {
                _this.HandleShowTransactionProcessingLoad && _this.HandleShowTransactionProcessingLoad(true)
                var params = $.extend({}, _this._DappContractPlugin.DappBaseObj.options._sendParam)//将一个空对象做为第一个参数
                params.feeLimit = 100000000
                _this._DappContractPlugin.ContractObj.methods
                    .cashLoanETT(id)
                    .send(params)
                    .then(function (rdata) {
                        console.log(rdata)
                        //回调处理
                        _this.HandleShowTransactionProcessingLoad && _this.HandleShowTransactionProcessingLoad(false)
                        typeof cb === "function" && cb(true, rdata)

                        //监听到账
                        _this._DappContractPlugin.DappBaseObj.checkTransactionReceipt(rdata, function (receipt) {
                            console.log(receipt)
                            //完成回调
                            //完成刷新会员信息
                            //直接调用账户变更事件进行更新页面数据
                            _this._DappContractPlugin.getCurrentAccount(function (_from) {
                                _this._DappContractPlugin.DappBaseObj._accountsChangedEvent(_from)
                                _this._DappContractPlugin._accountsChangedEvent(_from)
                            })
                        })
                    }, function (err) {
                        console.log(err)
                        _this.HandleShowTransactionProcessingLoad && _this.HandleShowTransactionProcessingLoad(false)
                        typeof cb === "function" && cb(false, err)
                    })
            } catch (e) {
                console.log(e)
                _this.HandleShowTransactionProcessingLoad && _this.HandleShowTransactionProcessingLoad(false)
                typeof cb === "function" && cb(false, e.message || e)
            }
        }

        //归还借款
        , Dapp_returnLoanETT: function (id, cb) {
            var _this = this;
            try {
                _this.HandleShowTransactionProcessingLoad && _this.HandleShowTransactionProcessingLoad(true)
                var params = $.extend({}, _this._DappContractPlugin.DappBaseObj.options._sendParam)//将一个空对象做为第一个参数
                params.feeLimit = 150000000
                _this._DappContractPlugin.ContractObj.methods
                    .returnLoanETT(id)
                    .send(params)
                    .then(function (rdata) {
                        console.log(rdata)
                        //回调处理
                        _this.HandleShowTransactionProcessingLoad && _this.HandleShowTransactionProcessingLoad(false)
                        typeof cb === "function" && cb(true, rdata)

                        //监听到账
                        _this._DappContractPlugin.DappBaseObj.checkTransactionReceipt(rdata, function (receipt) {
                            console.log(receipt)
                            //完成回调
                            //完成刷新会员信息
                            //直接调用账户变更事件进行更新页面数据
                            _this._DappContractPlugin.getNetworkType(function (networkType) {
                                _this._DappContractPlugin.DappBaseObj._networkChangedEvent(networkType)
                            })
                        })
                    }, function (err) {
                        console.log(err)
                        _this.HandleShowTransactionProcessingLoad && _this.HandleShowTransactionProcessingLoad(false)
                        typeof cb === "function" && cb(false, err)
                    })
            } catch (e) {
                console.log(e)
                _this.HandleShowTransactionProcessingLoad && _this.HandleShowTransactionProcessingLoad(false)
                typeof cb === "function" && cb(false, e.message || e)
            }
        }

        //流动挖矿投资
        , Dapp_digOre: function (money, cb) {
            var _this = this;
            try {
                _this.HandleShowTransactionProcessingLoad && _this.HandleShowTransactionProcessingLoad(true)
                var params = $.extend({}, _this._DappContractPlugin.DappBaseObj.options._sendParam)//将一个空对象做为第一个参数
                params.feeLimit = 100000000
                _this._DappContractPlugin.ContractObj.methods
                    .toDigOre(money)
                    .send(params)
                    .then(function (rdata) {
                        console.log(rdata)
                        //回调处理
                        _this.HandleShowTransactionProcessingLoad && _this.HandleShowTransactionProcessingLoad(false)
                        typeof cb === "function" && cb(true, rdata)

                        //监听到账
                        _this._DappContractPlugin.DappBaseObj.checkTransactionReceipt(rdata, function (receipt) {
                            console.log(receipt)
                            //完成回调
                            //完成刷新会员信息
                            //直接调用账户变更事件进行更新页面数据
                            _this._DappContractPlugin.getNetworkType(function (networkType) {
                                _this._DappContractPlugin.DappBaseObj._networkChangedEvent(networkType)
                            })
                        })
                    }, function (err) {
                        console.log(err)
                        _this.HandleShowTransactionProcessingLoad && _this.HandleShowTransactionProcessingLoad(false)
                        typeof cb === "function" && cb(false, err)
                    })
            } catch (e) {
                console.log(e)
                _this.HandleShowTransactionProcessingLoad && _this.HandleShowTransactionProcessingLoad(false)
                typeof cb === "function" && cb(false, e.message || e)
            }
        }

        //结算提取挖矿代币
        , Dapp_cashDigOreETT: function (id, cb) {
            var _this = this;
            try {
                _this.HandleShowTransactionProcessingLoad && _this.HandleShowTransactionProcessingLoad(true)
                var params = $.extend({}, _this._DappContractPlugin.DappBaseObj.options._sendParam)//将一个空对象做为第一个参数
                params.feeLimit = 300000000
                _this._DappContractPlugin.ContractObj.methods
                    .cashDigOreETT(id)
                    .send(params)
                    .then(function (rdata) {
                        console.log(rdata)
                        //回调处理
                        _this.HandleShowTransactionProcessingLoad && _this.HandleShowTransactionProcessingLoad(false)
                        typeof cb === "function" && cb(true, rdata)

                        //监听到账
                        _this._DappContractPlugin.DappBaseObj.checkTransactionReceipt(rdata, function (receipt) {
                            console.log(receipt)
                            //完成回调
                            //完成刷新会员信息
                            //直接调用账户变更事件进行更新页面数据
                            _this._DappContractPlugin.getNetworkType(function (networkType) {
                                _this._DappContractPlugin.DappBaseObj._networkChangedEvent(networkType)
                            })
                        })
                    }, function (err) {
                        console.log(err)
                        _this.HandleShowTransactionProcessingLoad && _this.HandleShowTransactionProcessingLoad(false)
                        typeof cb === "function" && cb(false, err)
                    })
            } catch (e) {
                console.log(e)
                _this.HandleShowTransactionProcessingLoad && _this.HandleShowTransactionProcessingLoad(false)
                typeof cb === "function" && cb(false, e.message || e)
            }
        }

        //撤资流动挖矿
        , Dapp_returnUinv2ETT: function (id, cb) {
            var _this = this;
            try {
                _this.HandleShowTransactionProcessingLoad && _this.HandleShowTransactionProcessingLoad(true)
                var params = $.extend({}, _this._DappContractPlugin.DappBaseObj.options._sendParam)//将一个空对象做为第一个参数
                params.feeLimit = 300000000
                _this._DappContractPlugin.ContractObj.methods
                    .returnUinv2ETT(id)
                    .send(params)
                    .then(function (rdata) {
                        console.log(rdata)
                        //回调处理
                        _this.HandleShowTransactionProcessingLoad && _this.HandleShowTransactionProcessingLoad(false)
                        typeof cb === "function" && cb(true, rdata)

                        //监听到账
                        _this._DappContractPlugin.DappBaseObj.checkTransactionReceipt(rdata, function (receipt) {
                            console.log(receipt)
                            //完成回调
                            //完成刷新会员信息
                            //直接调用账户变更事件进行更新页面数据
                            _this._DappContractPlugin.getNetworkType(function (networkType) {
                                _this._DappContractPlugin.DappBaseObj._networkChangedEvent(networkType)
                            })
                        })
                    }, function (err) {
                        console.log(err)
                        _this.HandleShowTransactionProcessingLoad && _this.HandleShowTransactionProcessingLoad(false)
                        typeof cb === "function" && cb(false, err)
                    })
            } catch (e) {
                console.log(e)
                _this.HandleShowTransactionProcessingLoad && _this.HandleShowTransactionProcessingLoad(false)
                typeof cb === "function" && cb(false, e.message || e)
            }
        }


        //获取全球15排名
        , Dapp_getGloleRanking: function (cb) {
            var _this = this;
            try {
                _this._DappContractPlugin.ContractObj.methods
                    .getGloleRanking()
                    .call(_this._DappContractPlugin.DappBaseObj.options._callParam)
                    .then(function (rdata) {
                        rdata = _HandleRdata(rdata)
                        //回调处理
                        typeof cb === "function" && cb(true, rdata)
                    })

                function _HandleRdata(rdata) {
                    var o_rdata = rdata

                    for (var i = 0; i < o_rdata[0].length; i++) {
                        rdata[0][i] = _this._DappContractPlugin.getAddressFromHex(o_rdata[0][i].toString())
                        if (rdata[0][i] == _this._DappContractPlugin.getAddressFromHex('0')) {
                            rdata[0][i] = "N/A"
                        }
                    }

                    for (var i = 0; i < o_rdata[1].length; i++) {
                        for (var j = 0; j < o_rdata[1][i].length; j++) {
                            rdata[1][i][j] = o_rdata[1][i][j].toString()
                        }
                    }

                    rdata[2] = o_rdata[2].toString()

                    return rdata
                }
            } catch (e) {
                console.log(e)
                typeof cb === "function" && cb(false, e.message || e)
            }
        }

        //获取用户借款记录
        , Dapp_getLoanRecord: function (cb, addr, index) {
            var _this = this;
            try {
                if (addr) {
                    _this._DappContractPlugin.ContractObj.methods
                        .getLoanRecord(addr, index)
                        .call(_this._DappContractPlugin.DappBaseObj.options._callParam)
                        .then(function (rdata) {
                            rdata = _HandleRdata(rdata)
                            //回调处理
                            typeof cb === "function" && cb(true, rdata)
                        })
                } else {
                    _this._DappContractPlugin.getCurrentAccount(function (_addr) {
                        _this._DappContractPlugin.ContractObj.methods
                            .getLoanRecord(_addr, index)
                            .call(_this._DappContractPlugin.DappBaseObj.options._callParam)
                            .then(function (rdata) {
                                rdata = _HandleRdata(rdata)
                                //回调处理
                                typeof cb === "function" && cb(true, rdata)
                            })
                    })
                }
                function _HandleRdata(rdata) {
                    var o_rdata = rdata

                    for (var i = 0; i < o_rdata.length; i++) {
                        rdata[i] = o_rdata[i].toString()
                    }

                    return rdata
                }
            } catch (e) {
                console.log(e)
                typeof cb === "function" && cb(false, e.message || e)
            }
        }

        //获取用户全球分红奖励记录
        , Dapp_getGlobalAwardRecord: function (cb, addr, index) {
            var _this = this;
            try {
                if (addr) {
                    _this._DappContractPlugin.ContractObj.methods
                        .getGlobalAwardRecord(addr, index)
                        .call(_this._DappContractPlugin.DappBaseObj.options._callParam)
                        .then(function (rdata) {
                            rdata = _HandleRdata(rdata)
                            //回调处理
                            typeof cb === "function" && cb(true, rdata)
                        })
                } else {
                    _this._DappContractPlugin.getCurrentAccount(function (_addr) {
                        _this._DappContractPlugin.ContractObj.methods
                            .getGlobalAwardRecord(_addr, index)
                            .call(_this._DappContractPlugin.DappBaseObj.options._callParam)
                            .then(function (rdata) {
                                rdata = _HandleRdata(rdata)
                                //回调处理
                                typeof cb === "function" && cb(true, rdata)
                            })
                    })
                }
                function _HandleRdata(rdata) {
                    var o_rdata = rdata

                    for (var i = 0; i < o_rdata.length; i++) {
                        rdata[i] = o_rdata[i].toString()
                    }

                    return rdata
                }
            } catch (e) {
                console.log(e)
                typeof cb === "function" && cb(false, e.message || e)
            }
        }

        //获取用户推荐奖记录
        , Dapp_getDirectAwardRecord: function (cb, addr, index) {
            var _this = this;
            try {
                if (addr) {
                    _this._DappContractPlugin.ContractObj.methods
                        .getDirectAwardRecord(addr, index)
                        .call(_this._DappContractPlugin.DappBaseObj.options._callParam)
                        .then(function (rdata) {
                            rdata = _HandleRdata(rdata)
                            //回调处理
                            typeof cb === "function" && cb(true, rdata)
                        })
                } else {
                    _this._DappContractPlugin.getCurrentAccount(function (_addr) {
                        _this._DappContractPlugin.ContractObj.methods
                            .getDirectAwardRecord(_addr, index)
                            .call(_this._DappContractPlugin.DappBaseObj.options._callParam)
                            .then(function (rdata) {
                                rdata = _HandleRdata(rdata)
                                //回调处理
                                typeof cb === "function" && cb(true, rdata)
                            })
                    })
                }

                function _HandleRdata(rdata) {
                    var o_rdata = rdata

                    for (var i = 0; i < o_rdata[0].length; i++) {
                        rdata[0][i] = o_rdata[0][i].toString()
                    }

                    rdata[1] = _this._DappContractPlugin.getAddressFromHex(rdata[1].toString())

                    return rdata
                }
            } catch (e) {
                console.log(e)
                typeof cb === "function" && cb(false, e.message || e)
            }
        }

        //获取用户管理奖记录
        , Dapp_getManagementAwardRecord: function (cb, addr, index) {
            var _this = this;
            try {
                if (addr) {
                    _this._DappContractPlugin.ContractObj.methods
                        .getManagementAwardRecord(addr, index)
                        .call(_this._DappContractPlugin.DappBaseObj.options._callParam)
                        .then(function (rdata) {
                            //回调处理
                            typeof cb === "function" && cb(true, rdata)
                        })
                } else {
                    _this._DappContractPlugin.getCurrentAccount(function (_addr) {
                        _this._DappContractPlugin.ContractObj.methods
                            .getManagementAwardRecord(_addr, index)
                            .call(_this._DappContractPlugin.DappBaseObj.options._callParam)
                            .then(function (rdata) {
                                //回调处理
                                typeof cb === "function" && cb(true, rdata)
                            })
                    })
                }
            } catch (e) {
                console.log(e)
                typeof cb === "function" && cb(false, e.message || e)
            }
        }

        //获取用户流动挖矿记录
        , Dapp_getDigOreRecord: function (cb, addr, index) {
            var _this = this;
            try {
                if (addr) {
                    _this._DappContractPlugin.ContractObj.methods
                        .getDigOreRecord(addr, index, 1)
                        .call(_this._DappContractPlugin.DappBaseObj.options._callParam)
                        .then(function (rdata) {
                            rdata = _HandleRdata(rdata)
                            //回调处理
                            typeof cb === "function" && cb(true, rdata)
                        })
                } else {
                    _this._DappContractPlugin.getCurrentAccount(function (_addr) {
                        _this._DappContractPlugin.ContractObj.methods
                            .getDigOreRecord(_addr, index)
                            .call(_this._DappContractPlugin.DappBaseObj.options._callParam)
                            .then(function (rdata) {
                                rdata = _HandleRdata(rdata)
                                //回调处理
                                typeof cb === "function" && cb(true, rdata)
                            })
                    })
                }
                function _HandleRdata(rdata) {
                    var o_rdata = rdata

                    for (var i = 0; i < o_rdata.length; i++) {
                        rdata[i] = o_rdata[i].toString()
                    }

                    return rdata
                }
            } catch (e) {
                console.log(e)
                typeof cb === "function" && cb(false, e.message || e)
            }
        }

        //获取平台流动挖矿信息
        , Dapp_getDigOreDayInfo: function (cb, index) {
            var _this = this;
            try {
                _this._DappContractPlugin.ContractObj.methods
                    .getDigOreDayInfo(index)
                    .call(_this._DappContractPlugin.DappBaseObj.options._callParam)
                    .then(function (rdata) {
                        rdata = _HandleRdata(rdata)
                        //回调处理
                        typeof cb === "function" && cb(true, rdata)
                    })
                function _HandleRdata(rdata) {
                    var o_rdata = rdata

                    for (var i = 0; i < o_rdata.length; i++) {
                        rdata[i] = o_rdata[i].toString()
                    }

                    return rdata
                }
            } catch (e) {
                console.log(e)
                typeof cb === "function" && cb(false, e.message || e)
            }
        }

        //-----------------------------------------------------------

        //获取当前用户注册/邀请码
        , business_getCurrentAccountCode: function (cb, addr) {
            var _this = this;
            _this.Dapp_getContractUserInfo(function (resulr, rdata) {
                var code
                if (resulr) {
                    //typeof cb === "function" && cb(rdata[1], false)
                    if (rdata[0][0] != 0) {
                        code = rdata[1]
                        //回调处理
                        typeof cb === "function" && cb(code, 2)
                        return
                    } else {
                        _this.Dapp_getContractState(function (resulr, rdata) {
                            if (resulr) {
                                _this._DappContractPlugin.getCurrentAccount(function (_addr) {
                                    code = _addr
                                    //直接回调，不验证
                                    typeof cb === "function" && cb(code, Number(rdata[0]) == 0 ? 0 : 1)
                                })
                            }
                        })
                        return
                    }
                }
                //重新获取注册码
                _this.business_afreshAccountCode(cb)
            }, addr)
        }
        //重新获取注册/邀请码
        , business_afreshAccountCode: function (cb) {
            var _this = this;
            var newCode = ''
            //newCode = _this._DappContractPlugin.randomString(6)
            if (newCode) {
                _this.Dapp_isUsedCode(newCode, function (resulr, rdata) {
                    if (resulr) {
                        if (!rdata) {
                            //回调处理
                            typeof cb === "function" && cb(newCode, true)
                        } else {
                            _this.business_afreshAccountCode(cb)
                        }
                    } else {
                        console.log("check newCode ERR")
                    }
                })
            } else {
                _this._DappContractPlugin.getCurrentAccount(function (_addr) {
                    newCode = _addr
                    //直接回调，不验证
                    typeof cb === "function" && cb(newCode, false)
                })
            }
        }
        //获取默认推荐码
        , business_getDefaultRecommendCode: function () {
            var _this = this;
            return _this._ContractRecommendCode
        }
        , business_getDefaultRecommendCodeInit: function () {
            var _this = this;
            //return 'rCode'
            //return '0x0000000000000000000000000000000000000000'
            return _this._DappContractPlugin.getAddressFromHex('0')
        }
        //获取推荐码
        , business_getRecommendCode: function (cb, r) {
            var _this = this;
            var rCode
            //优先获取浏览器参数
            rCode = _this._DappContractPlugin.getUrlParam('rCode')
            if (rCode) {
                //回调处理
                typeof cb === "function" && cb(rCode, -1)
                return
            }
            if (rCode && !r) {
                //检查邀请码是否正确
                _this.Dapp_isUsedCode(rCode, function (resulr, rdata) {
                    if (resulr) {
                        if (rdata) {
                            //回调处理
                            typeof cb === "function" && cb(rCode, -2)
                        } else {
                            //不正确的邀请码
                            _this.business_getRecommendCode(cb, true)
                        }
                    } else {
                        console.log("check newCode ERR")
                    }
                })
            } else {
                //根据已注册的属性获取
                _this.Dapp_getContractUserInfo(function (resulr, rdata) {
                    if (resulr) {
                        var uid = rdata[0][0]
                        if (uid != 0) {
                            rCode = rdata[2]
                            //回调处理
                            typeof cb === "function" && cb(rCode, uid)
                            return
                        }
                    }
                    //未注册未填写 尝试获取 默认
                    rCode = _this.business_getDefaultRecommendCode()
                    typeof cb === "function" && cb(rCode, 0)
                })
            }
        }

        //借款投资
        , business_invest: function (money, cb, code, rCode) {
            var _this = this;
            try {
                if (!money) {
                    throw { cede: 401, message: "请输入金额" }
                }
                if (code) {
                    //已获取邀请码
                    business_invest_r(money, cb, code, rCode)
                } else {
                    //未获取邀请码
                    _this.business_getCurrentAccountCode(function (_code, isNweCode) {
                        business_invest_r(money, cb, _code, rCode)
                    })
                }
            } catch (e) {
                console.log(e)
                typeof cb === "function" && cb(false, e.message || e)
            }
            //自定义函数处理
            function business_invest_r(money, cb, _code, rCode) {
                console.log(_code)
                if (rCode) {
                    console.log(rCode)
                    business_invest_s(money, cb, _code, rCode, -1)
                } else {
                    _this.business_getRecommendCode(function (_rCode, rtype) {
                        console.log(_rCode)
                        business_invest_s(money, cb, _code, _rCode, rtype)
                    })
                }
            }

            function business_invest_s(money, cb, _code, rCode, rtype) {
                //地址处理
                _this._DappContractPlugin.DappBaseObj.getCurrentAccount(function (addr) {
                    //投资限额判断
                    _this.Dapp_getContractState(function (resulr, rdata) {
                        var _DCSdata = rdata
                        if (resulr) {
                            if (Number(_DCSdata[16]) <= 0) {
                                typeof cb === "function" && cb(false, "借贷未开始")
                                return
                            }
                            if (Number(money.mul(_this._usdtWei)) > Number(_DCSdata[11]) || Number(money.mul(_this._usdtWei)) < Number(_DCSdata[10])) {
                                typeof cb === "function" && cb(false, "不在数量限制范围")
                                return
                            }
                            rCode = rCode || _this.business_getDefaultRecommendCodeInit()
                            if (addr != _this._ContractInitAddr) {
                                if (rdata[0] != 0) {
                                    if (rCode == 'rCode' && rtype != 1) {
                                        typeof cb === "function" && cb(false, "请输入推荐码")
                                        return
                                    }
                                    if (rCode == _this._DappContractPlugin.getAddressFromHex('0') && rtype != 1) {
                                        typeof cb === "function" && cb(false, "请输入推荐人地址")
                                        return
                                    }
                                }
                            }
                            if (addr != _this._ContractInitAddr) {
                                if (rtype < 0) {
                                    //检查邀请码是否正确
                                    _this.Dapp_isUsedCode(rCode, function (resulr, rdata) {
                                        if (resulr) {
                                            if (rdata) {
                                                //投资
                                                business_invest_t(money, cb, _code, rCode, _DCSdata)
                                                return
                                            }
                                        }
                                        typeof cb === "function" && cb(false, "请输入正确的推荐码")
                                    })
                                } else {
                                    business_invest_t(money, cb, _code, rCode, _DCSdata)
                                }
                            }
                        }
                    })
                })
            }

            function business_invest_t(money, cb, _code, rCode, _DCSdata) {
                _this.Dapp_getContractUserInfo(function (resulr, rdata) {
                    var code
                    if (resulr) {
                        //typeof cb === "function" && cb(rdata[1], false)
                        if (Number(rdata[0][20]) >= Number(rdata[0][19])) {

                            typeof cb === "function" && cb(false, "您今天借款次数已达上限")
                            return
                        }
                        var money_Approve = money
                        business_invest_b(money, cb, _code, rCode, money_Approve)
                    }
                })
            }

            function business_invest_b(money, cb, _code, rCode, money_Approve) {
                _this.HandleShowTokenApproveLoad && _this.HandleShowTokenApproveLoad(true)
                _this._DappContractPlugin.Token_checkApprove(money_Approve, _this._ContractAddress_USDT, _this._DappContractPlugin.DappBaseObj.options._ERC20ABIinterface, _this._ContractDecimals_USDT, true, function (resulr, code, errmsg) {
                    if (resulr) {
                        _this.HandleShowTokenApproveLoad && _this.HandleShowTokenApproveLoad(false)
                        _this.Dapp_invest(money, _code, rCode, cb)
                    } else {
                        _this.HandleShowTokenApproveLoad && _this.HandleShowTokenApproveLoad(false)
                        //checktask.cancel = true
                        if (code == 1002) {
                            //typeof cb === "function" && cb(false, "授权操作金额失败:USDT,code:" + code + ",msg:余额不足")
                            typeof cb === "function" && cb(false, "USDT余额不足")
                        } else {
                            typeof cb === "function" && cb(false, "授权操作金额失败:USDT,code:" + code + ",msg:" + errmsg)
                        }
                    }
                }, true)
            }
        }

        //提取借款代币
        , business_cashLoanETT: function (id, cb) {
            var _this = this;
            try {
                _this.Dapp_cashLoanETT(id, cb)
            } catch (e) {
                console.log(e)
                typeof cb === "function" && cb(false, e.message || e)
            }
        }

        //归还代币-（需授权）
        , business_returnLoanETT: function (id, money, cb) {
            var _this = this;
            try {
                _this.HandleShowTokenApproveLoad && _this.HandleShowTokenApproveLoad(true)
                _this._DappContractPlugin.Token_checkApprove(money, _this._ContractAddress_ETT1, _this._DappContractPlugin.DappBaseObj.options._ERC20ABIinterface, _this._ContractDecimals_ETT1, true, function (resulr, code, errmsg) {
                    if (resulr) {
                        _this.HandleShowTokenApproveLoad && _this.HandleShowTokenApproveLoad(false)
                        _this.Dapp_returnLoanETT(id, cb)
                    } else {
                        _this.HandleShowTokenApproveLoad && _this.HandleShowTokenApproveLoad(false)
                        if (code == 1002) {
                            //typeof cb === "function" && cb(false, "授权操作金额失败:,code:" + code + ",msg:余额不足")
                            typeof cb === "function" && cb(false, "余额不足")
                        } else {
                            typeof cb === "function" && cb(false, "授权操作金额失败:,code:" + code + ",msg:" + errmsg)
                        }
                    }
                }, true)
            } catch (e) {
                console.log(e)
                typeof cb === "function" && cb(false, e.message || e)
            }
        }

        //流动挖矿-（需授权）
        , business_digOre: function (cb) {
            var _this = this;
            try {
                _this._DappContractPlugin.DappBaseObj.getTokenBalance(function (_balance) {
                    if (Number(_balance) > 0) {
                        //_balance = _balance.mul(Math.pow(10, _this._ContractDecimals_ETT3));
                        console.log(_balance);

                        _this.HandleShowTokenApproveLoad && _this.HandleShowTokenApproveLoad(true)
                        _this._DappContractPlugin.Token_checkApprove(_balance, _this._ContractAddress_ETT3, _this._DappContractPlugin.DappBaseObj.options._ERC20ABIinterface, _this._ContractDecimals_ETT3, true, function (resulr, code, errmsg) {
                            if (resulr) {
                                _this.HandleShowTokenApproveLoad && _this.HandleShowTokenApproveLoad(false)
                                _this.Dapp_digOre(_balance.mul(Math.pow(10, _this._ContractDecimals_ETT3)), cb)
                            } else {
                                _this.HandleShowTokenApproveLoad && _this.HandleShowTokenApproveLoad(false)
                                if (code == 1002) {
                                    //typeof cb === "function" && cb(false, "授权操作金额失败:,code:" + code + ",msg:余额不足")
                                    typeof cb === "function" && cb(false, "余额不足")
                                } else {
                                    typeof cb === "function" && cb(false, "授权操作金额失败:,code:" + code + ",msg:" + errmsg)
                                }
                            }
                        }, true)
                    } else {
                        typeof cb === "function" && cb(false, "无可用余额");
                    }
                }, null, _this._ContractAddress_ETT3, null, _this._ContractDecimals_ETT3);


            } catch (e) {
                console.log(e)
                typeof cb === "function" && cb(false, e.message || e)
            }
        }

        //提取流动挖矿代币
        , business_cashDigOreETT: function (id, cb) {
            var _this = this;
            try {
                _this.Dapp_cashDigOreETT(id, cb)
            } catch (e) {
                console.log(e)
                typeof cb === "function" && cb(false, e.message || e)
            }
        }

        //流动挖矿撤资
        , business_returnUinv2ETT: function (id, cb) {
            var _this = this;
            try {
                _this.Dapp_returnUinv2ETT(id, cb)
            } catch (e) {
                console.log(e)
                typeof cb === "function" && cb(false, e.message || e)
            }
        }


        //全球15排名
        , business_getGloleRanking: function (cb) {
            var _this = this;
            _this.Dapp_getGloleRanking(function (resulr, rdata) {
                if (resulr) {
                    //console.log(rdata)
                    var _records = []
                    for (var i = 0; i < rdata[0].length; i++) {

                        var _recordsData = {}
                        _recordsData.number = i + 1
                        _recordsData.addr = rdata[0][i].toString()
                        _recordsData.dir = rdata[1][i][0].div(_this._usdtWei)
                        _recordsData.dirs = rdata[1][i][1].div(_this._usdtWei)
                        _recordsData.loan = rdata[1][i][2].div(_this._usdtWei)
                        _recordsData.loans = rdata[1][i][3].div(_this._usdtWei)
                        _recordsData.awards = rdata[1][i][4].div(_this._ettWei)
                        _records.push(_recordsData)
                    }
                    typeof cb === "function" && cb(_records)
                }
            })
        }

        //借款记录
        , business_getLoanRecord: function (index, cb, addr) {
            var _this = this;
            _this.Dapp_getLoanRecord(function (resulr, rdata) {
                if (resulr) {
                    var _recordsData = {}
                    _recordsData.id = rdata[0]
                    _recordsData.inRunDays = rdata[1]
                    _recordsData.time = rdata[2].mul(1000).toString()
                    _recordsData.usdtAmount = rdata[3].div(_this._usdtWei)
                    _recordsData.ettAmount = rdata[4].div(_this._ettWei)
                    _recordsData.status = rdata[5].toString()
                    typeof cb === "function" && cb(_recordsData)
                }
            }, addr, index)
        }

        //获取用户全球分红奖励记录
        , business_getGlobalAwardRecord: function (index, cb, addr) {
            var _this = this;
            _this.Dapp_getGlobalAwardRecord(function (resulr, rdata) {
                if (resulr) {
                    var _recordsData = {}
                    _recordsData.time = rdata[0].mul(1000).toString()
                    _recordsData.amount = rdata[1].div(_this._ettWei)
                    _recordsData.ranking = rdata[2]
                    typeof cb === "function" && cb(_recordsData)
                }
            }, addr, index)
        }

        //获取用户推荐奖记录
        , business_getDirectAwardRecord: function (index, cb, addr) {
            var _this = this;
            _this.Dapp_getDirectAwardRecord(function (resulr, rdata) {
                if (resulr) {
                    var _recordsData = {}
                    _recordsData.time = rdata[0][0].mul(1000).toString()
                    _recordsData.amount = rdata[0][1].div(_this._usdtWei)
                    _recordsData.fromUser = rdata[1].toString()
                    typeof cb === "function" && cb(_recordsData)
                }
            }, addr, index)
        }

        //获取用户管理奖记录
        , business_getManagementAwardRecord: function (index, cb, addr) {
            var _this = this;
            _this.Dapp_getManagementAwardRecord(function (resulr, rdata) {
                if (resulr) {
                    var _recordsData = {}
                    _recordsData.time = rdata[0][0].mul(1000).toString()
                    _recordsData.amount = rdata[0][1].div(_this._usdtWei)
                    _recordsData.eraCount = rdata[0][2]
                    _recordsData.fromUser = rdata[1].toString()
                    typeof cb === "function" && cb(_recordsData)
                }
            }, addr, index)
        }

        //获取用户流动挖矿记录
        , business_getDigOreRecord: function (index, cb, addr) {
            var _this = this;
            _this.Dapp_getDigOreRecord(function (resulr, rdata) {
                if (resulr) {
                    var _recordsData = {}
                    _recordsData.id = rdata[0]
                    _recordsData.inRunDays = rdata[1]
                    _recordsData.time = rdata[2].mul(1000).toString()
                    _recordsData.uinv2Amount = rdata[3].div(_this._univ2Wei)
                    _recordsData.ettAmount = rdata[4].div(_this._ettWei)
                    _recordsData.ettAmountAddup = rdata[5].div(_this._ettWei)
                    _recordsData.status = rdata[6]
                    _recordsData.state = rdata[7]
                    _recordsData.NFT_ettAmount = rdata[8].div(_this._ettWei)

                    typeof cb === "function" && cb(_recordsData)
                }
            }, addr, index)
        }
    }
    DappPluginContainer.init()

    return DappPluginContainer
}

_DappPluginContainer = createDappPluginContainer()