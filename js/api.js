const getTransactions = async (address, chainid = 43114) => {
  return await fetch(
    `https://api.routescan.io/v2/network/mainnet/evm/${chainid}/etherscan/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10000&sort=asc&apikey=YourApiKeyToken`
  )
    .then((res) => res.json())
    .catch((err) => null);
};

const getTokenPrice = async (tokenId) => {
  const price = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=avalanche-2&vs_currencies=usd"
  )
    .then((res) => res.json())
    .catch((err) => null);
  return price[tokenId] ? price[tokenId].usd : 0;
};
