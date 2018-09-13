<template>
    <div id="index">
        <div class="index-container">
            <!-- menu -->
            <div class="index-menu">
                <div class="menu-user">
                    <img class="user-avatar" src="~@/assets/img/custormer_avatar.jpg">
                    <div class="user-status">在线</div>
                </div>
                <div class="menu-tabs">
                    <div class="tabs-item my-icon-message" :class="{'active': tabsActive === 0}"></div>
                    <div class="tabs-item my-icon-searchFile" :class="{'active': tabsActive === 1}"></div>
                </div>
                <div class="menu-setting">
                    <el-dropdown trigger="click">
                        <div class="my-icon-menu"></div>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>欢迎语</el-dropdown-item>
                            <el-dropdown-item>忙碌语</el-dropdown-item>
                            <el-dropdown-item @click.native="logOut">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
            <div class="index-right">
                <div class="index-title">马自达在线顾问</div>
                <div class="right-container">
                    <my-chat v-if="initChat" :initData="$store.state.initData" :userInfo="$store.state.userInfo"></my-chat>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import JIM from '@/api/jim'
export default {
    name: 'index',
    data() {
        return {
            tabsActive: 0,
            initChat: false
        }
    },
    mounted() {
        this.initChat = true
    },
    methods: {
        logOut() {
            JIM.loginOut().then(() => {
                console.log('JIM退出登录')
                this.$cache.removeToken()
                this.$router.push({ name: 'login' })
            })
        }
    }
}
</script>
<style lang='stylus'>
$chatHeight = toRem(710);
$chatTitleHeight = toRem(50);
#index {
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
                cursor: pointer;
                .user-avatar {
                    display: block;
                    width: 44px;
                    height: 44px;
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
                flex-center();
                position: absolute;
                bottom: 48px;
                width: 100%;
                .my-icon-menu {
                    color: #fff;
                    font-size: 24px;
                    cursor: pointer;
                    &:hover {
                        color: #999;
                    }
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
                height: 100%;
                padding-top: $chatTitleHeight;
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
                        .item-avatar {
                            display: block;
                            width: 44px;
                            height: 44px;
                            margin-right: 10px;
                        }
                        .item-info {
                            flex: 1;
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
                    .conversation-container {
                        position: relative;
                        display: flex;
                        flex-direction: column;
                        height: 100%;
                        .conversation-main {
                            display: flex;
                            flex-direction: column;
                            height: toRem(450);
                            .conversation-title {
                                text-ellipsis();
                                display: flex;
                                align-items: center;
                                width: 100%;
                                height: toRem(40);
                                font-size: 16px;
                                padding-left: 20px;
                            }
                            .conversation-content {
                                width: 100%;
                                height: toRem(410);
                                border-bottom: 1px solid #D9DEE4;
                                overflow-y: auto;
                                padding: 0 toRem(20);
                                .content-item {
                                    display: flex;
                                    margin: toRem(20) 0;
                                    .item-avatar {
                                        display: block;
                                        width: toRem(40);
                                        height: toRem(40);
                                    }
                                    .item-content {
                                        color: $contentColor;
                                        font-size: 14px;
                                        padding: 9px 11px;
                                        border: 1px solid #8E8E8E;
                                        background: #F3F3F3;
                                    }
                                    .item-more {
                                        display: none;
                                        margin-left: toRem(12);
                                    }
                                    &.text {
                                        display: flex;
                                        align-items: center;
                                        &:hover {
                                            .item-more {
                                                display: block;
                                            }
                                        }
                                        .item-avatar {
                                            margin-right: toRem(12);
                                        }
                                        .item-content {
                                            border-radius: 2px 12px 12px 12px;
                                        }
                                    }
                                    &.self {
                                        display: flex;
                                        align-items: center;
                                        justify-content: flex-end;
                                        &:hover {
                                            .item-more {
                                                display: block;
                                            }
                                        }
                                        .item-avatar {
                                            margin-left: toRem(12);
                                        }
                                        .item-content {
                                            border-radius: 12px 12px 2px 12px;
                                        }
                                        .item-more {
                                            margin-right: toRem(12);
                                        }
                                    }
                                    &.time {
                                        flex-center();
                                        margin: toRem(30) 0 toRem(20);
                                        &:first-child {
                                            margin: toRem(10) 0 toRem(20);
                                        }
                                        .item-time {
                                            font-size: 12px;
                                            color: #999;
                                            text-align: center;
                                            padding: 2px 9px;
                                            background: #F2F6FB;
                                            border-radius: 5px;
                                        }
                                    }
                                }
                            }
                        }
                        .conversation-publish {
                            height: toRem(260);
                            overflow-y: auto;
                            .publish-tool {
                                display: flex;
                                align-items: center;
                                margin: 8px 0 12px;
                            }
                            .publish-content {
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
