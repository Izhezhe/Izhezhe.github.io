var reqConfig = {};
//异步请求地址封装
(function () {
    var interface = {
            type: {
                localDev: '',
                remote: 'http://192.168.60.19:8081',
                testServer: 'http://192.168.60.12:8081'
            },
            list: {
                'login':'/login',
                'sjclKey': '/sjclKey',
                'assessmentenent':'/caseStatistics',
                'activityList':'/activity/list',
                'caseManageList':'/activity/list',
                'caseRating':'/activity/list',
                'assignJudges':'/raterUser/list',
                'viewComment':'/case/caseView',
                'scoreState':'/activity/scoreList',
                'commentState':'/activity/commentList',
                'caseDelete':'/activity/delete',
                'getCase':'/activity/edit',
                'caseList':'/case/list',
                'setCase':'/activity/setActivity',
                'addCase':'/activity/setActivity',
                'setAppoint':'/raterUser/setAppoint',
                'approveList':'/approve/list',
                'examine':'/approve/pass',
                'approveEdit':'/approve/edit',
                'approveSave':'/approve/save',
                'approveDelete':'/approve/delete',
                'approvePass':'/approve/pass',
                'judgesGroupList':'/raterGroup/groupjudgelist',
                'addEditGroupList':'/raterGroup/editGroup',
                'judManage':'/raterUser/listraterUser',
                'addJudges':'/raterUser/addjudge',
                'jumpAddJudes':'/addJudges',
                'uploadPic':'/activity/uploadPic', 
                'deljudge':'/raterUser/deljudge',
                'editJudges':'/raterUser/edit',
                'grouping':'/raterGroup/all',
                'checkLoginName':"/raterUser/checkLoginName",
                'groupDelete':'/raterGroup/delete',
                'submitGroup':'/raterGroup/addupdategroup',
                'recommendSet':'/recommend/list',
                "recommendDate":'/recommend/getDates',
                "recommendDelete":'/recommend/delete',    
                'groupName':'/raterGroup/checkName',
                'caseActivityCaseList':'/case/ActivityCaseList',
                'recommendSave':'/recommend/save',
                'judCourt':'/activity/courtList',
                'modifyPwd':'/modifyPassword',
                'checkPwd':'/checkPassword',
                'changePwd':'/changePassword',
                'activityGetDates':'/activity/getDates',
                'assessGetScoreReason':'/assess/getScoreReason',
                'assessGetCaseComments':'/assess/getCaseComments',
                'assessGetCaseInfo':'/assess/getCaseInfo',
                'index':'/index'

            }
        },
        urlMode = /__(\w+)__/.exec(location.href),

        mod = (urlMode && urlMode[1]) || window.__mod__ || "localDev";

    reqConfig.getInterface = function (type, _mod) {
        if (!type) {
            return interface["type"][_mod || mod];
        }
        return interface["type"][_mod || mod] + interface["list"][_mod || type];
    };
    
    /**
     * 此代码是解决console在ie8下无法获取的的规避方案，后续会删除，
     * 代码中不要写console
     * @param  {[type]} window.console [description]
     * @return {[type]}                [description]
     */
    if (window.console == undefined) {
        window.console = {
            log: function(param) {}
        };
    }

})();

