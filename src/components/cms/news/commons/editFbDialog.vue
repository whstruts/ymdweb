<template>
 <div class="fb-wrap" v-if="fbDialogVisible">
  <el-dialog :title="form.isModify ? '修改':'新增'"  :visible.sync="fbDialogVisible" :close-on-click-modal="false" :before-close="cancel">
    <el-form :model="form" :rules="rules" ref="form" size="medium" label-width="80px" label-position="right" >
      <!-- <el-form-item label="发布时间" prop="createTime">
      <el-date-picker
      v-model="form.createTime"
      type="datetime"
      placeholder="选择日期时间"
      :editable="false"
      style="width: 50%" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss">
    </el-date-picker>
      </el-form-item> -->

      <el-form-item label="标题" prop="title">
        <el-input
          placeholder="请输入标题(50个字符)"
          v-model="form.title"
          autocomplete="off"
          maxlength="50"
          type="text"
          show-word-limit
        ></el-input>
      </el-form-item>

      <el-form-item label="内容" prop="content">
          <el-form-item>
            <quill-editor
              class="editor"
              v-model="form.content"
              ref="myQuillEditor"
              :options="editorOption"
              @input="handleInput"
            ></quill-editor>
            <span class="numberV">{{txtVal2}}个字符</span>
          </el-form-item>

            <!-- <el-upload
              class="avatar-uploader"
              :action="uploadUrl"
              name="file"
              :headers="header"
              :show-file-list="false"
              :on-success="uploadSuccess"
              :on-error="uploadError"
              :before-upload="beforeUpload"
            ></el-upload> -->

             <el-upload
              :action="uploadUrl"
              :show-file-list="false"
              :on-success="(res,file)=>{return handleAvatarSuccess(res,file)}"
              :headers="uploadHeaders"
              :data="{size:500}"
              :before-upload="beforeAvatarUpload"
              class="avatar-uploader">
            </el-upload>

      </el-form-item>
      <el-form-item>
        <div class="dialog-footer" style="text-align: right">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="determine()">确 定</el-button>
        </div>
      </el-form-item>
    </el-form>
    
  </el-dialog>
  </div>
</template>
<script>
  import API from '../../../../api/api_drugnews'
  import img_api from '@/api/api_homeSetting'
  // 工具栏配置
  const toolbarOptions = [
    ["bold", "italic", "underline", "strike"], // 加粗 斜体 下划线 删除线
    [{ list: "ordered" }, { list: "bullet" }], // 有序、无序列表
    [{ indent: "-1" }, { indent: "+1" }], // 缩进
    ["image"] // 链接、图片、视频
  ];
  const validateQuillEditor = (rule, value, callback) => {
  if (value.length > 500) {
      callback(new Error('最多输入500个字符'));
  } else {
      callback();
    }
  };
  export default {
  name: 'fbWrap',
  data(){
    return{
      uploadUrl:"",
      uploadHeaders: {Authorization: ''},//token
      form: {
          title: '',
          type: [],
          // createTime:'',
          content:'',
          time:'',
        },
      rules:{
        createTime: [
          {required: true, message: '请选择日期', trigger: 'change' }
        ],
        title:[
          {required: true, message: '请输入标题', trigger: 'blur' },
          { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
        ],
      },
      txtVal2: 0,
      editorOption: {
        placeholder: "",
        modules: {
          toolbar: {
            container: toolbarOptions,
            // container: "#toolbar",
            handlers: {
              image: function(value) {
                if (value) {
                  // 触发input框选择图片文件
                  document.querySelector(".avatar-uploader input").click();
                } else {
                  this.quill.format("image", false);
                }
              }
            }
          }
        }
      },
    } 
  },
  props:[
    'fbDialogVisible',
    'fbItemInfo',
  ],
  created() {
    this.uploadUrl = img_api.upload();
  },
  watch:{
    'fbItemInfo'(newVal){
      if(newVal && newVal.content) {
        this.form = newVal
        this.txtVal2 = newVal.content.length;
      }
    }
  },
  methods:{
    handleAvatarSuccess(res, file, item, index) {
    if (this.loading) {
      this.loading.close();
    }
    let quill = this.$refs.myQuillEditor.quill;
      // 如果上传成功
      if (res.code == 0) {
        // 获取光标所在位置
        let length = quill.getSelection().index;
        // 插入图片  res.url为服务器返回的图片地址
        quill.insertEmbed(length, "image", res.resPath);
        // 调整光标到最后
        quill.setSelection(length + 1);
      } else {
        this.$message.error("图片插入失败");
      }
  },
  beforeAvatarUpload(file) {
      this.uploadHeaders.Authorization = localStorage.getItem('access-token');
      if (!this.uploadHeaders.Authorization) {
        return false;
      }
      let arr = file.type.split("/");
      if (arr.indexOf("image") == -1) {
        this.$message.error('仅支持图片上传');
        return false;
      }
      let imgSize = file.size / 1024 / 1024 < 0.5;
      if (!imgSize) {
        return this.$confirm('图片大小不能超过500KB，是否确认压缩?', '提示', {
          type: 'warning'
        }).then(() => {
          this.loading = this.$loading({
            lock: true,
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.4)'
          });
          return true;
        }).catch(() => {
          return false;
        });
      }
      return true;
    },
  //  onEditorChange(event) {
  //   event.quill.deleteText(500,1)
  //   if(this.form.content === ''){
  //     this.txtVal2 = 0
  //   }else {
  //     this.txtVal2 = event.quill.getLength() - 1
  //   }
  //  },
   cancel() {
      this.$emit("closeEvent")
      this.form = {
        title: '',
        type: [],
        id: '',
        createTime:'',
        content:'',
        userName:'',
      } 
      this.txtVal2 = 0;
    },
     determine() {
      Date.prototype.Format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1, //月份 
            "d+": this.getDate(), //日 
            "H+": this.getHours(), //小时 
            "m+": this.getMinutes(), //分 
            "s+": this.getSeconds(), //秒 
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
            "S": this.getMilliseconds() //毫秒 
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
       var time2 = new Date().Format("yyyy-MM-dd HH:mm:ss");  
       console.log(time2);
       this.form.time = time2
       this.$refs.form.validate((valid) => {
        if (!valid) return this.$message.error('请填写必要的表单项！')
        let params = {
        content: this.form.content,
        createTime: this.form.time,
        createUserId: this.form.createUserId,
        id: this.form.id,
        tags: this.form.tags,
        title: this.form.title,
        type: this.form.type,
        userName:this.form.userName,
      }
      if(this.form.isModify) {
         API.newsmodify(params).then(res =>{
          if(res.code == 0) {
            console.log(res);
            this.$message.success('修改成功')
            this.form = {
              title: '',
              type: [],
              id: '',
              createTime:'',
              content:'',
              userName:''
            } 
            this.$emit("determineEvent")
          }else {
            this.$message.error('修改失败')
          }
        })
      }else{
        API.newspublish(params).then(res =>{
          if(res.code == 0) {
          this.$message.success('新增成功')
          this.form = {
            title: '',
            type: [],
            createTime:'',
            content:'',
          }
          this.$emit("determineEvent")
          }else {
            this.$message.error('新增失败')
          }
        })
      }
      });   
  },
   handleInput() {
     this.txtVal2 = this.form.content.length;
   },
   // 富文本图片上传前
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (!isLt1M) {
        this.$message.error('上传图片大小不能超过1MB!');
        return  Promise.reject();
      }
      // 显示loading动画
      this.quillUpdateImg = true;
    },
    uploadSuccess(res, file) {
      // res为图片服务器返回的数据
      // 获取富文本组件实例
      // console.log(res)
      let quill = this.$refs.myQuillEditor.quill;
      // 如果上传成功
      if (res.code == 0) {
        // 获取光标所在位置
        this.form.titleImgUrl = res.resPath;
        let length = quill.getSelection().index;
        // 插入图片  res.url为服务器返回的图片地址
        quill.insertEmbed(length, "image", res.resPath);
        // 调整光标到最后
        quill.setSelection(length + 1);
      } else {
        this.$message.error("图片插入失败");
      }
    },
    // 富文本图片上传失败
    uploadError() {
      // 显示loading动画
      // this.quillUpdateImg = true;
    },
  }
}
</script>
<style>
  .ql-editor {
    height: 365px !important;
  }
</style>