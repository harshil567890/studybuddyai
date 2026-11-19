const Razorpay = require("razorpay");

function getInstance() {
  if (process.env.RAZORPAY_KEY && process.env.RAZORPAY_SECRET) {
    return new Razorpay({
      key_id: process.env.RAZORPAY_KEY,
      key_secret: process.env.RAZORPAY_SECRET,
    });
  }
  // Graceful dummy instance for test/dev mode
  return {
    orders: {
      create: async (options) => ({
        id: "order_mock_" + Math.random().toString(36).substring(7),
        currency: options.currency || "INR",
        amount: options.amount || 1000,
        status: "created",
      }),
    },
  };
}

const instance = new Proxy({}, {
  get(target, prop) {
    const inst = getInstance();
    const value = inst[prop];
    return typeof value === "function" ? value.bind(inst) : value;
  }
});

exports.instance = instance;
exports.getInstance = getInstance;
