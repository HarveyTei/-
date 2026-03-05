(function () {
    const PLUGIN_INFO = JSON.stringify({
        uid: '3a7f2b8c-1d9e-5g6h-7i8j-9k0l1m2n3o4p',
        id: 'lc_vip',
        name: '聆川音源-赞助版',
        version: 'V8.0.1',
        description: '聆川赞助版接口,需要apikey,全音质',
        support: ['tx','wy','mg','kg','kw']
    });
    const list   = ['128k','320k','flac','flac24bit','hires','atmos','master'];
    const names  = ['standard','exhigh','lossless','lossless+','hires','atmos','master'];
    const sources = {
        kw: { qualitys: ['128k','320k','flac','flac24bit','hires'] },
        mg: { qualitys: ['128k','320k','flac','flac24bit','hires'] },
        kg: { qualitys: ['128k','320k','flac','flac24bit','hires','atmos','atmos_plus','master'] },
        tx: { qualitys: ['128k','320k','flac','flac24bit','hires','atmos','atmos_plus','master'] },
        wy: { qualitys: ['128k','320k','flac','flac24bit','hires','atmos','atmos_plus','master'] },
    };
    function pickQuality(source, quality) {
        const supported = sources[source]?.qualitys;
        if (!supported || supported.length === 0) return list[0];
        const idx = names.indexOf(quality);
        const q   = list[idx] || list[0];
        return supported.includes(q) ? q : supported[supported.length - 1];
    }
    async function getMusicUrl(source,id,quality,key="") {
        quality = pickQuality(source,quality);
        const url = `https://lc.guoyue2010.top/api/music/url?source=${source}&songId=${id}&quality=${quality}`;
        const headers = {
            'Content-Type': 'application/json',
            'X-API-Key': key,
            'User-Agent': 'CeruMusic-Plugin/v1'
        };
        try {
            const resultStr = await customFetch(url, { method: 'GET', headers: headers });
            const data = JSON.parse(resultStr);
            return data['url'];
        } catch (error) {
            try {
                return await getMusicUrl(source,id,'exhigh');
            } catch (error) {
                console.log(`解析错误:${error}`);
                throw error;
            }
        }
    }
    globalThis.MusicPlugin = {
        info: PLUGIN_INFO,
        getMusicUrl,
    };
})();