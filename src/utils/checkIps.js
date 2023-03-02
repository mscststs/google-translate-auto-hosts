import https from "node:https";
import {hostName, validUrl, timeout} from "../constant.js";

export async function checkAll(ips){
  let results = await Promise.all(ips.map(checkOne));
  return results.sort((a,b)=>{
    return a.value - b.value;
  });

}

/**
 * 返回结果
 * @param {*} ip
 */
export async function checkOne(ip){
  try{
    const startTs = Date.now();
    let ts = await new Promise((resolve,reject)=>{
      const req = https.get(
        validUrl.replace(`{ip}`, ip),
        {
          timeout,
          headers: {
            Host: hostName,
          },
          servername: hostName,
        },
        (res) => {
          if(res.statusCode === 200){
            resolve(Date.now());
          }else{
            reject("StatusCode Error:"+ res.statusCode);
          }
        }).on("error",reject)
        .on('timeout', () => {
          reject("Timeout");
          req.destroy()
        });
    });
    // console.log(`${ip} Success, cost ${ts - startTs}`);
    return {
      ip,
      value: ts - startTs,
    }
  }catch(e){
    return {
      ip,
      value: Infinity,
      error:e,
    }
  }
}