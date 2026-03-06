// src/services/gig.service.ts
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/database';

type Gig = Database['public']['Tables']['gigs']['Row'];
type GigInsert = Database['public']['Tables']['gigs']['Insert'];
type GigUpdate = Database['public']['Tables']['gigs']['Update'];

const supabase = createClient();

export const gigService = {
  /**
   * Create a new gig
   */
  async createGig(gig: Omit<GigInsert, 'id'>): Promise<Gig> {
    const { data, error } = await supabase
      .from('gigs')
      .insert(gig)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get a single gig by ID
   */
  async getGig(gigId: string): Promise<Gig | null> {
    const { data, error } = await supabase
      .from('gigs')
      .select(
        `
        *,
        freelancer:freelancer_id (
          id,
          full_name,
          avatar_url,
          rating,
          reviews_count,
          is_verified
        ),
        category:category_id (
          id,
          name,
          slug
        )
      `
      )
      .eq('id', gigId)
      .single();

    if (error) {
      console.error('Error fetching gig:', error);
      return null;
    }

    // Increment view count
    await this.incrementViews(gigId);

    return data as any;
  },

  /**
   * List gigs with filters and pagination
   */
  async listGigs(options: {
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sortBy?: 'created_at' | 'price' | 'rating' | 'orders_count';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  } = {}): Promise<{ data: Gig[]; count: number }> {
    const {
      categoryId,
      minPrice,
      maxPrice,
      search,
      sortBy = 'created_at',
      sortOrder = 'desc',
      page = 1,
      limit = 20,
    } = options;

    let query = supabase
      .from('gigs')
      .select(
        `
        *,
        freelancer:freelancer_id (
          id,
          full_name,
          avatar_url,
          rating,
          reviews_count
        ),
        category:category_id (
          id,
          name,
          slug
        )
      `,
        { count: 'exact' }
      )
      .eq('status', 'active');

    // Apply filters
    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    if (minPrice !== undefined) {
      query = query.gte('price', minPrice);
    }

    if (maxPrice !== undefined) {
      query = query.lte('price', maxPrice);
    }

    if (search) {
      query = query.or(
        `title.ilike.%${search}%,description.ilike.%${search}%,tags.cs.{${search}}`
      );
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error listing gigs:', error);
      return { data: [], count: 0 };
    }

    return { data: data as any[], count: count || 0 };
  },

  /**
   * Get gigs by freelancer
   */
  async getFreelancerGigs(freelancerId: string): Promise<Gig[]> {
    const { data, error } = await supabase
      .from('gigs')
      .select('*')
      .eq('freelancer_id', freelancerId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching freelancer gigs:', error);
      return [];
    }

    return data;
  },

  /**
   * Update a gig
   */
  async updateGig(gigId: string, updates: GigUpdate): Promise<Gig> {
    const { data, error } = await supabase
      .from('gigs')
      .update(updates)
      .eq('id', gigId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Delete a gig (soft delete by setting status)
   */
  async deleteGig(gigId: string): Promise<void> {
    const { error } = await supabase
      .from('gigs')
      .update({ status: 'deleted' })
      .eq('id', gigId);

    if (error) throw error;
  },

  /**
   * Pause/Unpause a gig
   */
  async toggleGigStatus(
    gigId: string,
    status: 'active' | 'paused'
  ): Promise<Gig> {
    return this.updateGig(gigId, { status });
  },

  /**
   * Increment gig views
   */
  async incrementViews(gigId: string): Promise<void> {
    const { error } = await supabase.rpc('increment_gig_views', {
      gig_id: gigId,
    });

    // If the RPC doesn't exist, fallback to manual increment
    if (error) {
      const { data: gig } = await supabase
        .from('gigs')
        .select('views')
        .eq('id', gigId)
        .single();

      if (gig) {
        await supabase
          .from('gigs')
          .update({ views: (gig.views || 0) + 1 })
          .eq('id', gigId);
      }
    }
  },

  /**
   * Add gig to favorites
   */
  async addToFavorites(userId: string, gigId: string): Promise<void> {
    const { error } = await supabase.from('favorites').insert({
      user_id: userId,
      gig_id: gigId,
    });

    if (error && error.code !== '23505') {
      // Ignore duplicate key error
      throw error;
    }

    // Increment favorites count
    await this.incrementFavorites(gigId);
  },

  /**
   * Remove gig from favorites
   */
  async removeFromFavorites(userId: string, gigId: string): Promise<void> {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('gig_id', gigId);

    if (error) throw error;

    // Decrement favorites count
    await this.decrementFavorites(gigId);
  },

  /**
   * Check if gig is favorited by user
   */
  async isFavorited(userId: string, gigId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('gig_id', gigId)
      .single();

    return !!data && !error;
  },

  /**
   * Get user's favorited gigs
   */
  async getFavorites(userId: string): Promise<Gig[]> {
    const { data, error } = await supabase
      .from('favorites')
      .select(
        `
        gig:gig_id (
          *,
          freelancer:freelancer_id (
            id,
            full_name,
            avatar_url,
            rating
          )
        )
      `
      )
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching favorites:', error);
      return [];
    }

    return data.map((item: any) => item.gig);
  },

  /**
   * Search gigs
   */
  async searchGigs(query: string, limit = 10): Promise<Gig[]> {
    const { data, error } = await supabase
      .from('gigs')
      .select(
        `
        *,
        freelancer:freelancer_id (
          id,
          full_name,
          avatar_url
        )
      `
      )
      .eq('status', 'active')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .limit(limit);

    if (error) {
      console.error('Error searching gigs:', error);
      return [];
    }

    return data as any[];
  },

  /**
   * Get trending/featured gigs
   */
  async getTrendingGigs(limit = 10): Promise<Gig[]> {
    const { data, error } = await supabase
      .from('gigs')
      .select(
        `
        *,
        freelancer:freelancer_id (
          id,
          full_name,
          avatar_url,
          rating
        )
      `
      )
      .eq('status', 'active')
      .or('is_featured.eq.true,orders_count.gte.10')
      .order('orders_count', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching trending gigs:', error);
      return [];
    }

    return data as any[];
  },

  /**
   * Increment favorites count
   */
  private async incrementFavorites(gigId: string): Promise<void> {
    const { data: gig } = await supabase
      .from('gigs')
      .select('favorites_count')
      .eq('id', gigId)
      .single();

    if (gig) {
      await supabase
        .from('gigs')
        .update({ favorites_count: (gig.favorites_count || 0) + 1 })
        .eq('id', gigId);
    }
  },

  /**
   * Decrement favorites count
   */
  private async decrementFavorites(gigId: string): Promise<void> {
    const { data: gig } = await supabase
      .from('gigs')
      .select('favorites_count')
      .eq('id', gigId)
      .single();

    if (gig && gig.favorites_count > 0) {
      await supabase
        .from('gigs')
        .update({ favorites_count: gig.favorites_count - 1 })
        .eq('id', gigId);
    }
  },
};
