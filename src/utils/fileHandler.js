import {win32HostPath, macHostPath, hostName} from "../constant.js";
import {readFile, writeFile} from "node:fs/promises";

export default new class {

  async win32(ip) {
    await this.#writeFile(ip, win32HostPath)
  }

  async darwin(ip) {
    await this.#writeFile(ip, macHostPath)
  }

  async #writeFile(ip, path) {
    try {
      const text = await readFile(path, {encoding: 'utf8'});
      const lists = text.split("\n");
      const index = lists.findIndex(item => {
        const tmpv = item.trim().replace(/#.*/, '');
        return tmpv.includes(hostName);
      });
      if (index >= 0) {
        // 存在
        lists[index] = `${ip}  ${hostName}`;
      } else {
        // 不存在
        lists.push(`${ip}  ${hostName}`);
      }
      const data = new Uint8Array(Buffer.from(lists.join("\n")));
      await writeFile(path, data);
    } catch (e) {
      if (e.code === 'EPERM') {
        console.error('写 hosts 失败，权限不足，请使用管理员权限运行');
      } else if (e.code === 'EACCES') {
        console.error('写 hosts 失败，权限不足，请使用sudo权限运行');
      } else {
        console.error(e);
      }
    }
  }
}