<template>
  <div class="ListPage">
    <el-checkbox v-model="isAll" border class="addBt" @change="changeCheck"
      >所有科室</el-checkbox
    >
    <el-select
      v-model="valueDepartment"
      @change="departmentfnEdit"
      placeholder="请选择科室"
      :disabled="disabledDepartment"
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
      :disabled="disabledPart"
    >
      <el-option
        v-for="item in Parts"
        :key="item.part_id"
        :label="item.part_name"
        :value="item.part_id"
      ></el-option>
    </el-select>
    <el-button
      plain
      class="addBt"
      @click="editDepartmentDialogFormVisible = true"
      :style="{ display: visibleAlertDepartment }"
      >修改科室</el-button
    >
    <el-button
      plain
      class="addBt"
      @click="editPartDialogFormVisible = true"
      :style="{ display: visibleAlertPart }"
      >修改部门</el-button
    >
    <el-button plain class="addBt" @click="showAddDialog"
      >增加科室部门</el-button
    >
    <el-button plain class="addBt" @click="returnMain">返回主页面</el-button>

    <part-dialog
      :formData="form"
      :clickOk="submitAddForm"
      :clickCancel="cancelAddForm"
      :visibleSync="addFormVisible"
      v-model="form.department_name"
      :form_part_name.sync="form.part_name"
      :form_ip_address_section.sync="form.ip_address_section"
      :form_label_width="formLabelWidth"
      :form_ip_min.sync="form.ip_min"
      :form_ip_max.sync="form.ip_max"
      :isDis="false"
      title="增加科室部门"
    />

    <part-dialog
      :formData="form"
      :clickOk="submitEditDepartmentForm"
      :clickCancel="cancelEditDepartmentForm"
      :visibleSync="editDepartmentDialogFormVisible"
      v-model="form.department_name"
      form_part_name="-"
      form_ip_address_section="-"
      :form_label_width="formLabelWidth"
      form_ip_min="0"
      form_ip_max="0"
      :isDis="true"
      title="修改科室"
    />

    <part-dialog
      :formData="form"
      :clickOk="submitEditPartForm"
      :clickCancel="cancelEditPartForm"
      :visibleSync="editPartDialogFormVisible"
      v-model="form.department_name"
      :form_part_name.sync="form.part_name"
      :form_ip_address_section.sync="form.ip_address_section"
      :form_label_width="formLabelWidth"
      :form_ip_min.sync="form.ip_min"
      :form_ip_max.sync="form.ip_max"
      :isDis="false"
      title="修改部门"
    />

    <ipdata-dialog
      :visibleSync.sync="editIpdataVisible"
      v-model="ipDataFrom"
      title="修改记录"
    />

    <div class="table">
      <el-table :data="tempList" style="width: 100%" :height="dialog_height">
        <el-table-column label="科室" width="180" align="center">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{
              scope.row.department_name
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="部门" width="180" align="center">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.part_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="位置" width="180" align="center">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.location }}</span>
          </template>
        </el-table-column>
        <el-table-column label="IP地址" width="180" align="center">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.ipAddress }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Mac地址" width="180" align="center">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.macAddress }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="paginationClass">
        <el-pagination
          @size-change="handleSizeChange1"
          @current-change="handleCurrentChange1"
          :current-page="currentPage1"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="this.tableData.length"
          :hide-on-single-page="true"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import partDialog from "./dialogs/part-dialog.vue";
import ipdataDialog from "./dialogs/ipdata-dialog.vue";
import qs from "qs";

export default {
  components: { partDialog, ipdataDialog },
  name: "ListPage",
  props: {},
  data() {
    return {
      dialog_height: 260,
      //分页参数
      total1: 0,
      currentPage1: 1,
      pageSize: 10,

      //数据参数
      departments: [],
      valueDepartment: "",
      Parts: [],
      valuePart: "",
      form: {
        mac: "校验格式",
        department_name: "",
        part_name: "",
        ip_address_section: "",
        ip_min: 1,
        ip_max: 254,
      },
      ipDataFrom: {
        mac_address: "校验格式",
        ip_address_section: "",
        ip_address_end: 0,
        location: "",
      },
      editDepartmentDialogFormVisible: false,
      editPartDialogFormVisible: false,
      editIpdataVisible: false,
      addFormVisible: false,
      formLabelWidth: "150px",
      tableData: [],
      tempList: [],
      isAll: false,
      disabledDepartment: false,
      disabledPart: false,
      visibleAlertDepartment: "none", // "none"隐藏,""显示
      visibleAlertPart: "none",
      temp_department_name: "",
    };
  },
  methods: {
    //分页方法
    handleSizeChange1: function (pageSize) {
      // 每页条数切换
      this.pageSize = pageSize;
      this.handleCurrentChange1(this.currentPage1);
    },
    handleCurrentChange1: function (currentPage) {
      //页码切换
      this.currentPage1 = currentPage;
      this.currentChangePage(this.tableData, currentPage);
    },
    currentChangePage(list, currentPage) {
      //console.log("触发了currentChangePage");
      let from = (currentPage - 1) * this.pageSize;
      let to = currentPage * this.pageSize;
      this.tempList = [];
      for (; from < to; from++) {
        if (list[from]) {
          this.tempList.push(list[from]);
        }
      }
    },

    //数据方法
    init_all() {
      this.initView();
      this.initDatas();
      this.tableData = [];
      this.isAll = false;
    },
    showAddDialog() {
      this.addFormVisible = true;
    },
    handleEdit(index, row) {
      //console.log(index, row);
      this.ipDataFrom.location = row.location;
      this.ipDataFrom.mac_address = row.macAddress;
      this.ipDataFrom.ip_address_section = row.ipAddress.substring(
        0,
        row.ipAddress.lastIndexOf(".") + 1
      );
      this.ipDataFrom.ip_address_end = row.ipAddress.substring(
        row.ipAddress.lastIndexOf(".") + 1
      );
      this.editIpdataVisible = true;
    },

    //删除记录
    handleDelete(index, row) {
      //console.log(row.ipAddress.substring(row.ipAddress.lastIndexOf(".") + 1));
      this.$confirm("此操作将永久删除记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http
            .post(
              "/datas/del_data",
              qs.stringify({
                part_id: row.part_id,
                ip_address_section: row.ipAddress.substring(
                  row.ipAddress.lastIndexOf(".") + 1
                ),
              }),
              {
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
              }
            )
            .then((res) => {
              //console.log("收到服务器返回 del_part ：", res.data);
              if (res.data > 0) {
                this.$message({
                  message: "删除成功！！ ",
                  type: "success",
                  offset: 200,
                });
      this.init_all();
              } else {
                this.$message({
                  message: "服务器删除数据失败 ",
                  type: "error",
                  offset: 200,
                });
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
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
      //console.log(index, row);
    },
    returnMain() {
      this.$router.replace("/mainPage");
    },
    initDatas() {
      this.$http
        .get("/datas/get_department")
        .then((res) => {
          //console.log("收到服务器返回  ：", res.data);
          // //console.log("length:"+res.data.name.length);
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
      this.visibleAlertDepartment = "";
      //console.log("vId:", vId, "departments:", this.departments);
      this.valuePart = "";
      let cur_department;
      for (let i in this.departments) {
        if (this.departments[i].department_id == vId) {
          cur_department = this.departments[i];
          break;
        }
      }

      this.Parts = cur_department.department_parts;
      this.form.department_name = cur_department.department_name;
    },
    partfnEdit(vId) {
      this.visibleAlertPart = "";
      this.$http
        .get("/datas/get_manage_datas", { params: { part_id: vId } })
        .then((res) => {
          //console.log("收到服务器返回  get_manage_datas", res.data);
          this.tableData = res.data;
        })
        .catch(() => {
          return false;
        });
      for (var i = 0; i < this.Parts.length; i++) {
        if (this.Parts[i].part_id == vId) {
          this.form.part_name = this.Parts[i].part_name;
        }
      }
    },
    initView() {
      this.valueDepartment = "";
      this.valuePart = "";
      this.visibleAlertDepartment = "none";
      this.visibleAlertPart = "none";
    },
    changeCheck(v) {
      this.initView();

      if (v) {
        this.disabledDepartment = true;
        this.disabledPart = true;
        this.partfnEdit(-1); //代表所有科室
      } else {
        this.disabledDepartment = false;
        this.disabledPart = false;
        this.tableData = [];
      }
    },
    async checkForm() {
      //检查ip段格式
      var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.$/;
      if (!reg.test(this.form.ip_address_section)) {
        this.$message({
          message:
            "你输入的ip段格式不对，正确格式为：192.168.1.  ,注意最后一位为点",
          type: "error",
          offset: 200,
        });
        return false;
      }

      var isSuccess = true;
      //检查科室和部门是否存在
      /*
    首先科室存在，则只向部门表添加，
    若不存在，则先添加科室，再添加部门
    添加部门同时，判断ip段是否重叠，不重叠才可使用
    添加最后需要在ip_locks表添加部门起始ip，lock为0
    */

      await this.$http
        .get("/datas/check_add_part", {
          params: {
            department_name: this.form.department_name,
            part_name: this.form.part_name,
            ip_address_section: this.form.ip_address_section,
            min_ip: this.form.ip_min,
            max_ip: this.form.ip_max,
          },
        })
        .then((res) => {
          //console.log("收到服务器返回  check_add_part", res.data);
          if (res.data == 1) {
            isSuccess = true;
          } else if (res.data == -1) {
            this.$message({
              message: "你添加的科室部门已经存在，请使用修改按钮修改！！！",
              type: "error",
              offset: 200,
            });

            isSuccess = false;
          } else if (res.data == -2) {
            this.$message({
              message:
                "你添加的ip段和最大最小值出现重复，请先查看列表中是否有重叠ip地址段！！！",
              type: "error",
              offset: 200,
            });

            isSuccess = false;
          }
        })
        .catch(() => {
          this.$message({
            message:
              "连接服务器失败，请检查网络或者服务器是否正常！请刷新重试请刷新重试！ ",
            type: "error",
            offset: 200,
          });
          isSuccess = false;
        });

      return isSuccess;
    },

    //提交修改科室的请求
    async db_edit_department() {
      let result = await this.$http
        .post(
          "/datas/edit_department",
          qs.stringify({
            department_id: this.valueDepartment,
            department_name: this.form.department_name,
          }),
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        )
        .then((res) => {
          //console.log("收到服务器返回 edit_department ：", res.data);
          if (res.data > 0) {
            return true;
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
      return result;
    },
    async db_edit_part() {
      let result = await this.$http
        .post(
          "/datas/edit_part",
          qs.stringify({
            part_id: this.valuePart,
            part_name: this.form.part_name,
            ip_address_section: this.form.ip_address_section,
            ip_min: this.form.ip_min,
            ip_max: this.form.ip_max,
          }),
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        )
        .then((res) => {
          // //console.log("收到服务器返回 edit_part ：", res.data);
          if (res.data > 0) {
            this.$message({
              message: "更新数据成功 !!",
              type: "success",
              offset: 200,
            });
            return true;
          } else if (res.data == -1) {
            this.$message({
              message: "同部门下已经存在相同名称，请修改!!!",
              type: "error",
              offset: 200,
            });
            return false;
          } else if (res.data == -2) {
            this.$message({
              message: "IP范围出现重叠，请修改!!!",
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
      return result;
    },
    async submitAddForm() {
      let result = await this.checkForm();
      if (!result) {
        return;
      }
      this.initDatas();
      this.initView();
      this.addFormVisible = false;
    },
    async submitEditDepartmentForm() {
      let result = await this.db_edit_department();
      if (result < 1) {
        this.$message({
          message: "服务器修改数据失败！ ",
          type: "error",
          offset: 200,
        });
      }
      this.initDatas();
      this.initView();
      this.editDepartmentDialogFormVisible = false;
    },
    async submitEditPartForm() {
      //检查ip段格式
      var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.$/;
      if (!reg.test(this.form.ip_address_section)) {
        this.$message({
          message:
            "你输入的ip段格式不对，正确格式为：192.168.1.  ,注意最后一位为点",
          type: "error",
          offset: 200,
        });
        return false;
      }
      let result = await this.db_edit_part();
      if (!result) {
        return;
      }
      this.initDatas();
      this.initView();
      this.editPartDialogFormVisible = false;
    },

    cancelAddForm() {
      this.addFormVisible = false;
    },
    cancelEditDepartmentForm() {
      this.editDepartmentDialogFormVisible = false;
    },
    cancelEditPartForm() {
      this.editPartDialogFormVisible = false;
    },
  },

  created: function () {
    // //console.log("ListPage Create!!");
    this.initDatas();
  },
  computed: {
    get_part_name: function () {
      return this.form.part_name;
    },
  },
  watch: {
    tableData: {
      //深度监听，可监听到对象、数组的变化
      handler() {
        this.currentChangePage(this.tableData, this.currentPage1);
        if (this.tableData.length > 5) {
          this.dialog_height = 400;
        } else {
          this.dialog_height = 260;
        }
      },
      deep: true, //true 深度监听
    },
    // get_part_name: {
    //   handler: function () {
    //     //console.log(this.form.part_name);
    //   },

    // },
    form: {
      handler: function () {
        //console.log(this.form.part_name);
        //console.log(this.form.department_name);
        //console.log(this.form.ip_address_section);
        //console.log(this.form.ip_min);
        //console.log(this.form.ip_max);
      },
      deep: true, //true 深度监听
    },
  },
};
</script>

<style scope>
.ListPage {
  margin-top: 10px;
}
.addBt {
  border: 2px solid #dcdfe6;
  color: white;
  background: transparent;
  box-shadow: 10px 10px 5px #35333365;
  margin-left: 30px;
}
.table {
  padding: 3%;
}
.paginationClass {
  font-size: 3em;
}
.el-checkbox__input.is-checked + .el-checkbox__label {
  color: white;
}
.el-checkbox.is-bordered.is-checked {
  border-color: white;
}
.el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #169bd5;
}
.el-pagination__jump .el-input__inner {
  margin-left: auto;
}
.el-button + .el-button {
  margin-left: 20px;
}
</style>