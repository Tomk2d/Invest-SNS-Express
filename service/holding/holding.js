const Holding = require("../../model/Holding");

async function updateBuyHolding(user, code, price, quantity) {
  try {
    let holding = await Holding.findOne({ user: user });

    const stockIndex = holding.stocks.findIndex((stock) => stock.code === code);
    if (stockIndex === -1) {
      holding.stocks.push({
        code: code,
        price: price,
        quantity: quantity,
      });
      holding.balance -= price * quantity;
    } else {
      const existingStock = holding.stocks[stockIndex];
      const updatedQuantity = existingStock.quantity + quantity;
      const updatedPrice = Math.floor(
        (existingStock.price * existingStock.quantity + price * quantity) /
          updatedQuantity
      );
      holding.stocks[stockIndex].quantity = updatedQuantity;
      holding.stocks[stockIndex].price = updatedPrice;
      holding.balance -= price * quantity;
    }

    await holding.save();
  } catch (error) {
    console.error("Error while processing stock codes:", error);
  }
}

async function updateSellHolding(user, code, price, quantity) {
  try {
    let holding = await Holding.findOne({ user: user });

    if (!holding) {
      return;
    }

    const stockIndex = holding.stocks.findIndex((stock) => stock.code === code);
    if (stockIndex === -1) {
      return;
    }

    const existingStock = holding.stocks[stockIndex];
    const updatedQuantity = existingStock.quantity - quantity;
    holding.stocks[stockIndex].quantity = updatedQuantity;
    holding.balance += price * quantity;

    await holding.save();
  } catch (error) {
    console.error("Error while processing stock codes:", error);
  }
}

module.exports = { updateBuyHolding, updateSellHolding };
