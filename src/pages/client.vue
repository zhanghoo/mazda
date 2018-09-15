<template>
    <div id="client">
        <div class="index-container" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.5)">
            <!-- menu -->
            <div class="index-menu">
                <div class="menu-user">
                    <img class="user-avatar" v-if="userInfo.avatar" :src="userInfo.avatar" @click="userDialogVisible = true">
                    <img class="user-avatar" v-else src="~@/assets/img/single-avatar.svg" @click="userDialogVisible = true">
                    <div class="user-status">在线</div>
                </div>
                <div class="menu-tabs">
                    <div class="tabs-item" v-for="(item, index) in tabOptions" :key="index" :class="{'active': tabActive === index}" @click="tabActive = index">
                        <div :class="[item.icon, 'item-icon']"></div>
                        <div class="item-label">{{item.label}}</div>
                    </div>
                </div>
                <div class="menu-setting" v-if="!isLogin">
                    <div class="setting-icon my-icon-userSetting" @click="loginDialogVisible = true"></div>
                </div>
            </div>
            <div class="index-right">
                <div class="index-title">马自达在线顾问</div>
                <!-- 联系人 -->
                <div class="right-container linkman" v-if="tabActive === 0">
                    <div class="linkman-item" v-for="(item, index) in customList" :key="index" @click="handleLinkman(item)">
                        <img class="item-avatar" :src="item.avatar" />
                        <div class="item-username">{{item.nickname || item.username}}</div>
                    </div>
                </div>
                <!-- 历史对话框 -->
                <div class="right-container conversation" v-show="tabActive === 1">
                    <my-chat :activeUser="activeUser" :initData="initData" :userInfo="userInfo" :json="conversationList"></my-chat>
                </div>
            </div>
        </div>
        <login-dialog v-if="loginDialogVisible" @close="loginDialogVisible = false" @onSubmit="login"></login-dialog>
        <user-dialog v-if="userDialogVisible" @close="userDialogVisible = false" :userInfo="userInfo"></user-dialog>
    </div>
</template>
<script>
import { compare } from '@/utils'
import { getCustomList, getInitParams, getUser, getLogin } from '@/api'
import JIM from '@/api/jim'
export default {
    name: 'client',
    data() {
        return {
            initData: '', // 极光初始化参数
            userInfo: '',
            tabOptions: [
                {
                    icon: 'my-icon-linkman',
                    label: '联系人'
                },
                {
                    icon: 'my-icon-conversation',
                    label: '历史会话'
                }
            ],
            tabActive: 0,
            customList: '', // 客服列表
            conversationList: [], // 会话列表
            initChat: false,
            mergeTime_ms: 3 * 60 * 1000,
            userDialogVisible: false,
            loginDialogVisible: false,
            loading: false,
            activeUser: '',
            isLogin: false
        }
    },
    mounted() {
        this.getCustomList()
    },
    methods: {
        // 获取在线客服
        getCustomList() {
            getCustomList().then(res => {
                console.log('获取在线客服', res)
                if (res.code === 0) {
                    let online = false
                    online = res.data2.some(item => item.online)
                    // 客服在线 ？极光初始化 ： 跳转至留言页
                    if (online) {
                        this.initJIM()
                        this.customList = res.data.filter(item => item.online)
                    } else {
                        this.$router.push({ name: 'message' })
                    }
                }
            })
        },
        // 初始化极光
        initJIM(loginInfo) {
            this.loading = true
            getInitParams().then(res => {
                console.log('获取极光初始化参数：', res)
                this.initData = res.data
                JIM.init(this.initData).then(() => {
                    if (!loginInfo) {
                        getUser().then(user => {
                            console.log('游客信息', user)
                            let params = {
                                'username': user.data.username,
                                'password': user.data.password
                            }
                            console.log('游客登录参数', params)
                            JIM.login(params).then(info => {
                                console.log('登录成功', info)
                                this.userInfo = user.data
                                this.syncConversation()
                            }).catch(err => {
                                this.$message.error('登录失败')
                                console.log('登录失败', err)
                            })
                        })
                    } else {
                        let params = {
                            'username': loginInfo.data.username,
                            'password': loginInfo.data.password
                        }
                        console.log('账号登录参数', params)
                        JIM.login(params).then(info => {
                            console.log('登录成功', info)
                            this.userInfo = loginInfo
                            this.syncConversation()
                        }).catch(err => {
                            this.$message.error('登录失败')
                            console.log('登录失败', err)
                        })
                    }
                    let uuid = this.$cache.getLocal('mazda_login')
                    uuid ? this.isLogin = true : this.isLogin = false
                })
            })
        },
        // 获取漫游信息
        syncConversation() {
            this.loading = false
            JIM.onSyncConversation().then(contents => {
                console.log('同步会话内容 syncConversationContent', contents)
                JIM.getConversation().then(list => {
                    console.log('同步会话列表 syncConversationList', list)
                    this.conversationList = list.conversations
                    this.conversationList.forEach(item => {
                        contents.forEach(content => {
                            // 同步已读消息
                            content.receipt_msgs.forEach(receipt_msg => {
                                content.msgs.some(msg => {
                                    if (receipt_msg.msg_id === msg.msg_id) {
                                        this.$set(msg, 'read', true)
                                        return true
                                    }
                                })
                            })
                            if (item.username === content.from_username) {
                                let msgs = content.msgs.map(msg => {
                                    // 获取图片资源路径
                                    if (msg.content.msg_body.media_id) {
                                        JIM.getResource(msg.content.msg_body.media_id).then(url => {
                                            this.$set(msg, 'local_url', url)
                                        })
                                    }
                                    return msg
                                })
                                // 合并短时间消息
                                for (let index = msgs.length - 1; index > 0; index--) {
                                    if (msgs[index].ctime_ms - msgs[index - 1].ctime_ms <= this.mergeTime_ms) {
                                        this.$set(msgs[index], 'ctime_ms_hide', true)
                                    }
                                }
                                this.$set(item, 'msgs', msgs)
                            }
                        })
                    })
                    // 排序
                    this.conversationList.sort(compare('des', 'mtime'))
                })
            })
        },
        // 点击联系人跳转至历史对话框
        handleLinkman(item) {
            this.tabActive = 1
            this.activeUser = item
            this.initChat = true
        },
        login(form) {
            getLogin(form).then(res => {
                console.log('mazda登录成功', res)
                this.$cache.setLocal('mazda_login', res.data.uuid)
                if (res.data.uuid !== this.userInfo.uuid) {
                    JIM.loginOut().then(() => {
                        console.log('已退出登录')
                        this.initJIM(res)
                    })
                } else {
                    this.userInfo = { ...this.userInfo, ...res.data }
                }
                this.loginDialogVisible = false
                this.isLogin = true
                this.$message.success('登录成功')
            }).catch(err => {
                console.log(err)
                this.$message.success('账号或密码错误')
            })
        },
        // 退出登录
        loginOut() {
            JIM.loginOut().then(() => {
                console.log('已退出登录')
            })
        }
    }
}
</script>
<style lang='stylus'>
$chatHeight = toRem(710);
$chatTitleHeight = toRem(50);
@media screen and (min-width: 981px) {
    #client {
        position: relative;
        width: 100%;
        min-height: 100vh;
        display: flex;
        align-items: center;
        .index-container {
            position: relative;
            display: flex;
            width: 100%;
            max-width: 980px;
            height: $chatHeight;
            margin: 0 auto;
            border-radius: 4px;
            background: #fff;
            overflow: hidden;
            .index-menu {
                position: relative;
                width: toRem(88);
                height: 100%;
                background: #0D0D0E;
                padding-top: $chatTitleHeight;
                .menu-user {
                    flex-center();
                    flex-direction: column;
                    padding-top: 10px;
                    margin: 10px 0 50px;
                    .user-avatar {
                        display: block;
                        width: 44px;
                        height: 44px;
                        cursor: pointer;
                    }
                    .user-status {
                        color: #fff;
                        font-size: 12px;
                        margin: 10px 0;
                    }
                }
                .menu-tabs {
                    .tabs-item {
                        flex-center();
                        color: #fff;
                        font-size: 24px;
                        cursor: pointer;
                        height: 46px;
                        margin-bottom: 15px;
                        &.active {
                            background: $appColor;
                        }
                        &:hover {
                            background: $appColor;
                        }
                        .item-label {
                            display: none;
                        }
                    }
                }
                .menu-setting {
                    position: absolute;
                    bottom: 48px;
                    width: 100%;
                    height: 46px;
                    cursor: pointer;
                    &:hover {
                        background: $appColor;
                    }
                    .setting-icon {
                        flex-center();
                        width: 100%;
                        height: 100%;
                        color: #fff;
                        font-size: 20px;
                    }
                }
            }
            .index-right {
                position: relative;
                flex: 1;
                height: 100%;
                overflow: hidden;
                .index-title {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    display: flex;
                    align-items: center;
                    width: 100%;
                    height: $chatTitleHeight;
                    color: #fff;
                    font-size: 18px;
                    font-family: SourceHanSerifCN-Regular;
                    font-weight: 100;
                    padding-left: 20px;
                    background: url('~@/assets/img/index_title_bg.png') no-repeat left center;
                    background-size: 100% 100%;
                }
                .right-container {
                    display: flex;
                    width: 100%;
                    height: 100%;
                    padding-top: $chatTitleHeight;
                    &.linkman {
                        .linkman-item {
                            display: flex;
                            align-items: center;
                            width: 100%;
                            height: toRem(50);
                            color: #2c2c2c;
                            font-size: 16px;
                            padding-left: toRem(18);
                            cursor: pointer;
                            &:hover {
                                background-color: #F3F7FB;
                            }
                            .item-avatar {
                                width: toRem(30);
                                height: toRem(30);
                                margin-right: toRem(10);
                            }
                        }
                    }
                    &.conversation {
                        .index-user {
                            position: relative;
                            width: toRem(310);
                            height: 100%;
                            border-right: 1px solid $borderColor;
                            background: $bgColor;
                            overflow-y: auto;
                            .user-item {
                                display: flex;
                                width: 100%;
                                padding: 15px 0 10px 20px;
                                cursor: pointer;
                                &.active {
                                    background: #fff;
                                }
                                .el-badge__content {
                                    border: none;
                                }
                                .item-avatar {
                                    display: block;
                                    width: 44px;
                                    height: 44px;
                                }
                                .item-info {
                                    flex: 1;
                                    margin-left: 10px;
                                    .info-header {
                                        display: flex;
                                        align-items: center;
                                        width: 100%;
                                        margin: 2px 0 6px;
                                        .info-username {
                                            text-ellipsis();
                                            font-size: 16px;
                                        }
                                        .info-time {
                                            color: #C8C8C8;
                                            font-size: 12px;
                                            margin-left: auto;
                                            margin-right: 8px;
                                        }
                                    }
                                    .info-lastMsg {
                                        display: flex;
                                        align-items: center;
                                        color: #9d9d9d;
                                        font-size: 12px;
                                        .lastMsg-read {
                                            white-space: nowrap;
                                            margin-right: 4px;
                                            &.unread {
                                                color: #CE1B10;
                                            }
                                        }
                                        .lastMsg-content {
                                            white-space: nowrap;
                                            text-overflow: ellipsis;
                                            overflow: hidden;
                                            width: 170px;
                                        }
                                    }
                                    .info-content {
                                        text-ellipsis();
                                        width: 170px;
                                        color: #9D9D9D;
                                        font-size: 12px;
                                    }
                                }
                            }
                        }
                        .index-conversation {
                            flex: 1;
                            height: 100%;
                            overflow: hidden;
                            .conversation-container {
                                position: relative;
                                display: flex;
                                flex-direction: column;
                                width: 100%;
                                height: 100%;
                                .conversation-main {
                                    display: flex;
                                    flex-direction: column;
                                    width: 100%;
                                    height: toRem(460);
                                    overflow: hidden;
                                    .conversation-title {
                                        text-ellipsis();
                                        display: flex;
                                        align-items: center;
                                        width: 100%;
                                        height: toRem(40);
                                        font-size: 16px;
                                        padding: 0 toRem(20);
                                    }
                                    .conversation-content {
                                        width: 100%;
                                        height: toRem(420);
                                        padding: 0 toRem(20);
                                        overflow-y: auto;
                                        overflow-X: hidden;
                                        border-bottom: 1px solid #D9DEE4;
                                        .content-list {
                                            width: 100%;
                                            .content-item-wrap {
                                                &:first-child {
                                                    .item-time {
                                                        margin-top: toRem(20);
                                                    }
                                                }
                                                .item-time {
                                                    flex-center();
                                                    margin-top: toRem(30);
                                                    .time-value {
                                                        font-size: 12px;
                                                        color: #999;
                                                        text-align: center;
                                                        line-height: 17px;
                                                        padding: 2px 9px;
                                                        background: #F2F6FB;
                                                        border-radius: 5px;
                                                    }
                                                }
                                                .item-text {
                                                    display: flex;
                                                    padding: toRem(20) 0;
                                                    &:hover {
                                                        .item-more {
                                                            .el-icon-more {
                                                                visibility: visible;
                                                            }
                                                        }
                                                    }
                                                    &.self {
                                                        justify-content: flex-end;
                                                        .item-avatar {
                                                            margin-left: toRem(12);
                                                            margin-right: 0;
                                                        }
                                                        .item-content-value {
                                                            border-radius: 12px 12px 2px 12px;
                                                        }
                                                        .item-more {
                                                            margin-right: toRem(12);
                                                            margin-left: 0;
                                                        }
                                                    }
                                                    .item-avatar {
                                                        display: block;
                                                        width: toRem(40);
                                                        height: toRem(40);
                                                        margin-right: toRem(12);
                                                    }
                                                    .item-content {
                                                        .item-content-value {
                                                            color: $contentColor;
                                                            font-size: 14px;
                                                            line-height: 20px;
                                                            word-break: break-all;
                                                            padding: 10px 12px;
                                                            border: 1px solid #8E8E8E;
                                                            background: #F3F3F3;
                                                            border-radius: 2px 12px 12px 12px;
                                                        }
                                                    }
                                                    .item-image {
                                                        cursor: zoom-in;
                                                        img {
                                                            display: block;
                                                            max-width: toRem(200);
                                                            max-height: toRem(300);
                                                            border-radius: 5px;
                                                        }
                                                    }
                                                    .item-more {
                                                        margin-left: toRem(12);
                                                        align-self: flex-end;
                                                        .el-icon-more {
                                                            cursor: pointer;
                                                            visibility: hidden;
                                                            width: 100%;
                                                            text-align: center;
                                                            font-size: 16px;
                                                            color: #fff;
                                                            padding: 1px 2px;
                                                            background: #ccc;
                                                            border-radius: 5px;
                                                            margin-bottom: 5px;
                                                        }
                                                        .item-read {
                                                            color: #A3A3A3;
                                                            font-size: 12px;
                                                            display: block;
                                                            white-space: nowrap;
                                                            &.unread {
                                                                color: #CE1B10;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                .conversation-publish {
                                    height: toRem(200);
                                    overflow: hidden;
                                    .publish-tool {
                                        display: flex;
                                        align-items: center;
                                        height: 24px;
                                        margin: 8px 0 12px;
                                        .tool-item {
                                            color: #888;
                                            font-size: 24px;
                                            margin-left: 18px;
                                            cursor: pointer;
                                            &:hover {
                                                color: #56c7c6;
                                            }
                                            &.active {
                                                color: #56c7c6;
                                            }
                                        }
                                    }
                                    .publish-content {
                                        textarea {
                                            border: none;
                                        }
                                    }
                                    .publish-button {
                                        flex-center();
                                        position: absolute;
                                        bottom: toRem(20);
                                        right: toRem(20);
                                        width: toRem(90);
                                        height: toRem(30);
                                        font-size: 14px;
                                        color: #2C2C2C;
                                        cursor: pointer;
                                        border: 1px solid #C8C8C8;
                                        background: #fff;
                                        border-radius: 3px;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
@media screen and (max-width: 980px) {
    #client {
        position: relative;
        width: 100%;
        height: 100vh;
        display: flex;
        align-items: center;
        overflow: hidden;
        .index-container {
            width: 100%;
            height: 100%;
            overflow: hidden;
            .index-menu {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                z-index: 99;
                width: 100%;
                height: 55px;
                background: #0D0D0E;
                .menu-user, .menu-setting {
                    display: none;
                }
                .menu-tabs {
                    display: flex;
                    align-items: center;
                    justify-content: space-around;
                    width: 100%;
                    height: 100%;
                    .tabs-item {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        text-align: center;
                        height: 100%;
                        padding: 0 18px;
                        color: #fff;
                        font-size: 24px;
                        &.active {
                            background: $appColor;
                        }
                        .item-label {
                            white-space: nowrap;
                            font-size: 12px;
                            margin-top: 2px;
                        }
                    }
                }
            }
            .index-right {
                height: 100vh;
                padding-top: 62px;
                background: #000 url('~@/assets/img/mazidalogo.png') no-repeat top left;
                background-size: 56px auto;
                overflow: hidden;
                .index-title {
                    display: none;
                }
                .right-container {
                    width: 100%;
                    height: 100%;
                    background: #fff;
                    border-top-left-radius: 8px;
                    border-top-right-radius: 8px;
                    overflow: hidden;
                    &.linkman {
                        padding: 0 18px;
                        .linkman-item {
                            display: flex;
                            align-items: center;
                            width: 100%;
                            height: 50px;
                            color: #2c2c2c;
                            font-size: 16px;
                            border-bottom: 1px solid #eee;
                            .item-avatar {
                                width: 30px;
                                height: 30px;
                                margin-right: 10px;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
