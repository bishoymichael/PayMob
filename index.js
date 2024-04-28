const axios = require('axios');

const API_KEY = "ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmpiR0Z6Y3lJNklrMWxjbU5vWVc1MElpd2ljSEp2Wm1sc1pWOXdheUk2T1RjeU5URTFMQ0p1WVcxbElqb2lhVzVwZEdsaGJDSjkucGFUODlOZkJ5MnEtS0RhMC0wVXZYQkthdkc0cEdTVVc2YjJzQXJ6OGlzbmVaaWJCZDRQdDJkZ0FtSHpJaFZYaUJQMmZ2TFc3RHVveHRrOXU1Y3dYRlE=";
const tokenUrl = 'https://accept.paymob.com/api/auth/tokens';
const orderUrl = 'https://accept.paymob.com/api/ecommerce/orders';
const paymentKeyUrl = 'https://accept.paymob.com/api/acceptance/payment_keys';
const integrationID = 4560739;

function getTokenAndCreateOrder() {
    getToken()
        .then(token => {
            const amount = "150";
            createOrder(token, amount)
                .then(orderResponse => {
                    console.log('Order created:', orderResponse.data);
                    const orderId = orderResponse.data.id;
                    // Call getPaymentKey function after order creation
                    getPaymentKey(token, amount, orderId)
                        .then(paymentKey => {
                            console.log('Payment key:', paymentKey);
                            // Further processing with the payment key if needed
                        })
                        .catch(error => {
                            console.error('Error fetching payment key:', error.message);
                        });
                })
                .catch(error => {
                    console.error('Error creating order:', error.message);
                });
        })
        .catch(error => {
            console.error('Error fetching token:', error.message);
        });
}

function getToken() {
    const requestBody = {
        api_key: API_KEY
    };
    return axios.post(tokenUrl, requestBody)
        .then(tokenResponse => {
            // Extract token from response
            const token = tokenResponse.data.token;
            console.log('Token:', token);
            return token;
        })
        .catch(error => {
            throw new Error('Error fetching token: ' + error.message);
        });
}

function createOrder(token, amount) {
    const requestBody = {
        auth_token: token,
        delivery_needed: "false",
        amount_cents: amount,
        currency: "EGP",
        items: [
            {
                "name": "ASCf15",
                "amount_cents": "5000",
                "description": "Watch",
                "quantity": "1"
            }
        ]
    };
    return axios.post(orderUrl, requestBody);
}


function getPaymentKey(token, amount, orderId) {
    const requestBody = {
        auth_token: token,
        amount_cents: amount,
        expiration: 3600,
        order_id: orderId,
        billing_data: {
            "apartment": "803",
            "email": "claudette09@exa.com",
            "floor": "42",
            "first_name": "Clifford",
            "street": "Ethan Land",
            "building": "8028",
            "phone_number": "+86(8)9135210487",
            "shipping_method": "PKG",
            "postal_code": "01898",
            "city": "Jaskolskiburgh",
            "country": "CR",
            "last_name": "Nicolas",
            "state": "Utah"
        },
        currency: "EGP",
        integration_id: integrationID
    };

    return axios.post(paymentKeyUrl, requestBody)
        .then(paymentKeyResponse => {
            // Extract payment key from response
            const paymentKey = paymentKeyResponse.data.token;
            console.log('Payment key:', paymentKey);
            return paymentKey;
        })
        .catch(error => {
            throw new Error('Error fetching payment key token: ' + error.message);
        });
}

// Call the main function to get token and create order
getTokenAndCreateOrder();
