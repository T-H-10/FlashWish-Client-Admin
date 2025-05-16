const fs = require('fs');
const path = require('path');


// כתובת ברירת מחדל לפיתוח
const defaultUrl = 'http://localhost:5279';

// קריאה מהמשתנה API_URL
const apiUrl = process.env.API_URL || defaultUrl;

const config = {
  apiUrl: this.apiUrl
};


// שמירה לנתיב שהאפליקציה יודעת לקרוא ממנו
const outputPath = path.join(__dirname, 'src', 'assets', 'config.local.json');

fs.writeFileSync(outputPath, JSON.stringify(config, null, 2));
console.log(`✅ config.local.json generated with apiBaseUrl = ${apiUrl}`);

// fs.writeFileSync(
//   'src/assets/config.local.json',
//   JSON.stringify(config, null, 2)
// );

// console.log(`✅ Config generated apiUrl = ${apiUrl}`);
