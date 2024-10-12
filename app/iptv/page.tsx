'use client';
import { iptv } from "../../lib/iptv"

export default function Page() {
  const gotoFmtAction = async () => {
    console.log("----")
    // iptv.readAndFmtM3u3("/Users/lxthyme/Downloads/iptv-source/m3u/all.m3u")
    iptv.readAndFmtM3u3("./public/iptv_file/m3u/all.m3u")
  }
  return (<div>
      <button id="fmt_iptv" onClick={gotoFmtAction}>
        format
      </button>
      </div>)
}
