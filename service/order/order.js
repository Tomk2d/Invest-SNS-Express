const ApplicationError = require("../../util/error/applicationError");
const uuid = require("uuid");

const postOrder = async (
  ownedShare,
  buyOrSell,
  price,
  quantity,
  user,
  client
) => {
  try {
    const orderId = uuid.v4();
    const currentTime = new Date();
    const key = `${ownedShare}:${buyOrSell}:${price}:${orderId}`;
    const value = JSON.stringify({ user, quantity, time: currentTime });

    const response = await client.set(key, value);

    return response;
  } catch (err) {
    throw new ApplicationError(400, "주문을 저장할 수 없습니다");
  }
};

module.exports = { postOrder };
