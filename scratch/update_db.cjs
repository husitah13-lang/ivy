const mongoose = require('mongoose');
const Content = require('../custom-cms/models/Content');
require('dotenv').config();

const updateDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const homepage = await Content.findOne({ name: 'homepage' });
    if (homepage) {
      console.log('Updating homepage record...');
      const data = homepage.data;
      
      // Update Hero Section
      if (data.hero_custom) {
        data.hero_custom.sub_headline = "FOR {G}ROWTH";
        data.hero_custom.body_text = "In an era defined by technological change, continuous innovation is the core of competitive advantage.";
        data.hero_custom.body_text_2 = "We partner with ambitious organizations to architect, develop, and scale the software solutions that define tomorrow's market leaders.";
      }

      homepage.markModified('data');
      await homepage.save();
      console.log('Homepage updated successfully');
    } else {
      console.log('Homepage record not found');
    }

    // Optional: Update Arabic if it exists
    const homepageAr = await Content.findOne({ name: 'homepage.ar' });
    if (homepageAr) {
        console.log('Updating homepage.ar record...');
        // For Arabic, we might not use the bracket syntax if it's not supported or needed there, 
        // but we should add the fields.
        if (homepageAr.data.hero_custom) {
            // body_text_2 split (rough translation or placeholder)
            homepageAr.data.hero_custom.body_text = "في عصر يتسم بالتغيير التكنولوجي، يعد الابتكار المستمر هو جوهر الميزة التنافسية.";
            homepageAr.data.hero_custom.body_text_2 = "نحن نشارك المنظمات الطموحة لهندسة وتطوير وتوسيع نطاق الحلول البرمجية التي تحدد قادة السوق في الغد.";
        }
        homepageAr.markModified('data');
        await homepageAr.save();
        console.log('Homepage.ar updated successfully');
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

updateDB();
