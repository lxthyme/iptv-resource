import fs from 'fs'
import path from 'path'
import { iptv } from "../../lib/iptv"

const API = async (req, res) => {
  try {
    const { file, fmt, type = 'merge' } = req.query

    let result = await iptv.readAllFile(fmt)
    if (fmt == 1) {
      result = iptv.fmtAllContent(result, type)
    }

    return new Promise(function (resolve) {
      setTimeout(resolve.bind(null, resolve), 1000)
    })
      .then(() => {
        // res.status(200).json({ result: { m3u, txt } });
        res.status(200).json({ result });
      })
  } catch (e) {
    res.status(200).json({
      query: res.query ?? {}
    })
  }
}

export default API

const mockData = {}
