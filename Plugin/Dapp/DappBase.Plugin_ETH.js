
function DappCreate(_options) {
    var defaults = {
        transaction: {
            Decimals: 18,//精度 转出金额扩大精度默认18位
            ContractAddress: null,//ERC20合约地址
            //默认RRC20代币合约ABI
            ContractABI: [{ "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "INITIAL_SUPPLY", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_subtractedValue", "type": "uint256" }], "name": "decreaseApproval", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_addedValue", "type": "uint256" }], "name": "increaseApproval", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" }], "name": "allowance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "spender", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }],
        },
        msgTips: function (msg) {
            //定义消息处理
            alert(msg)
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
            //1：以太坊主网 https://cn.etherscan.com/
            //3：Ropsten测试链 https://ropsten.etherscan.io/
            //42：Kovan测试链 https://kovan.etherscan.io/
            //4：Rinkeby测试链 https://rinkeby.etherscan.io/
            //5：Goerli测试链 https://goerli.etherscan.io/
            //初始化完成后回调/网络变更回调
            console.log('NetworkType:' + networkType + ', NetworkName:' + networkName + ', NetworkScan:' + networkScan)
        },
        networkChangeEventCallBack: function (e, networkType, networkName, networkScan) {
            //1：以太坊主网 https://cn.etherscan.com/
            //3：Ropsten测试链 https://ropsten.etherscan.io/
            //42：Kovan测试链 https://kovan.etherscan.io/
            //4：Rinkeby测试链 https://rinkeby.etherscan.io/
            //5：Goerli测试链 https://goerli.etherscan.io/
            //网络变更后回调
            console.log('networkChanged: new Network: NetworkType:' + networkType + ', NetworkName:' + networkName + ', NetworkScan:' + networkScan)
        },
        accountsChangedEventCallBack: function (e, defaultAccount) {
            //账号变更事件
            console.log('accountsChangedEvent: new accounts:' + defaultAccount)
        },
        isAuthorize: true,//启用授权
        defaultNetwork: "1",//默认网络
    };
    var options = $.extend({}, defaults, _options);//将一个空对象做为第一个参数

    //处理默认参数
    if (options.transaction && !options.transaction.Decimals && options.transaction.Decimals != 0) {
        options.transaction.Decimals = defaults.transaction.Decimals
    }

    //创建对象
    var DappObj = {
        _ethWei: Math.pow(10, 18),
        options: options,
        _initNumber: 0,
        _init: function (isNotFirst) {
            //初始化 基础web3接口方法
            var _this = this;
            try {
                var web3Provider = window.ethereum || (window.web3 && window.web3.currentProvider) || Web3.givenProvider;
                if (window.web3) {
                    window._web3 = window.web3
                }

                if (web3Provider) {
                    //创建web3对象
                    window.web3Obj = new Web3(web3Provider);

                    //授权初始化
                    if (_this.options.isAuthorize) {
                        //鉴权授权获取账户
                        _this.getCurrentAccount(function (defaultAccount) {
                            window.defaultAccount = defaultAccount;
                            //初始化完成执行回调鉴权
                            typeof _this.options.initCallBack === "function" && _this.options.initCallBack(_this, defaultAccount, true, isNotFirst)
                            //初始化完成执行扩展回调
                            typeof _this.options.extensionCallBack === "function" && _this.options.extensionCallBack(_this, defaultAccount, true, isNotFirst)
                        })
                    }

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
                } else {
                    //初始化完成执行回调
                    typeof _this.options.initCallBack === "function" && _this.options.initCallBack(_this, null, false, isNotFirst)
                    //初始化完成执行扩展回调
                    typeof _this.options.extensionCallBack === "function" && _this.options.extensionCallBack(_this, null, false, isNotFirst)
                }
                if (!isNotFirst) {
                    try {
                        //监听网络变更事件
                        //console.log("base: add networkChanged Event")
                        if (window.ethereum) {
                            window.ethereum.autoRefreshOnNetworkChange = false;
                        }
                        window.ethereum && window.ethereum.on && window.ethereum.on('networkChanged', function (networkType) {
                            //处理网络变更事件
                            _this._networkChangedEvent(networkType);
                        })

                        //监听账号变更事件
                        //console.log("base: add accountsChanged Event")
                        window.ethereum && window.ethereum.on && window.ethereum.on('accountsChanged', function (accounts) {
                            //处理账号变更事件
                            _this._accountsChangedEvent(accounts[0]);
                            window.defaultAccount = accounts[0];
                        })
                    } catch (e) {
                        console.log(e)
                    }
                }
            } catch (e) {
                console.log(e)
            }
        },
        init: function () {
            //初始化 插件方法
            var _this = this;
            try {
                //定义回调函数
                //window.addEventListener('load', function () {
                //    _this._init()
                //});
                $(function () {
                    _this._init()           
                })           
            } catch (e) {
                console.log(e)
            }
        },
        getWeb3Obj: function () {
            return window.web3Obj
        },
        _networkChangedEvent: function (networkType) {
            //监听网络变更事件
            var _this = this;
            try {
                //获取网络名称/区块浏览器
                var networkName = _this._getNetworkName(networkType);
                var networkScan = _this._getNetworkScan(networkType);

                //处理回调
                typeof _this.options.networkChangeEventCallBack === "function" && _this.options.networkChangeEventCallBack(_this, networkType, networkName, networkScan)

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
        getNetworkType: function (cb) {
            //获取网络类型
            var _this = this;
            try {
                if (_this.getWeb3Obj() && _this.getWeb3Obj().eth.net && _this.getWeb3Obj().eth.net.getId) {
                    _this.getWeb3Obj().eth.net.getId(function (err, networkType) {
                        typeof cb === "function" && cb(networkType.toString() || _this.options.defaultNetwork)
                    })
                } else if (_this.getWeb3Obj() && _this.getWeb3Obj().version && _this.getWeb3Obj().version.getNetwork) {
                    _this.getWeb3Obj().version.getNetwork(function (err, networkType) {
                        typeof cb === "function" && cb(networkType.toString() || _this.options.defaultNetwork)
                    })
                } else if (window._web3 && window._web3.version && window._web3.version.getNetwork) {
                    window._web3.version.getNetwork(function (err, networkType) {
                        typeof cb === "function" && cb(networkType.toString() || _this.options.defaultNetwork)
                    })
                } else if (window.ethereum && window.ethereum.networkVersion) {
                    typeof cb === "function" && cb(window.ethereum.networkVersion || _this.options.defaultNetwork)
                } else {
                    typeof cb === "function" && cb(_this.options.defaultNetwork)
                }
            } catch (e) {
                typeof _this.options.msgTips === "function" && _this.options.msgTips(e.message || e)
            }
        },
        _getNetworkName: function (networkType) {
            //获取网络名称  非回调
            var networkName = '';
            //1：以太坊主网 https://cn.etherscan.com/
            //3：Ropsten测试链 https://ropsten.etherscan.io/
            //42：Kovan测试链 https://kovan.etherscan.io/
            //4：Rinkeby测试链 https://rinkeby.etherscan.io/
            //5：Goerli测试链 https://goerli.etherscan.io/
            switch (networkType) {
                case '1':
                    networkName = 'Main';
                    break;
                case '3':
                    networkName = 'Ropsten';
                    break;
                case '42':
                    networkName = 'Kovan';
                    break;
                case '4':
                    networkName = 'Rinkeby';
                    break;
                case '5':
                    networkName = 'Goerli';
                    break;
                default:
                    networkName = 'Other';
                    break;
            }
            return networkName;
        },
        getNetworkName: function (networkType, cb) {
            //获取网络名称
            var _this = this;
            try {
                if (networkType) {
                    var networkName = _this._getNetworkName(networkType);
                    typeof cb === "function" && cb(networkName)
                } else {
                    _this.getNetworkType(function (_networkType) {
                        var networkName = _this._getNetworkName(_networkType);
                        typeof cb === "function" && cb(networkName)
                    })
                }
            } catch (e) {
                typeof _this.options.msgTips === "function" && _this.options.msgTips(e.message || e)
            }
        },
        _getNetworkScan: function (networkType) {
            //获取区块浏览器地址  非回调
            var scanUrl = '';
            //1：以太坊主网 https://cn.etherscan.com/
            //3：Ropsten测试链 https://ropsten.etherscan.io/
            //42：Kovan测试链 https://kovan.etherscan.io/
            //4：Rinkeby测试链 https://rinkeby.etherscan.io/
            //5：Goerli测试链 https://goerli.etherscan.io/
            switch (networkType) {
                case '1':
                    scanUrl = 'https://cn.etherscan.com/';
                    break;
                case '3':
                    scanUrl = 'https://ropsten.etherscan.io/';
                    break;
                case '42':
                    scanUrl = 'https://kovan.etherscan.io/';
                    break;
                case '4':
                    scanUrl = 'https://rinkeby.etherscan.io/';
                    break;
                case '5':
                    scanUrl = 'https://goerli.etherscan.io/';
                    break;
                default:
                    break;
            }
            return scanUrl;
        },
        getNetworkScan: function (networkType, cb) {
            //获取区块浏览器地址
            var _this = this;
            try {
                if (networkType) {
                    var scanUrl = _this._getNetworkScan(networkType);
                    typeof cb === "function" && cb(scanUrl)
                } else {
                    _this.getNetworkType(function (_networkType) {
                        var scanUrl = _this._getNetworkScan(_networkType);
                        typeof cb === "function" && cb(scanUrl)
                    })
                }
            } catch (e) {
                typeof _this.options.msgTips === "function" && _this.options.msgTips(e.message || e)
            }
        },
        getGasPrice: function (cb) {
            //获取当前gas价格
            var _this = this;
            try {
                _this.getWeb3Obj().eth.getGasPrice().then(function (gasPrice) {
                    typeof cb === "function" && cb(gasPrice)
                });
            } catch (e) {
                typeof _this.options.msgTips === "function" && _this.options.msgTips(e.message || e)
            }
        },
        _getCurrentAccount: function (cb) {
            var _this = this;
            //获取当前地址  非授权
            _this.getWeb3Obj().eth.getAccounts(function (err, accounts) {
                typeof cb === "function" && cb(accounts[0])
            })
        },
        getCurrentAccount: function (cb) {
            //获取当前地址,授权获取
            var _this = this;
            try {
                if (window.ethereum) {
                    window.ethereum.enable().then(function (accounts) {
                        //完成执行回调
                        typeof cb === "function" && cb(accounts[0])
                    }).catch(function (reason) {
                        console.log(reason)
                        //处理废弃接口  EIP 1102
                        if (reason.code == 4200) {
                            window.ethereum.send('eth_requestAccounts').then(function (accounts) {
                                //完成执行回调
                                typeof cb === "function" && cb(accounts[0])
                            }).catch(function (reason) {
                                console.log(reason)
                                //处理错误。用户可能拒绝登录:
                                if (reason.code == 4001) {
                                    typeof _this.options.msgTips === "function" && _this.options.msgTips("用户拒绝帐户授权")
                                } else {
                                    typeof _this.options.msgTips === "function" && _this.options.msgTips(reason.message)
                                }
                                //权限拒绝回调
                                typeof cb === "function" && cb()
                            })
                        } else {
                            //处理错误。用户可能拒绝登录:
                            if (reason.code == 4001) {
                                typeof _this.options.msgTips === "function" && _this.options.msgTips("用户拒绝帐户授权")
                            } else {
                                typeof _this.options.msgTips === "function" && _this.options.msgTips(reason.message)
                            }
                            //权限拒绝回调
                            typeof cb === "function" && cb()
                        }
                    })
                } else if (_this.getWeb3Obj()) {
                    _this.getWeb3Obj().eth.getAccounts().then(function (accounts) {
                        typeof cb === "function" && cb(accounts[0])
                    });
                } else {
                    typeof cb === "function" && cb(null)
                }
            } catch (e) {
                typeof _this.options.msgTips === "function" && _this.options.msgTips(e.message || e)
            }
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
                        var ScanAccountLink = networkScan + 'address/' + address
                        typeof cb === "function" && cb(ScanAccountLink)
                    } else {
                        _this.getNetworkType(function (_networkType) {
                            //区块地址
                            var networkScan = _this._getNetworkScan(_networkType);
                            var ScanAccountLink = networkScan + 'address/' + address
                            typeof cb === "function" && cb(ScanAccountLink)
                        })
                    }
                } else {
                    _this.getCurrentAccount(function (defaultAccount) {
                        if (networkType) {
                            //区块地址
                            var networkScan = _this._getNetworkScan(networkType);
                            var ScanAccountLink = networkScan + 'address/' + defaultAccount
                            typeof cb === "function" && cb(ScanAccountLink)
                        } else {
                            _this.getNetworkType(function (_networkType) {
                                //区块地址
                                var networkScan = _this._getNetworkScan(_networkType);
                                var ScanAccountLink = networkScan + 'address/' + defaultAccount
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
                _this.getWeb3Obj().eth.getBalance(address).then(function (result) {
                    var balance = result;
                    if (_this.getWeb3Obj().fromWei) {
                        balance = _this.getWeb3Obj().fromWei(result, 18)
                    } else {
                        balance = balance.div(_this._ethWei)
                    }
                    typeof cb === "function" && cb(balance)
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
        _getTokenBalance: function (address, contractAddress, contractABI, decimals, cb) {
            //获取指定合约的指定地址代币余额
            var _this = this;
            try {
                // 定义合约abi
                var contractAbi = contractABI || _this.options.transaction.ContractABI || defaults.transaction.ContractABI

                // 合约地址
                var _contractAddress = contractAddress || _this.options.transaction.ContractAddress;

                // 定义合约
                var myContract = _this._getContractObj(_contractAddress, contractAbi);

                myContract.methods.balanceOf(address).call().then(function (result) {
                    var balance = result;
                    if (_this.getWeb3Obj().fromWei) {
                        balance = _this.getWeb3Obj().fromWei(result, decimals || _this.options.transaction.Decimals || defaults.transaction.Decimals)
                    } else {
                        balance = balance.div(Math.pow(10, decimals || _this.options.transaction.Decimals || defaults.transaction.Decimals))
                    }
                    typeof cb === "function" && cb(balance)
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
                    _this._getTokenBalance(address, contractAddress, contractABI, decimals, cb)
                } else {
                    //获取当前地址
                    _this.getCurrentAccount(function (_address) {
                        //获取该地代币余额
                        _this._getTokenBalance(_address, contractAddress, contractABI, decimals, cb)
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
                var money = _money.mul(_this._ethWei);

                var params = {
                    to: _toAddress,
                    from: _fromAddress,
                    value: money
                }

                _this.getWeb3Obj().eth.sendTransaction(params)
                    .on('transactionHash', function (rdata) {
                        typeof cb === "function" && cb(rdata, _fromAddress)
                        ////监听到账
                        //_this.checkTransactionReceipt(rdata, function (receipt) {
                        //    console.log(receipt);
                        //})
                    })
                    .on('error', function (err) {
                        console.log(err)
                        if (err && err.code) {
                            typeof _this.options.msgTips === "function" && _this.options.msgTips(err.message || err)
                        }                 
                    })
                    //.on('confirmation', function (confirmationNumber, receipt) {
                    //    console.log('confirmation: ' + confirmationNumber);
                    //})
                    //.on('receipt', function (receipt) {
                    //    console.log(receipt);
                    //});
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
        _transactionToken: function (_fromAddress, _toAddress, _money, contractAddress, contractABI, decimals, cb) {
            //代币转账转出
            var _this = this;
            try {
                //获取当前地址余额 主要判断手续费是否充足
                _this.getTokenBalance(function (tokenBalance) {
                    if (Number(tokenBalance) < Number(_money)) {
                        typeof _this.options.msgTips === "function" && _this.options.msgTips("代币余额不足")
                        return;
                    }

                    var money = _money.mul(Math.pow(10, decimals || _this.options.transaction.Decimals || defaults.transaction.Decimals));

                    // 定义合约abi
                    var contractAbi = contractABI || _this.options.transaction.ContractABI || defaults.transaction.ContractABI

                    // 合约地址
                    var _contractAddress = contractAddress || _this.options.transaction.ContractAddress;

                    // 定义合约
                    var myContract = _this._getContractObj(_contractAddress, contractAbi, _fromAddress);

                    myContract.methods.transfer(_toAddress, money)
                        .send({ from: _fromAddress })
                        .on('transactionHash', function (rdata) {
                            typeof cb === "function" && cb(rdata, _fromAddress)
                            ////监听到账
                            //_this.checkTransactionReceipt(rdata, function (receipt) {
                            //    console.log(receipt);
                            //})
                        })
                        .on('error', function (err) {
                            console.log(err)
                            if (err && err.code) {
                                typeof _this.options.msgTips === "function" && _this.options.msgTips(err.message || err)
                            }
                        })
                        //.on('confirmation', function (confirmationNumber, receipt) {
                        //    console.log('confirmation: ' + confirmationNumber);
                        //})
                        //.on('receipt', function (receipt) {
                        //    console.log(receipt);
                        //});
                }, _fromAddress, contractAddress, contractABI, decimals)
            } catch (e) {
                typeof _this.options.msgTips === "function" && _this.options.msgTips(e.message || e)
            }
        },       
        transactionToken: function (_toAddress, _money, cb, contractAddress, contractABI, decimals) {
            //当前地址代币转账转出
            var _this = this;
            try {
                 //获取当前地址
                _this.getCurrentAccount(function (fromAddress) {
                     //获取当前地址余额 主要判断手续费是否充足
                    _this.getBalance(function (ETHBalance) {
                        if (ETHBalance == 0) {
                            typeof _this.options.msgTips === "function" && _this.options.msgTips("ETH余额不足(转账手续费不足)")
                            return;
                        }
                        //地址代币转账转出
                        _this._transactionToken(fromAddress, _toAddress, _money, contractAddress, contractABI, decimals, cb)
                    }, fromAddress)
                })
            } catch (e) {
                typeof _this.options.msgTips === "function" && _this.options.msgTips(e.message || e)
            }
        },
        _getContractObj: function (contractAddress, contractABI, fromAddress) {
            //初始化 设置 合约对象
            var _this = this;
            try {
                // 定义合约abi
                var contractAbi = contractABI || _this.options.contract.ContractABI

                // 合约地址
                var _contractAddress = contractAddress || _this.options.contract.ContractAddress;
                if (!contractAbi) {
                    console.log('contractAbi is empty, Web3ContractObj Initialization failed')
                    return;
                }
                if (!_contractAddress) {
                    console.log('contractAddress is empty, Web3ContractObj Initialization failed')
                    return;
                }
                if (_this.getWeb3Obj().eth.Contract) {
                    //web3 version >=1.0
                    var _web3Obj = _this.getWeb3Obj()
                    return new _web3Obj.eth.Contract(contractAbi, _contractAddress, {
                        from: fromAddress, // default from address 授权访问数据必须设置
                    });
                } else if (_this.getWeb3Obj().eth.contract) {
                    //web3 version <1.0
                    var _web3Obj = _this.getWeb3Obj()
                    var newObj = _web3Obj.eth.contract(contractAbi).at(_contractAddress)
                    _this.getWeb3Obj().eth.defaultAccount = fromAddress
                    return newObj
                } else {
                    console.log('contract create Provider err, Web3ContractObj Initialization failed')
                    return;
                }
            } catch (e) {
                console.log(e)
            }
        },
        wallet_watchAsset: function (_options) {
            var _this = this;
            try {
                //添加合约代币
                if (!window.ethereum) {
                    return;
                }
                var defaultsOptions = {
                    type: "ERC20",
                    options: {
                        address: '',
                        symbol: '',
                        decimals: 18,
                        image: '',
                    }
                };
                var options = $.extend({}, defaultsOptions, _options);//将一个空对象做为第一个参数

                _this.getCurrentAccount(function (_addr) {
                    var skey = _addr + '_' + options.options.address
                    var sval = localStorage.getItem(skey)
                    if (sval) {
                        //已添加
                        return
                    }
                    ethereum.send({
                        method: "wallet_watchAsset",
                        params: options,
                        id: Math.round(1e5 * Math.random())
                    }, function (e, t) {
                        e && console.log('err:' + e)
                        t && console.log('result:' + e)
                        e || (t.result ? (localStorage.setItem(skey, '1'), console.log("添加代币成功")) : console.log("添加代币失败"))
                    })
                })
            } catch (e) {
                console.log(e)
            }
        },
        checkTransactionReceipt: function (hash, cb) {
            var _this = this;
            try {
                //检查交易是否已经确认 没两秒确认一次
                var intval = setInterval(function () {
                    _this.getWeb3Obj().eth.getTransactionReceipt(hash, function (a, b) {
                        console.log(a);
                        console.log(b);
                        if (b) {
                            //有确认消息
                            clearInterval(intval)
                            //回调处理
                            typeof cb === "function" && cb(b)
                        }
                    })
                }, 2000)
            } catch (e) {
                console.log(e)
            }
        }
    }

    //首次执行初始化回调
    DappObj.init();

    return DappObj;
}