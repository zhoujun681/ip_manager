<template>
  <div class="box fontstyle">
    <div class="title">IP地址管理系统</div>

    <div class="content">
      <div class="username">
        <p>
          <span>Username:</span>
          <el-input
            size="mini"
            v-model="username"
            placeholder="请输入用户名"
          ></el-input>
        </p>
      </div>
      <div class="password">
        <p>
          <span>Password:</span>
          <el-input
            size="mini"
            v-model="password"
            placeholder="请输入密码"
            show-password
          ></el-input>
        </p>
      </div>

      <div class="bt">
        <el-button type="primary" plain @click="login">Login</el-button>
      </div>
    </div>
  </div>
</template>


<script>
import qs from "qs";

export default {
  name: "LoginBox",
  props: {},
  data() {
    return {
      username: "",
      password: "",
      timer: "",
    };
  },
  methods: {
    isEmpty(obj) {
      if (typeof obj === "undefined" || obj == null || obj === "") {
        return true;
      } else {
        return false;
      }
    },
    login() {
      if (!this.loginCheck()) {
        return;
      }
      this.$http
        .post(
          "/users/login",
          qs.stringify({
            name: "",
            username: this.username,
            password: this.password,
          }),
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        )
        .then((res) => {
         //console.log("收到服务器返回  ：", res);
          // console.log("length:"+res.data.name.length);
          if (res.data.length > 0) {
            if (res.data == "None") {
              this.loginFail();
            } else if (res.data == this.username) {
             //console.log("登陆成功");
              this.loginSuccess();
            }
          } else {
            this.loginFail();
          }
        })
        .catch((error) => {
          this.$message({
            message: "连接服务器失败，请检查网络或者服务器是否正常！！ " + error,
            type: "error",
            offset: 200,
          });
        });
    },
    loginCheck() {
      if (this.isEmpty(this.username) || this.isEmpty(this.password)) {
        this.$message({
          message: "登陆失败，用户名和密不允许为空！！！",
          type: "error",
          offset: 200,
        });
        return false;
      } else {
        return true;
      }
    },
    loginSuccess() {
      this.$message({
        message: "登陆成功，欢迎你" + this.username,
        type: "success",
        offset: 200,
      });
      clearTimeout(this.timer); //清除延迟执行
      this.timer = setTimeout(() => {
        //设置延迟执行
        this.$router.replace("/mainPage");
      }, 1000);
    },
    loginFail() {
      this.$message({
        message: "登陆失败，请检查用户名和密码！！！",
        type: "error",
        offset: 200,
      });
    },
  },
  created: function () {
   //console.log("created listPage");
  },
};
</script>

<style >
.password .username {
  margin-top: 2%;
}
.el-input--mini.el-input--mini {
  display: inline;
}
.el-input--mini.el-input--mini .el-input__inner {
  width: 50%;
}
.fontstyle {
  color: white;
  font-size: 1.3em;
  font-style: italic;
}
input {
  margin-left: 10px;
}
.bt {
  display: inline-block;
  padding-top: 10px;
  padding-bottom: 10px;
}
.content {
  padding: 1%;
}
.title {
  border-radius: 15px 15px 0px 0px;
  background: #3a6995;
}
p {
  display: inline;
  margin: 10px 0px;
}
.box {
  display: inline-block;
  margin: 5%;
  border: 1px solid white;
  border-radius: 15px;
}
</style>
