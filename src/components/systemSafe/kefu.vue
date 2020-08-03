<template>
  <div class="resetPwd">
    <el-form class="reset-form" ref="form" :rules="rules" :model="form" label-width="80px">
      <el-form-item label="客服热线" prop="value">
      <el-input
        placeholder=""  v-model.trim="form.value"  maxlength="16" size="small" :disabled="!canEdit"></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-button class="" type="" size="mini" v-if="canEdit" @click="handleCancel">取消</el-button>
        <el-button class="" type="primary" size="mini" v-if="canEdit" @click="handleUpDate">保存</el-button>
        <el-button class="" type="primary" size="mini" v-if="!canEdit" @click="handleEdit">修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import API from "../../api/api_user";
  export default {
    name: 'login',
    data() {
      return {
        loading: false,
        canEdit: false,
        form: {
          value: "",
        },
        kefu: '',
        rules:{
          value:[
            { required: true, message: '请输入客服热线', trigger: 'blur' },
            {
              pattern: /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/,
              message: '客服热线格式不正确'
            }
          ]
        }
      }
    },
    created(){
      this.queryKf();
    },
    methods: {
      queryKf(){
        API.queryKf().then( (res) => {
          if(res.code == 0) {
            console.log(res.value)
            this.form.value = res.value;
            this.kefu = res.value;
          } else {
            this.$message.error(res.msg);
          }
        })
      },
      // 点击修改
      handleEdit(){
        this.canEdit = true;
      },
      // 点击取消修改按钮
      handleCancel(){
        this.form.value = this.kefu;
        this.canEdit = false;
      },
      // 点击保存
      handleUpDate(){
        this.$refs['form'].validate((valid) => {
          if (valid) {
            API.updateKf({value: this.form.value}).then( (res) => {
              if(res.code == 0) {
                 this.canEdit = false
              } else {
                this.$message.error(res.msg);
              }
            })
          }
        })
      }
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .resetPwd{
    .reset-form{
      padding-top: 50px;
      width: 325px;
      .input-tips{
        position: absolute;
        left: 104%;
        font-size: 12px;
        width: 123%;
      }
    }
  }
</style>
