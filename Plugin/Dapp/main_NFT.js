function createDappPluginContainer_NFT() {
    var DappPluginContainer = {
        _ispligindebug: true//基础设置---基础参数
        , _usdtWei: Math.pow(10, 6)//不会改变
        , _ettWei: Math.pow(10, 18)//不会改变

        //token合约地址/ABI
        , _ContractAddress_USDT: null
        , _ContractDecimals_USDT: null

        , _ContractAddress_ETT1: null
        , _ContractDecimals_ETT1: null

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
                _this._ContractRunNetwork = '4'//nile测试链
                _this._ContractAddress = 'TWpHcDfQMWuo9dnPhLUCT7vNq1ZLVFHoPM'
                _this._ContractABI = [{ "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnerTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "operator", "type": "address" }], "name": "RoleAdded", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "operator", "type": "address" }], "name": "RoleRemoved", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "_from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "_to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "_value", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "time", "type": "uint256" }], "name": "TransferEvent", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "_token", "type": "address" }, { "indexed": true, "internalType": "address", "name": "_from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "_to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "_value", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "time", "type": "uint256" }], "name": "TransferTokenEvent", "type": "event" }, { "inputs": [{ "internalType": "address", "name": "_USDTAddr", "type": "address" }], "name": "__Constructor_init", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_operator", "type": "address" }], "name": "addAddressToWhitelist", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_step", "type": "uint256" }], "name": "castingNFT", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_index", "type": "uint256" }], "name": "getParam", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "orderID", "type": "uint256" }], "name": "getTradeOrderByID", "outputs": [{ "internalType": "uint256[10]", "name": "", "type": "uint256[10]" }, { "internalType": "address", "name": "", "type": "address" }, { "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_type", "type": "uint256" }, { "internalType": "uint256", "name": "index", "type": "uint256" }], "name": "getTradeOrderByTypeIndex", "outputs": [{ "internalType": "uint256[10]", "name": "", "type": "uint256[10]" }, { "internalType": "address", "name": "", "type": "address" }, { "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "ownerAddr", "type": "address" }, { "internalType": "uint256", "name": "_type", "type": "uint256" }, { "internalType": "uint256", "name": "index", "type": "uint256" }], "name": "getTradeOrderByTypeIndex_owner", "outputs": [{ "internalType": "uint256[10]", "name": "", "type": "uint256[10]" }, { "internalType": "address", "name": "", "type": "address" }, { "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_operator", "type": "address" }], "name": "isWhitelist", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "orderID", "type": "uint256" }], "name": "matchingTradeOrder", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }, { "internalType": "address", "name": "", "type": "address" }, { "internalType": "uint256[]", "name": "", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "", "type": "uint256[]" }, { "internalType": "bytes", "name": "", "type": "bytes" }], "name": "onERC1155BatchReceived", "outputs": [{ "internalType": "bytes4", "name": "", "type": "bytes4" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }, { "internalType": "address", "name": "", "type": "address" }, { "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "bytes", "name": "", "type": "bytes" }], "name": "onERC1155Received", "outputs": [{ "internalType": "bytes4", "name": "", "type": "bytes4" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenID", "type": "uint256" }, { "internalType": "uint256", "name": "number", "type": "uint256" }, { "internalType": "uint256", "name": "price", "type": "uint256" }], "name": "pushTradeOrder", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_operator", "type": "address" }], "name": "removeAddressFromWhitelist", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "orderID", "type": "uint256" }], "name": "rollbackTradeOrder", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_taddr", "type": "address" }, { "internalType": "address", "name": "_addr", "type": "address" }, { "internalType": "uint256", "name": "_val", "type": "uint256" }], "name": "sendTokenToAddr", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_taddr", "type": "address" }, { "internalType": "address", "name": "_addr", "type": "address" }, { "internalType": "uint256", "name": "_id", "type": "uint256" }, { "internalType": "uint256", "name": "_val", "type": "uint256" }], "name": "sendTokenToAddr_1155", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_taddr", "type": "address" }, { "internalType": "address", "name": "_addr", "type": "address" }, { "internalType": "uint256", "name": "_val", "type": "uint256" }], "name": "sendTokenToAddr_USDT", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token1", "type": "address" }], "name": "setETTAddress", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_FundAddress", "type": "address" }], "name": "setFundAddress", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_NFT1155Addr", "type": "address" }], "name": "setNFTAddress", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_index", "type": "uint256" }, { "internalType": "uint256", "name": "_value", "type": "uint256" }], "name": "setParam", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "stateView", "outputs": [{ "internalType": "uint256[20]", "name": "", "type": "uint256[20]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes4", "name": "interfaceId", "type": "bytes4" }], "name": "supportsInterface", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "addr", "type": "address" }], "name": "userView", "outputs": [{ "internalType": "uint256[10]", "name": "", "type": "uint256[10]" }], "stateMutability": "view", "type": "function" }, { "stateMutability": "payable", "type": "receive" }]
                _this._ContractRecommendCode = ''
                _this._ContractInitAddr = ''

                _this._ContractAddress_USDT = "TU3m8u9jZufgHynrevfMtUG9JikjJheBnx"
                _this._ContractDecimals_USDT = 6

                _this._ContractAddress_ETT1 = "TCdb1eNCxLeybzXxax4JCdF6xzNf51KavG"
                _this._ContractDecimals_ETT1 = 18

                _this._ContractAddress_ETT_NFT = "TUKQbHLfSrYv7amo8KDJLKxe8iYBWtpDdr"
                _this._ContractDecimals_ETT_NFT = 18
            } else {
                //主网设置
                _this._trongridKey = "db7eea6b-be83-4942-9c87-6989b58b948b" // 每个项目都要去https://www.trongrid.io/ 申请IDkey 不要混用
                //_this._ContractRunNetwork = '1'//主网
                _this._ContractAddress = 'TWHyqxjzbXcC6QB6sThKQ9yaJE3uczTFfE'//填入主网合约地址
                _this._ContractABI = [{ "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnerTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "operator", "type": "address" }], "name": "RoleAdded", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "operator", "type": "address" }], "name": "RoleRemoved", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "_from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "_to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "_value", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "time", "type": "uint256" }], "name": "TransferEvent", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "_token", "type": "address" }, { "indexed": true, "internalType": "address", "name": "_from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "_to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "_value", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "time", "type": "uint256" }], "name": "TransferTokenEvent", "type": "event" }, { "inputs": [{ "internalType": "address", "name": "_USDTAddr", "type": "address" }], "name": "__Constructor_init", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_operator", "type": "address" }], "name": "addAddressToWhitelist", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_step", "type": "uint256" }], "name": "castingNFT", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_index", "type": "uint256" }], "name": "getParam", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "orderID", "type": "uint256" }], "name": "getTradeOrderByID", "outputs": [{ "internalType": "uint256[10]", "name": "", "type": "uint256[10]" }, { "internalType": "address", "name": "", "type": "address" }, { "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_type", "type": "uint256" }, { "internalType": "uint256", "name": "index", "type": "uint256" }], "name": "getTradeOrderByTypeIndex", "outputs": [{ "internalType": "uint256[10]", "name": "", "type": "uint256[10]" }, { "internalType": "address", "name": "", "type": "address" }, { "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "ownerAddr", "type": "address" }, { "internalType": "uint256", "name": "_type", "type": "uint256" }, { "internalType": "uint256", "name": "index", "type": "uint256" }], "name": "getTradeOrderByTypeIndex_owner", "outputs": [{ "internalType": "uint256[10]", "name": "", "type": "uint256[10]" }, { "internalType": "address", "name": "", "type": "address" }, { "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_operator", "type": "address" }], "name": "isWhitelist", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "orderID", "type": "uint256" }], "name": "matchingTradeOrder", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }, { "internalType": "address", "name": "", "type": "address" }, { "internalType": "uint256[]", "name": "", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "", "type": "uint256[]" }, { "internalType": "bytes", "name": "", "type": "bytes" }], "name": "onERC1155BatchReceived", "outputs": [{ "internalType": "bytes4", "name": "", "type": "bytes4" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }, { "internalType": "address", "name": "", "type": "address" }, { "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "bytes", "name": "", "type": "bytes" }], "name": "onERC1155Received", "outputs": [{ "internalType": "bytes4", "name": "", "type": "bytes4" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenID", "type": "uint256" }, { "internalType": "uint256", "name": "number", "type": "uint256" }, { "internalType": "uint256", "name": "price", "type": "uint256" }], "name": "pushTradeOrder", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_operator", "type": "address" }], "name": "removeAddressFromWhitelist", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "orderID", "type": "uint256" }], "name": "rollbackTradeOrder", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_taddr", "type": "address" }, { "internalType": "address", "name": "_addr", "type": "address" }, { "internalType": "uint256", "name": "_val", "type": "uint256" }], "name": "sendTokenToAddr", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_taddr", "type": "address" }, { "internalType": "address", "name": "_addr", "type": "address" }, { "internalType": "uint256", "name": "_id", "type": "uint256" }, { "internalType": "uint256", "name": "_val", "type": "uint256" }], "name": "sendTokenToAddr_1155", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_taddr", "type": "address" }, { "internalType": "address", "name": "_addr", "type": "address" }, { "internalType": "uint256", "name": "_val", "type": "uint256" }], "name": "sendTokenToAddr_USDT", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token1", "type": "address" }], "name": "setETTAddress", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_FundAddress", "type": "address" }], "name": "setFundAddress", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_NFT1155Addr", "type": "address" }], "name": "setNFTAddress", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_index", "type": "uint256" }, { "internalType": "uint256", "name": "_value", "type": "uint256" }], "name": "setParam", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "stateView", "outputs": [{ "internalType": "uint256[20]", "name": "", "type": "uint256[20]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes4", "name": "interfaceId", "type": "bytes4" }], "name": "supportsInterface", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "addr", "type": "address" }], "name": "userView", "outputs": [{ "internalType": "uint256[10]", "name": "", "type": "uint256[10]" }], "stateMutability": "view", "type": "function" }, { "stateMutability": "payable", "type": "receive" }]
                _this._ContractRecommendCode = ''
                _this._ContractInitAddr = ''

                _this._ContractAddress_USDT = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"
                _this._ContractDecimals_USDT = 6

                _this._ContractAddress_ETT1 = "THRV4oVfNksstU7HhNBpd2TLyiywjX8PJJ"
                _this._ContractDecimals_ETT1 = 18

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
            $('.data2-networkFullName').html(showContractRunNetworkName)

            if (networkType == _this._ContractRunNetwork) {
                //显示投资按钮
                $('.data2-contractNetworkNormal').show()
                $('.data2-switchNetwork').hide()
            } else {
                //运行网限制
                //显示切换网络
                $('.data2-contractNetworkNormal').hide()
                $('.data2-switchNetwork').show()

                //提示
                var msgtipsswitchNetwork = "合约运行在 " + showContractRunNetworkName + ' 请切换为 ' + showContractRunNetworkName
                window.msgtips3 && window.msgtips3(msgtipsswitchNetwork)
            }

            //显示当前网络名称
            $('.data2-networkName').html(networkName + ' Net')
            //设置当前网络区块浏览器链接
            $('.data2-networkScan').attr('href', networkScan)
        }

        //处理账号余额信息 优先级2
        , HandleUserInfo: function (e, defaultAccount, isEthereum, isShowdefaultAccount) {
            var _this = this;
            //e 为DappBase基础对象
            if (!isEthereum) {
                //显示安装兼容钱包
                $('.data2-installationSupport').show()
            } else {
                $('.data2-installationSupport').hide()
            }
            $('.data2-defaultAccount').html("--")
            $('.data2-balance-usdt').html("--")
            $('.data2-balance-ett1').html("--")
            $('.data2-contractbalance-nft-ett').html("--")
            $('.data2-contractbalance-nft-count').html("--")

            if (defaultAccount) {
                $('.data2-defaultAccount').html(defaultAccount).data("account", defaultAccount)

                //设置账户地址区块浏览器链接
                e.getAccountLink(defaultAccount, function (accountLink) {
                    $('.data2-accountLink').attr('href', accountLink)
                })

                //初始化显示
                //显示当前账号eth余额-项目不用到
                //e.getBalance(function (_balance) {
                //    _this._ispligindebug && console.log('2.1.HandleUserInfo:' + _balance)
                //    //$('.data2-balance').html(_balance.toFloor(_this._AccountDisplayPrecision))
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

                //获取用户ERC1155指定同质化代币余额
                e.getTokenBalance_ERC1155(function (_balance) {
                    $('.data-balance-nft-ett').html(_balance.toFloor(_this._AccountDisplayPrecision))
                    $('.data2-balance-nft-ett').html(_balance.toFloor(_this._AccountDisplayPrecision))
                }, defaultAccount, e.getTokenIndex_ERC1155(1, 0), _this._ContractAddress_ETT_NFT, null, _this._ContractDecimals_ETT_NFT)
                //获取用户ERC1155指定同非质化代币数量统计
                e.getTokenBalance_ERC1155(function (_balance) {
                    $('.data-balance-nft-count').html(_balance.toFloor(_this._AccountDisplayPrecision))
                    $('.data2-balance-nft-count').html(_balance.toFloor(_this._AccountDisplayPrecision))
                }, defaultAccount, e.getTokenIndex_ERC1155(0, 1), _this._ContractAddress_ETT_NFT)

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
            $('.data2-contractLink').attr('href', contractLink)

            //初始化显示
            $('.data2-mainContractAddress').html("--") //合约地址

            //炼化
            $('.data2-stateView4').html("--") //需要的碎片
            $('.data2-stateView5').html("--") //需要的PAMT
            $('.data2-stateView6').html("--") //需要的USDT
            //溶解
            $('.data2-stateView7').html("--") //需要的碎片
            $('.data2-stateView8').html("--") //需要的PAMT
            $('.data2-stateView9').html("--") //需要的USDT
            //聚合
            $('.data2-stateView10').html("--") //需要的碎片
            $('.data2-stateView11').html("--") //需要的PAMT
            $('.data2-stateView12').html("--") //需要的USDT
            //合约运行网络一致
            if (networkType == _this._ContractRunNetwork) {
                $('.data2-mainContractAddress').html(_this._ContractAddress) //合约地址

                //显示合约状态-页面中间
                _this.Dapp_getContractState(function (resulr, rdata) {
                    if (resulr) {
                        //炼化 需要的碎片
                        $('.data2-stateView4').html(rdata[4].div(_this._ettWei))
                        if (Number(rdata[4].div(_this._ettWei)) > 0) {
                            $('.data2-stateView4-show').show()
                        } else {
                            $('.data2-stateView4-hide').show()
                        }
                        //炼化 需要的PAMT
                        $('.data2-stateView5').html(rdata[5].div(_this._ettWei))
                        if (Number(rdata[5].div(_this._ettWei)) > 0) {
                            $('.data2-stateView5-show').show()
                        } else {
                            $('.data2-stateView5-hide').show()
                        }
                        //炼化 需要的usdt
                        $('.data2-stateView6').html(rdata[6].div(_this._usdtWei))
                        if (Number(rdata[6].div(_this._ettWei)) > 0) {
                            $('.data2-stateView6-show').show()
                        } else {
                            $('.data2-stateView6-hide').show()
                        }

                        //溶解 需要的碎片
                        $('.data2-stateView7').html(rdata[7].div(_this._ettWei))
                        if (Number(rdata[7].div(_this._ettWei)) > 0) {
                            $('.data2-stateView7-show').show()
                        } else {
                            $('.data2-stateView7-hide').show()
                        }
                        //溶解 需要的PAMT
                        $('.data2-stateView8').html(rdata[8].div(_this._ettWei))
                        if (Number(rdata[8].div(_this._ettWei)) > 0) {
                            $('.data2-stateView8-show').show()
                        } else {
                            $('.data2-stateView8-hide').show()
                        }
                        //溶解 需要的usdt
                        $('.data2-stateView9').html(rdata[9].div(_this._usdtWei))
                        if (Number(rdata[9].div(_this._ettWei)) > 0) {
                            $('.data2-stateView9-show').show()
                        } else {
                            $('.data2-stateView9-hide').show()
                        }

                        //聚合 需要的碎片
                        $('.data2-stateView10').html(rdata[10].div(_this._ettWei))
                        if (Number(rdata[10].div(_this._ettWei)) > 0) {
                            $('.data2-stateView10-show').show()
                        } else {
                            $('.data2-stateView10-hide').show()
                        }
                        //聚合 需要的PAMT
                        $('.data2-stateView11').html(rdata[11].div(_this._ettWei))
                        if (Number(rdata[11].div(_this._ettWei)) > 0) {
                            $('.data2-stateView11-show').show()
                        } else {
                            $('.data2-stateView11-hide').show()
                        }
                        //聚合 需要的usdt
                        $('.data2-stateView12').html(rdata[12].div(_this._usdtWei))
                        if (Number(rdata[12].div(_this._ettWei)) > 0) {
                            $('.data2-stateView12-show').show()
                        } else {
                            $('.data2-stateView12-hide').show()
                        }
                       

                        _this.HandleShowContractInfo && _this.HandleShowContractInfo()
                    }
                })
            }
        }

        //处理合约账号信息 优先级4
        , HandleContractUserInfo: function (e, isAuthorize, networkType, defaultAccount) {
            var _this = this;
            //e 为DappContract对象

            //初始化合成步骤
            $('.data2-castingNFT').removeClass('active')

            //初始化显示
            $('.data2-userinfo0').html("--")//正在交易订单总数

            //鉴权成功且合约运行网络一致
            if (isAuthorize && networkType == _this._ContractRunNetwork) {
                //获取用户信息
                _this.Dapp_getContractUserInfo(function (resulr, rdata) {
                    if (resulr) {
                        var tempUserInfoData = rdata
                        $('.data2-userinfo0').html(tempUserInfoData[0])//正在交易订单总数

                        $('.data2-castingNFT-step' + tempUserInfoData[6].add(1)).addClass('active')

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

        //炼化/溶解/聚合
        , Dapp_castingNFT: function (step, cb) {
            var _this = this;
            try {
                _this.HandleShowTransactionProcessingLoad && _this.HandleShowTransactionProcessingLoad(true)
                _this._DappContractPlugin.ContractObj.methods
                    .castingNFT(step)
                    .send(_this._DappContractPlugin.DappBaseObj.options._sendParam)
                    .then(function (rdata) {
                        console.log(rdata)
                        //监听到账
                        _this._DappContractPlugin.DappBaseObj.checkTransactionReceipt(rdata, function (receipt) {
                            console.log(receipt)
                            //完成回调
                            //完成刷新会员信息
                            //直接调用账户变更事件进行更新页面数据
                            _this._DappContractPlugin.getNetworkType(function (networkType) {
                                _this._DappContractPlugin.DappBaseObj._networkChangedEvent(networkType)
                            })

                            //回调处理
                            _this.HandleShowTransactionProcessingLoad && _this.HandleShowTransactionProcessingLoad(false)
                            typeof cb === "function" && cb(true, rdata)
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
        //发布订单
        , Dapp_pushTradeOrder: function (cb, tokenID, number, price) {
            var _this = this;
            try {
                //余额转换
                price = price.mul(Math.pow(10, _this._ContractDecimals_USDT))
                if (!_this._DappContractPlugin.DappBaseObj.isNonFungible_ERC1155(tokenID)) {
                    //非NFT 需要扩大精度
                    number = number.mul(Math.pow(10, _this._ContractDecimals_ETT_NFT))
                } else {
                    number = 1;
                }

                _this.HandleShowTransactionProcessingLoad && _this.HandleShowTransactionProcessingLoad(true)
                _this._DappContractPlugin.ContractObj.methods
                    .pushTradeOrder(tokenID, number, price)
                    .send(_this._DappContractPlugin.DappBaseObj.options._sendParam)
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
        //匹配订单
        , Dapp_matchingTradeOrder: function (cb, orderID) {
            var _this = this;
            try {
                _this.HandleShowTransactionProcessingLoad && _this.HandleShowTransactionProcessingLoad(true)
                _this._DappContractPlugin.ContractObj.methods
                    .matchingTradeOrder(orderID)
                    .send(_this._DappContractPlugin.DappBaseObj.options._sendParam)
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
        //撤销订单
        , Dapp_rollbackTradeOrder: function (cb, orderID) {
            var _this = this;
            try {
                _this.HandleShowTransactionProcessingLoad && _this.HandleShowTransactionProcessingLoad(true)
                _this._DappContractPlugin.ContractObj.methods
                    .rollbackTradeOrder(orderID)
                    .send(_this._DappContractPlugin.DappBaseObj.options._sendParam)
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
        //获取订单记录 根据订单ID
        , Dapp_getTradeOrderByID: function (cb, orderID) {
            var _this = this;
            try {
                _this._DappContractPlugin.ContractObj.methods
                    .getTradeOrderByID(orderID)
                    .call(_this._DappContractPlugin.DappBaseObj.options._callParam)
                    .then(function (rdata) {
                        rdata = _HandleRdata(rdata)
                        //回调处理
                        typeof cb === "function" && cb(true, rdata)
                    })

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
        //获取订单记录 根据订单类型+索引
        , Dapp_getTradeOrderByTypeIndex: function (cb, type, index) {
            var _this = this;
            try {
                _this._DappContractPlugin.ContractObj.methods
                    .getTradeOrderByTypeIndex(type, index)
                    .call(_this._DappContractPlugin.DappBaseObj.options._callParam)
                    .then(function (rdata) {
                        rdata = _HandleRdata(rdata)
                        //回调处理
                        typeof cb === "function" && cb(true, rdata)
                    })

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
        //获取订单记录 根据会员地址+订单类型(全局为1000)+索引
        , Dapp_getTradeOrderByTypeIndex_owner: function (cb, addr, type, index) {
            var _this = this;
            try {
                if (addr) {
                    _this._DappContractPlugin.ContractObj.methods
                        .getTradeOrderByTypeIndex_owner(addr, type, index)
                        .call(_this._DappContractPlugin.DappBaseObj.options._callParam)
                        .then(function (rdata) {
                            rdata = _HandleRdata(rdata)
                            //回调处理
                            typeof cb === "function" && cb(true, rdata)
                        })
                } else {
                    _this._DappContractPlugin.getCurrentAccount(function (_addr) {
                        _this._DappContractPlugin.ContractObj.methods
                            .getTradeOrderByTypeIndex_owner(_addr, type, index)
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

        //炼化/溶解/聚合-（需授权）
        , business_castingNFT: function (step, cb) {
            var _this = this;
            try {
                _this.Dapp_getContractUserInfo(function (resulr, rdata) {
                    if (resulr) {
                        var tempUserInfoData = rdata
                        var castingNFT_step = tempUserInfoData[6].add(1);

                        if (step != castingNFT_step) {
                            typeof cb === "function" && cb(false, "无效的操作")
                        }

                        _this.Dapp_getContractState(function (resulr, rdata) {
                            if (resulr) {

                                var castingNFT_FT = "0";
                                var castingNFT_ETT = "0";
                                var castingNFT_USDT = "0";

                                if (castingNFT_step == '1') {
                                    //炼化
                                    castingNFT_FT = rdata[4].div(_this._ettWei);
                                    castingNFT_ETT = rdata[5].div(_this._ettWei);
                                    castingNFT_USDT = rdata[6].div(_this._usdtWei);
                                } else if (castingNFT_step == '2') {
                                    //溶解
                                    castingNFT_FT = rdata[7].div(_this._ettWei);
                                    castingNFT_ETT = rdata[8].div(_this._ettWei);
                                    castingNFT_USDT = rdata[9].div(_this._usdtWei);
                                } else if (castingNFT_step == '3') {
                                    //聚合
                                    castingNFT_FT = rdata[10].div(_this._ettWei);
                                    castingNFT_ETT = rdata[11].div(_this._ettWei);
                                    castingNFT_USDT = rdata[12].div(_this._usdtWei);
                                }

                                Token_checkApprove_USDT(castingNFT_USDT, function () {
                                    Token_checkApprove_ETT(castingNFT_ETT, function () {
                                        Token_checkApprove_FT(castingNFT_FT, function () {
                                            Token_checkBalance_NFT(_this._DappContractPlugin.DappBaseObj.getTokenIndex_ERC1155(1, 0), castingNFT_FT, function () {
                                                _this.Dapp_castingNFT(step.sub(1), cb)
                                            })                                            
                                        })
                                    })
                                })
                            }
                        })
                    }
                })

                function Token_checkApprove_USDT(amount, ApproveCB) {
                    if (Number(amount) <= 0) {
                        typeof ApproveCB === "function" && ApproveCB()
                        return;
                    }
                    _this.HandleShowTokenApproveLoad && _this.HandleShowTokenApproveLoad(true)
                    _this._DappContractPlugin.Token_checkApprove(amount, _this._ContractAddress_USDT, _this._DappContractPlugin.DappBaseObj.options._ERC20ABIinterface, _this._ContractDecimals_USDT, true, function (resulr, code, errmsg) {
                        if (resulr) {
                            _this.HandleShowTokenApproveLoad && _this.HandleShowTokenApproveLoad(false)
                            typeof ApproveCB === "function" && ApproveCB()
                        } else {
                            _this.HandleShowTokenApproveLoad && _this.HandleShowTokenApproveLoad(false)
                            if (code == 1002) {
                                //typeof cb === "function" && cb(false, "授权操作金额失败:,code:" + code + ",msg:余额不足")
                                typeof cb === "function" && cb(false, "USDT余额不足")
                            } else {
                                typeof cb === "function" && cb(false, "授权操作金额失败:,code:" + code + ",msg:" + errmsg)
                            }
                        }
                    })
                }
                function Token_checkApprove_ETT(amount, ApproveCB) {
                    if (Number(amount) <= 0) {
                        typeof ApproveCB === "function" && ApproveCB()
                        return;
                    }
                    _this.HandleShowTokenApproveLoad && _this.HandleShowTokenApproveLoad(true)
                    _this._DappContractPlugin.Token_checkApprove(amount, _this._ContractAddress_ETT1, _this._DappContractPlugin.DappBaseObj.options._ERC20ABIinterface, _this._ContractDecimals_ETT1, true, function (resulr, code, errmsg) {
                        if (resulr) {
                            _this.HandleShowTokenApproveLoad && _this.HandleShowTokenApproveLoad(false)
                            typeof ApproveCB === "function" && ApproveCB()
                        } else {
                            _this.HandleShowTokenApproveLoad && _this.HandleShowTokenApproveLoad(false)
                            if (code == 1002) {
                                //typeof cb === "function" && cb(false, "授权操作金额失败:,code:" + code + ",msg:余额不足")
                                typeof cb === "function" && cb(false, "PAMT余额不足")
                            } else {
                                typeof cb === "function" && cb(false, "授权操作金额失败:,code:" + code + ",msg:" + errmsg)
                            }
                        }
                    })
                }
                function Token_checkApprove_FT(amount, ApproveCB) {
                    if (Number(amount) <= 0) {
                        typeof ApproveCB === "function" && ApproveCB()
                        return;
                    }
                    _this.HandleShowTokenApproveLoad && _this.HandleShowTokenApproveLoad(true)
                    _this._DappContractPlugin.Token_checkApprove_ERC1155(true, _this._ContractAddress_ETT_NFT, _this._DappContractPlugin.DappBaseObj.options._ERC1155ABIinterface, _this._ContractDecimals_ETT_NFT, function (resulr, code, errmsg) {
                        if (resulr) {
                            _this.HandleShowTokenApproveLoad && _this.HandleShowTokenApproveLoad(false)
                            typeof ApproveCB === "function" && ApproveCB()
                        } else {
                            _this.HandleShowTokenApproveLoad && _this.HandleShowTokenApproveLoad(false)
                            typeof cb === "function" && cb(false, "授权操作金额失败:,code:" + code + ",msg:" + errmsg)
                        }
                    }, true)
                }

                function Token_checkBalance_NFT(id, checkbalance, checkCB) {
                    if (Number(checkbalance) <= 0) {
                        typeof checkCB === "function" && checkCB(true)
                        return;
                    }
                    _this._DappContractPlugin.DappBaseObj.getTokenBalance_ERC1155(function (_balance) {
                        if (Number(_balance) >= Number(checkbalance)) {
                            typeof checkCB === "function" && checkCB(true)
                        } else {
                            //typeof checkCB === "function" && checkCB(false)
                            typeof cb === "function" && cb(false, "碎片余额不足")
                        }
                    }, defaultAccount, id, _this._ContractAddress_ETT_NFT, null, _this._ContractDecimals_ETT_NFT)
                }
               
            } catch (e) {
                console.log(e)
                typeof cb === "function" && cb(false, e.message || e)
            }
        }
        //发布订单
        , business_pushTradeOrder: function (tokenID, number, price,cb) {
            var _this = this;
            try {
                //检查输入
                if (!price || Number(price) <= 0) {
                    throw { cede: 401, message: "请输入正确的单价" }
                }

                //检验余额
                if (!_this._DappContractPlugin.DappBaseObj.isNonFungible_ERC1155(tokenID)) {
                    if (!number || Number(number) <= 0) {
                        throw { cede: 401, message: "请输入正确的数量" }
                    }
                } else {
                    //NFT
                    number = 1;//数量恒定为1
                }

                _this.Dapp_getContractUserInfo(function (resulr, rdata) {
                    if (resulr) {
                        var tempUserInfoData = rdata

                        var pushTradeOrderLimit;
                        if (!_this._DappContractPlugin.DappBaseObj.isNonFungible_ERC1155(tokenID)) {
                            pushTradeOrderLimit = tempUserInfoData[4]

                            if (pushTradeOrderLimit == '1') {
                                //发布受限
                                typeof cb === "function" && cb(false, "您有一笔未成交的【碎片】订单，无法发布新的订单")
                                return;
                            }
                        } else {
                            //NFT
                            pushTradeOrderLimit = tempUserInfoData[5]

                            if (pushTradeOrderLimit == '1') {
                                //发布受限
                                typeof cb === "function" && cb(false, "您有一笔未成交的【Angle】订单，无法发布新的订单")
                                return;
                            }
                        }

                        //检查余额/NFT所有者
                        Token_checkBalance_NFT(tokenID, number, function (rdata) {
                            if (rdata) {
                                //授权操作
                                Token_checkApprove_FT(number, function () {
                                    //发布订单
                                    _this.Dapp_pushTradeOrder(cb, tokenID, number, price)
                                })
                            } else {
                                typeof cb === "function" && cb(false, "余额不足")
                            }
                        })
                    }
                })



                function Token_checkApprove_FT(amount, ApproveCB) {
                    if (Number(amount) <= 0) {
                        typeof ApproveCB === "function" && ApproveCB()
                        return;
                    }
                    _this.HandleShowTokenApproveLoad && _this.HandleShowTokenApproveLoad(true)
                    _this._DappContractPlugin.Token_checkApprove_ERC1155(true, _this._ContractAddress_ETT_NFT, _this._DappContractPlugin.DappBaseObj.options._ERC1155ABIinterface, _this._ContractDecimals_ETT_NFT, function (resulr, code, errmsg) {
                        if (resulr) {
                            _this.HandleShowTokenApproveLoad && _this.HandleShowTokenApproveLoad(false)
                            typeof ApproveCB === "function" && ApproveCB()
                        } else {
                            _this.HandleShowTokenApproveLoad && _this.HandleShowTokenApproveLoad(false)
                            typeof cb === "function" && cb(false, "授权操作金额失败:,code:" + code + ",msg:" + errmsg)
                        }
                    }, true)
                }

                function Token_checkBalance_NFT(id, checkbalance, checkCB) {
                    _this._DappContractPlugin.DappBaseObj.getTokenBalance_ERC1155(function (_balance) {
                        if (Number(_balance) >= Number(checkbalance)) {
                            typeof checkCB === "function" && checkCB(true)
                        } else {
                            typeof checkCB === "function" && checkCB(false)
                        }
                    }, defaultAccount, id, _this._ContractAddress_ETT_NFT, null, _this._ContractDecimals_ETT_NFT)
                }

            } catch (e) {
                console.log(e)
                typeof cb === "function" && cb(false, e.message || e)
            }
        }
        //匹配订单
        , business_matchingTradeOrder: function (orderID, cb) {
            var _this = this;
            try {
             
                _this._DappContractPlugin.getCurrentAccount(function (_addr) {
                    _this.Dapp_getTradeOrderByID(function (resulr, rdata) {
                        if (resulr) {
                            var tempTradeOrderData = rdata

                            var addr_From = tempTradeOrderData[1]
                            if (addr_From == _addr) {
                                //订单状态异常
                                typeof cb === "function" && cb(false, "无法与自己的订单成交")
                                return;
                            }

                            var orderState = tempTradeOrderData[0][2]
                            if (orderState != '0') {
                                //订单状态异常
                                typeof cb === "function" && cb(false, "订单已成交或不存在")
                                return;
                            }

                            var money_USDT = tempTradeOrderData[0][6].div(_this._usdtWei);

                            //检查余额/NFT所有者
                            Token_checkApprove_USDT(money_USDT, function () {
                                //匹配
                                _this.Dapp_matchingTradeOrder(cb, orderID)
                            })
                        }
                    }, orderID)
                })
   


                function Token_checkApprove_USDT(amount, ApproveCB) {
                    if (Number(amount) <= 0) {
                        typeof ApproveCB === "function" && ApproveCB()
                        return;
                    }
                    _this.HandleShowTokenApproveLoad && _this.HandleShowTokenApproveLoad(true)
                    _this._DappContractPlugin.Token_checkApprove(amount, _this._ContractAddress_USDT, _this._DappContractPlugin.DappBaseObj.options._ERC20ABIinterface, _this._ContractDecimals_USDT, true, function (resulr, code, errmsg) {
                        if (resulr) {
                            _this.HandleShowTokenApproveLoad && _this.HandleShowTokenApproveLoad(false)
                            typeof ApproveCB === "function" && ApproveCB()
                        } else {
                            _this.HandleShowTokenApproveLoad && _this.HandleShowTokenApproveLoad(false)
                            if (code == 1002) {
                                //typeof cb === "function" && cb(false, "授权操作金额失败:,code:" + code + ",msg:余额不足")
                                typeof cb === "function" && cb(false, "USDT余额不足")
                            } else {
                                typeof cb === "function" && cb(false, "授权操作金额失败:,code:" + code + ",msg:" + errmsg)
                            }
                        }
                    })
                }
            } catch (e) {
                console.log(e)
                typeof cb === "function" && cb(false, e.message || e)
            }
        }
        //撤销订单
        , business_rollbackTradeOrder: function (orderID, cb) {
            var _this = this;
            try {

                _this.Dapp_getContractState(function (resulr, rdata) {
                    if (resulr) {
                        var tempContractStateData = rdata

                        var number_USDT = tempContractStateData[13].div(_this._usdtWei);

                        //检查余额/NFT所有者
                        Token_checkApprove_USDT(number_USDT, function (rdata) {
                            //撤销订单
                            _this.Dapp_rollbackTradeOrder(cb, orderID)
                        })
                    }
                })



                function Token_checkApprove_USDT(amount, ApproveCB) {
                    if (Number(amount) <= 0) {
                        typeof ApproveCB === "function" && ApproveCB()
                        return;
                    }
                    _this.HandleShowTokenApproveLoad && _this.HandleShowTokenApproveLoad(true)
                    _this._DappContractPlugin.Token_checkApprove(amount, _this._ContractAddress_USDT, _this._DappContractPlugin.DappBaseObj.options._ERC20ABIinterface, _this._ContractDecimals_USDT, true, function (resulr, code, errmsg) {
                        if (resulr) {
                            _this.HandleShowTokenApproveLoad && _this.HandleShowTokenApproveLoad(false)
                            typeof ApproveCB === "function" && ApproveCB()
                        } else {
                            _this.HandleShowTokenApproveLoad && _this.HandleShowTokenApproveLoad(false)
                            if (code == 1002) {
                                //typeof cb === "function" && cb(false, "授权操作金额失败:,code:" + code + ",msg:余额不足")
                                typeof cb === "function" && cb(false, "USDT余额不足")
                            } else {
                                typeof cb === "function" && cb(false, "授权操作金额失败:,code:" + code + ",msg:" + errmsg)
                            }
                        }
                    })
                }

            } catch (e) {
                console.log(e)
                typeof cb === "function" && cb(false, e.message || e)
            }
        }
        //订单记录
        , business_getTradeOrderList: function (type, index, cb) {
            var _this = this;
            _this.Dapp_getTradeOrderByTypeIndex(function (resulr, rdata) {
                if (resulr) {
                    var _recordsData = {}
                    _recordsData.id = rdata[0][0]
                    _recordsData.orderType = rdata[0][1]
                    _recordsData.state = rdata[0][2]
                    _recordsData.tokenID = rdata[0][3]
                    _recordsData.number = rdata[0][4]
                    _recordsData.price = rdata[0][5]
                    _recordsData.money = rdata[0][6]
                    _recordsData.time_0 = rdata[0][7].mul(1000).toString()
                    _recordsData.time_1 = rdata[0][8].mul(1000).toString()
                    _recordsData.time_2 = rdata[0][9].mul(1000).toString()

                    _recordsData.addr_From = rdata[1]
                    _recordsData.addr_To = rdata[1]

                    if (_recordsData.orderType == '1') {
                        _recordsData.ActualID = _this._DappContractPlugin.DappBaseObj.getNFTActualID_ERC1155(_recordsData.tokenID, 1)
                        _recordsData.HexID = '0x' + new BigNumber(_this._DappContractPlugin.DappBaseObj.getNFTActualID_ERC1155(_recordsData.tokenID, 1)).toString(16)
                    } else {
                        _recordsData.ActualID = 1;
                        _recordsData.number = _recordsData.number.div(_this._ettWei)
                    }
                    _recordsData.money = _recordsData.money.div(_this._usdtWei)
                    _recordsData.price = _recordsData.price.div(_this._usdtWei)

                    typeof cb === "function" && cb(_recordsData)
                }
            }, type, index)
        }
        //我的订单记录
        , business_getMyTradeOrderList: function (type, index, cb, addr) {
            var _this = this;
            _this.Dapp_getTradeOrderByTypeIndex_owner(function (resulr, rdata) {
                if (resulr) {
                    var _recordsData = {}
                    _recordsData.id = rdata[0][0]
                    _recordsData.orderType = rdata[0][1]
                    _recordsData.state = rdata[0][2]
                    _recordsData.tokenID = rdata[0][3]
                    _recordsData.number = rdata[0][4]
                    _recordsData.price = rdata[0][5]
                    _recordsData.money = rdata[0][6]
                    _recordsData.time_0 = rdata[0][7].mul(1000).toString()
                    _recordsData.time_1 = rdata[0][8].mul(1000).toString()
                    _recordsData.time_2 = rdata[0][9].mul(1000).toString()

                    _recordsData.addr_From = rdata[1]
                    _recordsData.addr_To = rdata[1]

                    if (_recordsData.orderType == '1') {
                        _recordsData.ActualID = _this._DappContractPlugin.DappBaseObj.getNFTActualID_ERC1155(_recordsData.tokenID, 1)
                        _recordsData.HexID = '0x' + new BigNumber(_this._DappContractPlugin.DappBaseObj.getNFTActualID_ERC1155(_recordsData.tokenID, 1)).toString(16)
                    } else {
                        _recordsData.ActualID = 1;
                        _recordsData.number = _recordsData.number.div(_this._ettWei)
                    }
                    _recordsData.money = _recordsData.money.div(_this._usdtWei)
                    _recordsData.price = _recordsData.price.div(_this._usdtWei)

                    typeof cb === "function" && cb(_recordsData)
                }
            }, addr, type, index)
        }
    }
    DappPluginContainer.init()

    return DappPluginContainer
}

_DappPluginContainer_NFT = createDappPluginContainer_NFT()