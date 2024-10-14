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

const API = (req, res) => {
  const { file, fmt } = req.query

  const data = readFile(file)
  let fmt_data = ''
  if (fmt == 1) {
    if (file.includes('m3u')) {
      fmt_data = iptv.fmtM3u3(data)
    } else if (file.includes('txt')) {
      fmt_data = iptv.fmtTxt(data)
    }
  }

  res.status(200).json({ file, fmt, result: { data, fmt_data } });

  return new Promise(function (resolve) {
    setTimeout(resolve.bind(null, resolve), 1000)
  })
    .then(() => {
      res.status(200).json(data)
    })
}

export default API

const mockData = {}
