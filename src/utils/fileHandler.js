import {win32HostPath, hostName} from "../constant.js";
import {readFile, writeFile} from "node:fs/promises";

export default new class {
  constructor(){

  }

  async win32(ip){
    const text = await readFile(win32HostPath, { encoding: 'utf8' });
    const lists = text.split("\n");
    const index = lists.findIndex(item=>{
      const tmpv  = item.trim().replace(/#.*/, '');
      if(tmpv.indexOf(hostName)>-1){
        return true
      }
      return false;
    });
    if(index >= 0){
      // 存在
      lists[index] = `${ip}  ${hostName}`;
    }else{
      // 不存在
      lists.push(`${ip}  ${hostName}`)
    }

    const data = new Uint8Array(Buffer.from(lists.join("\n")));
    try{
      await writeFile(win32HostPath, data);
    }catch(e){
      if(e.code === `EPERM`){
        console.error("写 hosts 失败，权限不足，请使用管理员权限运行");
      }
      throw e;
    }
  }
}