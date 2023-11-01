#!/usr/bin/env node

//Connect to message brocker Rabbitmq

const amqp = require('amqp-connection-manager');

const q = "payment"
const publishmsg = async() => {
    const connection = amqp.connect('amqp://rabbitmq:5672');

    let channel = connection.createChannel({
        json: true,
        setup: ch =>{
            return ch.assertQueue(q, { durable: true});
        }
    });

    console.log("Starting publishing");
    setInterval(async() => {
        await channel.sendToQueue(q, { value: Math.random() });
    }, 500);

}

publishmsg();