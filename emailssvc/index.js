const AWS = require('aws-sdk');
const { Consumer } = require('sqs-consumer');
const nodemailer = require('nodemailer');

const ID = '';
const SECRET = '';

AWS.config.update({region: 'us-east-1'});

// Create an SQS service objecct
const sqs = new AWS.SQS({ 
    apiVersion: '2012-11-05', 
    accessKeyId: ID,
    secretAccessKey: SECRET,
    region: 'us-east-1'
});

const queueUrl = "";

// Configure Nodemailer to user Gmail
let transport = nodemailer.createTransport({
    host: 'smtp.googlemail.com',
    port: 587,
    auth: {
        user: '',
        pass: ''
    }
});

function sendMail(message) {
    let sqsMessage = JSON.parse(message.Body);
    const emailMessage = {
        from: 'imamovicjr@gmail.com', // Sender address,
        to: sqsMessage.userEmail, // Recipient address,
        subject: 'Order Received | NodeShop', // Subject line 
        html: `<p>Hi ${sqsMessage.userEmail}.</p. <p>Your order of ${sqsMessage.itemsQuantity} ${sqsMessage.itemName} has been received and is being processed.</p> <p> Thank you for shopping with us! </p>` // Plain text body
    };

    transport.sendMail(emailMessage, (err, info) => {
        if (err) {
            console.log(`EmailsSvc | ERROR: ${err}`);
        } else {
            console.log(`EmailsSvc | INFO: ${JSON.stringify(info)}`);
        }
    })
}

const app = Consumer.create({
    queueUrl,
    handleMessage: async (message) => {
        sendMail(message);
    },
    sqs
});

app.on('error', (err) => {
    console.error(err.message);
});

app.on('processing_error', (err) => {
    console.error(err.message);
})

console.log('Emails service is running');
app.start();
