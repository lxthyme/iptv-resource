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
      .filter(t => Object.keys(t).length != 3)
    return b
    // return JSON.stringify(b)
    // .replaceAll('\\"', '\"')
  }
  const readFile = async (path) => {
    // return new Promise((res, rej) => {
    //   try {
    //     const data = fs.readFileSync(path, 'utf8');
    //     console.log(data);
    //     res(data)
    //     // res('')
    //   } catch (err) {
    //     console.error('read file error: ', { path, err });
    //     rej(error)
    //   }
    // })
    const response = await fetch('/api/readFile', { file: path});
    const data = await response.json();
    console.log(data.content);
  }
  const readAndFmtM3u3 = async (path) => {
    const data = await readFile(path)
    const result = fmtM3u3(data)
    const json = JSON.stringify(result)
    console.log('-->result: ', result)
    console.log('-->json: ', json)
    navigator.clipboard.write(json)
  }
  return {
    fmtTxt, fmtM3u3, readFile, readAndFmtM3u3
  }
})()

export const iptv = sdk
