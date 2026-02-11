-- =============================================
-- GIGRISE DATABASE SCHEMA
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- PROFILES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    user_type TEXT CHECK (user_type IN ('freelancer', 'client', 'seller', 'both')) DEFAULT 'client',
    is_premium BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    phone_number TEXT,
    country TEXT DEFAULT 'Malawi',
    city TEXT,
    website TEXT,
    skills TEXT[],
    hourly_rate DECIMAL(10, 2),
    min_project_budget DECIMAL(10, 2),
    total_earned DECIMAL(10, 2) DEFAULT 0,
    total_spent DECIMAL(10, 2) DEFAULT 0,
    rating DECIMAL(3, 2) DEFAULT 0,
    reviews_count INTEGER DEFAULT 0,
    orders_completed INTEGER DEFAULT 0,
    response_time_hours INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- =============================================
-- CATEGORIES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    type TEXT CHECK (type IN ('gig', 'marketplace', 'both')) DEFAULT 'both',
    parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- =============================================
-- GIGS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.gigs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    freelancer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    subcategory_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 1000),
    delivery_time_days INTEGER NOT NULL CHECK (delivery_time_days >= 1),
    images TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    requirements TEXT,
    what_you_get TEXT[],
    status TEXT CHECK (status IN ('active', 'paused', 'deleted')) DEFAULT 'active',
    views INTEGER DEFAULT 0,
    orders_count INTEGER DEFAULT 0,
    favorites_count INTEGER DEFAULT 0,
    rating DECIMAL(3, 2) DEFAULT 0,
    reviews_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    featured_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- =============================================
-- MARKETPLACE ITEMS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.marketplace_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    subcategory_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 100),
    images TEXT[] DEFAULT '{}',
    stock_quantity INTEGER NOT NULL DEFAULT 1,
    condition TEXT CHECK (condition IN ('new', 'like_new', 'used', 'refurbished')),
    brand TEXT,
    model TEXT,
    specifications JSONB,
    shipping_available BOOLEAN DEFAULT TRUE,
    shipping_fee DECIMAL(10, 2) DEFAULT 0,
    location TEXT,
    status TEXT CHECK (status IN ('active', 'sold', 'inactive')) DEFAULT 'active',
    views INTEGER DEFAULT 0,
    favorites_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    featured_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- =============================================
-- ORDERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_number TEXT UNIQUE NOT NULL,
    gig_id UUID REFERENCES public.gigs(id) ON DELETE SET NULL,
    marketplace_item_id UUID REFERENCES public.marketplace_items(id) ON DELETE SET NULL,
    client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    order_type TEXT CHECK (order_type IN ('gig', 'marketplace')) NOT NULL,
    status TEXT CHECK (status IN ('pending', 'in_progress', 'delivered', 'completed', 'cancelled', 'disputed')) DEFAULT 'pending',
    amount DECIMAL(10, 2) NOT NULL,
    platform_fee DECIMAL(10, 2) NOT NULL,
    shipping_fee DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'held', 'released', 'refunded')) DEFAULT 'pending',
    payment_method TEXT,
    payment_id TEXT,
    payment_metadata JSONB,
    delivery_date DATE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    requirements TEXT,
    deliverables TEXT[],
    delivery_note TEXT,
    quantity INTEGER DEFAULT 1,
    shipping_address JSONB,
    tracking_number TEXT,
    cancellation_reason TEXT,
    dispute_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- =============================================
-- REVIEWS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    reviewer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    reviewee_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comment TEXT,
    response TEXT,
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(order_id, reviewer_id)
);

-- =============================================
-- MESSAGES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    conversation_id UUID NOT NULL,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    attachments TEXT[],
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- =============================================
-- NOTIFICATIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    metadata JSONB,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- =============================================
-- FAVORITES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    gig_id UUID REFERENCES public.gigs(id) ON DELETE CASCADE,
    marketplace_item_id UUID REFERENCES public.marketplace_items(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(user_id, gig_id),
    UNIQUE(user_id, marketplace_item_id)
);

-- =============================================
-- FOLLOWS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.follows (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    follower_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    following_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(follower_id, following_id),
    CHECK (follower_id != following_id)
);

-- =============================================
-- POSTS TABLE (for feed)
-- =============================================
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    post_type TEXT CHECK (post_type IN ('gig_offer', 'job_request', 'general')) NOT NULL,
    content TEXT NOT NULL,
    images TEXT[],
    gig_id UUID REFERENCES public.gigs(id) ON DELETE SET NULL,
    category TEXT,
    price TEXT,
    budget TEXT,
    delivery_time TEXT,
    deadline TEXT,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- =============================================
-- POST INTERACTIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.post_interactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    interaction_type TEXT CHECK (interaction_type IN ('like', 'save', 'share')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(post_id, user_id, interaction_type)
);

-- =============================================
-- COMMENTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- =============================================
-- INDEXES
-- =============================================

-- Profiles
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_user_type ON public.profiles(user_type);
CREATE INDEX idx_profiles_is_premium ON public.profiles(is_premium);

-- Gigs
CREATE INDEX idx_gigs_freelancer ON public.gigs(freelancer_id);
CREATE INDEX idx_gigs_category ON public.gigs(category_id);
CREATE INDEX idx_gigs_status ON public.gigs(status);
CREATE INDEX idx_gigs_created ON public.gigs(created_at DESC);
CREATE INDEX idx_gigs_rating ON public.gigs(rating DESC);
CREATE INDEX idx_gigs_price ON public.gigs(price);

-- Marketplace Items
CREATE INDEX idx_marketplace_seller ON public.marketplace_items(seller_id);
CREATE INDEX idx_marketplace_category ON public.marketplace_items(category_id);
CREATE INDEX idx_marketplace_status ON public.marketplace_items(status);
CREATE INDEX idx_marketplace_created ON public.marketplace_items(created_at DESC);
CREATE INDEX idx_marketplace_price ON public.marketplace_items(price);

-- Orders
CREATE INDEX idx_orders_client ON public.orders(client_id);
CREATE INDEX idx_orders_seller ON public.orders(seller_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created ON public.orders(created_at DESC);

-- Messages
CREATE INDEX idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX idx_messages_sender ON public.messages(sender_id);
CREATE INDEX idx_messages_receiver ON public.messages(receiver_id);
CREATE INDEX idx_messages_created ON public.messages(created_at DESC);

-- Notifications
CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_notifications_created ON public.notifications(created_at DESC);

-- Posts
CREATE INDEX idx_posts_author ON public.posts(author_id);
CREATE INDEX idx_posts_type ON public.posts(post_type);
CREATE INDEX idx_posts_created ON public.posts(created_at DESC);

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gigs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read all profiles, but only update their own
CREATE POLICY "Profiles are viewable by everyone"
    ON public.profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Gigs: Anyone can view active gigs, only owner can modify
CREATE POLICY "Active gigs are viewable by everyone"
    ON public.gigs FOR SELECT
    USING (status = 'active' OR freelancer_id = auth.uid());

CREATE POLICY "Freelancers can insert own gigs"
    ON public.gigs FOR INSERT
    WITH CHECK (auth.uid() = freelancer_id);

CREATE POLICY "Freelancers can update own gigs"
    ON public.gigs FOR UPDATE
    USING (auth.uid() = freelancer_id);

CREATE POLICY "Freelancers can delete own gigs"
    ON public.gigs FOR DELETE
    USING (auth.uid() = freelancer_id);

-- Marketplace Items: Anyone can view active items, only owner can modify
CREATE POLICY "Active marketplace items are viewable by everyone"
    ON public.marketplace_items FOR SELECT
    USING (status = 'active' OR seller_id = auth.uid());

CREATE POLICY "Sellers can insert own items"
    ON public.marketplace_items FOR INSERT
    WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can update own items"
    ON public.marketplace_items FOR UPDATE
    USING (auth.uid() = seller_id);

CREATE POLICY "Sellers can delete own items"
    ON public.marketplace_items FOR DELETE
    USING (auth.uid() = seller_id);

-- Orders: Only parties involved can view
CREATE POLICY "Users can view own orders"
    ON public.orders FOR SELECT
    USING (auth.uid() = client_id OR auth.uid() = seller_id);

CREATE POLICY "Clients can create orders"
    ON public.orders FOR INSERT
    WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Order parties can update orders"
    ON public.orders FOR UPDATE
    USING (auth.uid() = client_id OR auth.uid() = seller_id);

-- Reviews: Public reviews viewable by all, users can create reviews for their orders
CREATE POLICY "Public reviews are viewable by everyone"
    ON public.reviews FOR SELECT
    USING (is_public = true OR reviewer_id = auth.uid() OR reviewee_id = auth.uid());

CREATE POLICY "Users can create reviews for their orders"
    ON public.reviews FOR INSERT
    WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Users can update own reviews"
    ON public.reviews FOR UPDATE
    USING (auth.uid() = reviewer_id OR auth.uid() = reviewee_id);

-- Messages: Only sender and receiver can view
CREATE POLICY "Users can view own messages"
    ON public.messages FOR SELECT
    USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages"
    ON public.messages FOR INSERT
    WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update own messages"
    ON public.messages FOR UPDATE
    USING (auth.uid() = receiver_id);

-- Notifications: Users can only view their own
CREATE POLICY "Users can view own notifications"
    ON public.notifications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
    ON public.notifications FOR UPDATE
    USING (auth.uid() = user_id);

-- Favorites: Users manage their own favorites
CREATE POLICY "Users can view own favorites"
    ON public.favorites FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create favorites"
    ON public.favorites FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
    ON public.favorites FOR DELETE
    USING (auth.uid() = user_id);

-- Follows: Public follows, users manage own
CREATE POLICY "Follows are viewable by everyone"
    ON public.follows FOR SELECT
    USING (true);

CREATE POLICY "Users can create follows"
    ON public.follows FOR INSERT
    WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can delete own follows"
    ON public.follows FOR DELETE
    USING (auth.uid() = follower_id);

-- Posts: Public posts viewable by all
CREATE POLICY "Posts are viewable by everyone"
    ON public.posts FOR SELECT
    USING (true);

CREATE POLICY "Users can create posts"
    ON public.posts FOR INSERT
    WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own posts"
    ON public.posts FOR UPDATE
    USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own posts"
    ON public.posts FOR DELETE
    USING (auth.uid() = author_id);

-- Post Interactions: Users manage their own
CREATE POLICY "Users can view post interactions"
    ON public.post_interactions FOR SELECT
    USING (true);

CREATE POLICY "Users can create post interactions"
    ON public.post_interactions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own post interactions"
    ON public.post_interactions FOR DELETE
    USING (auth.uid() = user_id);

-- Comments: Public comments viewable by all
CREATE POLICY "Comments are viewable by everyone"
    ON public.comments FOR SELECT
    USING (true);

CREATE POLICY "Users can create comments"
    ON public.comments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
    ON public.comments FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
    ON public.comments FOR DELETE
    USING (auth.uid() = user_id);

-- =============================================
-- FUNCTIONS AND TRIGGERS
-- =============================================

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers: Apply update_updated_at to relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gigs_updated_at BEFORE UPDATE ON public.gigs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_marketplace_items_updated_at BEFORE UPDATE ON public.marketplace_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON public.comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function: Create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Create profile on auth.users insert
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function: Update rating after review
CREATE OR REPLACE FUNCTION update_user_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.profiles
    SET 
        rating = (
            SELECT AVG(rating)::DECIMAL(3,2)
            FROM public.reviews
            WHERE reviewee_id = NEW.reviewee_id
        ),
        reviews_count = (
            SELECT COUNT(*)
            FROM public.reviews
            WHERE reviewee_id = NEW.reviewee_id
        )
    WHERE id = NEW.reviewee_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_rating_after_review
    AFTER INSERT ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION update_user_rating();

-- =============================================
-- SEED DATA
-- =============================================

-- Insert default categories
INSERT INTO public.categories (name, slug, description, icon, type) VALUES
    ('Web Development', 'web-development', 'Website and web application development', '💻', 'gig'),
    ('Mobile Development', 'mobile-development', 'iOS and Android app development', '📱', 'gig'),
    ('Graphic Design', 'graphic-design', 'Logo, branding, and visual design', '🎨', 'gig'),
    ('Content Writing', 'content-writing', 'Blog posts, articles, and copywriting', '✍️', 'gig'),
    ('Digital Marketing', 'digital-marketing', 'SEO, social media, and marketing', '📈', 'gig'),
    ('Video Editing', 'video-editing', 'Video production and editing', '🎬', 'gig'),
    ('Electronics', 'electronics', 'Phones, laptops, and gadgets', '📱', 'marketplace'),
    ('Fashion', 'fashion', 'Clothing, shoes, and accessories', '👕', 'marketplace'),
    ('Home & Garden', 'home-garden', 'Furniture and home decor', '🏠', 'marketplace'),
    ('Books & Media', 'books-media', 'Books, movies, and music', '📚', 'marketplace')
ON CONFLICT (slug) DO NOTHING;