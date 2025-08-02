-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create link_hubs table
CREATE TABLE link_hubs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    bio TEXT,
    avatar TEXT,
    theme VARCHAR(50) DEFAULT 'light',
    custom_background TEXT,
    is_personal BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create links table
CREATE TABLE links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    link_hub_id UUID NOT NULL REFERENCES link_hubs(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    type VARCHAR(50) DEFAULT 'other',
    "order" INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    clicks INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create analytics table
CREATE TABLE analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    link_id UUID NOT NULL REFERENCES links(id) ON DELETE CASCADE,
    user_agent TEXT,
    ip_address INET,
    country VARCHAR(100),
    city VARCHAR(100),
    clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_link_hubs_user_id ON link_hubs(user_id);
CREATE INDEX idx_link_hubs_slug ON link_hubs(slug);
CREATE INDEX idx_links_link_hub_id ON links(link_hub_id);
CREATE INDEX idx_links_order ON links("order");
CREATE INDEX idx_analytics_link_id ON analytics(link_id);
CREATE INDEX idx_analytics_clicked_at ON analytics(clicked_at);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE link_hubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE links ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see and modify their own data
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- LinkHubs policies
CREATE POLICY "Users can view own linkhubs" ON link_hubs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own linkhubs" ON link_hubs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own linkhubs" ON link_hubs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own linkhubs" ON link_hubs FOR DELETE USING (auth.uid() = user_id);

-- Public can view active linkhubs
CREATE POLICY "Public can view active linkhubs" ON link_hubs FOR SELECT USING (is_active = true);

-- Links policies
CREATE POLICY "Users can manage own links" ON links FOR ALL USING (
    EXISTS (
        SELECT 1 FROM link_hubs 
        WHERE link_hubs.id = links.link_hub_id 
        AND link_hubs.user_id = auth.uid()
    )
);

-- Public can view active links from active linkhubs
CREATE POLICY "Public can view active links" ON links FOR SELECT USING (
    is_active = true AND EXISTS (
        SELECT 1 FROM link_hubs 
        WHERE link_hubs.id = links.link_hub_id 
        AND link_hubs.is_active = true
    )
);

-- Analytics policies
CREATE POLICY "Users can view own analytics" ON analytics FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM links 
        JOIN link_hubs ON link_hubs.id = links.link_hub_id
        WHERE links.id = analytics.link_id 
        AND link_hubs.user_id = auth.uid()
    )
);

CREATE POLICY "Anyone can create analytics" ON analytics FOR INSERT WITH CHECK (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_link_hubs_updated_at BEFORE UPDATE ON link_hubs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_links_updated_at BEFORE UPDATE ON links FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
