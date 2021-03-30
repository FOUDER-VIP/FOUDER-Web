function InitDappContract(_options, _dappBaseOptions) {
    var defaults = {
        contract: {
            ContractAddress: null,//合约地址
            //合约ABI
            ContractABI: null,
        },
        msgTips: function (msg) {
            //定义消息处理
            alert(msg)
        },
        initCallBack: function (e, networkType, networkName, networkScan) {
            //初始化完成后回调/网络变更回调
            console.log("Contract init succeed! " + 'NetworkType:' + networkType + ', NetworkName:' + networkName + ', NetworkScan:' + networkScan)
        },
        initAuthorizeCallBack: function (e, defaultAccount, isAuthorize) {
            //初始化完成后授权回调/网络变更回调/账号变更回调
            console.log("Authorize CallBack,defaultAccount:" + defaultAccount +",result:" + isAuthorize)
        },
        accountsChangedEventCallBack: function (e, defaultAccount, isShowdefaultAccount) {
            //账号变更事件
            console.log('accountsChangedEvent: new accounts:' + defaultAccount)
        },
    };
    var options = $.extend({}, defaults, _options);//将一个空对象做为第一个参数

    //重写 DappBaseObj 参数处理
    var dappBaseOptions = _dappBaseOptions;
    dappBaseOptions.extensionCallBack = function (e, defaultAccount, isEthereum, isNotFirst) {
        //dappBase执行初始化回调
        //DAPP环境
        if (isEthereum) {
            //合约初始化
            DappContractObj.init(!!defaultAccount, isEthereum, isNotFirst, defaultAccount);
        }
    }

    //创建对象
    var DappContractObj = {
        _ethWei: Math.pow(10, 18),
        options: options,
        DappBaseObj: DappCreate(dappBaseOptions),
        ContractObj: null,
        init: function (isAuthorize, isEthereum, isNotFirst, defaultAccount) {
            //初始化 插件方法
            var _this = this;
            try {
                //DAPP环境
                if (isEthereum) {
                    //合约对象创建
                    _this._setWeb3ContractObj(defaultAccount);

                    //获取网络类型/名称/区块浏览器
                    _this.DappBaseObj.getNetworkType(function (networkType) {
                        var networkName = _this.DappBaseObj._getNetworkName(networkType);
                        var networkScan = _this.DappBaseObj._getNetworkScan(networkType);
                        //初始化完成执行回调
                        typeof _this.options.initCallBack === "function" && _this.options.initCallBack(_this, networkType, networkName, networkScan)

                        _this.getCurrentAccount(function (defaultAccount) {
                            //鉴权回调
                            typeof _this.options.initAuthorizeCallBack === "function" && _this.options.initAuthorizeCallBack(_this, defaultAccount, isAuthorize)

                            //首次加载
                            if (!isNotFirst) {
                                try {
                                    //监听账号变更事件
                                    //console.log("Contract: add accountsChanged Event")
                                    window.ethereum && window.ethereum.on && window.ethereum.on('accountsChanged', function (accounts) {
                                        //处理账号变更事件
                                        _this._accountsChangedEvent(accounts[0]);
                                    })
                                } catch (e) {
                                    console.log(e)
                                }
                            }
                        })
                    })
                }
            } catch (e) {
                console.log(e)
            }
        },
        _setWeb3ContractObj: function (fromAddress, contractAddress, contractABI) {
            //初始化 设置 合约对象
            var _this = this;
            try {
                //来源地址
                if (fromAddress) {
                    _this._getContractObj(contractAddress, contractABI, fromAddress, function (myContract) {
                        _this.ContractObj = myContract
                    });
                } else {
                    _this.DappBaseObj.getCurrentAccount(function (_fromAddress) {
                        _this._getContractObj(contractAddress, contractABI, _fromAddress, function (myContract) {
                            _this.ContractObj = myContract
                        });
                    })
                }                
            } catch (e) {
                console.log(e)
            }
        },
        _setWeb3ContractObj_fromAddress: function (fromAddress) {
            //重映射合约对象授权
            var _this = this;
            try {
                //重映射合约对象授权
                //_this.ContractObj.options.from = fromAddress;
                _this._setWeb3ContractObj(fromAddress)
            } catch (e) {
                console.log(e)
            }
        },
        _setContractObjDefaultGasPrice: function (gasPrice) {
            //获取账户地址
            var _this = this;
            try {
                _this.ContractObj.options.gasPrice = gasPrice.mul(Math.pow(10, 9))
            } catch (e) {
                console.log(e)
            }
        },
        _accountsChangedEvent: function (account) {
            //账户变更事件
            var _this = this;
            try {
                //重映射合约对象授权
                _this._setWeb3ContractObj_fromAddress(account)

                //处理回调
                typeof _this.options.accountsChangedEventCallBack === "function" && _this.options.accountsChangedEventCallBack(_this, account, true)

                //鉴权回调
                typeof _this.options.initAuthorizeCallBack === "function" && _this.options.initAuthorizeCallBack(_this, account, true)
            } catch (e) {
                console.log(e)
            }
        },
        getContractLink: function (contractAddress, cb) {
            //获取合约区块浏览器地址
            var _this = this;
            try {
                // 合约地址
                var _contractAddress = contractAddress || _this.options.contract.ContractAddress;

                //区块地址
                _this.DappBaseObj.getNetworkType(function (networkType) {
                    var networkScan = _this.DappBaseObj._getNetworkScan(networkType);

                    var contractLink = networkScan + '#/address/' + _contractAddress
                    typeof cb === "function" && cb(contractLink)
                })
            } catch (e) {
                console.log(e)
            }
        },
        getContractAddress: function () {
            //获取合约地址
            var _this = this;
            try {
                return _this.options.contract.ContractAddress;
            } catch (e) {
                console.log(e)
            }
        },
        getCurrentAccount: function (cb) {
            //获取账户地址
            var _this = this;
            try {
                _this.DappBaseObj.getCurrentAccount(cb);
            } catch (e) {
                console.log(e)
            }
        },
        getNetworkType: function (cb) {
            //获取账户地址
            var _this = this;
            try {
                return _this.DappBaseObj.getNetworkType(cb);
            } catch (e) {
                console.log(e)
            }
        },
        _getContractObj: function (contractAddress, contractABI, fromAddress, cb) {
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

                return _this.DappBaseObj._getContractObj(_contractAddress, contractAbi, function (myContract) {
                    var rContractObj = myContract
                    typeof cb === "function" && cb(rContractObj)
                });
            } catch (e) {
                console.log(e)
            }
        },
        getContractObj: function (cb, contractAddress, contractABI, fromAddress) {
            //初始化 设置 合约对象
            var _this = this;
            try {
                //来源地址
                if (fromAddress) {
                     _this._getContractObj(contractAddress, contractABI, fromAddress, function (myContract) {
                         var rContractObj = myContract
                         typeof cb === "function" && cb(rContractObj)
                    })        
                } else {
                    _this.DappBaseObj.getCurrentAccount(function (_fromAddress) {
                        _this._getContractObj(contractAddress, contractABI, _fromAddress, function (myContract) {
                            var rContractObj = myContract
                            typeof cb === "function" && cb(rContractObj)
                        })      
                    })
                }
            } catch (e) {
                console.log(e)
            }
        },
        getAddressFromHex: function (address) {
            var _this = this;
            try {
                if (address == '0') {
                    if (_this.DappBaseObj.getWeb3Obj && typeof _this.DappBaseObj.getWeb3Obj === "function" ) {
                        return "0x0000000000000000000000000000000000000000" //ETH
                    }
                    if (_this.DappBaseObj.getTronWebObj && typeof _this.DappBaseObj.getTronWebObj === "function") {
                        return _this.DappBaseObj.getTronWebObj().address.fromHex("410000000000000000000000000000000000000000") //tron
                    }
                }

                if (_this.DappBaseObj.getWeb3Obj && typeof _this.DappBaseObj.getWeb3Obj === "function") {
                    return address //ETH
                }
                if (_this.DappBaseObj.getTronWebObj && typeof _this.DappBaseObj.getTronWebObj === "function") {
                    return _this.DappBaseObj.getTronWebObj().address.fromHex(address) //tron
                }
            } catch (e) {
                console.log(e)
            }
        },
        Token_getAllowance: function (cb, oaddr, spender, taddr, tABI, decimals) {
            //获取代币授权操作信息
            var _this = this;
            try {
                if (oaddr) {
                    _this.getContractObj(function (_ContractObj) {
                        _ContractObj.methods
                            .allowance(oaddr, spender)
                            .call(_this.DappBaseObj.options._callParam)
                            .then(function (rdata) {
                                //回调处理
                                typeof cb === "function" && cb(true, rdata.toString().div(Math.pow(10, decimals)))
                            })
                    }, taddr, tABI);
                } else {
                    _this.getCurrentAccount(function (_oaddr) {
                        _this.getContractObj(function (_ContractObj) {
                            _ContractObj.methods
                                .allowance(_oaddr, spender)
                                .call(_this.DappBaseObj.options._callParam)
                                .then(function (rdata) {
                                    //回调处理
                                    typeof cb === "function" && cb(true, rdata.toString().div(Math.pow(10, decimals)))
                                })
                        }, taddr, tABI);
                    })
                }
            } catch (e) {
                console.log(e)
                typeof cb === "function" && cb(false, e.message || e)
            }
        },
        Token_approve: function (cb, receiptCB, amount, spender, taddr, tABI, decimals, isfastmode) {
            //代币授权操作
            var _this = this;
            try {
                if (Number(amount)>=0) {
                    amount = amount.mul(Math.pow(10, decimals))
                } else if (Number(amount) == -1) {
                    //全授权
                    amount = new BigNumber("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff").sub(1).toString(10);
                }
                
                _this.getContractObj(function (_ContractObj) {
                    _ContractObj.methods
                        .approve(spender, amount)
                        .send(_this.DappBaseObj.options._sendParam)
                        .then(function (rdata) {
                            console.log(rdata)
                            //回调处理
                            typeof cb === "function" && cb(true, rdata)

                            if (isfastmode) {
                                setTimeout(function () {
                                    //完成回调
                                    typeof receiptCB === "function" && receiptCB("fast mode")
                                }, 500)
                                return;
                            }
                            //监听到账
                            _this.DappBaseObj.checkTransactionReceipt(rdata, function (receipt) {
                                console.log(receipt);
                                //完成回调
                                typeof receiptCB === "function" && receiptCB(receipt)
                            })
                        }, function (err) {
                            console.log(err)
                            typeof cb === "function" && cb(false, err)
                        });
                }, taddr, tABI);
            } catch (e) {
                console.log(e)
                typeof cb === "function" && cb(false, e.message || e)
            }
        },
        Token_checkApprove: function (amount, taddr, tABI, decimals, isERC777, cb, isfastmode) {
            function checktaskObj () {
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
            var _this = this;
            //检查代币授权
            tABI = tABI || _this.DappBaseObj.options._ERC20ABIinterface
            amount = amount.mul(Math.pow(10, decimals)).toFloor(0).div(Math.pow(10, decimals))
            _this.DappBaseObj.getTokenBalance(function (_balance) {
                if (Number(_balance) >= Number(amount)) {
                    _this.Token_getAllowance(function (resulr, rdata) {
                        if (resulr) {
                            if (Number(rdata) >= Number(amount)) {
                                //回调处理
                                typeof cb === "function" && cb(true)
                            } else {
                                var checktask = new checktaskObj();
                                function addchecktask() {
                                    checktask.crrc++;
                                    checktask.check(function (checkresult) {
                                        if (checkresult) {
                                            typeof cb === "function" && cb(true);
                                        }
                                    })
                                }

                                //重新授权
                                if (Number(rdata) > 0 && !isERC777) {
                                    checktask.coutnc = 2;
                                    _receiptApprove1(amount)
                                }
                                else {
                                    //全授权
                                    amount = -1
                                    _receiptApprove2(amount)
                                }
                            }

                            function _receiptApprove1(amount, r1CB) {
                                _this.Token_approve(function (resulr, rdata) {
                                    if (!resulr) {
                                        typeof cb === "function" && cb(false, 1001, rdata);
                                        console.log("r1 approve ERR：" + taddr);
                                        checktask.cancel = true;
                                    }
                                }, function () {
                                    console.log("receipt1 approve：" + taddr)
                                    checktask.crrc++;
                                    _receiptApprove2(amount)
                                }, "0", _this.getContractAddress(), taddr, tABI, decimals, isfastmode);
                            }

                            function _receiptApprove2(amount) {
                                _this.Token_approve(function (resulr, rdata) {
                                    if (!resulr) {
                                        typeof cb === "function" && cb(false, 1001, rdata);
                                        console.log("r2 approve ERR：" + taddr);
                                        checktask.cancel = true;
                                    }
                                }, function () {
                                    console.log("receipt2 approve：" + taddr);
                                    addchecktask()
                                }, amount, _this.getContractAddress(), taddr, tABI, decimals, isfastmode);
                            }
            
                        } else {
                            console.log("check approve ERR：" + taddr);
                            typeof cb === "function" && cb(false, 1000, "获取授权金额失败");
                        }
                    }, null, _this.getContractAddress(), taddr, tABI, decimals);
                } else {
                    typeof cb === "function" && cb(false, 1002, "余额不足");
                }
            }, null, taddr, tABI, decimals);
        },

        Token_getAllowance_ERC1155: function (cb, oaddr, spender, taddr, tABI, decimals) {
            //获取代币授权操作信息
            var _this = this;
            try {
                if (oaddr) {
                    _this.getContractObj(function (_ContractObj) {
                        _ContractObj.methods
                            .isApprovedForAll(oaddr, spender)
                            .call(_this.DappBaseObj.options._callParam)
                            .then(function (rdata) {
                                //回调处理
                                typeof cb === "function" && cb(true, rdata)
                            })
                    }, taddr, tABI);
                } else {
                    _this.getCurrentAccount(function (_oaddr) {
                        _this.getContractObj(function (_ContractObj) {
                            _ContractObj.methods
                                .isApprovedForAll(_oaddr, spender)
                                .call(_this.DappBaseObj.options._callParam)
                                .then(function (rdata) {
                                    //回调处理
                                    typeof cb === "function" && cb(true, rdata)
                                })
                        }, taddr, tABI);
                    })
                }
            } catch (e) {
                console.log(e)
                typeof cb === "function" && cb(false, e.message || e)
            }
        },
        Token_approve_ERC1155: function (cb, receiptCB, amount, spender, taddr, tABI, decimals, isfastmode) {
            //代币授权操作
            var _this = this;
            try {
                _this.getContractObj(function (_ContractObj) {
                    _ContractObj.methods
                        .setApprovalForAll(spender, !!amount)
                        .send(_this.DappBaseObj.options._sendParam)
                        .then(function (rdata) {
                            console.log(rdata)
                            //回调处理
                            typeof cb === "function" && cb(true, rdata)

                            if (isfastmode) {
                                setTimeout(function () {
                                    //完成回调
                                    typeof receiptCB === "function" && receiptCB("fast mode")
                                }, 500)
                                return;
                            }
                            //监听到账
                            _this.DappBaseObj.checkTransactionReceipt(rdata, function (receipt) {
                                console.log(receipt);
                                //完成回调
                                typeof receiptCB === "function" && receiptCB(receipt)
                            })
                        }, function (err) {
                            console.log(err)
                            typeof cb === "function" && cb(false, err)
                        });
                }, taddr, tABI);
            } catch (e) {
                console.log(e)
                typeof cb === "function" && cb(false, e.message || e)
            }
        },
        Token_checkApprove_ERC1155: function (amount, taddr, tABI, decimals, cb, isfastmode) {

            var _this = this;
            //检查代币授权
            tABI = tABI || _this.DappBaseObj.options._ERC20ABIinterface
            amount = !!amount

            _this.Token_getAllowance_ERC1155(function (resulr, rdata) {
                if (resulr) {
                    if (rdata) {
                        //回调处理
                        typeof cb === "function" && cb(true)
                        return;
                    }

                    _this.Token_approve_ERC1155(function (resulr, rdata) {
                        if (!resulr) {
                            typeof cb === "function" && cb(false, 1001, rdata);
                            console.log("approve ERR：" + taddr);
                        }
                    }, function () {
                        console.log("receipt approve：" + taddr)
                        typeof cb === "function" && cb(true);
                    }, amount, _this.getContractAddress(), taddr, tABI, decimals, isfastmode);
                } else {
                    console.log("check approve ERR：" + taddr);
                    typeof cb === "function" && cb(false, 1000, "获取授权金额失败");
                }
            }, null, _this.getContractAddress(), taddr, tABI, decimals);
        },

        randomString: function(len) {
            //随机生成字符串
            len = len || 32;
            var $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnoprstuvwxyz123456789';
            //var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
            var maxPos = $chars.length;
            var pwd = '';
            for (i = 0; i < len; i++) {
                pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
            }
            return pwd;
        },
        getUrlParam: function (name) {
            //获取rul参数
            var reg = new RegExp('(^|&)' + name + '=(.*)(&[^&=]+=)');
            var regLast = new RegExp('(^|&)' + name + '=(.*)($)');
            var rtest = window.location.href.replace(/\/\#/, '');
            rtest = rtest && rtest.match(/\?.+/) && rtest.match(/\?.+/)[0];
            rtest = rtest && (rtest.substr(1).match(reg) || rtest.substr(1).match(regLast));
            if (rtest) {
                var l = rtest[2].match(/&[^&=]+=/)
                if (l) {
                    return decodeURIComponent(rtest[2].split(l[0])[0]);
                } else return decodeURIComponent(rtest[2]);
            }
            return null;
        },
        _recordDataListObj: {},
        RecordDataList: function (key, HandleListcomplete, HandleCB, HandleCB2) {
            var _this = this;
            //记录列表显示数据通用封装
            _this._recordDataListObj[key] = [];
            var recordDataList = _this._recordDataListObj[key] || [];
            typeof HandleCB2 === "function" && HandleCB2(function (number, page, count) {
                count = count || 0;
                if (count > 0 && count < number) {
                    number = count;
                }

                for (var i = 0; i < number; i++) {
                    recordDataList.push(Object.assign({}, {}));
                    recordDataList[i].Index = i;
                }
                var size = number
                typeof HandleList === "function" && HandleList(page || 1, size, count || 0, HandleListcomplete);
            }, key);

            function HandleList(page, size, count, cb) {
                var start = size * (page - 1);
                var end = size * page - 1;
                if (count == 0) {
                    if (end > recordDataList.length - 1) {
                        end = recordDataList.length - 1;
                    }
                } else {
                    end = count - 1;
                    if (count >= size) {
                        start = count - size;
                    } else {
                        start = 0;
                    }
                }

                var asynchronous = end - start + 1;
                var complete = 0;
                var index = 0;
                for (var i = start; i <= end; i++) {
                    //console.log(i)
                    HandleCB && HandleCB(index, function (_recordsData, index) {
                        //console.log(_recordsData)
                        recordDataList[index] = _recordsData;
                        complete++;
                        if (complete >= asynchronous) {
                            typeof cb === "function" && cb(recordDataList, key);
                        }
                    }, i, key);
                    index++;
                }
            }
        },
    }

    return DappContractObj;
}