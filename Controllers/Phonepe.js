require('dotenv').config();

const uniqid = require("uniqid");
const sha256 = require("sha256");
const axios = require("axios");
const crypto = require("crypto");


const PHONE_PAY_HOST_URL = process.env.PHONE_PAY_HOST_URL;
const MERCHANT_ID = process.env.MERCHANT_ID;
const SALT_INDEX = process.env.SALT_INDEX;
const SALT_KEY = process.env.SALT_KEY;
const REACT_APP_FRONTEND_URL=process.env.REACT_APP_FRONTEND_URL
const BACKEND_URL=process.env.BACKEND_URL

const payEndpoint = "/pg/v1/pay";
const statusEndpoint = "/pg/v1/status";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY.padEnd(32, '0')
const IV_LENGTH = 16;

// Add a temporary storage for transaction details
const transactionStore = new Map(); // This will store transaction details temporarily

function encrypt(text) {
  let iv = crypto.randomBytes(IV_LENGTH);
  let cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

exports.pay = async (req, res) => {
  const { amount, mobileNumber, userId, passType } = req.body;
  try {
    // Create merchant transaction ID
    const merchantTransactionId = uniqid();
    
    // Store transaction details
    transactionStore.set(merchantTransactionId, {
      passType,
      amount,
      userId
    });

    // Set expiry for stored data (cleanup after 1 hour)
    setTimeout(() => {
      transactionStore.delete(merchantTransactionId);
    }, 3600000); // 1 hour

    const payload = {
      merchantId: MERCHANT_ID,
      merchantTransactionId: merchantTransactionId,
      merchantUserId: userId,
      amount: amount,
      redirectUrl: `${BACKEND_URL}/api/redirect-url/${merchantTransactionId}`,
      redirectMode: "POST",
      mobileNumber: mobileNumber,
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };
    const bufferObj = Buffer.from(JSON.stringify(payload), "utf8");
    const base64EncodedPayload = bufferObj.toString("base64");
    const xVerify =sha256(base64EncodedPayload + payEndpoint + SALT_KEY) +"###" +SALT_INDEX;

    const options = {
      method: "post",
      url: `${PHONE_PAY_HOST_URL}${payEndpoint}`,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": xVerify,
      },
      data: {
        request: base64EncodedPayload,
      },
    };

    axios
      .request(options)
      .then((response) => {
        const url = response.data.data.instrumentResponse.redirectInfo;
        // res.redirect(url)
        return res.status(200).json(url);
        // res.send(url)
      })
      .catch((error) => {
        console.error("Error during payment request:", error);
      });
  } catch (error) {
    console.error("there is some error:", error);
  }
};

exports.redirect = async (req, res) => {
  const merchantTransactionId = req.params.merchantTransactionId;
  
  if (merchantTransactionId) {
    // Get the stored transaction details
    const transactionDetails = transactionStore.get(merchantTransactionId);
    const xVerify =sha256(`/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}` + SALT_KEY) +"###"+SALT_INDEX;
    

    const options = {
      method: "get",
      url: `${PHONE_PAY_HOST_URL}${statusEndpoint}/${MERCHANT_ID}/${merchantTransactionId}`,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-MERCHANT-ID": merchantTransactionId,
        "X-VERIFY": xVerify,
      },
    };

    try {
      const response = await axios.request(options);

      if (response.data) {
        // Include the stored passType in the payment details
        const paymentDetails = {
          ...response.data,
          passType: transactionDetails?.passType, // Add passType to response
          originalAmount: transactionDetails?.amount
        };
        
        // Clean up stored data
        transactionStore.delete(merchantTransactionId);
        
        const encryptedPaymentDetails = encrypt(JSON.stringify(paymentDetails));
        return res.redirect(
          `${REACT_APP_FRONTEND_URL}/Passes?paymentDetails=${encryptedPaymentDetails}`
        );
      }
    } catch (error) {
      console.error("Error during transaction status fetch:", error);
      return res.redirect(`${REACT_APP_FRONTEND_URL}/checkout`);
    }
  } else {
    res.send("no id found");
  }
};
