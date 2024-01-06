const main = async (address) => {
  const transactions = await getTransactions(address);
  console.log(transactions.result);
  if (!transactions || transactions.status !== "1") {
    $("#fees_box").html(
      "<p>Oops we can't fetch the data. Please try again or retry later.</p>"
    );
    return;
  }
  let total_fees = 0;
  let total_fees_failed = { number: 0, gas: 0 };
  transactions.result.forEach((el) => {
    // if (el.gasPrice < 10 ** 12) {
    //   total_fees += (el.gasPrice * el.gasUsed) / 1e18;
    // }
    total_fees += (el.gasPrice * el.gasUsed) / 1e18;
    if (el.isError === "1") {
      console.log(el);
      total_fees_failed.number++;
      total_fees_failed.gas += (el.gasPrice * el.gasUsed) / 1e18;
    }
  });
  const avax_price = await getTokenPrice("avalanche-2");
  // await fillTransactionsTable(transactions.data)
  // await fillWalletTable(address)
  $(".total_fees").html(
    ` <b>${total_fees.toFixed(2)} AVAX</b> for ${
      transactions.result.length
    } transactions - <b>$${(total_fees * avax_price).toFixed(2)}*</b>`
  );
  $(".total_failed").html(
    ` ${total_fees_failed.number} failed for ${total_fees_failed.gas.toFixed(
      2
    )} AVAX`
  );
  $(".price").html(` $${avax_price}`);
  $("#download").html(
    '<button type="button" class="nes-btn is-primary" onclick="onDownload()">Download my transaction history</button>'
  );
};

window.addEventListener("load", async () => {
  $(".infos_topic").html(
    '<h2>fetching tokens<span class="loading"></span></h2>'
  );
  /*
    ARC20TOKENS = await getARC20Tokens();
    if (!ARC20TOKENS || ARC20TOKENS.error) {
        console.log('error fatal')
        $(".infos_topic").html('<h2>FATAL ERROR: we can\'t retrieve tokens from Covalent API :(</h2>')
        return
    }*/
  $(".infos_topic").html(
    '<h2>Connecting to Metamask<span class="loading"></span></h2>'
  );
  const params = getUrlVars();
  let address = params.address || params.a || null;
  if (!address) {
    console.log(window.hasOwnProperty("ethereum"));
    if (
      window.hasOwnProperty("ethereum") &&
      window.ethereum.hasOwnProperty("isMetaMask")
    ) {
      const addresses = await ethereum.request({
        method: "eth_requestAccounts",
      });
      address = addresses[0];
    } else {
      $(".infos_topic").html(
        '<h2>Oops you need to install <a target="_blank" href="https://metamask.io/">MetaMask</a> before!</h2><br><p>Or add an argument in the url like that: ?a=YOUR_ADDRESS</p>'
      );
      $(".address_section").html(
        '<br/><p>you can try an example <a href="https://0xarkin.github.io/avax-fees/?a=0xC35D1124f56EEbf9E727C04fc678191D02df9A09">here</a> (random address)</p>'
      );
      $(".wallet_topic").html("");
      $(".tokens_topic").html("");
      return;
    }
  }
  $(".infos_topic").html("");
  $(".address_section").html(
    `<br/><p>Connected to <span id="address"><b>${address}</b></span></p>`
  );
  $(".menu_topic").css("display", "block");
  $(".fees_topic").css("display", "block");
  await main(address);
  $(".loading").css("display", "none");
  $(".warning_loading").css("display", "none");
  $("#fees_box").css("display", "block");
});
