// const fs = require('fs');
import fs from 'fs'
// import { readFile } from 'fs/promises'
// var fs = require('fs')
// import fse from 'fs-extra/esm'

const sdk = (() => {
  const fmtM3u3 = (a) => {
    const b = a.split('\n')
      // .slice(1, 2)
      // .map(t => t.split(' '))
      .map(t1 => {
        const tmp = t1.split(',')
        const tmp1 = tmp.splice(0, 1)[0].split(' ')
        const suffix = tmp.splice(0, 1)[0]
        let exitnf = ''
        const obj = {}
        const list = []
        tmp1.forEach(t2 => {
          if (t2.includes('=')) {
            // return t2.split('=')
            const tmp = t2.split('=')
            const k = tmp[0]
            const v = tmp[1]
            try {
              obj[k] = JSON.parse(v)
            } catch {
              console.log(`-->v: \(v)`)
              obj[k] = v
            }
          } else if (t2.startsWith('#EXTINF:')) {
            exitnf = t2
          } else {
            list.push(t2)
          }
        })
        const result = {
          exitnf,
          suffix,
          obj,
          list,
          origin: t1,
          origin_list: tmp1,
        }
        if (tmp.length > 0) {
          console.log(`extra tmp = ${tmp}`)
          obj['extra'] = tmp
        }
        return result
      })

    return b
    // return JSON.stringify(b)//.replaceAll('\\"', '\"')
  }
  const fmtTxt = a2 => {
    const b = a2.split('\n')
      // .slice(-14, -12)
      .map(t => {
        const tmp = t.split(',')
        const prefix = tmp.splice(0, 1)[0]
        const url = tmp.splice(0, 1)[0]
        let m3u8 = ''
        let prefix_fmt = {}
        if (tmp.length == 1) {
          m3u8 = tmp.splice(0, 1)[0]

          const tmp2 = prefix
            .replaceAll('\"_', '\"||_')
            .split('||')
          const extra = []
          tmp2.forEach(t2 => {
            if (t2.includes('=')) {
              // return t2.split('=')
              const tmp3 = t2.split('=')
              const k = tmp3[0]
              const v = tmp3[1]
              try {
                prefix_fmt[k] = JSON.parse(v)
              } catch {
                console.log(`-->v: ${v}`)
                prefix_fmt[k] = v
              }
            } else {
              extra.push(t2)
            }
          })
          prefix_fmt['extra'] = extra
        }
        if (tmp.length > 0) {
          const obj = {
            t, tmp, prefix, url
          }
          console.log(`extra t: `, obj)
        }
        const obj = {
          // prefix: JSON.stringify(prefix),
          prefix,
          url,
          extra: tmp
        }
        if (m3u8) {
          obj['m3u8'] = m3u8
        }
        if (Object.keys(prefix_fmt).length > 0) {
          obj['prefix_fmt'] = prefix_fmt
        }
        return obj
      })
    // .filter(t => Object.keys(t).length != 3)
    return b
    // return JSON.stringify(b)
    // .replaceAll('\\"', '\"')
  }
  const readFile = async (path, fmt = 0) => {
    const response = await fetch(`http://localhost:3000/api/readFile?fmt=${fmt}&file=${path}`, { method: 'get' });
    const data = await response.json();
    // console.log(data.content);
    return data?.['result']?.['data']
  }
  const readAndFmtM3u3 = async (path) => {
    const data = await readFile(path)
    const result = fmtM3u3(data)
    const json = JSON.stringify(result)
    console.log('-->result: ', result)
    console.log('-->json: ', json)
    navigator.clipboard.write(json)
  }

  const readAllFile = async (fmt) => {
    const m3uList = [
      // 'all.m3u', 'cn_c.m3u', 'cn_n.m3u', 'cn_p.m3u', 'cn.m3u', 'cymz6_lives.m3u', 'fmml_dv6.m3u', 'fmml_ipv6.m3u', 'j_home.m3u', 'j_iptv.m3u', 'o_all.m3u', 'o_cn.m3u', 'o_s_cn_112114.m3u', 'o_s_cn_cctv.m3u', 'o_s_cn_cgtn.m3u', 'o_s_cn.m3u', 'q_bj_iptv_mobile_m.m3u', 'q_bj_iptv_mobile.m3u', 'q_bj_iptv_unicom_m.m3u', 'q_bj_iptv_unicom.m3u', 'y_g.m3u',
      'ycl_iptv.m3u'
    ]

    const txtList = [
      // 'cn_c.txt', 'all.txt', 'cn_n.txt', 'cn_p.txt', 'cn.txt', 'cymz6_lives.txt', 'fmml_dv6.txt', 'fmml_ipv6.txt', 'j_home.txt', 'j_iptv.txt', 'o_all.txt', 'o_cn.txt', 'o_s_cn_112114.txt', 'o_s_cn_cctv.txt', 'o_s_cn_cgtn.txt', 'o_s_cn.txt', 'q_bj_iptv_mobile_m.txt', 'q_bj_iptv_mobile.txt', 'q_bj_iptv_unicom_m.txt', 'q_bj_iptv_unicom.txt', 'y_g.txt',
      'ycl_iptv.txt'
    ]

    const m3uResult = {}
    const txtResult = {}
    try {
      // m3uList.forEach(async t => {
      // for(const t in m3uList) {
      for (let idx = 0; idx < m3uList.length; idx++) {
        const t = m3uList[idx]
        const data = await readFile(`m3u/${t}`)
        if (fmt == 1) {
          m3uResult[t] = iptv.fmtM3u3(data)
        } else {
          m3uResult[t] = data
        }
      }
    } catch (e) {
      console.error('-->error: ', e)
    }
    try {
      // txtList.forEach(async t => {
      // for(const t in txtList) {
      for (let idx = 0; idx < txtList.length; idx++) {
        const t = txtList[idx]
        const data = await readFile(`txt/${t}`)
        if (fmt == 1) {
          txtResult[t] = iptv.fmtTxt(data)
        } else {
          txtResult[t] = data
        }
      }
    } catch (e) {
      console.error('-->error: ', e)
    }

    return {
      m3u: m3uResult,
      txt: txtResult,
    }
  }

  const fmtAllContent = (data, type) => {
    const __fmt = (all) => {
      const obj1 = {}
      const obj2 = {}
      const list = []

      Object.values(all).forEach(t => {
        if (t.suffix) {
          obj1[t.suffix] = [...(obj1[t.suffix] ?? []), t]
        } else if (t.origin) {
          obj2[t.origin] = [...(obj2[t.origin] ?? []), t]
        } else {
          list.push(t)
        }
      })
      return { obj1, obj2, list }
    }
    if (type == 'merge') {
      const m3u = Object.values(data.m3u).flat()
      const txt = Object.values(data.txt).flat()
      const fmt_m3u = __fmt(m3u)
      const fmt_txt = __fmt(txt)
      return { m3u: fmt_m3u, txt: fmt_txt }
    } else {
      const obj1 = {}
      const obj2 = {}
      const list = []
      const all = []
      if (type == 'm3u') {
        const list = Object.values(data.m3u).flat()
        all.push(...list)
      } else if (type == 'txt') {
        const list = Object.values(data.txt).flat()
        all.push(...list)
      } else if (type == 'all') {
        const m3u = Object.values(data.m3u).flat()
        const txt = Object.values(data.txt).flat()
        all.push(...m3u)
        all.push(...txt)
      }
      return __fmt(all)
    }
    // const all = data.m3u['all.m3u']


    // Object.values(obj).filter(t => t.length > 1)
    return { obj1, obj2, list }
  }
  return {
    fmtTxt, fmtM3u3, readFile, readAndFmtM3u3,
    readAllFile, fmtAllContent,
  }
})()

export const iptv = sdk
