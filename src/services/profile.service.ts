// src/services/profile.service.ts
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/database';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

const supabase = createClient();

export const profileService = {
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data;
  },

  async updateProfile(
    userId: string,
    updates: ProfileUpdate
  ): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }

    return data;
  },

  async uploadAvatar(userId: string, file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Math.random()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    // Upload file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      throw uploadError;
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('avatars').getPublicUrl(filePath);

    // Update profile with new avatar URL
    await this.updateProfile(userId, { avatar_url: publicUrl });

    return publicUrl;
  },

  async getPublicProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select(
        `
        id,
        email,
        full_name,
        avatar_url,
        bio,
        user_type,
        is_verified,
        city,
        country,
        website,
        skills,
        rating,
        reviews_count,
        orders_completed,
        created_at
      `
      )
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching public profile:', error);
      return null;
    }

    return data as Profile;
  },

  async searchProfiles(query: string, filters?: {
    userType?: string;
    city?: string;
    minRating?: number;
  }): Promise<Profile[]> {
    let queryBuilder = supabase
      .from('profiles')
      .select('*')
      .or(`full_name.ilike.%${query}%,bio.ilike.%${query}%`);

    if (filters?.userType) {
      queryBuilder = queryBuilder.eq('user_type', filters.userType);
    }

    if (filters?.city) {
      queryBuilder = queryBuilder.eq('city', filters.city);
    }

    if (filters?.minRating) {
      queryBuilder = queryBuilder.gte('rating', filters.minRating);
    }

    const { data, error } = await queryBuilder;

    if (error) {
      console.error('Error searching profiles:', error);
      return [];
    }

    return data;
  },

  async followUser(followerId: string, followingId: string): Promise<void> {
    const { error } = await supabase.from('follows').insert({
      follower_id: followerId,
      following_id: followingId,
    });

    if (error) throw error;
  },

  async unfollowUser(followerId: string, followingId: string): Promise<void> {
    const { error } = await supabase
      .from('follows')
      .delete()
      .eq('follower_id', followerId)
      .eq('following_id', followingId);

    if (error) throw error;
  },

  async getFollowers(userId: string): Promise<Profile[]> {
    const { data, error } = await supabase
      .from('follows')
      .select(
        `
        follower:follower_id (
          *
        )
      `
      )
      .eq('following_id', userId);

    if (error) {
      console.error('Error fetching followers:', error);
      return [];
    }

    return data.map((item: any) => item.follower);
  },

  async getFollowing(userId: string): Promise<Profile[]> {
    const { data, error } = await supabase
      .from('follows')
      .select(
        `
        following:following_id (
          *
        )
      `
      )
      .eq('follower_id', userId);

    if (error) {
      console.error('Error fetching following:', error);
      return [];
    }

    return data.map((item: any) => item.following);
  },

  async isFollowing(
    followerId: string,
    followingId: string
  ): Promise<boolean> {
    const { data, error } = await supabase
      .from('follows')
      .select('id')
      .eq('follower_id', followerId)
      .eq('following_id', followingId)
      .single();

    return !!data && !error;
  },
};
