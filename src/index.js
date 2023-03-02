import { plateform } from "./utils/platform.js";
import fileHandler from "./utils/fileHandler.js";
import ipFetch from "./utils/ipFecth.js";
import { checkAll } from "./utils/checkIps.js";


export default async function(){
  try{
    if(!fileHandler[plateform]){
      console.error("不支持的操作系统");
      return;
    }
    
    let ips = await ipFetch();
    console.log("获取可用ip数量",ips.length);
    let values = await checkAll(ips);
    const [fast] = values;

    // 检查可用性
    if(fast.error){
      console.error("所有 IP 都不可用，请注意，以下是验证结果");
      console.error(JSON.stringify(values,null,4));
      return;
    }

    console.log(`优质ip: ${fast.ip}; 延迟: ${fast.value}`);

    console.log("开始更新 host 文件");
    await fileHandler[plateform](fast.ip);

    console.log("更新成功");

  }catch(e){
    console.error(e);
  }
}