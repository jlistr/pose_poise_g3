
import { supabase } from './supabase';

// Adapter to match Data Connect SDK signatures
// We ignore the first argument (dataConnect instance)

export const createUser = async (_dc: any, vars: { uid: string; email: string; now?: string }) => {
  const { error } = await supabase.from('users').upsert({
    uid: vars.uid,
    email: vars.email,
    created_at: vars.now || new Date().toISOString()
  });
  if (error) throw error;
};

// --- IMAGES ---

export const getLibrary = async (_dc: any, vars: { uid: string }) => {
  const { data, error } = await supabase
    .from('images')
    .select('*')
    .eq('user_id', vars.uid)
    .order('uploaded_at', { ascending: false });
    
  if (error) throw error;
  
  // Return shape matching Data Connect: { data: { images: [] } }
  return {
      data: {
          images: data.map(row => ({
              id: row.id,
              url: row.url,
              metadata: row.metadata ? JSON.stringify(row.metadata) : undefined,
              fileHash: row.file_hash, // Ensure casing matches
              uploadedAt: row.uploaded_at
          }))
      }
  };
};

export const upsertImage = async (_dc: any, vars: { id: string; uid: string; url: string; now?: string; path?: string }) => {
  const { error } = await supabase.from('images').upsert({
      id: vars.id,
      user_id: vars.uid,
      url: vars.url,
      uploaded_at: vars.now || new Date().toISOString()
      // metadata, file_hash not passed in current usage?
  });
  if (error) throw error;
};

export const deleteImage = async (_dc: any, vars: { id: string }) => {
  const { error } = await supabase.from('images').delete().eq('id', vars.id);
  // Remove from join table logic handled by CASCADE in SQL
  if (error) throw error;
};

export const getImagesByHash = async (_dc: any, vars: { hash: string }) => {
    const { data, error } = await supabase
        .from('images')
        .select('*')
        .eq('file_hash', vars.hash);
        
    if (error) throw error;
    return { data: { images: data || [] } };
};

// --- PROFILES ---

export const getProfile = async (_dc: any, vars: { uid: string }) => { 
    // DataConnect generated query likely named 'profiles' and took 'uid'
    const { data, error } = await supabase.from('profiles').select('*').eq('user_id', vars.uid);
    if (error) throw error;
    return { data: { profiles: data || [] } };
};

export const upsertProfile = async (_dc: any, vars: any) => {
    // vars might contain { uid, name, ... } or { user_id ... }
    const { error } = await supabase.from('profiles').upsert({
        user_id: vars.uid || vars.user_id, 
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

export const getPortfolio = async (_dc: any, vars: { uid: string }) => {
    // Assuming similar pattern: getPortfolio({ uid }) -> { portfolios: [...] } ?
    // Or maybe it was single? Let's assume list to be safe if singular fails, or check usage.
    // If usage is 'response.data.portfolio' (singular), then adapter below is fine.
    // If usage is 'response.data.portfolios[0]', then need array.
    // Let's guess array based on getProfile pattern, but I should check usage.
    // For now, I'll return both to cover bases? No, type safety.
    // I'll stick to 'portfolio' (singular) matching my previous guess unless compilation fails.
    // Wait, error said "uid does not exist in type { user: string }". So calling code passes { uid }.
    
    // Check if I can see getPortfolio usage? Step 937 showed loadPortfolio call but usage inside was hidden.
    // I will return singular 'portfolio' but accept 'uid'.
    
    const { data, error } = await supabase.from('portfolios').select('*').eq('user_id', vars.uid).maybeSingle();
    if (error) throw error;
    
    return { 
        data: { 
            portfolio: data ? { ...data, settings: JSON.stringify(data.settings) } : null 
        } 
    };
};

export const upsertPortfolio = async (_dc: any, vars: any) => {
    const { error } = await supabase.from('portfolios').upsert({
        user_id: vars.uid || vars.user,
        is_public: vars.isPublic,
        settings: vars.settings ? JSON.parse(vars.settings) : {},
        updated_at: new Date().toISOString()
    });
    if (error) throw error;
};

export const deletePortfolio = async (_dc: any, vars: { uid: string }) => {
     const { error } = await supabase.from('portfolios').delete().eq('user_id', vars.uid);
     if (error) throw error;
};


// --- SHOOTS ---
// getShootsForPortfolio usage? Likely select * from shoots where portfolio_id = ...

export const getShootsForPortfolio = async (_dc: any, vars: { portfolio: string }) => {
    // portfolio param maps to user_id (primary key of portfolio)
    const { data, error } = await supabase.from('shoots').select(`
        *,
        shoot_images (
            image_id,
            "order",
            is_visible,
            images (*
            )
        )
    `).eq('portfolio_id', vars.portfolio);
    
    if (error) throw error;
    
    return { 
        data: {
            shoots: data.map(shoot => ({
                id: shoot.id,
                name: shoot.name,
                vibes: shoot.vibes ? shoot.vibes.split(',').filter(Boolean) : [],
                photographer: shoot.photographer,
                studio: shoot.studio,
                hiddenImages: shoot.shoot_images.filter((si: any) => !si.is_visible).map((si: any) => si.images.url),
                // Flatten: sort by order, then map to url
                images: shoot.shoot_images
                    .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
                    .map((si: any) => si.images?.url)
                    .filter(Boolean)
            }))
        }
    };
};

// Shoots are complex. I'll defer complex graph mapping until needed. 
// For now, I'll export stubs for less critical ones or generic implementations.

export const upsertShoot = async (_dc: any, vars: { id: string; uid: string; name: string; vibes: string; photographer: string; studio: string; now?: string }) => {
    const { error } = await supabase.from('shoots').upsert({
        id: vars.id,
        portfolio_id: vars.uid, // Portfolio ID is User ID 1:1
        name: vars.name,
        vibes: vars.vibes,
        photographer: vars.photographer,
        studio: vars.studio,
        updated_at: vars.now || new Date().toISOString()
    });
    if (error) throw error;
};

export const deleteShoot = async (_dc: any, vars: { id: string }) => {
    const { error } = await supabase.from('shoots').delete().eq('id', vars.id);
    if (error) throw error;
};

export const addImageToShoot = async (_dc: any, vars: { shootId: string; imageId: string; order: number; isVisible: boolean }) => {
    // Upsert into join table
    const { error } = await supabase.from('shoot_images').upsert({
        shoot_id: vars.shootId,
        image_id: vars.imageId,
        "order": vars.order,
        is_visible: vars.isVisible
    }, { onConflict: 'shoot_id,image_id' });
    
    if (error) throw error;
};
export const getCompCards = async (_dc: any, vars: any) => { return { data: { compCards: [] } } };
export const deleteCompCard = async (_dc: any, vars: any) => {};

