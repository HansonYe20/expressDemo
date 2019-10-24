const Vacation = require('./models/vacation');
const express = require('express');
const app = express();
const credentials = require('./lib/credentials.js');

var mongoose = require('mongoose');

var opts = {
  server: {
    socketOptions: { keepAlive: 1 }
  }
};
switch (app.get('env')) {
  case 'development':
    mongoose.connect(credentials.mongo.development.connectionString, opts);
    break;
  case 'production':
    mongoose.connect(credentials.mongo.production.connectionString, opts);
    break; default:
    throw new Error('Unknown execution environment: ' + app.get('env'));
}


Vacation.find(function (err, vacations) {
  if (vacations && vacations.length) return;

  // new Vacation({
  //   name: 'Hood River Day Trip',
  //   slug: 'hood-river-day-trip',
  //   category: 'Day Trip',
  //   sku: 'HR199',
  //   description: 'Spend a day sailing on the Columbia and ' +
  //     'enjoying craft beers in Hood River!',
  //   priceInCents: 9995,
  //   tags: ['day trip', 'hood river', 'sailing', 'windsurfing', 'breweries'], inSeason: true,
  //   maximumGuests: 16,
  //   available: true,
  //   packagesSold: 0,
  // }).save();

  // new Vacation({
  //   name: 'Rock Climbing in Bend',
  //   slug: 'rock-climbing-in-bend',
  //   category: 'Adventure',
  //   sku: 'B99',
  //   description: 'Experience the thrill of climbing in the high desert.', priceInCents: 289995,
  //   tags: ['weekend getaway', 'bend', 'high desert', 'rock climbing'], inSeason: true,
  //   requiresWaiver: true,
  //   maximumGuests: 4,
  //   available: false,
  //   packagesSold: 0,
  //   notes: 'The tour guide is currently recovering from a skiing accident.',
  // }).save();
  new Vacation({
    name: 'Oregon Coast Getaway',
    slug: 'oregon-coast-getaway',
    category: 'Weekend Getaway',
    sku: 'OC39',
    description: 'Enjoy the ocean air and quaint coastal towns!', priceInCents: 269995,
    tags: ['weekend getaway', 'oregon coast', 'beachcombing'], inSeason: false,
    maximumGuests: 8,
    available: true,
    packagesSold: 0,
  })
  // .save();
  .save((err, product) => {
    mongoose.disconnect((error) => {
      console.log('===>>> disconnect');
    });
  });
});