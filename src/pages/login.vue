<template>
    <div id="login">
        <div class="login-container">
            <div class="login-title"></div>
            <el-form class="login-form" :model="form" @submit.native.prevent="verify">
                <el-form-item class="username">
                    <el-input v-model="form.username" placeholder="请输入用户名" />
                    <span class="input-icon prepend-icon">
                        <i class="my-icon-username"></i>
                    </span>
                </el-form-item>
                <el-form-item class="password">
                    <el-input v-model="form.password" placeholder="请输入密码" />
                    <span class="input-icon prepend-icon">
                        <i class="my-icon-lock"></i>
                    </span>
                </el-form-item>
                <div class="cacheInfo">
                    <el-checkbox v-model="cacheInfo">记住用户名和密码</el-checkbox>
                </div>
                <el-input class="login-btn" :class="{'active': form.username && form.password}" type="submit" value="登录" />
            </el-form>
        </div>
    </div>
</template>
<script>
import { getLogin, getInitParams } from '@/api'
import JIM from '@/api/jim'
export default {
    name: 'login',
    data() {
        return {
            form: {
                username: 'huzhou03',
                password: '123456'
            },
            cacheInfo: false
        }
    },
    methods: {
        verify() {
            if (this.form.username && this.form.password) {
                this.login()
            }
        },
        login() {
            getLogin(this.form).then(res => {
                this.$cache.setToken('123456789')
                this.init()
            }).catch(() => {
                this.$message.error('账号密码错误')
            })
        },
        async init() {
            let res = await getInitParams()
            JIM.init(res.data).then(() => {
                console.log('JIM初始化完成')
                JIM.login(this.form).then(() => {
                    console.log('JIM登录成功')
                    this.$router.push('/')
                })
            })
        }
    }
}
</script>
<style lang='stylus'>
#login {
    position: relative;
    width: 100%;
    height: 100vh;
    .login-container {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 100;
        width: toRem(460);
        min-height: 400px;
        border-radius: 6px;
        padding: 0 toRem(45) toRem(32);
        margin: 0 auto;
        background: url('~@/assets/img/login_bg.png') top left no-repeat;
        background-size: 100% 100%;
        overflow: hidden;
        .login-title {
            flex-center();
            width: 100%;
            height: toRem(145);
            background: url('~@/assets/img/login_logo.png') no-repeat center center;
            background-size: 66%;
        }
        .login-form {
            .el-form-item {
                &.password {
                    margin-bottom: 10px;
                }
                .el-input__inner {
                    font-size: 12px;
                    padding: 0 36px 0 44px;
                    height: 42px;
                    line-height: 42px;
                    border: 1px solid #6D6D6D;
                    border-radius: toRem(50);
                    &:focus {
                        border: 1px solid $appColor;
                    }
                }
                .input-icon {
                    position: absolute;
                    top: 0;
                    display: flex;
                    align-items: center;
                    height: 100%;
                    font-size: 16px;
                    text-align: center;
                    user-select: none;
                    cursor: pointer;
                    padding: 0 14px;
                    &.prepend-icon {
                        left: 0;
                    }
                    &.append-icon {
                        right: 0;
                    }
                }
            }
            .cacheInfo {
                padding: 0 6px;
                margin-bottom: 22px;
                .el-checkbox {
                    font-size: 12px;
                    .el-checkbox__label {
                        font-size: inherit;
                    }
                }
            }
            .login-btn {
                &.active {
                    input {
                        color: #fff;
                        cursor: pointer;
                        border-color: $appColor;
                        background-color: $appColor;
                    }
                }
                input {
                    color: #9E9E9E;
                    font-size: 14px;
                    height: 42px;
                    line-height: 42px;
                    background-color: #DCDCDC;
                    border-color: #AFAFAF;
                    border-radius: toRem(100);
                }
            }
        }
    }
}
</style>
