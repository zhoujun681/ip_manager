<template>
  <div class="mainBox">
    <div
      v-loading="loading"
      element-loading-text="正在获取并锁定ip,需要一段时间，请耐心等待~~~^-^"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0,0,0,0.8)"
    >
      <el-select
        v-model="valueDepartment"
        @change="departmentfnEdit"
        placeholder="请选择科室"
      >
        <el-option
          v-for="item in departments"
          :key="item.department_id"
          :label="item.department_name"
          :value="item.department_id"
        ></el-option>
      </el-select>
      <el-select
        v-model="valuePart"
        @change="partfnEdit"
        placeholder="请选择部门"
        class="mm"
      >
        <el-option
          v-for="item in Parts"
          :key="item.part_id"
          :label="item.part_name"
          :value="item.part_id"
        ></el-option>
      </el-select>
      <el-button
        type="primary"
        medium
        @click="ck_checkip"
        round
        class="mainButton mm"
        >获取</el-button
      >
      <el-button
        type="primary"
        medium
        @click="manage"
        round
        class="mainButton mm"
        >管理</el-button
      >

      <el-dialog
        title="已锁定当前获取的IP地址"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        :visible.sync="dialogFormVisible"
      >
        <div class="msgIpAddress">{{ CurrentIpAddress }}</div>
        <el-form :model="form">
          <el-form-item label="Mac地址" :label-width="formLabelWidth">
            <el-input
              v-model="form.mac"
              autocomplete="off"
              hint="请输入Mac地址"
            ></el-input>
          </el-form-item>
          <el-form-item label="科室" :label-width="formLabelWidth">
            <el-input
              v-model="form.department"
              autocomplete="on"
              :disabled="true"
            ></el-input>
          </el-form-item>
          <el-form-item label="部门" :label-width="formLabelWidth">
            <el-input
              v-model="form.part"
              autocomplete="on"
              :disabled="true"
            ></el-input>
          </el-form-item>
          <el-form-item label="位置" :label-width="formLabelWidth">
            <el-input
              v-model="form.location"
              autocomplete="off"
              hint="请输入位置"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button class="alertButton" @click="skinIp">跳过此IP</el-button>
          <el-button class="alertButton" @click="closeDialog">取 消</el-button>
          <el-button class="alertButton" type="primary" @click="submitForm"
            >确 定</el-button
          >
        </div>
      </el-dialog>

      <div class="secLine">
        <span class="dqwy">当前未用：</span>
        <span class="IpAddress" @dblclick="alertIp">{{
          CurrentIpAddress
        }}</span>
      </div>
    </div>
  </div>
</template>>

<script>
import qs from "qs";

export default {
  name: "MainPage",
  data() {
    return {
      departments: [],
      valueDepartment: "",
      Parts: [],
      valuePart: "",
      CurrentIpAddress: "192.168.0.0",
      ip_address_end: 0,
      form: {
        mac: "",
        department: "",
        department_id: 0,
        part: "",
        part_id: 0,
        location: "",
      },
      dialogFormVisible: false,
      formLabelWidth: "150px",
      loading: false,
    };
  },
  methods: {
    manage() {
      this.$router.replace("/listPage");
    },
    initDatas() {
      this.$http
        .get("/datas/get_department")
        .then((res) => {
          // console.log("收到服务器返回  ：", res.data);
          // console.log("length:"+res.data.name.length);
          if (res.data.length > 0) {
            this.departments = res.data;
          } else {
            this.departments = [
              {
                department_id: "选项1",
                department_name: "没有获取到数据",
              },
            ];
          }
        })
        .catch(() => {
          this.departments = [
            {
              department_id: "0",
              department_name: "连接服务器失败",
            },
          ];
          return false;
        });
    },
    departmentfnEdit(vId) {
//      consolelog("vId:", vId, "departments:", this.departments);
      this.valuePart = "";
      let cur_department;
      for (let i in this.departments) {
        if (this.departments[i].department_id == vId) {
          cur_department = this.departments[i];
          break;
        }
      }

      this.Parts = cur_department.department_parts;
      this.form.department = cur_department.department_name;
    },
    partfnEdit(vId) {
      this.$http
        .get("/datas/get_ip", { params: { part_id: vId } })
        .then((res) => {
//          consolelog("收到服务器返回  get_ip", res.data);
          this.CurrentIpAddress = res.data;
          let spstr = this.CurrentIpAddress.split(".");
          this.ip_address_end = parseInt(spstr[spstr.length - 1]);
//          consolelog(this.ip_address_end)
        })
        .catch(() => {
          return false;
        });
      for (var i = 0; i < this.Parts.length; i++) {
        if (this.Parts[i].part_id == vId) {
          this.form.part = this.Parts[i].part_name;
        }
      }
    },
    ck_checkip() {
      this.loading = true;
      if (this.CurrentIpAddress == "192.168.0.0") {
        this.$message({
          message:
            "你所要锁定的IP无效，请检查是否选择了正确的部门！或者到达部门ip限制！",
          type: "error",
          offset: 200,
        });
        this.loading = false;
        return;
      }
      this.$http
        .get("/datas/check_ip", {
          params: {
            part_id: this.valuePart,
            ip_address_end: this.ip_address_end,
            ip_address_full: this.CurrentIpAddress,
          },
        })
        .then((res) => {
//          consolelog("收到服务器返回check_ip  ：", res.data);
           this.loading = false;
          if (res.data == 0) {
            this.innert_lock(1, true);
          } else if (res.data >= 0) {
            this.$message({
              message:
                "你所要锁定的IP已被他人锁定，一般是并发操作引起，请刷新页面重新获取。如果一直是占用状态请联系管理员清理！",
              type: "error",
              offset: 200,
            });
            return;
          } else if (res.data == -1) {
            this.$message({
              message: "服务器内部错误！（" + res.data + "）",
              type: "error",
              offset: 200,
            });
            return;
          } else if (res.data == -2) {
            this.$confirm(
              "此IP地址当前已在线，可能系统未记录。（" +
                res.data +
                "），是否继续获取？\n若要跳过次ip可以点击确定后填写时选择页面上的跳过此IP!",
              "提示",
              {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              }
            )
              .then(() => {
                this.$message({
                  type: "success",
                  message: "获取成功!请注意排查可能存在的ip冲突！！",
                });
                this.innert_lock(1, true);
              })
              .catch(() => {
                this.$message({
                  type: "info",
                  message: "已取消获取!请注意排查可能存在的ip冲突后重试！！",
                });
                return;
              });
          }else if (res.data == -3) {
            this.$message({
              message: "你锁定的IP不在部门允许的范围内！！！",
              type: "error",
              offset: 200,
            });
            return;
          }  else {
            this.$message({
              message: "服务器返回未知错误（" + res.data + "）",
              type: "error",
              offset: 200,
            });
            return;
          }
         
        })
        .catch((error) => {
          this.$message({
            message:
              "连接服务器失败，请检查网络或者服务器是否正常！请刷新重试！ ",
            error,
            type: "error",
            offset: 200,
          });
          this.loading = false;
          return;
        });
    },
    innert_lock(lock, show) {
      this.$http
        .post(
          "/datas/insert_or_alter_lock",
          qs.stringify({
            part_id: this.valuePart,
            ip_address_end: this.ip_address_end,
            lock: lock,
          }),
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        )
        .then((res) => {
//          consolelog("收到服务器返回 insert_or_alter_lock ：", res.data);
          if (res.data > 0) {
            if (show) {
              this.dialogFormVisible = true;
            } else {
              this.dialogFormVisible = false;
            }
          } else {
            this.$message({
              message: "服务器插入数据失败 ",
              type: "error",
              offset: 200,
            });
            return false;
          }
        })
        .catch((error) => {
          this.$message({
            message:
              "连接服务器失败，请检查网络或者服务器是否正常！请刷新重试！ " +
              error,
            type: "error",
            offset: 200,
          });
          return false;
        });
    },
    closeDialog() {
      //设置锁定标志为0
      this.innert_lock(0, false);
      this.dialogFormVisible = false;
    },
    checkMac(macAddress) {
      var regex =
        "^[a-fA-F0-9]{2}(?:[-]?[a-fA-F0-9]{2}){5}(?:,[a-fA-F0-9]{2}(?:[-]?[a-fA-F0-9]{2}){5})*$";
      // var regex = "^([[:xdigit:]]{2}[:.-]?){5}[[:xdigit:]]{2}$";
      // var regex = "([A-Fa-f0-9]{2}-){5}[A-Fa-f0-9]{2}"
      //var regex = "(([A-Fa-f0-9]{2}-){5}[A-Fa-f0-9]{2})|(([A-Fa-f0-9]{2}:){5}[A-Fa-f0-9]{2})"; // 含冒号
      var regexp = new RegExp(regex);
      if (!regexp.test(macAddress)) {
        this.$message({
          message: "Mac地址格式不正确，请检查！！格式为xx-xx-xx-xx-xx-xx ",
          type: "error",
          offset: 200,
        });
        return false;
      }

      return true;
    },
    submitForm() {
      if (!this.checkMac(this.form.mac)) {
        return;
      }
      if (this.form.location == "") {
        this.$message({
          message: "请填写位置信息",
          type: "error",
          offset: 200,
        });
        return;
      }
      this.$http
        .post(
          "/datas/submitForm",
          qs.stringify({
            mac: this.form.mac,
            ip_address_end: this.ip_address_end,
            part_id: this.valuePart,
            location: this.form.location,
          }),
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        )
        .then((res) => {
          if (res.data > 0) {
            this.$message({
              message: "提交成功！！！",
              type: "success",
              offset: 200,
            });
            this.dialogFormVisible = false;
            this.valueDepartment = "";
            this.valuePart = "";
          } else {
            this.$message({
              message: "提交失败，请刷新重试！！",
              type: "error",
              offset: 200,
            });
            this.innert_lock(0, false);
            this.valueDepartment = "";
            this.valuePart = "";
            this.CurrentIpAddress = "192.168.0.0";
          }
        })
        .catch((error) => {
          this.$message({
            message:
              "连接服务器失败，请检查网络或者服务器是否正常！请刷新重试请刷新重试！ " +
              error,
            type: "error",
            offset: 200,
          });
        });
    },
    skinIp() {
      this.$http
        .post(
          "/datas/submitForm",
          qs.stringify({
            mac: "00-00-00-00-00-00",
            ip_address_end: this.ip_address_end,
            part_id: this.valuePart,
            location: "未知",
          }),
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        )
        .then((res) => {
          if (res.data > 0) {
            this.$message({
              message: "跳过IP成功！！！如需重新设置此IP，请从管理界面更新！",
              type: "success",
              offset: 200,
            });
            this.dialogFormVisible = false;
            this.valueDepartment = "";
            this.valuePart = "";
            this.CurrentIpAddress = "192.168.0.0";
          } else {
            this.$message({
              message: "跳过IP失败，请刷新重试！！",
              type: "error",
              offset: 200,
            });
            this.innert_lock(0, false);
            this.valueDepartment = "";
            this.valuePart = "";
          }
        })
        .catch((error) => {
          this.$message({
            message:
              "连接服务器失败，请检查网络或者服务器是否正常！请刷新重试！ " +
              error,
            type: "error",
            offset: 200,
          });
        });
    },
    // 添加beforeunload监听事件
    createBeforeunloadHandler() {
      // window.addEventListener('beforeunload', e => this.beforeunloadHandler(e))
      window.addEventListener("beforeunload", this.beforeunloadHandler, false);
    },
    // 移除beforeunload事件
    destroyedBeforeunloadHandler() {
      // window.removeEventListener('beforeunload', e => this.beforeunloadHandler(e)) // 错误方法，无法移除
      window.removeEventListener(
        "beforeunload",
        this.beforeunloadHandler,
        false
      );
      // this.rowEditEnable = 0
    },
    // beforeunload监听事件
    beforeunloadHandler(e) {
      this.innert_lock(0, false);
      e.preventDefault();
      e = e || window.event;
      // e.returnValue = '确定要关闭窗口吗？'
      // 兼容IE8和Firefox 4之前的版本
      if (e) {
        e.returnValue = "关闭提示";
      }

      // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
      return "关闭提示";

      // console.log('释放权限操作')
      // 释放权限操作，无阻塞
      // 用户点击取消后执行，恢复操作
      //   setTimeout(function () {setTimeout(function () {
      //       console.log('恢复用户权限操作')
      //     }, 50)
      //   }, 50)
      // }
    },
    beforeDestroy() {
      // 在 beforeDestroy 钩子移除beforeunload事件
      this.destroyedBeforeunloadHandler();
    },
    alertIp() {
      this.$prompt("不建议直接修改IP地址，修改ip段请选择对应部门或新建部门！\n请输入需要修改的IP地址的末位:", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^25[0-5]$|^2[0-4]\d$|^1\d{2}$|^[1-9]?\d$/,
        inputErrorMessage: "IP地址格式不正确",
      })
        .then(({ value }) => {
          this.CurrentIpAddress =  this.CurrentIpAddress.replace(/(.)(25[0-5]$|2[0-4]\d$|1\d{2}$|[1-9]?\d$)/,"$1"+value);
          let spstr = this.CurrentIpAddress.split(".");
          this.ip_address_end = parseInt(spstr[spstr.length - 1]);
        })
        .catch(() => {
 
        });
    },
  },

  destroy: function () {
    this.innert_lock(0, false);
  },
  created: function () {
    this.initDatas();
  },
  mounted() {
    this.createBeforeunloadHandler();
  },
};
</script>

<style>
.alertButton {
  width: 20%;
}
.el-input--suffix .el-input__inner {
  box-shadow: 10px 10px 5px #35333365;
}
.mainButton {
  width: 15%;
}
.el-button--primary {
  background-color: #169bd5;
  box-shadow: 10px 10px 5px #35333365;
}
.mm {
  margin-left: 3%;
}
.mainBox {
  height: 30%;
  margin-top: 5%;
}
.msgIpAddress {
  font-size: 3em;
  color: red;
}
.IpAddress {
  font-size: 3em;
  color: red;
  background: white;
  border: 6px dashed #244488;
  padding: 10px;
}
.dqwy {
  font-size: 3em;
  color: white;
}
.secLine {
  margin-top: 3%;
}
</style>>