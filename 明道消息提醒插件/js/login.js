
var login = '<div class="homeDialog loginDialog show" style="width:347px;height:350px;"><div class="loginContainer"><div class="loginForm"><div class="loginWrapper"><div class="inputWrapper"><input class="iptUserName" id="loginName" type="text" name="userName" placeholder="GUID"></div><button class="btnLoginSubmit" type="submit">登录</button><div class="loginAction"><a class="forgetPsd" title="去明道登录" target="_blank" href="http://www.mingdao.com/">去明道登录</a><a class="forgetPsd" title="忘记密码" target="_blank" href="http://www.mingdao.com/FindPassword.htm">忘记密码？</a></div></div></div></div></div>';
function loadHtml(){
    if(localStorage.guid && localStorage.guid.length > 0)
    {
        if($(".div2").find(".homeDialog").length == 0 ){
            $(".div2").html(localStorage.guid);
        }
    }else
    {
        $(".div2").html(login);
    }
}

function initLoad(){
    loadHtml();

    $("#keepLogin").click(function(){
        if($(this).parent().attr("class") != "loginCheck checked"){
            $(this).parent().attr("class","loginCheck checked");
        }else
        {
            $(this).parent().attr("class","loginCheck");
        }

    });

    $(".btnLoginSubmit").click(function(){
        if($("#loginName").val().length == 0)
        {
            alert("请输入GUID，不清楚找周工吧 ^_^!");
            return;
        }
        $.ajax({
            url: 'http://mq.mingdao.com/notification/get?key=' + $("#loginName").val(),
            type: 'GET',
            dataType: 'html',
            timeout: 1000,
            error: function(ex){
                alert('Error loading PHP document');
            },
            success: function(result){
                console.log(result);
                result = result.substr(result.indexOf('(') + 1);
                result = result.substr(0,result.indexOf(')'));
                var entity = JSON.parse(result);
                console.log(entity);
                if(entity.MSG == "F")
                {
                    alert("登录失败！");
                }else
                {
                    localStorage.guid = $("#loginName").val();
                }
            }
        });
        getNotify();
    });

    $(".btnLoginSubmit22").click(function(){
        $.ajax({
            url: 'http://www.mingdao.com/ajaxpage/DoLogin.aspx',
            type: 'POST',
            data:{
                op:"login",
                LoginName:"zhouhengyi@rrliuxue.com",
                LoginPwd:"yczhouhy0795",
                Code:"",
                PID:"",
                IsCookie:true
            },
            dataType: 'html',
            timeout: 1000,
            error: function(ex){
                alert('Error loading PHP document');
            },
            success: function(result){
                var entity = eval("("+result+")");
                if(entity.Status == 101)
                {
                    location.href="http://www.mingdao.com/feed";
                }else
                {
                    alert(entity.MSG);
                }
            }
        });

    });
}

function getNotify(type){
    eachGetNotify();
}

function eachGetNotify(){
    $.ajax({
            url: 'http://mq.mingdao.com/notification/get?key=' + localStorage.guid,
            type: 'GET',
            dataType: 'html',
            timeout: 1000,
            error: function(ex){
                alert('Error loading PHP document');
            },
            success: function(result){
                console.log(result);
                result = result.substr(result.indexOf('(') + 1);
                result = result.substr(0,result.indexOf(')'));
                var entity = JSON.parse(result);
                console.log(entity);
                if(entity.MSG == "F")
                {

                }else
                {
                        tzMsg(entity.Users[0].taskmessage,
                            entity.Users[0].taskcomment,
                            entity.Users[0].taskreply,
                            entity.Users[0].taskmention);
                    loadHtml();
                }
            }
    });
}

function tzMsg(taskmessage,taskcomment,taskreply,taskmention){
    try{
        //新方法
        var notification = new Notification("明道提醒",{
            body : '新任务：' + taskmessage + '     新评论：' + taskcomment
                    + '<br/>新回复：' + taskreply + '     提醒我：' + taskmention,
            iconUrl : 'favicon.ico',
            tag : {}, // 可以加一个tag
        });
        console.log('tixng');
        notification.show();
    }catch(ex){
        console.log(ex);
    }
}


function start(){
    try{
        console.log(localStorage.guid);
        if(localStorage.guid != "")
        {
            getNotify();
        }
    }catch(ex){
        console.log(ex);
    }
}

$(function(){
    initLoad();
});