import fs from 'fs'
import path from 'path'
import { iptv } from "../../lib/iptv"

const readFile = (file) => {
  console.log('-->file: ', file)
  console.log('-->cwd: ', process.cwd())
  const filePath = path.join(process.cwd(), './public/iptv_file/', file);
  console.log('-->filePath: ', filePath)
  return fs.readFileSync(filePath, 'utf-8');
}

const fmtContent = (data) => {
  return iptv.fmtM3u3(result)
}

const readAllFile = (fmt) => {
  const m3uList = ['all.m3u', 'cn_c.m3u', 'cn_n.m3u', 'cn_p.m3u', 'cn.m3u', 'cymz6_lives.m3u', 'fmml_dv6.m3u', 'fmml_ipv6.m3u', 'j_home.m3u', 'j_iptv.m3u', 'o_all.m3u', 'o_cn.m3u', 'o_s_cn_112114.m3u', 'o_s_cn_cctv.m3u', 'o_s_cn_cgtn.m3u', 'o_s_cn.m3u', 'q_bj_iptv_mobile_m.m3u', 'q_bj_iptv_mobile.m3u', 'q_bj_iptv_unicom_m.m3u', 'q_bj_iptv_unicom.m3u', 'y_g.m3u', 'ycl_iptv.m3u']

  const txtList = ['cn_c.txt', 'all.txt', 'cn_n.txt', 'cn_p.txt', 'cn.txt', 'cymz6_lives.txt', 'fmml_dv6.txt', 'fmml_ipv6.txt', 'j_home.txt', 'j_iptv.txt', 'o_all.txt', 'o_cn.txt', 'o_s_cn_112114.txt', 'o_s_cn_cctv.txt', 'o_s_cn_cgtn.txt', 'o_s_cn.txt', 'q_bj_iptv_mobile_m.txt', 'q_bj_iptv_mobile.txt', 'q_bj_iptv_unicom_m.txt', 'q_bj_iptv_unicom.txt', 'y_g.txt', 'ycl_iptv.txt']

  const m3uResult = {}
  const txtResult = {}
  m3uList.forEach(t => {
    const data = readFile(`m3u/${t}`)
    if (fmt) {
      m3uResult[t] = iptv.fmtM3u3(data)
    } else {
      m3uResult[t] = data
    }
  })
  txtList.forEach(t => {
    const data = readFile(`txt/${t}`)
    if (fmt) {
      txtResult[t] = iptv.fmtTxt(data)
    } else {
      txtResult[t] = data
    }
  })

  return {
    m3u: m3uResult,
    txt: txtResult,
  }
}

const fmtAllContent = (data) => {
  const obj1 = {}
  const obj2 = {}
  const list = []
  const all = Object.values(data.m3u).flat()
  // const all = data.m3u['all.m3u']
  Object.values(all).forEach(t => {
    if (t.suffix) {
      obj1[t.suffix] = [...(obj1[t.suffix] ?? []), t]
    } else if (t.origin) {
      obj2[t.origin] = [...(obj2[t.origin] ?? []), t]
    } else {
      list.push(t)
    }
  })

  // Object.values(obj).filter(t => t.length > 1)
  return { obj1, obj2, list }
}

const API = (req, res) => {
  const { file, fmt } = req.query

  // const m3u = {}
  // const txt = {}
  // const data = readFile(file)
  // const fmt = iptv.fmtM3u3(data)
  // m3u['all.m3u'] = fmt
  let result = readAllFile(fmt)
  result = fmtAllContent(result)

  // res.status(200).json({ result: { m3u, txt } });
  res.status(200).json({ result });

  return new Promise(function (resolve) {
    setTimeout(resolve.bind(null, resolve), 1000)
  })
    .then(() => {
      res.status(200).json(data)
    })
}

export default API

const mockData = {}
