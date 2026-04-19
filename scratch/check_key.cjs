const API_KEY_0 = "AIzaSyBvpqPvSE-cSA2cGHV0mi1tc90e29iDyR8";
const API_KEY_O = "AIzaSyBvpqPvSE-cSA2cGHVOmi1tc90e29iDyR8";

async function testKey(key, label) {
  console.log(`Testing ${label}: ${key}`);
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${key}`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({ email: "test@example.com", password: "password123", returnSecureToken: true }),
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    
    if (data.error) {
      console.log(`❌ ${label} Failed: ${data.error.message}`);
      return false;
    } else {
      console.log(`✅ ${label} Success! (or different error like EMAIL_EXISTS)`);
      return true;
    }
  } catch (err) {
    console.log(`⚠️ ${label} Error: ${err.message}`);
    return false;
  }
}

async function run() {
  await testKey(API_KEY_0, "Key with ZERO (0)");
  console.log("-------------------");
  await testKey(API_KEY_O, "Key with LETTER (O)");
}

run();
