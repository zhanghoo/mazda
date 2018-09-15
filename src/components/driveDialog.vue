<template>
    <el-dialog class="drive-dialog" title="" :visible.sync="visible" width="60%">
        <div id="drive">
            <div class="drive-header">
                <img class="header-logo" src="~@/assets/img/drive-logo.png" />
                <div class="header-title">
                    <div class="title-label">查看预约试驾清单</div>
                </div>
                <div class="header-back" @click="visible = false">
                    <div class="back-icon my-icon-back"></div>
                    <div class="back-label">返回列表</div>
                </div>
            </div>
            <div class="drive-content">
                <el-table :data="tableJson" style="width: 100%" fit :header-cell-style="{'text-align': 'center'}" header-cell-class-name="header-label" empty-text="没有更多数据了">
                    <el-table-column align="center" label="姓名">
                        <template slot-scope="scope">
                            <span>{{scope.row.name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="性别">
                        <template slot-scope="scope">
                            <span>{{scope.row.ctime}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="手机号">
                        <template slot-scope="scope">
                            <span>{{scope.row.ctime}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="车系">
                        <template slot-scope="scope">
                            <span>{{scope.row.ctime}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="车型">
                        <template slot-scope="scope">
                            <span>{{scope.row.ctime}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="提交时间">
                        <template slot-scope="scope">
                            <span>{{scope.row.ctime}}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </el-dialog>
</template>
<script>
// import { getDrive } from '@/api'
export default {
    name: 'drive',
    data() {
        return {
            visible: true,
            tableJson: []
        }
    },
    watch: {
        visible(val) {
            if (!val) {
                this.$emit('close', false)
            }
        }
    },
    mounted() {
        // let params = {
        //     advisors_id: 14,
        //     p: 1,
        //     num: 20
        // }
        // getDrive(params).then(res => {
        //     console.log('试驾清单', res)
        // }).catch(err => {
        //     console.log(err)
        // })
    }
}
</script>
<style lang='stylus'>
.drive-dialog {
    .el-dialog__header {
        padding: 0;
        .el-dialog__headerbtn {
            display: none;
        }
    }
    .el-dialog__body {
        padding: 0;
        #drive {
            position: relative;
            width: 100%;
            .drive-header {
                width: 100%;
                height: 80px;
                display: flex;
                align-items: center;
                color: #fff;
                padding: 0 22px;
                background: #000;
                .header-logo {
                    width: 60px;
                }
                .header-title {
                    flex-center();
                    flex: 1;
                    .title-label {
                        position: relative;
                        width: fit-content;
                        text-align: center;
                        font-size: 20px;
                        color: #fff;
                        &:before {
                            content: '';
                            position: absolute;
                            left: 0;
                            bottom: -1px;
                            height: 1px;
                            width: 100%;
                            border-bottom: 1px solid #fff;
                        }
                        &:after {
                            content: '';
                            position: absolute;
                            left: 0;
                            bottom: -4px;
                            height: 1px;
                            width: 100%;
                            border-bottom: 1px solid #fff;
                        }
                    }
                }
                .header-back {
                    display: flex;
                    text-align: center;
                    flex-direction: column;
                    cursor: pointer;
                    font-size: 12px;
                    .back-icon {
                        font-size: 24px;
                        margin-bottom: 2px;
                    }
                }
            }
            .drive-content {
                padding: 20px 25px;
                min-height: 500px;
                max-height: 600px;
                overflow-y: auto;
                .header-label {
                    color: #000;
                    border: none;
                }
                .el-table {
                    &::before {
                        background: none;
                    }
                }
                .el-table__empty-text {
                    color: #000;
                }
            }
        }
    }
}
@media screen and (max-width: 980px) {
    .drive-dialog {
        overflow: hidden;
        .el-dialog {
            margin-top: 0 !important;
            width: 100% !important;
            height: 100%;
            .el-dialog__body {
                height: 100%;
                #drive {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    .drive-header {
                        padding: 0 16px;
                    }
                    .drive-content {
                        padding: 20px 15px;
                        flex: 1;
                        overflow-y: auto;
                        .el-table {
                            width: 100%;
                            .el-table__header, .el-table__body, .el-table__empty-block {
                                width: auto !important;
                            }
                            .header-label {
                                font-size: 12px;
                                width: fit-content;
                                .cell {
                                    width: fit-content;
                                    padding: 0 5px;
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
