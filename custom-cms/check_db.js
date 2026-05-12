require('dotenv').config();
const mongoose = require('mongoose');
const Content = require('./models/Content');

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  
  const articleContent = await Content.findOne({ name: 'articleContent' });
  const articleContentAr = await Content.findOne({ name: 'articleContent.ar' });

  console.log('--- ArticleContent ---');
  if (articleContent) console.log('English Last Updated:', articleContent.updatedAt);
  if (articleContentAr) {
      console.log('Arabic Last Updated:', articleContentAr.updatedAt);
      const keys = Array.isArray(articleContentAr.data) ? articleContentAr.data.map(i => i.id) : Object.keys(articleContentAr.data);
      console.log('Arabic Keys:', keys);
  }

  const insights = await Content.findOne({ name: 'insights' });
  const insightsAr = await Content.findOne({ name: 'insights.ar' });

  console.log('\n--- Insights ---');
  if (insights) console.log('English Last Updated:', insights.updatedAt);
  if (insightsAr) {
      console.log('Arabic Last Updated:', insightsAr.updatedAt);
      // Insights data is usually an object with an 'insights' array
      const keys = insightsAr.data.insights ? insightsAr.data.insights.map(i => i.id) : Object.keys(insightsAr.data);
      console.log('Arabic Keys:', keys);
  }

  await mongoose.disconnect();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
