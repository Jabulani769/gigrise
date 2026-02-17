const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envPath = require('path').join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf-8').split('\n').forEach(line => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (match) process.env[match[1].trim()] = match[2].trim();
  });
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkBuckets() {
  console.log('\n🔍 Checking storage buckets...\n');
  
  try {
    const { data, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.log('❌ Error:', error.message);
      return;
    }
    
    console.log(`Found ${data.length} bucket(s):`);
    data.forEach(bucket => {
      console.log(`  - ${bucket.name} (public: ${bucket.public})`);
    });
    
    const required = ['avatars', 'gig-images', 'marketplace-images'];
    const found = data.map(b => b.name);
    const missing = required.filter(b => !found.includes(b));
    
    console.log('\nRequired buckets:');
    required.forEach(name => {
      const exists = found.includes(name);
      console.log(`  ${exists ? '✅' : '❌'} ${name}`);
    });
    
    if (missing.length > 0) {
      console.log(`\n⚠️  Missing: ${missing.join(', ')}`);
      console.log('\nTo create them:');
      console.log('1. Go to Supabase Dashboard');
      console.log('2. Click Storage → Create bucket');
      console.log('3. Create each missing bucket (mark as public)');
    } else {
      console.log('\n🎉 All buckets exist!');
    }
    
  } catch (error) {
    console.log('❌ Unexpected error:', error.message);
  }
}

checkBuckets();
