<template>
    <div id="client">
        <div class="index-container">
            <!-- menu -->
            <div class="index-menu">
                <div class="menu-user">
                    <img class="user-avatar" :src="userInfo.avatar" @click="userDialogVisible = true">
                    <div class="user-status">在线</div>
                </div>
                <div class="menu-tabs">
                    <div class="tabs-item" v-for="(item, index) in tabOptions" :key="index" :class="[item, {'active': tabActive === index}]" @click="tabActive = index"></div>
                </div>
                <el-dropdown class="menu-setting" trigger="click" placement="top-start">
                    <div class="setting-icon my-icon-userSetting"></div>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="login">登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
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
                <div class="right-container conversation" v-else-if="tabActive === 1">
                    <!-- user -->
                    <div class="index-user" v-if="conversationList">
                        <div class="user-item" v-if="item" v-for="(item, index) in conversationList" :key="index" :class="{'active': conversationActiveIndex === index}" @click="handleHistoryActive(item, index)">
                            <el-badge :value="item.unread_msg_count" :hidden="item.unread_msg_count === 0">
                                <img class="item-avatar" src="~@/assets/img/mazidakefu.png">
                            </el-badge>
                            <div class="item-info">
                                <div class="info-header">
                                    <div class="info-username">{{item.nickName}}</div>
                                    <div class="info-time" v-if="item.retractTime">{{item.retractTime | formatTime}}</div>
                                    <div class="info-time" v-else-if="item.msgs">{{item.msgs[item.msgs.length - 1].ctime_ms | formatTime}}</div>
                                </div>
                                <div class="info-lastMsg" v-if="item.msgs">
                                    <div class="lastMsg-read" :class="item.msgs[item.msgs.length - 1].read ? '' : 'unread'" v-if="!item.retractText && item.msgs[item.msgs.length - 1].content.from_id === userInfo.username">{{item.msgs[item.msgs.length - 1].read ? '[已读]' : '[未读]'}}</div>
                                    <div class="lastMsg-content" v-if="item.retractText">{{item.retractText}}</div>
                                    <div class="lastMsg-content" v-else>{{item.msgs[item.msgs.length - 1].content.msg_body.text || '[图片]'}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- conversation -->
                    <div class="index-conversation">
                        <div class="conversation-container" v-if="conversationActiveData">
                            <div class="conversation-main">
                                <div class="conversation-title">{{conversationActiveData.nickName}}</div>
                                <div class="conversation-content">
                                    <div class="content-list">
                                        <div class="content-item-wrap" v-for="(item, index) in conversationActiveData.msgs" :key="index">
                                            <div class="item-time" v-if="!item.ctime_ms_hide">
                                                <div class="time-value">{{item.ctime_ms | formatTime}}</div>
                                            </div>
                                            <div class="item-text" v-if="item.content.from_id === conversationActiveData.username">
                                                <img class="item-avatar" src="~@/assets/img/mazidakefu.png">
                                                <div class="item-content" v-if="item.content.msg_body.text">
                                                    <div class="item-content-value">{{item.content.msg_body.text}}</div>
                                                </div>
                                                <div class="item-image" v-else-if="item.local_url">
                                                    <img :src="item.local_url" @click="handlePreviewImage(item, index)">
                                                </div>
                                                <div class="item-more" v-if="item.content.msg_body.text">
                                                    <el-dropdown trigger="click" placement="bottom">
                                                        <div class="el-icon-more"></div>
                                                        <el-dropdown-menu slot="dropdown">
                                                            <el-dropdown-item v-clipboard:copy="item.content.msg_body.text">复制</el-dropdown-item>
                                                        </el-dropdown-menu>
                                                    </el-dropdown>
                                                </div>
                                            </div>
                                            <div class="item-text self" v-else>
                                                <div class="item-more">
                                                    <el-dropdown trigger="click">
                                                        <div class="el-icon-more"></div>
                                                        <el-dropdown-menu slot="dropdown">
                                                            <el-dropdown-item @click.native="handleMsgRetract(item.msg_id, index)">撤回</el-dropdown-item>
                                                            <el-dropdown-item v-clipboard:copy="item.content.msg_body.text">复制</el-dropdown-item>
                                                        </el-dropdown-menu>
                                                    </el-dropdown>
                                                    <div class="item-read" :class="[item.read ? '' : 'unread']">{{item.read ? '已读' : '未读'}}</div>
                                                </div>
                                                <div class="item-content" v-if="item.content.msg_body.text">
                                                    <div class="item-content-value">{{item.content.msg_body.text}}</div>
                                                </div>
                                                <div class="item-image" v-else-if="item.local_url">
                                                    <img :src="item.local_url" @click="handlePreviewImage(item, index)">
                                                </div>
                                                <img class="item-avatar" :src="userInfo.avatar">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="conversation-publish">
                                <div class="publish-tool">
                                    <div class="tool-item my-icon-emoji"></div>
                                    <label class="tool-item my-icon-picture" for="upload-pic">
                                        <input id="upload-pic" style="display: none;" type="file" accept="image/*" @change="handleSendSinglePic($event)">
                                    </label>
                                </div>
                                <el-input class="publish-content" v-model="content" placeholder="请输入文字" type="textarea" resize="none" @keyup.enter.native="handleSendSingleMsg" :rows="4"></el-input>
                                <div class="publish-button" @click="handleSendSingleMsg">发送</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <login-dialog v-if="loginDialogVisible" @close="loginDialogVisible = false"></login-dialog>
        <user-dialog v-if="userDialogVisible" @close="userDialogVisible = false" :userInfo="userInfo"></user-dialog>
        <my-preview v-if="previewDialogVisible" :imageList=previewImageList :previewIndex="previewIndex" @close="previewDialogVisible = false"></my-preview>
    </div>
</template>
<script>
import { compare, formatTime } from '@/utils'
import { getCustomList, getInitParams, getUser, saveMsg } from '@/api'
import JIM from '@/api/jim'
export default {
    name: 'client',
    data() {
        return {
            initData: '', // 极光初始化参数
            userInfo: '',
            tabOptions: ['my-icon-linkman', 'my-icon-conversation'], // tab选项
            tabActive: 1,
            customList: '', // 客服列表
            conversationList: [], // 会话列表
            conversationActiveIndex: -1,
            userDialogVisible: false,
            loginDialogVisible: false,
            previewDialogVisible: false,
            previewIndex: 0,
            previewImageList: [],
            content: '',
            mergeTime_ms: 1000 * 60
        }
    },
    computed: {
        // 当前对话框数据
        conversationActiveData() {
            return this.conversationList[this.conversationActiveIndex]
        }
    },
    mounted() {
        this.getCustomList()
    },
    filters: {
        formatTime
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
        initJIM() {
            getInitParams().then(res => {
                console.log('获取极光初始化参数：', res)
                this.initData = res.data
                JIM.init(this.initData).then(() => {
                    console.log('极光初始化成功')
                    getUser().then(user => {
                        console.log('获取用户参数', user)
                        let params = {
                            'username': user.data.username,
                            'password': user.data.password
                        }
                        JIM.login(params).then(() => {
                            console.log('登录成功')
                            this.userInfo = user.data
                            this.initSyncData()
                            this.initListenEvent()
                        }).catch(err => {
                            console.log('登录失败', err)
                        })
                    })
                })
            })
        },
        // 初始化同步数据
        initSyncData() {
            console.log('初始化同步数据...')
            this.syncConversation()
        },
        // 初始化监听事件
        initListenEvent() {
            console.log('初始化监听事件...')
            this.onMsgReceive()
            this.onMsgReceiptChange()
            this.onEventNotification()
        },
        // 同步会话数据
        syncConversation() {
            JIM.onSyncConversation().then(contents => {
                console.log('同步会话内容 syncConversationContent', contents)
                JIM.getConversation().then(list => {
                    console.log('同步会话列表 syncConversationList', list)
                    this.conversationList = list.conversations
                    this.conversationList.forEach(item => {
                        contents.forEach(content => {
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
                                this.mergeMessage(msgs, '', 'sync')
                                this.$set(item, 'msgs', msgs)
                            }
                        })
                    })
                    // 排序
                    this.conversationList.sort(compare('des', 'mtime'))
                })
            })
            // 同步已读消息
            JIM.onSyncMsgReceipt().then(res => {
                console.log('同步已读消息 syncMsgReceipt', res)
                this.comparisonMessage(res)
            })
        },
        // 发送文字
        handleSendSingleMsg() {
            JIM.sendSingleMsg(this.initData.appkey, this.conversationActiveData.username, this.content).then(data => {
                console.log('发送文字消息：sendSingleMsg', data)
                if (this.conversationActiveData.retractText) {
                    this.$set(conversation, 'retractText', '')
                    this.$set(conversation, 'retractTime', '')
                }
                let msg = data.msg
                this.$set(msg, 'ctime_ms', data.res.ctime_ms)
                this.mergeMessage(this.conversationActiveData.msgs, msg)
                this.scrollBottom()
                // 保存信息
                let params = {
                    'kfusername': this.conversationActiveData.username,
                    'username': this.userInfo.username,
                    'message': this.content,
                    'msg_type': 1,
                    'user_type': 1,
                    'timestamp': (new Date()).getTime()
                }
                saveMsg(params).then(res => {
                    this.content = ''
                })
            })
        },
        // 发送图片消息
        handleSendSinglePic(ev) {
            let imgFile = ev.target.files[0]
            JIM.sendSinglePic(this.initData.appkey, this.conversationActiveData.username, imgFile).then(data => {
                console.log('发送图片消息：sendSinglePic', data)
                let msg = data.msg
                JIM.getResource(msg.content.msg_body.media_id).then(URL => {
                    msg['local_url'] = URL
                    if (this.conversationActiveData.retractText) {
                        this.$set(conversation, 'retractText', '')
                        this.$set(conversation, 'retractTime', '')
                    }
                    this.$set(msg, 'ctime_ms', data.res.ctime_ms)
                    this.mergeMessage(this.conversationActiveData.msgs, msg)
                    this.scrollBottom()
                    // 保存信息
                    let params = {
                        'kfusername': this.conversationActiveData.username,
                        'username': this.userInfo.username,
                        'image': msg.content.msg_body.media_id,
                        'msg_type': 2,
                        'user_type': 1,
                        'timestamp': (new Date()).getTime()
                    }
                    saveMsg(params).then(res => {
                        this.content = ''
                    })
                })
            })
        },
        // 监听接收消息
        onMsgReceive() {
            JIM.onMsgReceive(res => {
                console.log('接收到1条消息: onMsgReceive', res)
                if (res.rid) {
                    let msg = res.messages[0]
                    let conversation = this.conversationFind(msg.from_username)
                    if (conversation) {
                        if (conversation.retractText) {
                            this.$set(conversation, 'retractText', '')
                            this.$set(conversation, 'retractTime', '')
                        }
                        this.mergeMessage(conversation.msgs, msg)
                        // 当前对话框 ？已读回执 ： 未读 +1
                        if (conversation.username === this.conversationActiveData.username) {
                            this.handleMsgReport(conversation.username, [res.rid])
                            this.scrollBottom()
                        } else {
                            conversation.unread_msg_count += 1
                        }
                    } else {
                        // 新建对话框
                        // let new_conversation = {
                        // }
                    }
                }
            })
        },
        // 监听已读数变更（针对自己）
        onMsgReceiptChange() {
            JIM.onMsgReceiptChange(res => {
                console.log('已读数变更 onMsgReceiptChange : ', res)
                this.comparisonMessage([res])
            })
        },
        // 业务事件监听
        onEventNotification() {
            JIM.onEventNotification(res => {
                console.log('业务事件监听 onEventNotification : ', res)
                // 消息撤回事件
                if (res.event_type === 55) {
                    let conversation = this.conversationFind(res.from_username)
                    if (conversation) {
                        conversation.msgs.some((item, index) => {
                            if (item.msg_id === res.msg_ids[0]) {
                                conversation.msgs.splice(index, 1)
                            }
                        })
                        this.$set(conversation, 'retractText', '对方撤回了一条信息')
                        this.$set(conversation, 'retractTime', res.ctime_ms)
                    }
                }
            })
        },
        // 已读回执
        handleMsgReport(username, unread_msgs) {
            let conversation = this.conversationFind(username)
            this.$set(conversation, 'unread_msg_count', 0)
            JIM.addSingleReceiptReport(username, unread_msgs).then(res => {
                console.log('已读回执 addSingleReceiptReport : ', res)
                // 重置未读数
                JIM.resetUnreadCount(username)
            })
        },
        login() {
            this.loginDialogVisible = true
        },
        // 退出登录
        logOut() {
            JIM.loginOut().then(() => {
                console.log('已退出登录')
                this.$cache.removeToken()
                this.$router.push({ name: 'login' })
            })
        },
        // 点击联系人跳转至历史对话框
        handleLinkman(item) {
            this.tabActive = 1
            this.conversationList.some((conversation, index) => {
                if (conversation.username === item.username) {
                    this.conversationActiveIndex = index
                    this.scrollBottom()
                    return true
                }
            })
        },
        // 点击对话框
        handleHistoryActive(item, index) {
            this.conversationActiveIndex = index
            let kefuMsgs = item.msgs.filter(msg => msg.content.from_id === item.username)
            let msgs_id = kefuMsgs.map(kuMsgs => kuMsgs.msg_id)
            this.handleMsgReport(this.conversationActiveData.username, msgs_id)
            this.scrollBottom()
        },
        // 图片预览
        handlePreviewImage(item, index) {
            this.getImageList().then(res => {
                this.previewImageList = res
                this.previewImageList.findIndex((image, activeIndex) => {
                    if (image.index === index) {
                        this.previewIndex = activeIndex
                    }
                })
                this.previewDialogVisible = true
            })
        },
        // 消息撤回
        handleMsgRetract(msg_id, index) {
            JIM.msgRetract(msg_id).then(res => {
                console.log('消息撤回 msgRetract：', res)
                this.conversationActiveData.msgs.splice(index, 1)
                this.$set(this.conversationActiveData, 'retractText', '您撤回了一条信息')
                this.$set(this.conversationActiveData, 'retractTime', new Date().getTime())
            }).catch(err => {
                if (err.code === 881401) {
                    this.$message.error('时间过长，不能撤回')
                }
            })
        },
        // 获取当前对话框的图片列表
        getImageList() {
            return new Promise((resolve, reject) => {
                let arr = []
                let count = 0
                let imageArr = this.conversationActiveData.msgs.filter(item => item.local_url)
                this.conversationActiveData.msgs.forEach((item, index) => {
                    if (item.local_url) {
                        let img = new Image()
                        img.src = item.local_url
                        let set = setInterval(() => {
                            if (img.width > 0 || img.height > 0) {
                                count += 1
                                if (count === imageArr.length) {
                                    resolve(arr)
                                }
                                clearInterval(set)
                            }
                        }, 40)
                        img.onload = () => {
                            let obj = {
                                src: item.local_url,
                                w: img.width,
                                h: img.height,
                                index: index
                            }
                            arr.push(obj)
                        }
                    }
                })
            })
        },
        // 设置已读（针对自己）
        comparisonMessage(readMsgs) {
            readMsgs.forEach(readMsg => {
                let conversation = this.conversationFind(readMsg.username)
                if (conversation) {
                    readMsg.receipt_msgs.forEach(receipt_msg => {
                        conversation.msgs.some(msg => {
                            if (receipt_msg.msg_id === msg.msg_id) {
                                this.$set(msg, 'read', true)
                                return true
                            }
                        })
                    })
                }
            })
        },
        // 查找对话框
        conversationFind(username) {
            return this.conversationList.find(item => item.username === username)
        },
        scrollBottom() {
            this.$nextTick().then(res => {
                let conversationHeight = this.$el.querySelector('.content-list').offsetHeight
                this.$el.querySelector('.conversation-content').scrollTop = conversationHeight
            })
        },
        // 合并短间隔消息
        mergeMessage(msgs, msg, type) {
            if (type === 'sync') {
                for (let index = msgs.length - 1; index > 0; index--) {
                    if (msgs[index].ctime_ms - msgs[index - 1].ctime_ms <= this.mergeTime_ms) {
                        this.$set(msgs[index], 'ctime_ms_hide', true)
                    }
                }
            } else {
                for (let index = msgs.length - 1; index > 0; index--) {
                    if (!msgs[index].ctime_ms_hide) {
                        if (msg.ctime_ms - msgs[index].ctime_ms < this.mergeTime_ms) {
                            this.$set(msg, 'ctime_ms_hide', true)
                        }
                        msgs.push(msg)
                        break
                    }
                }
            }
        }
    }
}
</script>
<style lang='stylus'>
$chatHeight = toRem(710);
$chatTitleHeight = toRem(50);
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
</style>
