
import { supabase } from './supabase';

// Adapter to match Data Connect SDK signatures
// We ignore the first argument (dataConnect instance)

export const createUser = async (vars: { uid: string; email: string; now?: string }) => {
  const { error } = await supabase.from('users').upsert({
    uid: vars.uid,
    email: vars.email,
    created_at: vars.now || new Date().toISOString()
  });
  if (error) throw error;
};


// --- IMAGES ---

export const getLibrary = async (vars: { uid: string }) => {
  const { data, error } = await supabase
    .from('images')
    .select('*')
    .eq('user_uid', vars.uid) // user_uid FK
    .order('uploaded_at', { ascending: false });
    
  if (error) throw error;
  
  return {
      data: {
          images: data.map(row => ({
              id: row.uid, // Map DB 'uid' to App 'id'
              url: row.url,
              metadata: row.metadata ? JSON.stringify(row.metadata) : undefined,
              fileHash: row.file_hash,
              uploadedAt: row.uploaded_at
          }))
      }
  };
};

export const upsertImage = async (vars: { id: string; uid: string; url: string; now?: string; path?: string }) => {
  const { error } = await supabase.from('images').upsert({
      uid: vars.id, // Item ID
      user_uid: vars.uid, // User FK
      url: vars.url,
      uploaded_at: vars.now || new Date().toISOString()
  });
  if (error) throw error;
};

export const deleteImage = async (vars: { id: string }) => {
  const { error } = await supabase.from('images').delete().eq('uid', vars.id);
  if (error) throw error;
};

export const getImagesByHash = async (vars: { hash: string }) => {
    const { data, error } = await supabase
        .from('images')
        .select('*')
        .eq('file_hash', vars.hash);
        
    if (error) throw error;
    // Map data
    const images = data ? data.map(row => ({ ...row, id: row.uid })) : [];
    return { data: { images } };
};

// --- PROFILES ---

export const getProfile = async (vars: { uid: string }) => { 
    // Schema: profiles PK is uid (user id)
    const { data, error } = await supabase.from('profiles').select('*').eq('uid', vars.uid);
    if (error) throw error;
    return { data: { profiles: data || [] } };
};

export const getProfileByInstagram = async (vars: { handle: string }) => {
    // Basic lookup by instagram handle (assuming it acts as username for now)
    // Note: Instagram handles include @ usually, but subdomain won't. 
    // We should search with and without @ to be safe or standardize.
    const handle = vars.handle.startsWith('@') ? vars.handle : `@${vars.handle}`;
    
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .ilike('instagram', handle) // case-insensitive
        .limit(1);
        
    if (error) throw error;
    return { data: { profiles: data || [] } };
};

export const upsertProfile = async (vars: any) => {
    const { error } = await supabase.from('profiles').upsert({
        uid: vars.uid || vars.user_id, // PK
        name: vars.name,
        height: vars.height,
        bust: vars.bust,
        waist: vars.waist,
        hips: vars.hips,
        shoe_size: vars.shoeSize,
        dress_size: vars.dressSize,
        hair_color: vars.hairColor,
        eye_color: vars.eyeColor,
        instagram: vars.instagram,
        avatar: vars.avatar,
        description: vars.description,
        career_goals: vars.careerGoals
    });
    if (error) throw error;
};

// --- PORTFOLIOS ---

export const getPortfolio = async (vars: { uid?: string; id?: string }) => {
    // Map 'id' to 'uid' column as 'id' doesn't exist in portfolios table
    const targetUid = vars.uid || vars.id;
    if (!targetUid) throw new Error("No identifier provided for portfolio");

    const { data, error } = await supabase.from('portfolios').select('*').eq('uid', targetUid);
    if (error) throw error;
    
    return { 
        data: { 
            portfolios: data.map(p => ({ 
                ...p, 
                id: p.uid, // Portfolios use uid as PK
                settings: JSON.stringify(p.settings) 
            })) 
        } 
    };
};

export const upsertPortfolio = async (vars: any) => {
    const { error } = await supabase.from('portfolios').upsert({
        uid: vars.uid || vars.user, // PK is User ID
        is_public: vars.isPublic,
        settings: vars.settings ? JSON.parse(vars.settings) : {},
        updated_at: new Date().toISOString()
    });
    if (error) throw error;
};

export const deletePortfolio = async (vars: { uid: string }) => {
     const { error } = await supabase.from('portfolios').delete().eq('uid', vars.uid); // PK is uid
     if (error) throw error;
};

// --- SHOOTS ---

export const getShootsForPortfolio = async (vars: { uid?: string; id?: string }) => {
    const targetUid = vars.uid || vars.id;
    if (!targetUid) throw new Error("No identifier provided for shoots query");

    // Filter directly on portfolio_uid to avoid joins that might reference non-existent 'id' col
    const { data, error } = await supabase.from('shoots').select(`
        *,
        shoot_images (
            image_uid,
            "order",
            is_visible,
            images (*)
        )
    `).eq('portfolio_uid', targetUid);

    if (error) throw error;
    
    return { 
        data: {
            shoots: data.map(shoot => ({
                id: shoot.uid, // Map PK
                name: shoot.name,
                vibes: shoot.vibes ? shoot.vibes.split(',').filter(Boolean) : [],
                photographer: shoot.photographer,
                studio: shoot.studio,
                date: shoot.date, // Added date field
                hiddenImages: shoot.shoot_images.filter((si: any) => !si.is_visible).map((si: any) => si.images.url),
                images: shoot.shoot_images
                    .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
                    .map((si: any) => si.images?.url)
                    .filter(Boolean)
            }))
        }
    };
};

export const upsertShoot = async (vars: { 
    id: string; 
    portfolioId: string; 
    name: string; 
    vibes: string; 
    photographer: string; 
    studio: string; 
    date?: string; // Added date
    now?: string 
}) => {
    // Check if portfolioId passed is User ID or UUID?
    // In page.tsx: portfolioId is set to portfolio.id.
    // If getPortfolio returns User ID as ID, then page.tsx propagates User ID.
    // So vars.portfolioId SHOULD be the User ID.
    
    const { error } = await supabase.from('shoots').upsert({
        uid: vars.id, // Item ID
        portfolio_uid: vars.portfolioId, // FK -> Portfolio.uid (User ID)
        name: vars.name,
        vibes: vars.vibes,
        photographer: vars.photographer,
        studio: vars.studio,
        date: vars.date, // Added date
        updated_at: vars.now || new Date().toISOString()
    });
    if (error) throw error;
};

export const deleteShoot = async (vars: { id: string }) => {
    const { error } = await supabase.from('shoots').delete().eq('uid', vars.id);
    if (error) throw error;
};

export const addImageToShoot = async (vars: { shootId: string; imageId: string; order: number; isVisible: boolean }) => {
    const { error } = await supabase.from('shoot_images').upsert({
        shoot_uid: vars.shootId,
        image_uid: vars.imageId,
        "order": vars.order,
        is_visible: vars.isVisible
    }, { onConflict: 'shoot_uid,image_uid' });
    
    if (error) throw error;
};
export const getCompCards = async (vars: any) => { return { data: { compCards: [] } } };
export const deleteCompCard = async (vars: any) => {};

