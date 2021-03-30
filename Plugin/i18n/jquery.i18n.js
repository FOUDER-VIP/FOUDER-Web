(function ($) {
    var i18n_options = {
        list: "list",//filePath+filePrefix+list+fileSuffix+.json
        defaultLang: "",//defaultLang
        lang: "",//filePath+filePrefix+lang+fileSuffix+.json
        filePath: "../js/i18n/json/",//filePath+filePrefix+lang+fileSuffix+.json
        filePrefix: "i18n_",//filePath+filePrefix+lang+fileSuffix+.json
        fileSuffix: "",//filePath+filePrefix+lang+fileSuffix+.json
        forever: false,//是否存清理默认语言
        callback: function (arr) { },//inin return lang list
    };
    var i18nLang = {};
    String.prototype.toTranslate_i18n = function () {
        var str = $.i18n_translation(this) || this;
        return str.toString()
    };
    String.prototype.HtmlToTranslate_i18n = function () {
        var str = this.toString();
        str = $(str).ToTranslate_i18n();
        return str.toString()
    };
    function getCookie(name) {
        var arr = document.cookie.split('; ');
        for (var i = 0; i < arr.length; i++) {
            var arr1 = arr[i].split('=');
            if (arr1[0] == name) {
                return arr1[1];
            }
        }
        return '';
    };

    function setCookie(name, value, myDay) {
        var oDate = new Date();
        oDate.setDate(oDate.getDate() + myDay);
        document.cookie = name + '=' + value + '; expires=' + oDate;
    };
    $.extend({
        i18n: function (_options, callback) {
            var defaults = {
                list: "list",//filePath+filePrefix+list+fileSuffix+.json
                defaultLang: "",//defaultLang
                lang: "",//filePath+filePrefix+lang+fileSuffix+.json
                filePath: "../js/i18n/json/",//filePath+filePrefix+lang+fileSuffix+.json
                filePrefix: "i18n_",//filePath+filePrefix+lang+fileSuffix+.json
                fileSuffix: "",//filePath+filePrefix+lang+fileSuffix+.json
                forever: false,//是否存清理默认语言
                callback: function (arr) { },//inin return lang list
            };

            i18n_options = $.extend({}, defaults, i18n_options, _options);//将一个空对象做为第一个参数

            if (i18n_options.forever) {
                setCookie("i18n_lang",'');
                i18n_options.forever = false
            }

            if (getCookie('i18n_lang')) {
                i18n_options.defaultLang = getCookie('i18n_lang');
            }

            if (i18n_options.lang == "" && i18n_options.defaultLang == "") {
                throw "defaultLang must not be null !";
            };

            i18n_options.lang = i18n_options.lang || i18n_options.defaultLang;

            $.getJSON(i18n_options.filePath + i18n_options.filePrefix + i18n_options.list + i18n_options.fileSuffix + ".json", function (data) {
                if (data) {
                    typeof i18n_options.callback === "function" && i18n_options.callback(data);
                }
            });
            $.getJSON(i18n_options.filePath + i18n_options.filePrefix + i18n_options.lang + i18n_options.fileSuffix + ".json", function (data) {
                if (data != null) {
                    i18nLang = data;
                    i18n_options.init = true;
                    typeof callback === "function" && callback(i18n_options.lang)
                }
            });
        },
        i18n_translation: function (translationStr) {
            return i18nLang[translationStr]
        },
        i18n_getCurrentLanguage: function (translationStr) {
            if (getCookie('i18n_lang')) {
                i18n_options.defaultLang = getCookie('i18n_lang');
            }
            return i18n_options.lang || i18n_options.defaultLang
        },
        i18n_setLanguage: function (lang, callback) {
            if (!lang) {
                return
            }
            setCookie('i18n_lang', lang);

            i18n_options.defaultLang = lang

            i18n_options.lang = lang;

            $.getJSON(i18n_options.filePath + i18n_options.filePrefix + i18n_options.lang + i18n_options.fileSuffix + ".json", function (data) {
                if (data != null) {
                    i18nLang = data;
                    typeof callback === "function" && callback()
                }
            });
        },
        i18n_clearLanguageSet: function () {
            setCookie("i18n_lang", '');
        },
        i18n_load: function (callback) {
            if (!i18n_options.init) {
                setTimeout(function () {
                    if (getCookie('i18n_lang')) {
                        i18n_options.defaultLang = getCookie('i18n_lang');
                    }

                    if (i18n_options.lang == "" && i18n_options.defaultLang == "") {
                        throw "defaultLang must not be null !";
                    };

                    i18n_options.lang = i18n_options.lang || i18n_options.defaultLang;

                    $.getJSON(i18n_options.filePath + i18n_options.filePrefix + i18n_options.lang + i18n_options.fileSuffix + ".json", function (data) {
                        if (data != null) {
                            i18nLang = data;
                            i18n_options.init = true;
                            typeof callback === "function" && callback()
                        }
                    });
                }, 500)               
            } else {
                typeof callback === "function" && callback()
            }
        },
    });
    $.fn.extend({
        i18n: function (callback) {
            $(this).each(function (i) {
                var this_item = this;
                if ($(this_item).attr("i18n-html")) {
                    var str = $(this_item).attr("i18n-html")
                    typeof callback === "function" && callback(str, i18nLang, function (str) {
                        return i18nLang[str]
                    }, function (str) {
                        $(this_item).html(str)
                    })
                }
                if ($(this_item).attr("i18n-value")) {
                    var str = $(this_item).attr("i18n-value")
                    typeof callback === "function" && callback(str, i18nLang, function (str) {
                        return i18nLang[str]
                    }, function (str) {
                        $(this_item).val(str)
                    })
                }
                if ($(this_item).attr("i18n-placeholder")) {
                    var str = $(this_item).attr("i18n-placeholder")
                    typeof callback === "function" && callback(str, i18nLang, function (str) {
                        return i18nLang[str]
                    }, function (str) {
                        $(this_item).attr('placeholder', str)
                    })
                }
            });

        },
        ToTranslate_i18n : function () {
            //var $html = $({ html: this });
            var newFrag = document.createDocumentFragment();
            var oDiv = document.createElement('div');
            newFrag.appendChild(oDiv);
            $(this).each(function (i) {
                var this_item = this;
                oDiv.appendChild(this_item);
            })
            $(newFrag).find('[i18n]').i18n(function (strtemplet, i18nLang, formtCB, setCB) {
                setCB(formtCB(strtemplet));
            });
            return $(oDiv).html()
        },
    });
})(jQuery);
