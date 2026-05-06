const url = 'https://ivy-f5vr-6id5k0fly-husitah13-langs-projects.vercel.app/api/content/homepage';

fetch(url)
  .then(res => res.json())
  .then(data => {
    console.log("Success! Data preview:");
    console.log(JSON.stringify(data.hero_custom, null, 2));
  })
  .catch(err => console.error("Error fetching:", err));
