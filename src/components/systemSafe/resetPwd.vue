<template>
  <div class="resetPwd">
    <el-form class="reset-form" ref="form" :rules="rules" :model="form" label-width="80px">
      <el-form-item label="原始密码" prop="lastPwd">
      <el-input
        placeholder=""
        type="password"  v-model.trim="form.lastPwd"  maxlength="16" size="small"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPwd">
      <el-input
        placeholder=""
        type="password"  v-model.trim="form.newPwd" maxlength="16" size="small"></el-input>
        <span class="input-tips">密码6-16个字符，由字母、数字组成，注意区分大小</span>
      </el-form-item>
      <el-form-item label="确认密码" prop="reNewPwd">
          <el-input
        placeholder=""
        type="password" v-model.trim="form.reNewPwd" maxlength="16" size="small"></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" class="login_button" @click="handleUpPwd('form')" :loading="loading" :disabled="!form.lastPwd||!form.newPwd||!form.reNewPwd" size="small">确认修改
      </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import API from "../../api/api_user";

  export default {
    name: 'login',
    data() {
      let  regPwd = (rule, value, callback) => {
        let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/

        if (!reg.test(value.trim())) {
          callback(new Error('密码6-16个字符，由字母、数字组成，注意区分大小写'));
        } else {
          callback();
        }
      };
      return {
        form: {
          lastPwd: "",
          newPwd: "",
          reNewPwd: ""
        },
        rules:{
          lastPwd:[
            { required: true, message: '请输入原始密码', trigger: 'blur' },
          ],
          newPwd:[
            { required: true, message: '请输入新密码', trigger: 'blur' },
            { validator: regPwd, trigger: 'blur' }
          ],
          reNewPwd:[
            { required: true, message: '请确认密码', trigger: 'blur' },
            { validator: regPwd, trigger: 'blur' }
          ]
        },
        verificationCodeList: [],
        verificationCode: "",//验证码
        codeIsSuccess: false,//验证码是否验证成功
        rememberPwd: false,//记住密码
        loading: false,
        imgCheck: "",
        getImg: "",
        token: ""
      }
    },
    methods: {
      handleUpPwd(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.form.newPwd != this.form.reNewPwd) {
              this.$message.error("两次输入的密码不一致")
              return;
            }
            this.loading = true;
            let params = {
              oldPassword: this.form.lastPwd,
              password: this.form.newPwd
            }
            API.upPwd(params).then((res) => {
              this.loading = false;
              if (res.code == "0") {
                this.$message.success("重置成功，请使用新密码登录");
                localStorage.removeItem("access-user");
                localStorage.removeItem("access-token");
                localStorage.removeItem("menus");
                localStorage.removeItem("perms");
                this.$router.push({
                  name: "login"
                });
              } else {
                this.$message.error(res.msg);
              }
            }).catch(() => {
              this.loading = false
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
