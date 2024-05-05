var ajaxpath='/';
var ajaxtype='POST';
var ajaxct='application/x-www-form-urlencoded; charset=utf-8';
var ajaxJson = 'application/application/json; charset=utf-8';
var ajaxdt='json';
var contentRoot='/templets/pu/';
var soundRoot='/sound/';
var uinfo = {isadmin: false, islogin: false, level: 0};
var inIPAD=false;
var isToneChanged = false;
var dataLayer = [];
var isRedirecting = false

function clearTone(songID) {
    showAlert(true, 1, "您確定要重置調性嗎？", function () {
        $.ajax({
            type: ajaxtype,
            url: ajaxpath + 'ajaxapi/deleteUsersongdisplay.php',
            contentType: ajaxct,
            data: {id: songID},
            dataType: ajaxdt,
            success: function (data) {
                if (data.done == "ok") {
                    alert("刪除成功")
                    location.reload(true);
                } else {
                    console.log(data);
                    location.reload(true);
                }
            },
            error: function () {
                console.log('獲取用戶資料錯誤！');
            }
        });
    }, null, function () {
        $("#save-label").prop("checked", true);
    });
}

function saveTone() {
    Ẵ(true, 1, "是否保存現在的調性？", ᶉ, null, function() {
        console.log("cancel");

        // if cancel, keep checked, because user don't want to change saved tone.
        if (isToneChanged) {
            $("#save-label").prop("checked", true);
        } else {
            $("#save-label").prop("checked", false);
        }
    });
}

function saveCheckBoxClicked(songID) {
    var isChecked = $("#save-label").prop("checked");
    // if false, means the status from checked to uncheck
    // clear the save data

    isToneChanged = isKeyCapoChanged();

    if (isToneChanged || isChecked) {
        saveTone();
    } else {
        clearTone(songID);
    }

    // if (!isChecked && !isToneChanged) {
    // 	clearTone(songID);
    // } else {
    // 	saveTone();
    // }

}

function notShowTodayClicked() {
    var isChecked = $("#not-show-label").prop("checked");

    setStorage("not-show-today", isChecked);
}

/*  removeStorage: removes a key from localStorage and its sibling expiracy key
   params:
       key <string>     : localStorage key to remove
   returns:
       <boolean> : telling if operation succeeded
*/
function removeStorage(name) {
    try {
        localStorage.removeItem(name);
        localStorage.removeItem(name + '_expiresIn');
    } catch(e) {
        console.log('removeStorage: Error removing key ['+ key + '] from localStorage: ' + JSON.stringify(e) );
        return false;
    }
    return true;
}
/*  getStorage: retrieves a key from localStorage previously set with setStorage().
    params:
        key <string> : localStorage key
    returns:
        <string> : value of localStorage key
        null : in case of expired key or failure
 */
function getStorage(key) {

    var now = Date.now();  //epoch time, lets deal only with integer
    // set expiration for storage
    var expiresIn = localStorage.getItem(key+'_expiresIn');
    if (expiresIn===undefined || expiresIn===null) { expiresIn = 0; }

    if (expiresIn < now) {// Expired
        removeStorage(key);
        return null;
    } else {
        try {
            var value = localStorage.getItem(key);
            return value;
        } catch(e) {
            console.log('getStorage: Error reading key ['+ key + '] from localStorage: ' + JSON.stringify(e) );
            return null;
        }
    }
}
/*  setStorage: writes a key into localStorage setting a expire time
    params:
        key <string>     : localStorage key
        value <string>   : localStorage value
        expires <number> : number of seconds from now to expire the key
    returns:
        <boolean> : telling if operation succeeded
 */

function setStorage(key, value, expires) {

    if (expires===undefined || expires===null) {
        expires = (24*60*60);  // default: seconds for 1 day
    } else {
        expires = Math.abs(expires); //make sure it's positive
    }

    var now = Date.now();  //millisecs since epoch time, lets deal only with integer
    var schedule = now + expires*1000;
    try {
        localStorage.setItem(key, value);
        localStorage.setItem(key + '_expiresIn', schedule);
    } catch(e) {
        console.log('setStorage: Error setting key ['+ key + '] in localStorage: ' + JSON.stringify(e) );
        return false;
    }
    return true;
}

function randRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function gotoPage(url) {
    window.location.href = url;
}

function getPageVar() {
    var lh = window.location.href;
    var varstr = lh.substr(lh.lastIndexOf("?") + 1).split("&");
    var verobj = new Object();
    for (var i = 0; i < varstr.length; i++) {
        var _t = varstr[i].split("=");
        verobj[_t[0]] = _t[1];
    }
    return verobj;
}
var pageVars = getPageVar();

function errorImage(obj) {
    obj.src = contentRoot + "images/noface.gif";
}

function sLs(key, value) {
    if (value === undefined) {
        return localStorage.getItem(key);
    }
    if (value === null) {
        localStorage.removeItem(key);
        return true;
    }
    localStorage.setItem(key, value);
    return true;
}
var cookieCFG = {
    expires: 7
};

function refwm() {
    return;
}

function sSs(key, value) {
    if (value === undefined) {
        return sessionStorage.getItem(key);
    }
    if (value === null) {
        sessionStorage.removeItem(key);
        return true;
    }
    sessionStorage.setItem(key, value);
    return true;
}

function getDayTime(oldt) {
    var nowDate;
    if (oldt) {
        nowDate = new Date(oldt);
    } else {
        nowDate = new Date();
    }
    return (new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate())).getTime();
}




function showAlert(b, type, txt, func, param, errorFunc) {

    if (b) {
        $('.alertwin p').html(txt);
        if (type == 0) {
            $('.alertwin bdo').removeClass();
        } else if (type == 1) {
            $('.alertwin bdo').addClass('s').text('確定').unbind().data('param', param).click(func);
        }
        $('.alertwin button').show().text(type ? '取消' : '好的').unbind().click(function (e) {
            showAlert(false);
            errorFunc();
        });
        $('.alertwin').fadeIn('fast');
    } else {
        $('.alertwin').fadeOut('fast', function () {
            $('.alertwin bdo').removeClass();
        });
    }
}

function showTipAlert(t) {
    showAlert(true, 0, t);
}

function showLoginAlert() {
    showAlert(true, 1, "您未登入，馬上去登入！", function () {
        gotoPage("/member/login.php");
    });
}

function showUplevelAlert(t) {
    showAlert(true, 1, t, function () {
        gotoPage("/value/membership_step1.php");
    });
}

var __vippageCountTimer;
var __vippageCount;
var popUpVipPageCountTimer;


function showVipPageAlert(vipLevel){

    // show check box to disable ad
    if (vipLevel < 2) {
        $('#disalbe-ad-label').fadeIn().css('display','none');
    } else {
        $('#disalbe-ad-label').fadeIn().css('display','block');
    }

    if (vipLevel >= 2 && getStorage("not-show-today")) {
        $('#viptoneWindow').fadeIn().css('display','none');

        $(".google-auto-placed").each(function(){
            $(this).css('display','none');
        });

        $("#google_pedestal_container").hide();
        $("#google_pedestal_container").css('display','none');


    } else {

        __vippageCount = 3;
        $('#viptoneWindow code').show().text(__vippageCount);
        $('#viptoneWindow').fadeIn().css('display','flex');

        $('#viptoneWindow .close2').hide().unbind().click(function(){
            $('#viptoneWindow').fadeOut();
        });
        __vippageCountTimer = setInterval(countVipPage,1000);

        // Popup vip window every 2 minutes, tempory disable this function.
        // popUpVipPageCountTimer = setInterval(countVipForBackgroundToForground,2 * 60 * 1000);

    }

    if (vipLevel >= 2) {
        $('.adsbygoogle').hide();

        $('.a-post-show').each(function( index ) {
            var position = $(this).attr('data-position-code');
            if (position != 'middle') {
                $(this).hide();
            }
        });


        $('div[id^="adGeek"]').each(function( index ) {
            $(this).hide();
        });
    }

}

function countVipPage(){
    __vippageCount--;
    $('#viptoneWindow code').text(__vippageCount);
    if(__vippageCount<=0){
        $('#viptoneWindow code').hide();
        $('#viptoneWindow .close2').show().unbind().click(function(){
            $('#viptoneWindow').fadeOut();
        });
        clearInterval(__vippageCountTimer);
    }
}

function countVipForBackgroundToForground() {
    __vippageCount = 3;
    $('#viptoneWindow code').show().text(__vippageCount);
    $('#viptoneWindow').visible();
    $('#viptoneWindow').css('display','flex');

    $('#viptoneWindow .close2').hide().unbind().click(function(){
        $('#viptoneWindow').fadeOut();
    });
    __vippageCountTimer = setInterval(countVipPage,1000);
}

function showUnLoginAlert(){
    $('#unloginWindow .close2').show().unbind().click(function(){
        document.getElementById('unloginWindow').style.visibility='hidden'
    });
    $('#unloginWindow').fadeIn().css('display','flex');

    // showGuide();
}

function closeGuide() {
    var guideView = document.getElementsByClassName("slideshow-container");
    guideView[0].style.visibility = "hidden";
}

function showGuide() {
    var guideView = document.getElementsByClassName("slideshow-container");
    guideView[0].style.visibility = "visible";
}

//
function checkLogin(func) {
    if (!func) {
        try {
            func = initPage;
        } catch (e) {}
    }
    $.ajax({
        type: ajaxtype,
        url: ajaxpath + 'ajaxapi/getuserinfo.php',
        contentType: ajaxct,
        dataType: ajaxdt,
        success: function (data) {
            if (data.done == "ok") {
                if (data.islogin) {
                    /*
                    data.vip_expired_d = "2018-12-12";
                    data.level = 3;
                    data.monthly_vip = 1;
                    data.cfg.sts = 1;
                    */

                    saveAccountLevel(data.level);
                    uinfo = data;
                    try {
                        func(true, data);
                    } catch (e) {}
                    initShowHead(true, data);
                } else {
                    try {
                        func(false);
                    } catch (e) {}
                    initShowHead(false);
                }
            } else {
                try {
                    func(false, data.done);
                } catch (e) {}
                initShowHead(false);
            }
        },
        error: function () {
            console.log('獲取用戶資料錯誤！');
        }
    });
}

function initShowHead(isLogin, data) {
    if (isLogin) {
        var _ub;
        if (uinfo.level === 1) {
            _ub = $('<div>').append(
                $("<strong>").text("普通會員").click(
                    function(){
                        gotoPage("/member/myvip.php");
                    }
                )
            ).append(
                "馬上<span class='b' onclick=\"buyPay('vipNew')\">升級</span>為VIP會員！"
            );
        } else if (uinfo.level === 2) {
            _ub = $('<div>').append(
                uinfo.monthly_vip ?
                    $("<strong>").addClass('g').text("白金包月會員").click(
                        function(){
                            gotoPage("/member/myvip.php");
                        }
                    )
                    :
                    $("<strong>").text("白金會員").click(
                        function(){
                            gotoPage("/member/myvip.php");
                        }
                    )
            ).append(
                uinfo.monthly_vip ?
                    $('<abbr>').text(uinfo.vip_expired_d + ' 到期')
                    :
                    $('<abbr>').text(uinfo.vip_expired_d + ' 自動到期')
            ).append(
                uinfo.monthly_vip ?
                    $('<span>').addClass('b').text('取消包月').click(function () {
                        showAlert(true, 1, "您確定要取消包月嗎？", function () {
                            showCpWaitting('月繳訂單取消中，請稍候 3 ～ 10分鐘', 1);
                            window.open('/order/order_period_cancel.php');
                        });
                    }) :
                    $('<span>').addClass('b').text('續費').click(function () {
                        buyPay("vip2");
                    })
            ).append(
                uinfo.monthly_vip ?
                    ''
                    :
                    $('<span>').addClass('b').text('升級鑽石').click(function () {
                        buyPay("vip3");
                    })
            );
        } else if (uinfo.level === 3) {
            _ub = $('<div>').append(
                uinfo.monthly_vip ?
                    $("<strong>").addClass('g').text("鑽石包月會員").click(
                        function(){
                            gotoPage("/member/myvip.php");
                        }
                    )
                    :
                    $("<strong>").text("鑽石會員").click(
                        function(){
                            gotoPage("/member/myvip.php");
                        }
                    )
            ).append(
                uinfo.monthly_vip ?
                    $('<abbr>').text(uinfo.vip_expired_d + ' 到期')
                    :
                    $('<abbr>').text(uinfo.vip_expired_d + ' 自動到期')
            ).append(
                uinfo.monthly_vip ?
                    $('<span>').addClass('b').text('取消包月').click(function () {
                        showAlert(true, 1, "您確定要取消包月嗎？", function () {
                            showCpWaitting('月繳訂單取消中，請稍候 3 ～ 10分鐘', 1);
                            window.open('/order/order_period_cancel.php');
                        });
                    }) :
                    $('<span>').addClass('b').text('續費').click(function () {
                        buyPay("vip3");
                    })
            );
        } else if (uinfo.level === 4) {
            _ub = $('<div>').append(
                uinfo.monthly_vip ?
                    $("<strong>").addClass('g').text("學生包月會員").click(
                        function(){
                            gotoPage("/member/myvip.php");
                        }
                    )
                    :
                    $("<strong>").text("學生會員").click(
                        function(){
                            gotoPage("/member/myvip.php");
                        }
                    )
            ).append(
                uinfo.monthly_vip ?
                    $('<abbr>').text(uinfo.vip_expired_d + ' 到期')
                    :
                    $('<abbr>').text(uinfo.vip_expired_d + ' 自動到期')
            ).append(
                uinfo.monthly_vip ?
                    $('<span>').addClass('b').text('取消包月').click(function () {
                        showAlert(true, 1, "您確定要取消包月嗎？", function () {
                            showCpWaitting('月繳訂單取消中，請稍候 3 ～ 10分鐘', 1);
                            window.open('/order/order_period_cancel.php');
                        });
                    }) :
                    $('<span>').addClass('b').text('續費').click(function () {
                        buyPay("vip3");
                    })
            );
        } else if (uinfo.level === 5) {
            _ub = $('<div>').append(
                uinfo.monthly_vip ?
                    $("<strong>").addClass('g').text("VIP+會員").click(
                        function(){
                            gotoPage("/member/myvip.php");
                        }
                    )
                    :
                    $("<strong>").text("VIP+會員").click(
                        function(){
                            gotoPage("/member/myvip.php");
                        }
                    )
            ).append(
                uinfo.monthly_vip ?
                    $('<abbr>').text(uinfo.vip_expired_d + ' 到期')
                    :
                    $('<abbr>').text(uinfo.vip_expired_d + ' 自動到期')
            ).append(
                uinfo.monthly_vip ?
                    $('<span>').addClass('b').text('取消包月').click(function () {
                        showAlert(true, 1, "您確定要取消包月嗎？", function () {
                            showCpWaitting('月繳訂單取消中，請稍候 3 ～ 10分鐘', 1);
                            window.open('/order/order_period_cancel.php');
                        });
                    }) :
                    $('<span>').addClass('b').text('續費').click(function () {
                        buyPay("vip3");
                    })
            );
        }
        //
        $('.ushow').empty().append(
            $('<ins>').addClass('lv' + uinfo.level).text(uinfo.nickname)
        ).append(
            $('<div>').addClass('fix')
        ).append(
            $('<div>').addClass('showbox').append(
                $('<div>').addClass('ub').append(
                    $('<div>').addClass('face').append(
                        $('<img>').attr('src', uinfo.face)
                    ).click(function () {
                        gotoPage('/member/edit_baseinfo.php');
                    })
                ).append(
                    $('<div>').addClass('ii').append(
                        $('<div>').append(
                            $("<dfn>").text(uinfo.nickname).click(function () {
                                gotoPage('/member/edit_baseinfo.php')
                            })
                        ).append(
                            $('<a>').addClass('b').attr('href', "/member/index_do.php?fmdo=login&dopost=exit").text('登出')
                        )
                    ).append(
                        _ub
                    )
                ).append(
                    $('<div>').addClass('clear')
                ).append(
                    $('<div>').addClass('hm').html("我的海馬幣：<a href='/member/hmpoint.php'><code>" + uinfo.point + "</code></a>幣，馬上去<span onclick=\"buyPay('hm')\" class='b'>購買</span>")
                ).append(
                    $('<div>').addClass('hm').html("序號兌換：<span onclick=\" showExchangeWindow(true)\" class='b'>兌換</span>")
                )
            ).append(
                $('<div>').addClass('umenu').append(
                    $('<a>').attr('href', '/member/mypu.php').text('我的求譜')
                ).append(
                    $('<a>').attr('href', '/member/fav.php').text('我的收藏')
                ).append(
                    $('<a>').attr('href', '/member/myorder.php').text('我的交易')
                ).append(
                    $('<a>').attr('href', '/special/vip.shtml').text('VIP專區')
                )
            ).append(
                $('<div>').addClass('umore').append(
                    $('<a>').attr('href', '/member/edit_baseinfo.php').text('更多 >>')
                )
            ).append(
                $('<div>').addClass('hdonate').append($('<icon>')).append(
                    $('<a>').attr('href', '/special/pay.shtml?t=d').text('我要捐款')
                ).hide()
            )
        );
        //
        if(!uinfo.monthly_vip&&!uinfo.reg_gift){
            var gwin=$('#giftWindow');
            if(gwin.length>0){
                gwin.find('.close').click(function(){
                    $('#giftWindow').fadeOut();
                });
                gwin.find('button').click(function(){
                    if(uinfo.vertify_email){
                        $.ajax({
                            type: ajaxtype,
                            url: ajaxpath + 'ajaxapi/reggift.php',
                            data:{gift:1},
                            contentType: ajaxct,
                            dataType: ajaxdt,
                            success: function (data) {
                                if (data.done == "ok") {
                                    showTipAlert('領取禮包成功！');
                                    uinfo.reg_gift=1;
                                } else {
                                    showTipAlert(data.done);
                                }
                                $('#giftWindow').fadeOut();
                            },
                            error: function () {
                                $('#giftWindow').fadeOut();
                                showTipAlert('領取禮包失敗！');
                            }
                        });
                    }else{
                        showAlert(true, 1, "您的Email未通過驗証，請先驗証 Email！", function () {
                            window.open('/member/vemail.php');
                        });
                    }
                })
                gwin.fadeIn().css('display','flex');
            }
        }
    } else {
        $('.ushow').empty().append(
            $('<a>').addClass('lf').attr('href', "/member/login.php").text('登入')
        ).append(
            $('<a>').addClass('lf').attr('href', "/member/reg_new.php").text('註冊')
        );
    }
}

function buyPay(t) {
    sSs('pay_type', t);
    gotoPage('/special/pay.shtml');
}

function showReport(b){
    if(b){
        $('#reportWindow').fadeIn().css('display','flex');
    }else{
        $('#reportWindow').fadeOut();
    }
}

function showExchangeWindow(b){
    if(b){
        $('#exchangeWindow').fadeIn().css('display','flex');
    }else{
        $('#exchangeWindow').fadeOut();
    }
}

$(function(){
    if (isRedirecting) {
        return;
    }

    $('.a-post-show').each(function(ix,va){
        var _pd=$(va);
        $.ajax({
            type: ajaxtype,
            url: ajaxpath + 'ajaxapi/getpicbycode.php',
            data: {zone_code: _pd.data('zone-code'), position_code: _pd.data('position-code')},
            contentType: ajaxct,
            dataType: ajaxdt,
            success: function (data) {
                if (data.done == "ok") {

                    var randomValue = Math.floor(Math.random() * data.list.length);
                    var displayElement = data.list[randomValue];

                    if (displayElement.type == "video") {
                        _pd.append(
                            $('<iframe>').attr('src', displayElement.weburl + '?autoplay=1&mute=1').attr('target', '_blank')
                                .attr('frameborder', 0).attr('width', 560).attr('height', 315).attr('allow', 'autoplay')
                        )

                    } else if (displayElement.urlimg) {
                        _pd.append(
                            $('<a>').attr('href', displayElement.weburl).attr('target', '_blank').append(
                                $('<img>').attr('src', displayElement.urlimg)
                            )
                                .data('k1', displayElement.zone_code + '-' + displayElement.position_code)
                                .data('k2', displayElement.name)
                                .click(function () {
                                    ga('send', 'event', $(this).data('k1'), '廣告點擊', $(this).data('k2'))
                                })
                        )
                    }
                } else {
                    showRmaxPost(_pd, _pd.data('rmax-space-id'), _pd.data('target'));
                }
            }, error: function () {
                showRmaxPost(_pd, _pd.data('rmax-space-id'), _pd.data('target'));
            }
        });
    });


    getUserInfo().then(function (data) {
        uinfo = data;
        dataLayer.push({'event': 'w91puUserInfoLoaded', 'memberLevel': data.level, 'memberLogin': data.islogin });
        document.body.dispatchEvent(new CustomEvent('w91puUserInfoLoaded', {'detail': {'memberLevel': data.level, 'memberLogin': data.islogin}}));
        showLiveWindow();
    }).catch((reason) => {
        dataLayer.push({'event': 'w91puUserInfoLoaded', 'memberLevel': 0, 'memberLogin': false });
        document.body.dispatchEvent(new CustomEvent('w91puUserInfoLoaded', {'detail': {'memberLevel': 0, 'memberLogin': false }}));
        showLiveWindow();
    });
    function showLiveWindow() {
        getLiveStatus().then(function (data) {
            let showFloating = true;
            if (uinfo.level > 1 ) {
                // 處理vip live觀看時間
                const viewStr = localStorage.getItem('live_view_time') || '';
                const now = new Date();
                const str = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
                if (viewStr && viewStr == str) {
                    showFloating = false;
                }
                localStorage.setItem('live_view_time', str);
            }

            $('.live-show-header').each(function (ix, va) {
                var _pd = $(va);
                _pd.append(
                    $('<a>').attr('href', data.list.weburl).attr('target', '_blank').append(
                        $('<img>').attr('src', data.list.urlImg).attr('style', 'height:35px;')
                    ).append(
                        $('<h1>').text(data.list.description).attr('style', 'display: inline-block; color: white;')
                    )
                )
            });

            if (!showFloating) return

            $(".live-show").html("<div style=\"height: 170px\"><a class=\"live-close-btn\" onclick=\"closeLiveBtn()\">X</a><div class=\"live-show-video\" style=\"float: right; display: table; border: 1px solid #808184;margin: 16px 16px 0 0; width: 250px; height: 150px;\"></div><a href=\"https://www.youtube.com/watch?v=WqsJJ9Aw8ZI\" target=\"_blank\"><img src=\"/uploads/180701/1-1PF1193426455.gif\" style=\"height:35px; width: unset !important; border-radius: unset !important;\"><h1 style=\"display: inline-block; color: white;\">直播</h1></a></div>");
            if (data.list.weburl.includes('facebook')) {
                $(".live-show-video").html("<iframe src=\"https://www.facebook.com/plugins/video.php?href=" + data.list.weburl + "&amp;show_text=0&amp;width=315\" width=\"250\" height=\"150\" scrolling=\"no\" frameborder=\"0\" allowtransparency=\"true\" allowfullscreen=\"true\" style=\"display: inline; \"></iframe>");
            } else if (data.list.youtubeId != null) {
                $(".live-show-video").html("<iframe width=\"250\" height=\"150\" src=\"https://www.youtube.com/embed/" + data.list.youtubeId + "?controls=0\" frameborder=\"0\" allow=\"accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen></iframe>");
            } else if (data.list.twitchId != null) {
                $('.live-show-video').html('<iframe src="https://player.twitch.tv/?channel=' + data.list.twitchId + '&muted=true&parent='+ location.host +'" height="150" width="250" allowfullscreen="true"></iframe>')
            } else {
                $(".live-show-video").html("<a href=\"" + data.list.weburl + "\" style=\"display: table-cell; color: white; text-align: center; vertical-align: middle;\">點擊觀看</a>");
            }

            $('.live-show-mobile').each(function (ix, va) {
                var _pd = $(va);
                _pd.append(
                    $('<a>').attr('class', 'live-close-btn').attr('onclick', 'closeLiveBtn()').text('X'),

                    $('<a>').attr('href', data.list.weburl).attr('target', '_blank').append(
                        $('<img>').attr('src', data.list.urlImg).attr('style', 'height:35px;')
                    )
                )
            });

        }).catch((reason) => {
            console.log('Rejected promise (' + reason + ').');

            $(".live-show").html('');

            $('.live-show-header').each(function (ix, va) {
                var _pd = $(va);
                showRmaxPost(_pd, _pd.data('rmax-space-id'));
            });

            $('.live-show-mobile').each(function (ix, va) {
                var _pd = $(va);
                showRmaxPost(_pd, _pd.data('rmax-space-id'));
            });

        });
    }
});

function getUserInfo() {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: ajaxtype,
            url: ajaxpath + 'ajaxapi/getuserinfo.php',
            contentType: ajaxct,
            dataType: ajaxdt,
            success: function (data) {
                if (data.done === "ok") {
                    // Fixup data
                    data.level = (data.level !== undefined) ? data.level : 0;
                    data.islogin = (data.islogin !== undefined) ? data.islogin : false;
                    data.isadmin = (data.isadmin !== undefined) ? data.isadmin : false;
                    resolve(data);
                } else {
                    reject("getUserInfo error");
                }
            }, error: function () {
                reject("getUserInfo error");
            }
        });
    });
}

function getLiveStatus() {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: ajaxtype,
            url: ajaxpath + 'ajaxapi/getLiveStatus.php',
            contentType: ajaxct,
            dataType: ajaxdt,
            success: function (data) {
                if (data.done === "ok" && data.list.status === "1") {
                    resolve(data);
                } else {
                    reject("getLiveStatus error");
                }
            }, error: function () {
                reject("getLiveStatus error");
            }
        });
    });
}

function showRmaxPost(dom,rid, target){
    // if(rid && target){
    //
    // 	dom.html(
    // 		'<ins class="rmax" data-rmax-space-id="'+rid+'" data-rmax-space-type="' + target + '" data-target-pos="INNER"></ins><script async="async" src="//tenmax-static.cacafly.net/ssp/adsbytenmax.js"></script>'
    // 	);
    // } else if (rid) {
    // 	dom.html(
    // 		'<ins class="rmax" data-rmax-space-id="'+rid+'" data-rmax-space-type="NATIVE" data-target-pos="INNER"></ins><script async="async" src="//tenmax-static.cacafly.net/ssp/adsbytenmax.js"></script>'
    // 	);
    // }
}

var cpTimes = 0;
var cpSeconds = 5;
function showCpWaitting(txt, type){
    $('.alertwin p').html(txt);
    $('.alertwin bdo').removeClass();

    if (1 == type) {
        $('.alertwin button').hide();
        $('.alertwin').fadeIn('fast');
        cpTimes = 180;
        cancelPeriodCheck();
    } else {
        $('.alertwin button').show().text('好的').unbind().click(function (e) {
            showAlert(false);
            location.reload(true);
        });
    }

}

function showSpWaitting(txt, type){
    $('.alertwin p').html(txt);
    $('.alertwin bdo').removeClass();
    if (1 == type) {
        $('.alertwin button').hide();
        $('.alertwin').fadeIn('fast');
    } else {
        $('.alertwin button').show().text('好的').unbind().click(function (e) {
            showAlert(false);
            location.reload(true);
        });
    }

}

function cancelPeriodCheck(){
    $.get('/ajaxapi/vipTypeCheck.php', function(json){
        var _result = $.parseJSON(json);
        if(1 == _result.period){
            cpTimes--;
            if(cpTimes > 0){setTimeout(cancelPeriodCheck, cpSeconds * 1000);}
            else{
                showCpWaitting('請洽客服人員查詢退訂進度', 2);
            }
        }else{
            showCpWaitting('取消月繳成功', 2);
        }
    });
}

function closeTipAlert(){
    showAlert(false);
}

function saveAccountLevel(accountLevel) {
    setStorage("accountLevel", accountLevel);
}

function isPayingAccount() {
    return getStorage("accountLevel") >= 2;
}

function showExchangeWindow(isShow) {
    if(isShow){
        $('#exchangeWindow').fadeIn().css('display','flex');
    }else{
        $('#exchangeWindow').fadeOut();
    }
}

function addExchangeData(exchangeCode) {

    if (exchangeCode == null || exchangeCode == '' || exchangeCode.length < 16 || exchangeCode.length > 24) {
        showTipAlert("請輸入正確的兌換碼");
        return;
    }

    var dataJSON = {};
    dataJSON["exchange_code"] = exchangeCode;


    $.ajax({
        type: ajaxtype,
        url: ajaxpath + 'ajaxapi/addExchange.php',
        data: JSON.stringify(dataJSON),
        contentType: ajaxJson,
        dataType: ajaxdt,
        success: function (data) {
            if (data.done == "ok") {
                showExchangeWindow(false);
                showTipAlert("送出兌換需求成功，若序號正確會儘快為你進行兌換，請稍候3 ~ 5天");
            } else {
                showExchangeWindow(false);
                showTipAlert("新增兌換碼錯誤 請登入");
            }
        },
        error: function () {
            showExchangeWindow(false);
            showTipAlert("新增兌換碼錯誤 請登入");
        }
    });
}

function addExchangeDataInMobile(exchangeCode) {

    if (exchangeCode == null || exchangeCode == '' || exchangeCode.length < 16 || exchangeCode.length > 24) {
        alert("請輸入正確的兌換碼");
        return;
    }

    var dataJSON = {};
    dataJSON["exchange_code"] = exchangeCode;


    $.ajax({
        type: ajaxtype,
        url: ajaxpath + 'ajaxapi/addExchange.php',
        data: JSON.stringify(dataJSON),
        contentType: ajaxJson,
        dataType: ajaxdt,
        success: function (data) {
            if (data.done == "ok") {
                alert("送出兌換需求成功，若序號正確會儘快為你進行兌換，請等候3 ~ 5天");
                window.location.reload();
            } else {
                alert("新增兌換碼錯誤 請登入");
                window.location.reload();
            }
        },
        error: function () {
            alert("新增兌換碼錯誤 請登入");
            window.location.reload();
        }
    });
}

// Patch for removed method
function browserRedirectPhone() {
    var sUserAgent = navigator.userAgent.toLowerCase();
    var bIsIpad = sUserAgent.match(/ipad/i) != null;
    var bIsIphoneOs = sUserAgent.match(/iphone os/i) != null;
    var bIsMidp = sUserAgent.match(/midp/i) != null;
    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) != null;
    var bIsUc = sUserAgent.match(/ucweb/i) != null;
    var bIsAndroid = sUserAgent.match(/android/i) != null;
    var bIsCE = sUserAgent.match(/windows ce/i) != null;
    var bIsWM = sUserAgent.match(/windows mobile/i) != null;
    if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
        return true;
    }
    return false;
}

function detectBrowserType() {
    let result = {};
    const sUserAgent = navigator.userAgent.toLowerCase();
    result["bIsIpad_original"] = sUserAgent.match(/ipad/i) != null;
    result["bIsIpad"] = sUserAgent.match(/ipad/i) != null;
    if (/MacIntel/.test(navigator.platform) && navigator.maxTouchPoints && navigator.maxTouchPoints > 2) {
        // Workaround for iPad detection
        result["bIsIpad"] = true;
    }
    result["bIsIphoneOs"] = sUserAgent.match(/iphone os/i) != null;
    result["bIsMidp"] = sUserAgent.match(/midp/i) != null;
    result["bIsUc7"] = sUserAgent.match(/rv:1.2.3.4/i) != null;
    result["bIsUc"] = sUserAgent.match(/ucweb/i) != null;
    result["bIsAndroid"] = sUserAgent.match(/android/i) != null;
    result["bIsCE"] = sUserAgent.match(/windows ce/i) != null;
    result["bIsWM"] = sUserAgent.match(/windows mobile/i) != null;
    return result;
}

function ShowSixLine(tone) {

    if (tone === "") {
        return;
    }

    var tonePath = window.location.href;

    var toneNumber = tonePath.substring(tonePath.lastIndexOf("/") + 1, tonePath.lastIndexOf("."));

    console.log("toneNumber : " + toneNumber);

    var toneImagePath = window.location.protocol + "//" + window.location.hostname + "/uploads/six-line/" + toneNumber + "-" + tone + ".png";
    var defaultNoImage = window.location.protocol + "//" + window.location.hostname + "/images/default_no_sixline_image.png";

    console.log("toneImagePath : " + toneImagePath);

    checkImageExists(toneImagePath, function(existsImage) {

        if(existsImage == true) {
            openImage(toneImagePath);
        } else {
            // not a valid image.
            openImage(defaultNoImage, "https://www.91pu.com.tw/article/91pu/2020/0729/12912.html");
        }
    });
}

function ShowSixLineMobile(tone) {

    if (tone === "") {
        return;
    }

    var tonePath = window.location.href;

    let toneUrl = new URL(tonePath);



    let parameters = toneUrl.searchParams;

    let toneNumber = parameters.get("id");

    console.log("toneNumber : " + toneNumber);

    var toneImagePath = window.location.protocol + "//" + window.location.hostname + "/uploads/six-line/" + toneNumber + "-" + tone + ".png";
    var defaultNoImage = window.location.protocol + "//" + window.location.hostname + "/images/default_no_sixline_image.png";
    console.log("toneImagePath : " + toneImagePath);

    checkImageExists(toneImagePath, function(existsImage) {

        if(existsImage == true) {
            openImage(toneImagePath);
        } else {
            // not a valid image.
            openImage(defaultNoImage, "https://www.91pu.com.tw/article/91pu/2020/0729/12912.html");
        }
    });
}

function openImage(imageSrc, imageLink) {

    // Get the modal
    var sixLineDisplayRegion = document.getElementById("six-line-image");

    // Get the image and insert it inside the modal - use its "alt" text as a caption
    var sixLineImage = document.getElementById("display-image");
    var aElement = document.getElementById("display-image-a");
    aElement.href = ((typeof imageLink) == "string") ? imageLink : "#";

    var sixLineImageCloseBtn = document.getElementById("close-six-line");

    sixLineDisplayRegion.style.display = "block";
    sixLineImageCloseBtn.style.display = "block";

    if (sixLineImage.src != imageSrc) {
        sixLineImage.src = "";
        sixLineImage.src = imageSrc;
    }
}

function closeSixLineImage() {
    // Get the modal
    var sixLineDisplayRegion = document.getElementById("six-line-image");
    var sixLineImage = document.getElementById("display-image");
    var sixLineImageCloseBtn = document.getElementById("close-six-line");


    sixLineImage.src = "";
    sixLineDisplayRegion.style.display = "none";
    sixLineImageCloseBtn.style.display = "none";
}


function checkImageExists(imageUrl, callBack) {
    var imageData = new Image();

    imageData.onload = function() {
        callBack(true);
    };

    imageData.onerror = function() {
        callBack(false);
    };

    imageData.src = imageUrl;
}

(function($) {
    $.fn.invisible = function() {
        return this.each(function() {
            $(this).css("visibility", "hidden");
        });
    };
    $.fn.visible = function() {
        return this.each(function() {
            $(this).css("visibility", "visible");
        });
    };
}(jQuery));
