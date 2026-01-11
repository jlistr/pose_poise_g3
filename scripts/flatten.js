const fs = require('fs');
const path = require('path');

const inputFile = path.resolve(__dirname, '../data/export.json');
const outputFile = path.resolve(__dirname, '../supabase/seed.sql');

if (!fs.existsSync(inputFile)) {
  console.error("ERROR: data/export.json not found. Run export.js first.");
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

let sql = `
-- Auto-generated Seed Data from Firestore Export

-- Ensure tables exist (Schema should be applied separately, but good for context)
-- Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE,
  name text,
  instagram text,
  measurements jsonb,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (id)
);

-- Portfolios
CREATE TABLE IF NOT EXISTS public.portfolios (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  settings jsonb,
  shoots jsonb,
  updated_at timestamptz
);

-- Composite Cards
CREATE TABLE IF NOT EXISTS public.composite_cards (
  id text PRIMARY KEY, -- Keeping string ID from Firestore for now
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  data jsonb,
  created_at timestamptz DEFAULT now()
);

-- Library
CREATE TABLE IF NOT EXISTS public.library (
  id text PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  url text,
  type text,
  created_at timestamptz
);

`;

// Helper to escape single quotes for SQL
const escape = (str) => {
  if (typeof str !== 'string') return str;
  return str.replace(/'/g, "''");
};

// 1. Process Users (Profiles)
// Note: We assume the Auth Users already exist in Supabase with the SAME UUIDs.
// If not, this insert will fail due to Foreign Key constraints.
Object.keys(data.users).forEach(uid => {
  const profile = data.users[uid];
  const measurements = {
     height: profile.height,
     bust: profile.bust,
     waist: profile.waist,
     hips: profile.hips,
     shoeSize: profile.shoeSize,
     hairColor: profile.hairColor,
     eyeColor: profile.eyeColor,
     dressSize: profile.dressSize
  };

  sql += `
INSERT INTO public.profiles (id, name, instagram, measurements)
VALUES (
  '${uid}', 
  '${escape(profile.name)}', 
  '${escape(profile.instagram)}', 
  '${JSON.stringify(measurements)}'
) ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  instagram = EXCLUDED.instagram,
  measurements = EXCLUDED.measurements;
`;
});

// 2. Process Portfolios
Object.keys(data.portfolios).forEach(uid => {
  const portfolio = data.portfolios[uid];
  // Determine if we insert or update? Since generated ID, we just insert.
  // Actually, let's assume 1 portfolio per user for now.
  sql += `
INSERT INTO public.portfolios (user_id, settings, shoots, updated_at)
VALUES (
  '${uid}',
  '${JSON.stringify(portfolio.settings)}',
  '${JSON.stringify(portfolio.shoots)}',
  to_timestamp(${portfolio.updatedAt ? portfolio.updatedAt / 1000 : 'now()'})
);
`;
});

// 3. Composite Cards
Object.keys(data.cards).forEach(uid => {
  const cards = data.cards[uid];
  cards.forEach(card => {
     const { id, ...cardData } = card;
     sql += `
INSERT INTO public.composite_cards (id, user_id, data)
VALUES (
  '${id}',
  '${uid}',
  '${JSON.stringify(cardData)}'
) ON CONFLICT (id) DO NOTHING;
`;
  });
});

// 4. Library
Object.keys(data.library).forEach(uid => {
  const items = data.library[uid];
  items.forEach(item => {
     const { id, ...itemData } = item;
     sql += `
INSERT INTO public.library (id, user_id, url, type, created_at)
VALUES (
  '${id}',
  '${uid}',
  '${itemData.url}',
  '${itemData.type || 'image'}',
  now() -- Firestore might not have had created_at consistent
) ON CONFLICT (id) DO NOTHING;
`;
  });
});

fs.writeFileSync(outputFile, sql);
console.log("SQL Seed file generated at: supabase/seed.sql");
