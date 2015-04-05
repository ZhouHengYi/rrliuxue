
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
                console.log('Error loading PHP document');
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
                    if(entity.Users[0].taskmessage >0 || entity.Users[0].taskcomment > 0 || entity.Users[0].taskreply > 0 || entity.Users[0].taskmention > 0)
                    {
                        tzMsg(entity.Users[0].taskmessage,
                            entity.Users[0].taskcomment,
                            entity.Users[0].taskreply,
                            entity.Users[0].taskmention);
                    }
                }
            }
    });
}

function tzMsg(taskmessage,taskcomment,taskreply,taskmention){
    try{
        //新方法
        var notification = new Notification("明道提醒",{
            body : '新任务：' + taskmessage + '          新评论：' + taskcomment
                    + '          新回复：' + taskreply + '          提醒我：' + taskmention,
            icon : 'http://images.cnblogs.com/cnblogs_com/flyingzl/268702/r_1.jpg',
            tag : {}, // 可以加一个tag
        });
        console.log('tixng');
        notification.onclick = function () {
            window.open("https://www.mingdao.com/inbox");
          }
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
console.log("start");
start();
setInterval(start,3000);
