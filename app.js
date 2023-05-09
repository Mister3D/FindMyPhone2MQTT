const mqtt = require('mqtt')
const fs = require('fs');
const path = require('path');

const findPhone = require('./findPhone.js');

const options = {
  host: '192.168.0.160',
  port: 1883,
  username: '',
  password: '',
};

const client = mqtt.connect(options);


client.on('connect', () => {
  console.log('Connected to MQTT broker')
  client.subscribe('findPhone/set')
  client.subscribe('findPhone/get')
})

client.on('message', (topic, message) => {

  const json = JSON.parse(message.toString());

  if(json.action === "add") {
    if (fs.existsSync(`./cookies/${json.name}.json`)) {
      client.publish("findPhone", JSON.stringify({"error": "cookie_existe"}));
    } else {
      fs.writeFileSync(`./cookies/${json.name}.json`, JSON.stringify(json.data, null, 4));
      client.publish("findPhone", JSON.stringify({"statut": "cookie added"}));
    }
  }

  if(json.action === "delete") {
    fs.unlink(`./cookies/${json.name}.json`, function(err) {
      if (err) {
        client.publish("findPhone", JSON.stringify({"error": "error_or_not_exist"}));
      } else {
        client.publish("findPhone", JSON.stringify({"statut": "cookie deleted"}));
      }
    });
  }
  
  if(json.action === "ring") {
    console.log("Faire sonner le téléphone")
    findPhone(json.name);
  }
  

  console.log(`Received message ${message} on topic ${topic}`)


})

client.publish("findPhone", JSON.stringify({"start": "now"}));