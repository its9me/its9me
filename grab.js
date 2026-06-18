(async () => {
  const res = await fetch('https://r.jina.ai/https://medium.com/@awais0x1/discovering-an-sql-injection-with-burps-scanner-41c6c5910d84');
  const text = await res.text();
  console.log(text.substring(0, 15000));
})();
