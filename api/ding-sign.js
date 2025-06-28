const axios = require('axios');
const crypto = require('crypto');

const config = {
  appKey: 'dinghyoiblhw30rmp3h4',
  appSecret: 'G8BfCNyl999WUfXR_pEyQPBcPDkpGmrh09e3Jwu07RGq6scarnPD6JCNkNDdvqgh',
  agentId: '3923763185',
  corpId: 'ding9f4b80a6ddbade5fee0f45d8e4f7c288'
};

let cache = {
  access_token: '',
  jsapi_ticket: '',
  token_time: 0
};

async function getAccessToken() {
  const res = await axios.get('https://oapi.dingtalk.com/gettoken', {
    params: {
      appkey: config.appKey,
      appsecret: config.appSecret
    }
  });
  return res.data.access_token;
}

async function getJsapiTicket(token) {
  const res = await axios.get('https://oapi.dingtalk.com/get_jsapi_ticket', {
    params: {
      access_token: token
    }
  });
  return res.data.ticket;
}

function sign(ticket, nonceStr, timeStamp, url) {
  const plainText = `jsapi_ticket=${ticket}&noncestr=${nonceStr}&timestamp=${timeStamp}&url=${url}`;
  return crypto.createHash('sha1').update(plainText).digest('hex');
}

module.exports = async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      res.status(400).json({ error: 'Missing url param' });
      return;
    }

    const decodedUrl = decodeURIComponent(url);
    const timeStamp = Math.floor(Date.now() / 1000);
    const nonceStr = 'ding-sign-nonce';

    if (!cache.access_token || Date.now() - cache.token_time > 7000 * 1000) {
      cache.access_token = await getAccessToken();
      cache.jsapi_ticket = await getJsapiTicket(cache.access_token);
      cache.token_time = Date.now();
    }

    const signature = sign(cache.jsapi_ticket, nonceStr, timeStamp, decodedUrl);

    res.status(200).json({
      timeStamp,
      nonceStr,
      signature,
      agentId: config.agentId,
      corpId: config.corpId
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
