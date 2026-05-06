const baseUrl = 'https://ivy-5d6a.vercel.app';

async function update() {
  try {
    // 1. Login
    console.log('Logging in...');
    const loginRes = await fetch(`${baseUrl}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'ivyadmin123' })
    });
    const { token } = await loginRes.json();
    console.log('Logged in successfully');

    // 2. Fetch homepage
    console.log('Fetching homepage content...');
    const contentRes = await fetch(`${baseUrl}/api/content/homepage`);
    const data = await contentRes.json();

    // 3. Update fields
    console.log('Updating fields...');
    if (!data.hero_custom) data.hero_custom = {};
    data.hero_custom.sub_headline = "FOR {G}ROWTH";
    data.hero_custom.body_text = "In an era defined by technological change, continuous innovation is the core of competitive advantage.";
    data.hero_custom.body_text_2 = "We partner with ambitious organizations to architect, develop, and scale the software solutions that define tomorrow's market leaders.";

    // 4. Save back
    console.log('Saving updated content...');
    const saveRes = await fetch(`${baseUrl}/api/content/homepage`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    
    if (saveRes.ok) {
      console.log('Homepage updated successfully via API!');
    } else {
      const err = await saveRes.json();
      console.error('Failed to save:', err);
    }

    // 5. Do the same for Arabic if it exists
    console.log('Checking for homepage.ar...');
    const arRes = await fetch(`${baseUrl}/api/content/homepage.ar`);
    if (arRes.ok) {
        const arData = await arRes.json();
        if (!arData.hero_custom) arData.hero_custom = {};
        arData.hero_custom.body_text = "في عصر يتسم بالتغيير التكنولوجي، يعد الابتكار المستمر هو جوهر الميزة التنافسية.";
        arData.hero_custom.body_text_2 = "نحن نشارك المنظمات الطموحة لهندسة وتطوير وتوسيع نطاق الحلول البرمجية التي تحدد قادة السوق في الغد.";
        
        await fetch(`${baseUrl}/api/content/homepage.ar`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(arData)
        });
        console.log('Arabic homepage updated successfully!');
    }

  } catch (err) {
    console.error('Error:', err);
  }
}

update();
