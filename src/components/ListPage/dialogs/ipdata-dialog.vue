<!--
 * @Descripttion: 使用ctrl+alt+i添加头部注释，ctrl+alt+t添加方法注释, 或者复制方法名后使用gocm来添加方法注释
 * @version: 
 * @Author: bb
 * @Date: 2021-01-08 16:13:19
 * @LastEditors: bb
 * @LastEditTime: 2021-01-22 11:08:18
-->
<template>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    :visible="visibleSync"
    @open="open_dialog"
  >
    <el-form :model="formData">
      <el-form-item label="地址信息" :label-width="form_label_width">
        <el-input v-model="location" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="ip段:" :label-width="form_label_width">
        <span>{{ formData.ip_address_section }}</span>
      </el-form-item>
      <el-form-item label="ip尾数" :label-width="form_label_width">
        <el-input
          v-model="ip_address_end"
          type="number"
          min="1"
          max="254"
        ></el-input>
      </el-form-item>
      <el-form-item label="mac地址" :label-width="form_label_width">
        <el-input v-model="mac_address"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button class="alertButton" @click="clickCancel">取 消</el-button>
      <el-button class="alertButton" type="primary" @click="clickOk"
        >修 改</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import qs from "qs";

export default {
  props: ["visibleSync", "title", "formData"],
  model: {
    prop: "formData",
    //这个事件名可以随意写，它实际上是规定了子组件要更新父组件值需要注册的方法
    event: "update_formData",
  },
  data() {
    return {
      location: "",
      ip_address_section: "",
      ip_address_end: 0,
      mac_address: "",
      form_label_width: "150px",
      ip_address_end_old: 0,
    };
  },
  methods: {
    open_dialog() {
      // console.log("formData:", this.formData);
      this.location = this.formData.location;
      this.ip_address_section = this.formData.ip_address_section;
      this.ip_address_end = this.formData.ip_address_end;
      this.ip_address_end_old = this.formData.ip_address_end;
      this.mac_address = this.formData.mac_address;
    },
    clickCancel() {
      this.$emit("update:visibleSync", false);
    },
    async clickOk() {
      let result = await this.db_submit();
 
      if (!result) {
        return;
      }

      this.$emit("update:visibleSync", false);
      this.$parent.init_all();
    },
    async db_submit() {
      let result = false;
      // console.log("location", this.location);
      await this.$http
        .post(
          "/datas/edit_ipdata",
          qs.stringify({
            location: this.location,
            ip_address_section: this.ip_address_section,
            ip_address_end: this.ip_address_end,
            ip_address_end_old: this.ip_address_end_old,
            mac_address: this.mac_address,
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        )
        .then((res) => {
          // console.log("收到服务器返回 edit_ipdata ：", res.data);
          if (res.data >= 0) {
            this.$message({
              message: "修改成功！！ ",
              type: "success",
              offset: 200,
            });
            result = true;
          } else {
            if (res.data == -4) {
              this.$message({
                message:
                  "你所要锁定的IP已被他人锁定，一般是并发操作引起，请刷新页面重新获取。如果一直是占用状态请联系管理员清理！",
                type: "error",
                offset: 200,
              });
              result = false;
            } else if (res.data == -1) {
              this.$message({
                message: "服务器内部错误！（" + res.data + "）",
                type: "error",
                offset: 200,
              });
              result = false;
            } else if (res.data == -2) {
              this.$message({
                message:
                  "修改成功！但此IP地址当前已在线，可能系统未记录！！！请注意排查可能存在的ip冲突!!",
                type: "warning",
                offset: 200,
              });
              result = true;
            } else if (res.data == -3) {
              this.$message({
                message: "你锁定的IP不在部门允许的范围内！！！",
                type: "error",
                offset: 200,
              });
              result = false;
            } else {
              this.$message({
                message: "服务器返回未知错误（" + res.data + "）",
                type: "error",
                offset: 200,
              });
              result = false;
            }

            result = false;
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
          result = false;
        });
      return result;
    },
  },

  watch: {
    // visibleSync(newValue, oldValue) {
    //   console.log(oldValue);
    //   this.vis = newValue;
    // },
    ip_address_end(newValue) {
      if (newValue < 1) {
        this.ip_address_end = 1;
      }
      if (newValue > 253) {
        this.ip_address_end = 253;
      }
    },
  },
};
</script>