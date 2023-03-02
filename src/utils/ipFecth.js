import { ipListUrl } from "../constant.js";
import https from "node:https"


/**
 * 获取 ip 列表
 * @returns []String
 */

export default async function ipFetch(){
  let res = await new Promise((resolve,reject)=>{
    https.get(ipListUrl, (res) => {
      const split = [];
      res.on('data', (d)=>{
        split.push(d);
      });
      res.on("end", ()=>{
        resolve(new TextDecoder().decode(Buffer.concat(split)));
      })
    }).on("error",reject)
  });

  return res.split("\n").filter(v=>v.length>0);
}