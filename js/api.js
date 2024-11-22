const fetchTransactions = async (address, chainid = 43114, page = 1) => {
  const offset = 10000 / page;
  const apiUrl = `https://api.routescan.io/v2/network/mainnet/evm/${chainid}/etherscan/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=${page}&offset=${offset}&sort=asc&apikey=YourApiKeyToken`;
  console.log("fetching transactions", apiUrl);
  try {
    const response = await fetch(apiUrl)
      .then((res) => res.json())
      .catch((err) => null);

    if (!response || response.status !== "1") {
      console.log("error on fetch txs", response);
      return [];
    }
    const transactions = response.result;

    // If there are more transactions, recursively fetch the next page
    if (transactions.length === offset) {
      const nextPageTransactions = await fetchTransactions(
        address,
        chainid,
        page + 1
      )
        .then((res) => res)
        .catch((err) => null);
      return transactions.concat(nextPageTransactions);
    }
    return transactions;
  } catch (error) {
    console.error("Error fetching transactions:", error.message);
    throw error;
  }
};

const getTokenPrice = async (tokenId) => {
  const price = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=avalanche-2&vs_currencies=usd"
  )
    .then((res) => res.json())
    .catch((err) => null);
  return price[tokenId] ? price[tokenId].usd : 0;
};
