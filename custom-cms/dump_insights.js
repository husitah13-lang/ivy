require('dotenv').config();
const mongoose = require('mongoose');
const Content = require('./models/Content');

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  
  const insights = await Content.findOne({ name: 'insights' });
  const insightsAr = await Content.findOne({ name: 'insights.ar' });

  if (insights) {
    console.log('--- Insights (EN) ---');
    console.log('Keys at root:', Object.keys(insights.data));
    console.log('Insights length:', insights.data.insights ? insights.data.insights.length : 'MISSING');
    if (insights.data.insights && insights.data.insights.length > 0) {
      console.log('First Item ID:', insights.data.insights[0].id);
    }
  } else {
    console.log('Insights (EN) not found');
  }

  if (insightsAr) {
    console.log('\n--- Insights (AR) ---');
    console.log('Keys at root:', Object.keys(insightsAr.data));
    console.log('Insights length:', insightsAr.data.insights ? insightsAr.data.insights.length : 'MISSING');
    if (insightsAr.data.insights && insightsAr.data.insights.length > 0) {
      console.log('First Item ID:', insightsAr.data.insights[0].id);
    }
  } else {
    console.log('Insights (AR) not found');
  }

  await mongoose.disconnect();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
