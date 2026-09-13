export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).json({ status: 'NeftyBot V3 Ready - Use POST' });
  }
  try {
    const { action, symbol, quantity } = req.body || {};
    const orderAction = (action || 'BUY').toUpperCase();
    const orderSymbol = symbol || 'NIFTY';
    const orderQty = quantity || 50;
    const DHAN_CLIENT_ID = process.env.DHAN_CLIENT_ID || '1113333377';
    const DHAN_TOKEN = process.env.DHAN_TOKEN || '';
    if (!DHAN_TOKEN) {
      return res.status(500).json({ error: 'DHAN_TOKEN not set in Vercel Env' });
    }
    const dhanRes = await fetch('https://api.dhan.co/v2/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access-token': DHAN_TOKEN,
        'client-id': DHAN_CLIENT_ID
      },
      body: JSON.stringify({
        transactionType: orderAction,
        exchangeSegment: 'NSE_FNO',
        productType: 'INTRADAY',
        orderType: 'MARKET',
        validity: 'DAY',
        tradingSymbol: orderSymbol,
        securityId: '0',
        quantity: orderQty,
        price: 0
      })
    });
    const data = await dhanRes.json();
    return res.status(200).json({ status: 'Order Sent', action: orderAction, dhanResponse: data });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
