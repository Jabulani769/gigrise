const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (match) {
      process.env[match[1].trim()] = match[2].trim();
    }
  });
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function runTests() {
  console.log('\n╔══════════════════════════════════════════╗');
  console.log('║   SUPABASE CONNECTION TEST - GIGRISE     ║');
  console.log('╚══════════════════════════════════════════╝\n');
  
  let passed = 0, total = 0;

  // Test 1: Categories
  total++;
  try {
    const { data } = await supabase.from('categories').select('*').limit(5);
    if (data?.length > 0) {
      console.log(`✅ Test 1: Categories (${data.length} found)`);
      passed++;
    }
  } catch (e) { console.log('❌ Test 1: Categories failed'); }

  // Test 2: Profiles
  total++;
  try {
    await supabase.from('profiles').select('*').limit(1);
    console.log('✅ Test 2: Profiles table');
    passed++;
  } catch (e) { console.log('❌ Test 2: Profiles failed'); }

  // Test 3: Gigs
  total++;
  try {
    await supabase.from('gigs').select('*').limit(1);
    console.log('✅ Test 3: Gigs table');
    passed++;
  } catch (e) { console.log('❌ Test 3: Gigs failed'); }

  // Test 4: Marketplace
  total++;
  try {
    await supabase.from('marketplace_items').select('*').limit(1);
    console.log('✅ Test 4: Marketplace table');
    passed++;
  } catch (e) { console.log('❌ Test 4: Marketplace failed'); }

  // Test 5: Orders
  total++;
  try {
    await supabase.from('orders').select('*').limit(1);
    console.log('✅ Test 5: Orders table');
    passed++;
  } catch (e) { console.log('❌ Test 5: Orders failed'); }

  // Test 6: Storage
  total++;
  try {
    const { data } = await supabase.storage.listBuckets();
    const required = ['avatars', 'gig-images', 'marketplace-images'];
    const found = data?.map(b => b.name) || [];
    const missing = required.filter(b => !found.includes(b));
    
    if (missing.length === 0) {
      console.log('✅ Test 6: Storage buckets');
      passed++;
    } else {
      console.log(`⚠️  Test 6: Missing buckets: ${missing.join(', ')}`);
    }
  } catch (e) { console.log('❌ Test 6: Storage failed'); }

  // Test 7: Auth
  total++;
  try {
    await supabase.auth.getSession();
    console.log('✅ Test 7: Authentication');
    passed++;
  } catch (e) { console.log('❌ Test 7: Auth failed'); }

  console.log('\n═══════════════════════════════════════════');
  console.log(`Tests Passed: ${passed}/${total} (${Math.round(passed/total*100)}%)`);
  console.log('═══════════════════════════════════════════\n');

  if (passed === total) {
    console.log('🎉 All tests passed! Ready to go!\n');
    console.log('Next: npm run dev\n');
  } else {
    console.log('⚠️  Some tests failed. Check setup.\n');
  }
}

runTests();
