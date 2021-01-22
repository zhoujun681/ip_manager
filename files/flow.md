<!--
 * @Descripttion: 使用ctrl+alt+i添加头部注释，ctrl+alt+t添加方法注释, 或者复制方法名后使用gocm来添加方法注释
 * @version: 
 * @Author: bb
 * @Date: 2020-12-29 13:46:16
 * @LastEditors: bb
 * @LastEditTime: 2020-12-29 15:36:16
-->
语法 https://mermaid-js.github.io/mermaid
## 锁定ip
```mermaid
graph TD
    Click([点击按钮]) --> SelectExist{查询IP是否占用或锁定}
    LockDb[(IpLock)] -. 查询 .-> SelectExist
    SelectExist -- IP被占用 -->  quit[/提示用户并返回\]
    SelectExist -- IP未用-->innertDb[插入锁定数据]  
    innertDb -.插入数据.->LockDb[(IpLock)]
    innertDb  --> ShowWindow[弹出窗口]
    ShowWindow --> close[/关闭窗口\]
    close -.修改lock标志为0.->LockDb
    ShowWindow -->Fill[填写内容]
    Fill --> sub[提交]
    sub -->SelectExist2{查询IP是否仍然锁定}
    LockDb  -. 查询 .-> SelectExist2
    SelectExist2 --否-->quit
    SelectExist2 --是-->innertData[/插入数据\]
    innert
    Data -.插入.->IpDatas[(IpDatas)]
```

## 修改ip数据
```mermaid
graph TD
    Click([点击修改按钮]) -->dialog[弹出窗口]
    dialog-->fillForm[/填写内容\]
    subgraph 填写内容 
    fillForm -..->editPosition[修改地址]
    fillForm -..->editIpAddress[修改IP地址]
    fillForm -..->editMacAddress[修改Mac地址]
    end
    fillForm --> submitForm[提交内容]
    submitForm --提交--> Server([服务端])
    subgraph 服务端 
    Server --> getData[解析请求]
    getData --> checkIp[验证IP地址]
    subgraph 验证IP
    checkIp --> checkIpAddressSection[/IP地址是否已经使用\]
    checkIpAddressSection -.是.->return-1([返回-1])
    checkIpAddressSection -.否.->checkIpOverlap[/Ip地址是否在范围内\]
    checkIpOverlap -.是.->return-2([返回-2])
    checkIpOverlap -.否.->return1([返回1])
    end
    end
```    

## 数据库关系
```mermaid
graph TD
%% 这是注释
subgraph DB:User
User[(User)]
User-->user_id[user_id]
User-->user_name[user_name]
User-->login_name[login_name]
User-->password[password]
end
subgraph DB:department
department[(department)]
department-->department_id[department_id]
department-->department_name[department_name]
end
subgraph DB:part
part[(part)]
part-->part_id[part_id]
part-->part_name[part_name]
part-->part_department_id[department_id]
part-->ip_min[ip_min]
part-->ip_max[ip_max]
part_department_id -..-department_id
end
subgraph DB:ip_datas
ip_datas[(ip_datas)]
ip_datas-->ip_datas_id[ip_datas_id]
ip_datas-->ip_address_end_[ip_address_end]
ip_datas-->ip_datas_part_id[part_id]
ip_datas-->position[position]
ip_datas-->mac_address[mac_address]
ip_datas_part_id -..-part_id
end
subgraph DB:ip_locks
ip_locks[(ip_locks)]
ip_locks-->ip_locks_id[ip_locks_id]
ip_locks-->ip_locks_ip_address_end_[ip_address_end]
ip_locks-->ip_locks_part_id[part_id]
ip_locks-->lock[lock]
ip_locks_ip_address_end_ -..- ip_address_end_
ip_locks_part_id-..-ip_datas_part_id
end

```