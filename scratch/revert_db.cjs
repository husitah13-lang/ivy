const baseUrl = 'https://ivy-5d6a.vercel.app';

async function revertDB() {
  try {
    console.log('Logging in...');
    const loginRes = await fetch(`${baseUrl}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'ivyadmin123' })
    });
    const { token } = await loginRes.json();

    console.log('Fetching homepage content...');
    const contentRes = await fetch(`${baseUrl}/api/content/homepage`);
    const data = await contentRes.json();

    console.log('Reverting fields...');
    if (data.hero_custom) {
      data.hero_custom.sub_headline = "FOR GROWTH";
      data.hero_custom.body_text = "In an era defined by technological change, continuous innovation is the core of competitive advantage. We partner with ambitious organizations to architect, develop, and scale the software solutions that define tomorrow's market leaders.";
      delete data.hero_custom.body_text_2;
    }

    console.log('Saving reverted content...');
    await fetch(`${baseUrl}/api/content/homepage`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    console.log('Homepage reverted successfully!');

    console.log('Reverting homepage.ar...');
    const arRes = await fetch(`${baseUrl}/api/content/homepage.ar`);
    if (arRes.ok) {
        const arData = await arRes.json();
        if (arData.hero_custom) {
            // Restore Arabic description if it was changed
            arData.hero_custom.body_text = "في عصر يتسم بالتغيير التكنولوجي، يعد الابتكار المستمر هو جوهر الميزة التنافسية. نحن نشارك المنظمات الطموحة لهندسة وتطوير وتوسيع نطاق الحلول البرمجية التي تحدد قادة السوق في الغد.";
            delete arData.hero_custom.body_text_2;
        }
        await fetch(`${baseUrl}/api/content/homepage.ar`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(arData)
        });
        console.log('Arabic homepage reverted successfully!');
    }

  } catch (err) {
    console.error('Error:', err);
  }
}

revertDB();
