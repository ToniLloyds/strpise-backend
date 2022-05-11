const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;
const stripe = require("stripe")("sk_test_6xYM9hDZ9NsICXkWe3IZgj9R");

app.use(bodyParser.json());

app.post("/payment-sheet", async (req: any, res: any) => {
  const body = req.body as any;

  if (!body?.amount || !body?.currency) {
    res.status(422);
    res.send({ message: "Wrong data" });
    return;
  }
  const { amount, currency } = body;

  console.log("AMOUNT: ", amount);

  const customer = await stripe.customers.create();
  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: customer.id },
    { apiVersion: "2020-08-27" }
  );
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency,
    customer: customer.id,
    payment_method_types: ["card"],
  });

  res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    publishableKey: "pk_test_wM5GWAdQILVi0Z4RkmFm4nHF",
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
