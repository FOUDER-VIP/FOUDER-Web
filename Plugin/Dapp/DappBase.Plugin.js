function DappCreate(_options) {
    var defaults = {
        _ERC20ABIinterface: [{ "inputs": [{ "internalType": "address", "name": "", "type": "address" }, { "internalType": "address", "name": "", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }, { "internalType": "uint256", "name": "", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "claimAmount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }, { "internalType": "uint256", "name": "", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }, { "internalType": "address", "name": "", "type": "address" }, { "internalType": "uint256", "name": "", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }],
        _ERC1155ABIinterface: [{ "inputs": [{ "internalType": "string", "name": "uri", "type": "string" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": false, "internalType": "bool", "name": "approved", "type": "bool" }], "name": "ApprovalForAll", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "account", "type": "address" }], "name": "Paused", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "indexed": true, "internalType": "bytes32", "name": "previousAdminRole", "type": "bytes32" }, { "indexed": true, "internalType": "bytes32", "name": "newAdminRole", "type": "bytes32" }], "name": "RoleAdminChanged", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": true, "internalType": "address", "name": "sender", "type": "address" }], "name": "RoleGranted", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": true, "internalType": "address", "name": "sender", "type": "address" }], "name": "RoleRevoked", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256[]", "name": "ids", "type": "uint256[]" }, { "indexed": false, "internalType": "uint256[]", "name": "values", "type": "uint256[]" }], "name": "TransferBatch", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "id", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "TransferSingle", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "string", "name": "value", "type": "string" }, { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" }], "name": "URI", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "account", "type": "address" }], "name": "Unpaused", "type": "event" }, { "inputs": [], "name": "DEFAULT_ADMIN_ROLE", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "MINTER_ROLE", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "PAUSER_ROLE", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "id", "type": "uint256" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address[]", "name": "accounts", "type": "address[]" }, { "internalType": "uint256[]", "name": "ids", "type": "uint256[]" }], "name": "balanceOfBatch", "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "id", "type": "uint256" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "burn", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256[]", "name": "ids", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "name": "burnBatch", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "index", "type": "uint256" }, { "internalType": "uint256", "name": "_type", "type": "uint256" }], "name": "convertIndexToNFTID", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "pure", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "_uri", "type": "string" }], "name": "createNFT", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "pure", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "id", "type": "uint256" }], "name": "getMaskBaseType", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "pure", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "id", "type": "uint256" }], "name": "getMaskIndex", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "pure", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }], "name": "getRoleAdmin", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "uint256", "name": "index", "type": "uint256" }], "name": "getRoleMember", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }], "name": "getRoleMemberCount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" }], "name": "grantRole", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" }], "name": "hasRole", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "address", "name": "operator", "type": "address" }], "name": "isApprovedForAll", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "id", "type": "uint256" }], "name": "isFungible", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "pure", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "id", "type": "uint256" }], "name": "isNonFungible", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "pure", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "id", "type": "uint256" }], "name": "isNonFungibleBaseType", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "pure", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "id", "type": "uint256" }], "name": "isNonFungibleItem", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "pure", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "id", "type": "uint256" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "name": "mint", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256[]", "name": "ids", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "name": "mintBatch", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_type", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }], "name": "mintNonFungible", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_type", "type": "uint256" }, { "internalType": "address[]", "name": "tos", "type": "address[]" }], "name": "mintNonFungibleBatch", "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "id", "type": "uint256" }], "name": "ownerOf", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "id", "type": "uint256" }], "name": "parseNFTIDToIndex", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "pure", "type": "function" }, { "inputs": [], "name": "pause", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "paused", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" }], "name": "renounceRole", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" }], "name": "revokeRole", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256[]", "name": "ids", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "name": "safeBatchTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "id", "type": "uint256" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "operator", "type": "address" }, { "internalType": "bool", "name": "approved", "type": "bool" }], "name": "setApprovalForAll", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "newuri", "type": "string" }, { "internalType": "uint256", "name": "id", "type": "uint256" }], "name": "setTokenURI", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "newuri", "type": "string" }], "name": "setURI", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes4", "name": "interfaceId", "type": "bytes4" }], "name": "supportsInterface", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "index", "type": "uint256" }], "name": "tokenByIndex", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "uint256", "name": "id", "type": "uint256" }, { "internalType": "uint256", "name": "index", "type": "uint256" }], "name": "tokenOfOwnerByIndex", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "unpause", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "uri", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }],
        _sendParam : {
            feeLimit: 500000000,
            callValue: 0,
        },
        _callParam : {
            _isConstant: true,//一定要加，justswap不加报错
        },
        transaction: {
            Decimals: 18,//精度 转出金额扩大精度默认18位
            ContractAddress: null,//TRC20合约地址
            //默认TRC20代币合约ABI
            ContractABI: null,
        },
        transactionQueueSubmit: function (e, transferHash, type, addr, userData) {
            //转账队列提交
            console.log(transferHash)
            console.log(type)
            console.log(addr)
            console.log(JSON.stringify(userData))
            //移除队列
            e.removelocalqueue(transferHash)
        },
        msgTips: function (msg) {
            //定义消息处理
            alert(msg)
        },
        waitLinkTips: function (statu) {
            console.log(statu)
        },
        initCallBack: function (e, defaultAccount, isEthereum, isNotFirst) {
            //初始化完成后回调/网络变更回调/账号变更回调
            console.log(defaultAccount)
        },
        extensionCallBack: function (e, defaultAccount, isEthereum, isNotFirst) {
            //扩展回调
            console.log(defaultAccount)
        },
        initHandleNetworkType: function (e, networkType, networkName, networkScan) {
            //1：波场主网 https://api.trongrid.io    https://tronscan.io/
            //1: 波场主网 https://api.tronstack.io    https://tronscan.io/
            //1: Imtoken波场主网 https://tron-mainnet.token.im 或  https://api.singapore.trongrid.io
            //2：Shasta测试网 https://api.shasta.trongrid.io   https://shasta.tronscan.io/#/ 
            //3：Tronex测试网 https://testhttpapi.tronex.io  (主要提供http api 节点接口测试 暂时没找到对应区块浏览器 )
            //4：Nile测试网 https://api.nileex.io  https://nile.tronscan.org/ (部署合约测试主要在此链网络)

            //初始化完成后回调/网络变更回调
            console.log('NetworkType:' + networkType + ', NetworkName:' + networkName + ', NetworkScan:' + networkScan)
        },
        networkChangeEventCallBack: function (e, networkType, networkName, networkScan) {
            //1：波场主网 https://api.trongrid.io    https://tronscan.io/
            //1: 波场主网 https://api.tronstack.io    https://tronscan.io/
            //2：Shasta测试网 https://api.shasta.trongrid.io   https://shasta.tronscan.io/#/ 
            //3：Tronex测试网 https://testhttpapi.tronex.io  (主要提供http api 节点接口测试 暂时没找到对应区块浏览器 )
            //4：Nile测试网 https://api.nileex.io  https://nile.tronscan.org/ (部署合约测试主要在此链网络)
            //网络变更后回调
            console.log('networkChanged: new Network: NetworkType:' + networkType + ', NetworkName:' + networkName + ', NetworkScan:' + networkScan)
        },
        accountsChangedEventCallBack: function (e, defaultAccount) {
            //账号变更事件
            console.log('accountsChangedEvent: new accounts:' + defaultAccount)
        },
        isAuthorize: true,//启用授权
        defaultNetwork: "1",//默认网络 trongrid  主网
        isInitqueueSubmit: false,//初始化完成是否执行转账信息提交
    };
    var options = $.extend({}, defaults, _options);//将一个空对象做为第一个参数

    //处理默认参数
    if (options.transaction && !options.transaction.Decimals && options.transaction.Decimals != 0) {
        options.transaction.Decimals = defaults.transaction.Decimals
    }

    //创建对象
    var DappObj = {
        _trxWei: Math.pow(10, 6),
        options: options,
        _initNumber: 0,
        _init: function (isNotFirst) {
            //初始化 基础tronWeb接口方法
            var _this = this;
            try {
                var retryCount = 0;
                var obj = setInterval(() => {
                    var tronProvider = window.tronWeb;
                    if (tronProvider) {
                        // 2. check node connection，检查所需要的API是否都可以连通
                        var connected = !Object.entries(tronProvider.isConnected()).map(([name, connected]) => {
                            if (!connected) {
                                console.error(`Error: ${name} is not connected`);
                            }
                            return connected;
                        }).includes(false);
                        if (!connected) {
                            return
                        }

                        if (!tronProvider.defaultAddress.base58) {
                            typeof _this.options.waitLinkTips === "function" && _this.options.waitLinkTips(1)
                            return;
                        } 
                        typeof _this.options.waitLinkTips === "function" && _this.options.waitLinkTips(0)

                        clearInterval(obj);
                        //创建web3对象
                        window.tronWebObj = tronProvider;
                        //alert(JSON.stringify(tronProvider.fullNode));
                        //设置trongridKey
                        _this._setExperimental && _this._setExperimental();
                        //注册队列任务
                        _this._reg_bobolink && _this._reg_bobolink();
                        //网络类型回调
                        _this.getNetworkType(function (networkType) {
                            //获取网络名称/区块浏览器
                            var networkName = _this._getNetworkName(networkType);
                            var networkScan = _this._getNetworkScan(networkType);
                            //初始化完成执行回调处理网络类型
                            typeof _this.options.initHandleNetworkType === "function" && _this.options.initHandleNetworkType(_this, networkType, networkName, networkScan);
                            //非授权回调、、兼容重写调用
                            if (!_this.options.isAuthorize) {
                                //初始化完成执行回调鉴权
                                typeof _this.options.initCallBack === "function" && _this.options.initCallBack(_this, null, true, isNotFirst)
                                //初始化完成执行扩展回调
                                typeof _this.options.extensionCallBack === "function" && _this.options.extensionCallBack(_this, null, true, isNotFirst)
                            }
                        })

                        //授权初始化
                        if (_this.options.isAuthorize) {
                            //鉴权授权获取账户
                            _this.getCurrentAccount(function (defaultAccount) {
                                window.defaultAccount = defaultAccount;
                                //初始化完成执行回调鉴权
                                typeof _this.options.initCallBack === "function" && _this.options.initCallBack(_this, defaultAccount, true, isNotFirst)
                                //初始化完成执行扩展回调
                                typeof _this.options.extensionCallBack === "function" && _this.options.extensionCallBack(_this, defaultAccount, true, isNotFirst)
                                //初始化完成执行转账信息提交
                                _this.options.isInitqueueSubmit && _this.initqueueSubmit();
                            })
                        }

                        if (!isNotFirst) {
                            try {
                                window.addEventListener('message', function (e) {
                                    //TronLink环境注入事件
                                    //if (e.data.message && e.data.message.action == "tabReply") {
                                    //    console.log("tabReply event", e.data.message)
                                    //    if (e.data.message.data.data.node.chain == '_') {
                                    //        console.log("tronLink currently selects the main chain")
                                    //    } else {
                                    //        console.log("tronLink currently selects the side chain")
                                    //    }
                                    //}
                                    //监听账号变更事件
                                    if (e.data.message && e.data.message.action == "setAccount") {
                                        //console.log("setAccount event", e.data.message)
                                        //console.log("current address:", e.data.message.data.address)
                                        //处理账号变更事件
                                        _this._accountsChangedEvent(e.data.message.data.address);
                                        window.defaultAccount = e.data.message.data.address;
                                    }
                                    //监听节点网络变更事件
                                    if (e.data.message && e.data.message.action == "setNode") {
                                        //console.log("setNode event", e.data.message)
                                        //if (e.data.message.data.node.chain == '_') {
                                        //    console.log("tronLink currently selects the main chain")
                                        //} else {
                                        //    console.log("tronLink currently selects the side chain")
                                        //}
                                        //处理网络变更事件
                                        _this._networkChangedEvent(e.data.message.data.node.fullNode);
                                    }
                                });
                            } catch (e) {
                                console.log(e)
                            }
                        }
                    } else {
                        retryCount++;
                        if (retryCount > 5) {
                            clearInterval(obj);
                            //初始化完成执行回调
                            typeof _this.options.initCallBack === "function" && _this.options.initCallBack(_this, null, false, isNotFirst)
                            //初始化完成执行扩展回调
                            typeof _this.options.extensionCallBack === "function" && _this.options.extensionCallBack(_this, null, false, isNotFirst)
                        }
                    }
                }, 1000);
            } catch (e) {
                console.log(e)
            }
        },
        _init_bobolink: function (cb) {
            var _this = this;
            //初始化队列任务对象
            if (!_bobolinkObj) {
                if (typeof require === "function") {
                    var _bobolink = require('bobolink')
                    var _bobolink_options = {
                        // 常量直接挂载在Bobolink下，设定会按频率调度
                        scheduleMode: _bobolink.SCHEDULE_MODE_FREQUENCY,
                        // 设定每秒执行两个任务，bobolink会计算出每500ms执行一个任务
                        countPerTimeScale: 5
                    }
                    if (_this.options.trongridKey) {
                        _bobolink_options.countPerTimeScale = 10;
                    }
                    var _bobolinkObj = new _bobolink(_bobolink_options);
               
                    window._bobolinkObj = _bobolinkObj;
                    typeof cb === "function" && cb(true)
                } else {
                    typeof cb === "function" && cb(false)
                }
            }
        },
        _get_bobolinkObj: function () {
            return window._bobolinkObj;
        },
        _pushtask_bobolink: function (taskCB) {
            //添加队列任务
            var _this = this;
            try {
                // 提交执行失败的任务
                _this._get_bobolinkObj().put(() => {
                    try {
                        typeof taskCB === "function" && taskCB();
                        return new Promise(resolve => {
                            resolve();
                        });
                    } catch (e) {
                        return Promise.reject(e);
                    }
                }).then(ts => {
                    //console.log(ts);
                    if (ts.err) {
                        console.log('任务执行出错' + ts.err);
                    } else {
                        console.log('任务执行完成');
                    }       
                });
            } catch (e) {
                console.log(e)
            }
        },
        _reg_bobolink: function () {
            var _this = this;
            //初始化队列任务对象
            if (_this._get_bobolinkObj()) {
                //从定义请求方法
                var tronProvider = _this.getTronWebObj();

                {
                    if (!tronProvider.fullNode.instance._requestQueueReg) {
                        var request_old = tronProvider.fullNode.instance.request
                        tronProvider.fullNode.instance.request = function () {
                            var args = new Array(arguments.length);
                            for (var i = 0; i < args.length; i++) {
                                args[i] = arguments[i];
                            }
                            var args_this = this
                            return new Promise(function (resolve, reject) {
                                //全部的合约调用全部封装队列任务
                                _this._pushtask_bobolink(function () {
                                    request_old.apply(args_this, args).then(resolve, reject);
                                })
                            });
                        }
                        tronProvider.fullNode.instance._requestQueueReg = true;
                    }
                }
                {
                    if (!tronProvider.solidityNode.instance._requestQueueReg) {
                        var request_old_solidity = tronProvider.solidityNode.instance.request
                        tronProvider.solidityNode.instance.request = function () {
                            var args = new Array(arguments.length);
                            for (var i = 0; i < args.length; i++) {
                                args[i] = arguments[i];
                            }
                            var args_this = this
                            return new Promise(function (resolve, reject) {
                                //全部的合约调用全部封装队列任务
                                _this._pushtask_bobolink(function () {
                                    request_old_solidity.apply(args_this, args).then(resolve, reject);
                                })
                            });
                        }
                        tronProvider.solidityNode.instance._requestQueueReg = true;
                    }
                }
                {
                    if (!tronProvider.eventServer.instance._requestQueueReg) {
                        var request_old_event = tronProvider.eventServer.instance.request
                        tronProvider.eventServer.instance.request = function () {
                            var args = new Array(arguments.length);
                            for (var i = 0; i < args.length; i++) {
                                args[i] = arguments[i];
                            }
                            var args_this = this
                            return new Promise(function (resolve, reject) {
                                //全部的合约调用全部封装队列任务
                                _this._pushtask_bobolink(function () {
                                    request_old_event.apply(args_this, args).then(resolve, reject);
                                })
                            });
                        }
                        tronProvider.eventServer.instance._requestQueueReg = true;
                    }
                }
            }
        },
        init: function () {
            //初始化 插件方法
            var _this = this;
            try {
                //初始化队列任务容器
                _this._init_bobolink(function (isinit) {
                    _this._init();
                });        
            } catch (e) {
                console.log(e)
            }
        },        
        getTronWebObj: function () {
            return window.tronWebObj;
        },
        _setExperimental: function () {
            var _this = this;
            if (_this.options.trongridKey) {
                var tronProvider = _this.getTronWebObj()

                if (tronProvider.fullNode.host.indexOf('trongrid.io') == -1) {
                    //如果不是trongrid.io 服务不需要添加头
                    return;

                }
                if (tronProvider.version >='3.2.6') {
                    tronProvider.setHeader({ "TRON-PRO-API-KEY": _this.options.trongridKey })
                } else {
                    var keyHeader = "TRON-PRO-API-KEY"
                    tronProvider.fullNode.headers[keyHeader] = _this.options.trongridKey
                    for (var i in tronProvider.fullNode.instance.defaults.headers) {
                        tronProvider.fullNode.instance.defaults.headers[i][keyHeader] = _this.options.trongridKey
                    }
                    tronProvider.solidityNode.headers[keyHeader] = _this.options.trongridKey
                    for (var i in tronProvider.solidityNode.instance.defaults.headers) {
                        tronProvider.solidityNode.instance.defaults.headers[i][keyHeader] = _this.options.trongridKey
                    }
                    tronProvider.eventServer.headers[keyHeader] = _this.options.trongridKey
                    for (var i in tronProvider.eventServer.instance.defaults.headers) {
                        tronProvider.eventServer.instance.defaults.headers[i][keyHeader] = _this.options.trongridKey
                    }
                }
            }
        },
        _networkChangedEvent: function (networkFullNodeUrl) {
            //监听网络变更事件
            var _this = this;
            try {
                //获取网络名称/区块浏览器
                var networkType = _this._getNetworkType(networkFullNodeUrl);
                var networkName = _this._getNetworkName(networkFullNodeUrl);
                var networkScan = _this._getNetworkScan(networkFullNodeUrl);
                //处理回调
                typeof _this.options.networkChangeEventCallBack === "function" && _this.options.networkChangeEventCallBack(_this, networkType, networkName, networkScan);
                //重新初始化
                _this._init(true);
            } catch (e) {
                console.log(e)
            }
        },
        _accountsChangedEvent: function (account) {
            //账户变更事件
            var _this = this;
            try {
                //处理回调
                typeof _this.options.accountsChangedEventCallBack === "function" && _this.options.accountsChangedEventCallBack(_this, account)

                //处理授权回调
                typeof _this.options.initCallBack === "function" && _this.options.initCallBack(_this, account, true, true)
            } catch (e) {
                console.log(e)
            }
        },
        _getNetworkType: function (networkFullNodeUrl) {
            //获取网络类型
            var networkType = '0';
            switch (networkFullNodeUrl) {
                case 'https://api.trongrid.io':
                case 'https://api.tronstack.io':
                case 'https://tron-mainnet.token.im':
                    networkType = '1';
                    break;
                case 'https://api.shasta.trongrid.io':
                    networkType = '2';
                    break;
                case 'https://testhttpapi.tronex.io':
                    networkType = '3';
                    break;
                case 'https://api.nileex.io':
                    networkType = '4';
                    break;
            }
            return networkType;
        },
        getNetworkType: function (cb) {
            var _this = this;
            var networkFullNodeUrl = _this.getTronWebObj().fullNode.host;
            console.log(networkFullNodeUrl);
            var networkType = _this._getNetworkType(networkFullNodeUrl);
            if (typeof cb === "function") {
                cb(networkType);
            }
            else {
                return networkType;
            }
        },
        _getNetworkName: function (netWorkType) {
            //获取网络名称  非回调
            var networkName = '';
            //1：波场主网 https://api.trongrid.io    https://tronscan.io/
            //1: 波场主网 https://api.tronstack.io    https://tronscan.io/
            //2：Shasta测试网 https://api.shasta.trongrid.io   https://shasta.tronscan.io/#/ 
            //3：Tronex测试网 https://testhttpapi.tronex.io  (主要提供http api 节点接口测试 暂时没找到对应区块浏览器 )
            //4：Nile测试网 https://api.nileex.io  https://nile.tronscan.org/ (部署合约测试主要在此链网络)
            switch (netWorkType) {
                case '1':
                    networkName = 'Mainnet';
                    break;
                case '2':
                    networkName = 'Shasta Testnet';
                    break;
                case '3':
                    networkName = 'Tronnex Testnet';
                    break;
                case '4':
                    networkName = 'Nile Testnet';
                    break;
            }
            return networkName;
        },
        getNetworkName: function (netWorkType) {
            //获取网络名称
            var _this = this;
            try {
                var networkName = '';
                if (_this.getTronWebObj()) {
                    networkName = _this._getNetworkName(netWorkType);
                } else {
                    networkName = "It's not the tronlink environment";
                }
                return networkName;
            } catch (e) {
                typeof _this.options.msgTips === "function" && _this.options.msgTips(e.message || e)
            }
        },
        _getNetworkScan: function (networkType) {
            //获取区块浏览器地址  非回调
            var scanUrl = '';
            switch (networkType) {
                case '1':
                    scanUrl = 'https://tronscan.io/';
                    break;
                case '2':
                    scanUrl = 'https://shasta.tronscan.io';
                    break;
                case '3':
                    scanUrl = 'https://tronex.tronscan.io';
                    break;
                case '4':
                    scanUrl = 'https://nile.tronscan.org/';
                    break;
                default:
                    break;
            }
            return scanUrl;
        },
        getNetworkScan: function (networkType) {
            //获取区块浏览器地址
            var _this = this;
            return _this._getNetworkScan(networkType);

        },
        _getCurrentAccount: function (cb) {
            var _this = this;
            var tmpAccount = _this.getTronWebObj().defaultAddress.base58;
            typeof cb === "function" && cb(tmpAccount);
        },
        getCurrentAccount: function (cb) {
            var _this = this;
            _this._getCurrentAccount(cb)
        },
        _getAccountLink: function (address, networkType, cb) {
            //获取账户区块浏览器地址
            var _this = this;
            try {
                // 账号地址
                if (address) {
                    if (networkType) {
                        //区块地址
                        var networkScan = _this._getNetworkScan(networkType);
                        var ScanAccountLink = networkScan + '#/searcherror/' + address
                        typeof cb === "function" && cb(ScanAccountLink)
                    } else {
                        _this.getNetworkType(function (_networkType) {
                            //区块地址
                            var networkScan = _this._getNetworkScan(_networkType);
                            var ScanAccountLink = networkScan + '#/searcherror/' + address
                            typeof cb === "function" && cb(ScanAccountLink)
                        })
                    }
                } else {
                    _this.getCurrentAccount(function (defaultAccount) {
                        if (networkType) {
                            //区块地址
                            var networkScan = _this._getNetworkScan(networkType);
                            var ScanAccountLink = networkScan + '#/searcherror/' + defaultAccount
                            typeof cb === "function" && cb(ScanAccountLink)
                        } else {
                            _this.getNetworkType(function (_networkType) {
                                //区块地址
                                var networkScan = _this._getNetworkScan(_networkType);
                                var ScanAccountLink = networkScan + '#/searcherror/' + defaultAccount
                                typeof cb === "function" && cb(ScanAccountLink)
                            })
                        }
                    })
                }
            } catch (e) {
                console.log(e)
            }
        },
        getAccountLink: function (address, cb) {
            //获取账户区块浏览器地址
            var _this = this;
            try {
                _this._getAccountLink(address, null, cb)
            } catch (e) {
                console.log(e)
            }
        },
        _getBalance: function (address, cb) {
            //获取指定地址余额
            var _this = this;
            try {
                _this.getTronWebObj().trx.getAccount(address).then(result => {
                    var balance = 0;
                    if (result.balance) {
                        balance = result.balance.toString().div(_this._trxWei)
                    }
                    typeof cb === "function" && cb(balance);
                });
            } catch (e) {
                typeof _this.options.msgTips === "function" && _this.options.msgTips(e.message || e)
            }
        },
        getBalance: function (cb, address) {
            //获取当前/指定地址余额,参数2留空则获取当前地址余额
            var _this = this;
            try {
                if (address) {
                    //获取该地余额
                    _this._getBalance(address, cb)
                } else {
                    //获取当前地址
                    _this.getCurrentAccount(function (_address) {
                        //获取该地余额
                        _this._getBalance(_address, cb)
                    })
                }
            } catch (e) {
                typeof _this.options.msgTips === "function" && _this.options.msgTips(e.message || e)
            }
        },
        _getTokenBalance: function (address, contractAddress, contractABI, cb, decimals) {
            //获取指定合约的指定地址代币余额
            var _this = this;
            try {
                // 定义合约abi
                var contractAbi = contractABI || _this.options.transaction.ContractABI || defaults.transaction.ContractABI || _this.options._ERC20ABIinterface

                // 合约地址
                var _contractAddress = contractAddress || _this.options.transaction.ContractAddress;

                // 调用合约
                _this._getContractObj(_contractAddress, contractAbi, function (myContract) {
                    myContract.balanceOf(address).call(_this.options._callParam).then(data => {
                        var balance = _this.getTronWebObj().toBigNumber(data._hex).toString();
                        if (decimals) {
                            balance = balance.div(Math.pow(10, decimals));
                            typeof cb === "function" && cb(balance);
                        }
                        else {
                            myContract.decimals().call(_this.options._callParam).then(result => {
                                decimals = _this.getTronWebObj().toBigNumber(result);
                                balance = balance.div(Math.pow(10, decimals));
                                typeof cb === "function" && cb(balance);
                            });
                        }
                    });
                });
            } catch (e) {
                typeof _this.options.msgTips === "function" && _this.options.msgTips(e.message || e)
            }
        },
        getTokenBalance: function (cb, address, contractAddress, contractABI, decimals) {
            //获取当前/指定地址代币余额,参数2留空则获取当前地址代币余额
            var _this = this;
            try {
                if (address) {
                    //获取该地代币余额
                    _this._getTokenBalance(address, contractAddress, contractABI, cb, decimals)
                } else {
                    //获取当前地址
                    _this.getCurrentAccount(function (_address) {
                        //获取该地代币余额
                        _this._getTokenBalance(_address, contractAddress, contractABI, cb, decimals)
                    })
                }
            } catch (e) {
                typeof _this.options.msgTips === "function" && _this.options.msgTips(e.message || e)
            }
        },
        _transaction: function (_fromAddress, _toAddress, _money, cb) {
            //转账转出
            var _this = this;
            try {
                var money = _money.mul(_this._trxWei);
                _this.getTronWebObj().transactionBuilder.sendTrx(_toAddress, money, _fromAddress)
                    .then(tx => {
                        _this.getTronWebObj().trx.sign(tx).then(signedTx => {
                            _this.getTronWebObj().trx.sendRawTransaction(signedTx).then(broastTx => {
                                typeof cb === "function" && cb(broastTx.txid);
                            }, err => {
                                console.log(err);
                                typeof cb === "function" && cb(err, true);
                            });
                        }, err => {
                            console.log(err);
                            typeof cb === "function" && cb(err, true);
                        });
                    }, err => {
                        console.log(err);
                        typeof cb === "function" && cb(err, true);
                    });
            } catch (e) {
                typeof _this.options.msgTips === "function" && _this.options.msgTips(e.message || e)
            }

        },
        transaction: function (_toAddress, _money, cb) {
            //当前地址转账转出
            var _this = this;
            try {
                //获取当前地址
                _this.getCurrentAccount(function (fromAddress) {
                    //地址转账转出
                    _this._transaction(fromAddress, _toAddress, _money, cb)
                })
            } catch (e) {
                typeof _this.options.msgTips === "function" && _this.options.msgTips(e.message || e)
            }
        },
        _transactionToken: function (_toAddress, _money, contractAddress, contractABI, decimals, cb) {
            //代币转账转出
            var _this = this;
            try {
                //获取当前地址余额 主要判断手续费是否充足
                _this.getTokenBalance(function (tokenBalance) {
                    if (Number(tokenBalance) < Number(_money)) {
                        typeof _this.options.msgTips === "function" && _this.options.msgTips("代币余额不足")
                        return;
                    }
                    // 定义合约abi
                    var contractAbi = contractABI || _this.options.transaction.ContractABI || defaults.transaction.ContractABI || _this.options._ERC20ABIinterface

                    // 合约地址
                    var _contractAddress = contractAddress || _this.options.transaction.ContractAddress;

                    // 调用合约
                    _this._getContractObj(_contractAddress, contractAbi, function (myContract) {
                        var amount = null;
                        if (decimals) {
                            amount = _money.mul(Math.pow(10, decimals));
                            myContract.transfer(_toAddress, amount.toString()).send({
                                feeLimit: 100000000,
                                callValue: 0,
                            }).then(result => {
                                typeof cb === "function" && cb(result);
                            }, err => {
                                console.log(err);
                                typeof cb === "function" && cb(err, true);
                            });
                        }
                        else {
                            myContract.decimals().call(_this.options._callParam).then(data => {
                                decimals = _this.getTronWebObj().toBigNumber(data._hex);
                                amount = _money.mul(Math.pow(10, decimals));
                                myContract.transfer(_toAddress, amount.toString()).send({
                                    feeLimit: 100000000,
                                    callValue: 0,
                                }).then(result => {
                                    typeof cb === "function" && cb(result);
                                });
                            });
                        }
                    });
                },null, contractAddress, contractABI, decimals);
            } catch (e) {
                typeof _this.options.msgTips === "function" && _this.options.msgTips(e.message || e)
            }
        },
        transactionToken: function (_toAddress, _money, cb, contractAddress, contractABI, decimals) {
            //当前地址代币转账转出
            var _this = this;
            try {
                //地址代币转账转出
                _this._transactionToken(_toAddress, _money, contractAddress, contractABI, decimals, cb)

            } catch (e) {
                typeof _this.options.msgTips === "function" && _this.options.msgTips(e.message || e);
            }
        },
        _getContractObj: function (contractAddress, contractABI, cb) {
            //初始化 设置 合约对象
            var _this = this;
            try {
                // 定义合约abi
                var contractAbi = contractABI;
                // 合约地址
                var _contractAddress = contractAddress;
                if (!_contractAddress) {
                    console.log('contractAddress is empty, TronContractObj Initialization failed')
                    return;
                }
                else {
                    if (contractAbi) {
                        var contractobj = _this.getTronWebObj().contract(contractAbi, contractAddress)
                        typeof cb === "function" && cb(contractobj);
                    }
                    else {
                        _this.getTronWebObj().contract().at(contractAddress).then(result => {
                            typeof cb === "function" && cb(result);
                        });
                    }
                }
            } catch (e) {
                console.log(e)
            }
        },
        checkTransactionReceipt: function (hash, cb) {
            var _this = this;
            try {
                //检查交易是否已经确认 没两秒确认一次
                var intval = setInterval(function () {
                    _this.getTronWebObj().trx.getConfirmedTransaction(hash).then(function (result) {
                        console.log(result);
                        if (result) {
                            //有确认消息
                            clearInterval(intval)
                            //回调处理
                            typeof cb === "function" && cb(result)
                        }
                    }, function (err) {
                            console.log(err);
                    });
                }, 2000);
            } catch (e) {
                console.log(e)
            }
        },

        localqueuekey: "localqueuekey",
        addlocalqueue: function (transferHash, type, addr, userData) {
            //添加未提交转账信息
            var _this = this;
            try {
                var setData = {
                    type: type,
                    addr: addr,
                    data: userData
                };
                setStorageObj(_this.localqueuekey, transferHash, setData)
            } catch (e) {
                typeof _this.options.msgTips === "function" && _this.options.msgTips(e.message || e)
            }
        },
        removelocalqueue: function (transferHash) {
            //移除已提交转账信息
            var _this = this;
            try {
                removeStorageObj(_this.localqueuekey, transferHash)
            } catch (e) {
                typeof _this.options.msgTips === "function" && _this.options.msgTips(e.message || e)
            }
        },
        initqueueSubmit: function () {
            //初始化时，提交队列信息到服务器
            var _this = this;
            try {
                //获取所有队列信息
                var objlocalqueueall = JSON.parse(getStorageItem(_this.localqueuekey) || "{}")
                if (objlocalqueueall) {
                    for (var itemkey in objlocalqueueall) {
                        var item = objlocalqueueall[itemkey]
                        typeof _this.options.transactionQueueSubmit === "function" && _this.options.transactionQueueSubmit(_this, itemkey, item.type, item.addr, item.data)
                    }
                }
            } catch (e) {
                typeof _this.options.msgTips === "function" && _this.options.msgTips(e.message || e)
            }
        },
        //合约方法---ABI 交互实现-----Token NFT1155 操作
        getTokenIndex_ERC1155: function (id, isNFT, nonce) {
            //获取合约代币类型ID
            if (!isNFT) {
                return id
            }
            if (typeof (nonce) == "undefined" || nonce == null) {
                nonce = 1//nonce从1开始
            }
            //高128位NFT标志
            var TYPE_NF_BIT = new BigNumber('0x8000000000000000000000000000000000000000000000000000000000000000').toString(10)
            //高位索引合并高位标志
            var NFT_Type = TYPE_NF_BIT.add(new BigNumber('0x' + new BigNumber(nonce).toString() + '00000000000000000000000000000000').toString(10))
            //合并低128位索引ID
            var tokenIndex = NFT_Type.add(id)

            return tokenIndex
        },
        getNFTActualID_ERC1155: function (id, isNFT, nonce) {
            //获取 非同质化代币实际ID
            if (!isNFT) {
                return id
            }
            if (typeof (nonce) == "undefined" || nonce == null || !nonce) {
                nonce = 1//nonce从1开始
            }
            //高128位NFT标志
            var TYPE_NF_BIT = new BigNumber('0x8000000000000000000000000000000000000000000000000000000000000000').toString(10)
            //高位索引合并高位标志
            var NFT_Type = TYPE_NF_BIT.add(new BigNumber('0x' + new BigNumber(nonce).toString() + '00000000000000000000000000000000').toString(10))
            //全ID减去高128位存储类型
            var tokenActualID = id.sub(NFT_Type)

            return tokenActualID
        },
        isNonFungible_ERC1155: function (id) {
            //判断是否为非同质化代币
            //高128位NFT标志
            var TYPE_NF_BIT = new BigNumber('0x8000000000000000000000000000000000000000000000000000000000000000')

            var TYPE_NF_BIT_arr = new BigNumber(TYPE_NF_BIT).toString(2).split("").reverse()
            var id_arr = new BigNumber(id).toString(2).split("").reverse()
            var maxLength = Math.max(TYPE_NF_BIT_arr.length, id_arr.length)
            var oand =[]
            for (var i = 0; i < maxLength; i++) {
                oand[i] = TYPE_NF_BIT_arr[i] & id_arr[i]
            }
            oand = oand.reverse().join("")
            oand = new BigNumber(oand, 2)

            //高位索引 和 高位标志 与运算
            var isNonFungible = TYPE_NF_BIT.toString(16) == oand.toString(16)
            return isNonFungible
        },
        _getTokenBalance_ERC1155: function (address, id, contractAddress, contractABI, cb, decimals) {
            //获取指定合约的指定地址代币余额
            var _this = this
            var _baseThis = _this
            try {
                // 定义合约abi
                var contractAbi = contractABI || _this.options._ERC1155ABIinterface

                // 合约地址
                var _contractAddress = contractAddress

                // 调用合约
                _baseThis._getContractObj(_contractAddress, contractAbi, function (myContract) {
                    myContract.balanceOf(address, id).call(_baseThis.options._callParam).then(data => {
                        var balance = _baseThis.getTronWebObj().toBigNumber(data._hex).toString()

                        if (!_baseThis.isNonFungible_ERC1155(id)) {
                            //同质化代币
                            if (decimals) {
                                balance = balance.div(Math.pow(10, decimals))
                                typeof cb === "function" && cb(balance)
                            }
                            else {
                                myContract.decimals().call(_baseThis.options._callParam).then(result => {
                                    decimals = _baseThis.getTronWebObj().toBigNumber(result)
                                    balance = balance.div(Math.pow(10, decimals))
                                    typeof cb === "function" && cb(balance)
                                })
                            }
                        } else {
                            //非同质化代币
                            typeof cb === "function" && cb(balance)
                        }
                    })
                })
            } catch (e) {
                typeof _baseThis.options.msgTips === "function" && _baseThis.options.msgTips(e.message || e)
            }
        },
        getTokenBalance_ERC1155: function (cb, address, id, contractAddress, contractABI, decimals) {
            //获取当前/指定地址代币余额,参数2留空则获取当前地址代币余额
            var _this = this
            var _baseThis = _this
            try {
                if (address) {
                    //获取该地代币余额
                    _this._getTokenBalance_ERC1155(address, id, contractAddress, contractABI, cb, decimals)
                } else {
                    //获取当前地址
                    _baseThis.getCurrentAccount(function (_address) {
                        //获取该地代币余额
                        _this._getTokenBalance_ERC1155(_address, id, contractAddress, contractABI, cb, decimals)
                    })
                }
            } catch (e) {
                typeof _baseThis.options.msgTips === "function" && _baseThis.options.msgTips(e.message || e)
            }
        },
        _getTokenIDbyIndex: function (cb, address, id, index, contractAddress, contractABI) {
            //根据地址与类型和索引获取NFT的ID
            var _this = this
            var _baseThis = _this
            try {
                // 定义合约abi
                var contractAbi = contractABI || _this.options._ERC1155ABIinterface

                // 合约地址
                var _contractAddress = contractAddress

                // 调用合约
                _baseThis._getContractObj(_contractAddress, contractAbi, function (myContract) {
                    myContract.tokenOfOwnerByIndex(address, id, index).call(_baseThis.options._callParam).then(data => {
                        typeof cb === "function" && cb(data, index)
                    })
                })
            } catch (e) {
                typeof _baseThis.options.msgTips === "function" && _baseThis.options.msgTips(e.message || e)
            }
        },
        getTokenList_ERC1155: function (cb, address, id, contractAddress, contractABI) {
            //获取当前/指定地址NFT代币余额,参数2留空则获取当前地址代币余额
            var _this = this
            var _baseThis = _this
            try {
                if (address) {
                    //获取该地代币余额
                    _this._getTokenBalance_ERC1155(address, id, contractAddress, contractABI, function (count) {
                        _getTokenList_ERC1155(count, address, id)
                    })
                } else {
                    //获取当前地址
                    _baseThis.getCurrentAccount(function (_address) {
                        //获取该地代币余额
                        _this._getTokenBalance_ERC1155(_address, id, contractAddress, contractABI, function (count) {
                            _getTokenList_ERC1155(count, _address, id)
                        })
                    })
                }

                function checktaskObj() {
                    //任务检查
                    this.coutnc = 1;
                    this.crrc = 0;
                    this.cancel = false;

                    this.check = function (cb) {
                        if (this.crrc >= this.coutnc && !this.cancel) {
                            typeof cb === "function" && cb(true)
                        } else {
                            typeof cb === "function" && cb(false)
                        }
                    }
                }
                //获取列表
                function _getTokenList_ERC1155(count, _address, _id) {
                    var datalist = [];
                    if (count == 0) {
                        typeof cb === "function" && cb(datalist);
                        return;
                    }  
                    var checktask = new checktaskObj();
                    checktask.coutnc = count;
                    for (var i = 0; i < count; i++) {
                        var currid = _this._getTokenIDbyIndex(function (rdata, index) {
                            checktask.crrc++;
                            datalist[index] = {
                                _hex: rdata,
                                HexID : '0x' + new BigNumber(_this.getNFTActualID_ERC1155(rdata.toString(), 1)).toString(16),
                                ActualID: _this.getNFTActualID_ERC1155(rdata.toString(), 1)
                            }
                            checktask.check(function (checkresult) {
                                if (checkresult) {
                                    typeof cb === "function" && cb(datalist);
                                }
                            })
                        }, _address, _id, i, contractAddress, contractABI)
                    }
                }
            } catch (e) {
                typeof _baseThis.options.msgTips === "function" && _baseThis.options.msgTips(e.message || e)
            }
        },
        _transactionToken_ERC1155: function (_fromAddress, _toAddress, _money, id, contractAddress, contractABI, decimals, cb) {
            //代币转账转出
            var _this = this;
            try {
                //获取当前地址余额 主要判断手续费是否充足
                _this.getTokenBalance_ERC1155(function (tokenBalance) {
                    if (Number(tokenBalance) < Number(_money)) {
                        typeof _this.options.msgTips === "function" && _this.options.msgTips("代币余额不足")
                        return;
                    }
                    // 定义合约abi
                    var contractAbi = contractABI || _this.options._ERC1155ABIinterface

                    // 合约地址
                    var _contractAddress = contractAddress

                    // 调用合约
                    _this._getContractObj(_contractAddress, contractAbi, function (myContract) {
                        var amount = null;
                        if (!_this.isNonFungible_ERC1155(id)) {
                            //同质化代币
                            if (decimals) {
                                amount = _money.mul(Math.pow(10, decimals));
                                myContract.safeTransferFrom(_fromAddress, _toAddress, id, amount.toString(), []).send({
                                    feeLimit: 100000000,
                                    callValue: 0,
                                }).then(result => {
                                    typeof cb === "function" && cb(result);
                                }, err => {
                                    console.log(err);
                                    typeof cb === "function" && cb(err, true);
                                });
                            }
                            else {
                                myContract.decimals().call(_this.options._callParam).then(data => {
                                    decimals = data.toString();
                                    amount = _money.mul(Math.pow(10, decimals));
                                    myContract.safeTransferFrom(_fromAddress, _toAddress, id, amount.toString(), []).send({
                                        feeLimit: 100000000,
                                        callValue: 0,
                                    }).then(result => {
                                        typeof cb === "function" && cb(result);
                                    });
                                });
                            }
                        } else {
                            //非同质化代币
                            amount = '1';
                            myContract.safeTransferFrom(_fromAddress, _toAddress, id, amount.toString(), []).send({
                                feeLimit: 100000000,
                                callValue: 0,
                            }).then(result => {
                                typeof cb === "function" && cb(result);
                            }, err => {
                                console.log(err);
                                typeof cb === "function" && cb(err, true);
                            });
                        }
                    });
                }, null, id, contractAddress, contractABI, decimals);
            } catch (e) {
                typeof _this.options.msgTips === "function" && _this.options.msgTips(e.message || e)
            }
        },
        transactionToken_ERC1155: function (_toAddress, _money, id, cb, contractAddress, contractABI, decimals) {
            //当前地址代币转账转出
            var _this = this;
            try {
                //获取当前地址
                _this.getCurrentAccount(function (fromAddress) {
                    //地址代币转账转出
                    _this._transactionToken_ERC1155(fromAddress, _toAddress, _money, id, contractAddress, contractABI, decimals, cb)
                })
            } catch (e) {
                typeof _this.options.msgTips === "function" && _this.options.msgTips(e.message || e);
            }
        },
    }

    //首次执行初始化回调
    DappObj.init();

    return DappObj;
}