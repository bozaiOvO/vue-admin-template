<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 基础表格</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                  <el-button type="primary" @click='showEdit()'>添加一级分类</el-button>
            </div>
            <el-table :data="kindList" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="goodsKind.title" label="title"  width="150">
                </el-table-column>
                <el-table-column prop="goodsKind.ctitle" label="ctitle" width="120">
                </el-table-column>
                <el-table-column prop="goodsKind.img" label="img" :formatter="formatter">
                </el-table-column>
                <el-table-column prop="list" label="子类标签" :formatter="formatter">
                    <template scope="scope">
                        <el-tag
                          v-for="tag in scope.row.list"
                          :disable-transitions="false"
                          closable
                           @close="handleDelete(tag.id)"
                         >
                            {{tag.ctitle}}
                        </el-tag>
                    <el-button  class="button-new-tag" size="small" @click="showEdit(scope.row.goodsKind.id,true)">+ 添加一个子类</el-button>

                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row.goodsKind.id)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.row.goodsKind.id,false)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :total="1000">
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="英文名字">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="中文名字">
                    <el-input v-model="form.ctitle"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="upDataKind"v-if="isUpDataID!==''">更新确 定</el-button>
                <el-button type="primary" @click="addKind" v-else>确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteKind">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {getKindList,delKind,addKind,upDataKind} from '@/api/kind2'
    export default {
        name: 'basetable',
        data() {
            return {
                url: './static/vuetable.json',
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                form: {
                    title: '',
                    ctitle:'',
                    pid:0
                },
                idx: -1,
                kindList:[],
                delId:'',
                kindDelType:1,
                isUpDataID:''
            }
        },
        created() {
            this.getKindList()//这里加上this指的是引用的当前的方法。
        },
        methods: {
            //打开编辑
            showEdit(id){
                console.log(id)
                this.form = {
                    title: '',
                    ctitle:'',
                    pid:0
                }
                this.isUpDataID = ''
                this.editVisible=true
                if(id){
                    console.log('ff')
                    this.form.pid = id //如果是添加子类，那么把父类ID传过来。
                }else{
                    console.log('没有ID   ')
                    return
                }
            },
            getKindList(){
                getKindList()//不加this指的是引用的api下的接口。
                .then(res=>this.kindList=res.data.data)
            },
            deleteKind(){
                delKind(this.delId,this.kindDelType)
                .then(res=>{
                    console.log(res)
                    if(res.data.code==='S'){
                        this.$message.success(`删除成功`);
                        this.getKindList()
                    }
                })
                this.delVisible = false
            },
            //开启你的删除弹窗并且传值。
            handleDelete(id,flag) {
                this.delId = id;
                if(flag){
                    //为true的话 就认为是子类打开的删除。
                    this.kindDelType = 1 
                }else{
                    //为false的话 就认为是父类打开的删除。
                    this.kindDelType = 0 
                }
                this.delVisible = true
            },
            addKind(){
                addKind({goodsKind:this.form})
                .then(res=>{
                    if(res.data.code==='S'){
                        this.$message.success(`添加成功`);
                        this.getKindList()
                    }
                })
                this.editVisible=false
            },
            handleEdit(id) {
                this.form = {
                    title: '',
                    ctitle:'',
                    pid:0
                }
                this.isUpDataID = id 
                this.editVisible=true
            },
            //更新数据
            upDataKind(){
                this.form.id = this.isUpDataID
                upDataKind({goodsKind:this.form})
                .then(res=>{
                    console.log(res)
                    if(res.data.code==='S'){
                        this.$message.success(`编辑成功`);
                        this.getKindList()
                    }
                })
                this.editVisible=false
            },









            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            // 获取 easy-mock 的模拟数据
            getData() {
                // 开发环境使用 easy-mock 数据，正式环境使用 json 文件
                if (process.env.NODE_ENV === 'development') {
                    this.url = '/ms/table/list';
                };
                this.$axios.post(this.url, {
                    page: this.cur_page
                }).then((res) => {
                    this.tableData = res.data.list;
                })
            },
            search() {
                this.is_search = true;
            },
            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            
            
            delAll() {
                const length = this.multipleSelection.length;
                let str = '';
                this.del_list = this.del_list.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {
                    str += this.multipleSelection[i].name + ' ';
                }
                this.$message.error('删除了' + str);
                this.multipleSelection = [];
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 保存编辑
            saveEdit() {
                this.$set(this.tableData, this.idx, this.form);
                this.editVisible = false;
                this.$message.success(`修改第 ${this.idx+1} 行成功`);
            },
            // 确定删除
            deleteRow(){
                this.tableData.splice(this.idx, 1);
                this.$message.success('删除成功');
                this.delVisible = false;
            }
        }
    }

</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
    .table{
        width: 100%;
        font-size: 14px;
    }
    .red{
        color: #ff0000;
    }
</style>
