<!--
 * @Descripttion: 使用ctrl+alt+i添加头部注释，ctrl+alt+t添加方法注释, 或者复制方法名后使用gocm来添加方法注释
 * @version: 
 * @Author: bb
 * @Date: 2021-01-08 16:13:19
 * @LastEditors: bb
 * @LastEditTime: 2021-01-19 11:37:52
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
      <el-form-item label="请输入使用科室名" :label-width="form_label_width">
        <el-input
          v-model="form_department_name_data"
          autocomplete="off"
          @input="form_department_name_changed"
          :disabled="!isDis"
        ></el-input>
      </el-form-item>
      <el-form-item label="请输入使用部门名" :label-width="form_label_width">
        <el-input
          v-model="form_part_name_data"
          autocomplete="off"
          :disabled="isDis"
          @input="form_part_name_changed"
        ></el-input>
      </el-form-item>
      <el-form-item label="请输入ip段" :label-width="form_label_width">
        <el-input
          v-model="form_ip_address_section_data"
          autocomplete="off"
          placeholder="格式: '192.168.130.' 注意包含点"
          :disabled="isDis"
          @input="form_ip_address_section_changed"
        ></el-input>
      </el-form-item>
      <el-form-item label="请输入最小ip尾数" :label-width="form_label_width">
        <el-input
          v-model="form_ip_min_data"
          type="number"
          min="1"
          max="254"
          :disabled="isDis"
          @input="form_ip_min_changed"
        ></el-input>
      </el-form-item>
      <el-form-item label="请输入最大ip尾数" :label-width="form_label_width">
        <el-input
          v-model="form_ip_max_data"
          type="number"
          min="1"
          max="254"
          :disabled="isDis"
          @input="form_ip_max_changed"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button class="alertButton" @click="clickCancel">取 消</el-button>
      <el-button class="alertButton" type="primary" @click="clickOk"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: [
    "clickOk",
    "clickCancel",
    "visibleSync",
    "form_department_name", //初始化值
    "form_part_name",
    "form_ip_address_section",
    "form_label_width",
    "form_ip_min",
    "form_ip_max",
    "title",
    "formData",
    "isDis",
  ],
  model: {
    prop: "form_department_name",
    //这个事件名可以随意写，它实际上是规定了子组件要更新父组件值需要注册的方法
    event: "update_department_name",
  },
  data() {
    return {
      vis: false,
      form_department_name_data: "",
      form_part_name_data: "",
      form_ip_address_section_data: "",
      form_ip_min_data: "",
      form_ip_max_data: "",
    };
  },
  methods: {
    form_department_name_changed() {
      // console.log("change", this.form_department_name_data);
      this.$emit("update_department_name", this.form_department_name_data);
    },
    form_part_name_changed() {
      // console.log("change", this.form_part_name_data);
      this.$emit("update:form_part_name", this.form_part_name_data);
    },
    form_ip_address_section_changed() {
      this.$emit(
        "update:form_ip_address_section",
        this.form_ip_address_section_data
      );
    },
    form_ip_min_changed() {
      this.$emit("update:form_ip_min", this.form_ip_min_data);
    },
    form_ip_max_changed() {
      this.$emit("update:form_ip_max", this.form_ip_max_data);
    },
    open_dialog() {
      this.form_department_name_data = this.form_department_name;
      this.form_part_name_data = this.form_part_name;
      this.form_ip_address_section_data = this.form_ip_address_section;
      this.form_ip_min_data = this.form_ip_min;
      this.form_ip_max_data = this.form_ip_max;
    },
  },

  watch: {
    visibleSync(newValue, oldValue) {
      console.log(oldValue);
      this.vis = newValue;
    },
    form_ip_min_data(newValue) {
      if (newValue < 1) {
        this.form_ip_min_data = 1;
      }
      if (newValue > 253) {
        this.form_ip_min_data = 253;
      }
    },
    form_ip_max_data(newValue) {
      if (newValue < 1) {
        this.form_ip_max_data = 1;
      }
      if (newValue > 254) {
        this.form_ip_max_data = 254;
      }
    },
  },
};
</script>