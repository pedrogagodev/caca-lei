-- BillHunt Database Schema for Supabase
-- This schema extends Supabase's built-in auth.users table

-- =====================================================
-- EXTENSIONS
-- =====================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- ENUMS
-- =====================================================
CREATE TYPE user_role AS ENUM ('CITIZEN', 'GOVERNMENT');
CREATE TYPE bill_status AS ENUM ('DRAFT', 'UNDER_REVIEW', 'IN_COMMITTEE', 'VOTING', 'PASSED', 'REJECTED', 'ENACTED');
CREATE TYPE age_range AS ENUM ('18-24', '25-34', '35-44', '45-54', '55+');
CREATE TYPE occupation_type AS ENUM (
  'Trabalhador CLT',
  'MEI/Autônomo',
  'Estudante',
  'Servidor Público',
  'Aposentado',
  'Desempregado',
  'Outros'
);
CREATE TYPE sentiment_type AS ENUM ('PRO', 'CONTRA', 'NEUTRAL', 'CONFUSED');

-- =====================================================
-- PROFILES TABLE (extends auth.users)
-- =====================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_role user_role NOT NULL DEFAULT 'USER',
  full_name TEXT,
  avatar_url TEXT,
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'Brazil',
  age_range age_range,
  occupation_type occupation_type,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- BILL CATEGORIES
-- =====================================================
CREATE TABLE public.bill_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- BILLS
-- =====================================================
CREATE TABLE public.bills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bill_number TEXT UNIQUE NOT NULL, -- e.g., "H.R. 1234-117"
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  full_text TEXT,
  category_id UUID REFERENCES public.bill_categories(id) ON DELETE SET NULL,
  status bill_status NOT NULL DEFAULT 'UNDER_REVIEW',
  date_introduced DATE NOT NULL,
  date_enacted DATE,
  video_url TEXT,
  author_name TEXT, -- Sponsor/author of the bill
  total_votes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- VOTES
-- =====================================================
CREATE TABLE public.votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bill_id UUID NOT NULL REFERENCES public.bills(id) ON DELETE CASCADE,
  has_voted BOOLEAN NOT NULL DEFAULT TRUE,
  voted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, bill_id) -- One vote per user per bill
);

-- =====================================================
-- COMMENTS
-- =====================================================
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bill_id UUID NOT NULL REFERENCES public.bills(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE, -- For threaded comments
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- SENTIMENT DATA (for analytics)
-- =====================================================
CREATE TABLE public.sentiment_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bill_id UUID NOT NULL REFERENCES public.bills(id) ON DELETE CASCADE,
  sentiment_type sentiment_type NOT NULL,
  percentage DECIMAL(5,2) NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(bill_id, sentiment_type)
);

-- =====================================================
-- ARGUMENTS (Pro/Contra)
-- =====================================================
CREATE TABLE public.arguments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bill_id UUID NOT NULL REFERENCES public.bills(id) ON DELETE CASCADE,
  argument_type sentiment_type NOT NULL CHECK (argument_type IN ('PRO', 'CONTRA')),
  text TEXT NOT NULL,
  mention_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- GEOGRAPHIC VOTING DATA
-- =====================================================
CREATE TABLE public.geographic_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bill_id UUID NOT NULL REFERENCES public.bills(id) ON DELETE CASCADE,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  vote_count INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(bill_id, city, state)
);

-- =====================================================
-- BILL ANALYTICS SUMMARY (cached analytics data)
-- =====================================================
CREATE TABLE public.bill_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bill_id UUID NOT NULL UNIQUE REFERENCES public.bills(id) ON DELETE CASCADE,
  total_votes INTEGER NOT NULL DEFAULT 0,
  total_comments INTEGER NOT NULL DEFAULT 0,
  votes_per_day DECIMAL(10,2) NOT NULL DEFAULT 0,
  engagement_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
  days_active INTEGER NOT NULL DEFAULT 0,
  last_calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================

-- Profiles
CREATE INDEX idx_profiles_user_role ON public.profiles(user_role);
CREATE INDEX idx_profiles_city ON public.profiles(city);
CREATE INDEX idx_profiles_age_range ON public.profiles(age_range);
CREATE INDEX idx_profiles_occupation ON public.profiles(occupation_type);

-- Bills
CREATE INDEX idx_bills_category ON public.bills(category_id);
CREATE INDEX idx_bills_status ON public.bills(status);
CREATE INDEX idx_bills_date_introduced ON public.bills(date_introduced DESC);
CREATE INDEX idx_bills_total_votes ON public.bills(total_votes DESC);

-- Votes
CREATE INDEX idx_votes_bill_id ON public.votes(bill_id);
CREATE INDEX idx_votes_user_id ON public.votes(user_id);
CREATE INDEX idx_votes_voted_at ON public.votes(voted_at DESC);

-- Comments
CREATE INDEX idx_comments_bill_id ON public.comments(bill_id);
CREATE INDEX idx_comments_user_id ON public.comments(user_id);
CREATE INDEX idx_comments_created_at ON public.comments(created_at DESC);
CREATE INDEX idx_comments_parent ON public.comments(parent_comment_id);

-- Arguments
CREATE INDEX idx_arguments_bill_id ON public.arguments(bill_id);
CREATE INDEX idx_arguments_type ON public.arguments(argument_type);

-- Geographic
CREATE INDEX idx_geographic_votes_bill ON public.geographic_votes(bill_id);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bills_updated_at BEFORE UPDATE ON public.bills
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_arguments_updated_at BEFORE UPDATE ON public.arguments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile automatically
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update bill vote count
CREATE OR REPLACE FUNCTION update_bill_vote_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.has_voted = TRUE THEN
    UPDATE public.bills SET total_votes = total_votes + 1 WHERE id = NEW.bill_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.has_voted = FALSE AND NEW.has_voted = TRUE THEN
      UPDATE public.bills SET total_votes = total_votes + 1 WHERE id = NEW.bill_id;
    ELSIF OLD.has_voted = TRUE AND NEW.has_voted = FALSE THEN
      UPDATE public.bills SET total_votes = total_votes - 1 WHERE id = NEW.bill_id;
    END IF;
  ELSIF TG_OP = 'DELETE' AND OLD.has_voted = TRUE THEN
    UPDATE public.bills SET total_votes = total_votes - 1 WHERE id = OLD.bill_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_bill_votes
  AFTER INSERT OR UPDATE OR DELETE ON public.votes
  FOR EACH ROW EXECUTE FUNCTION update_bill_vote_count();

-- Function to update geographic voting data
CREATE OR REPLACE FUNCTION update_geographic_votes()
RETURNS TRIGGER AS $$
DECLARE
  user_city TEXT;
  user_state TEXT;
BEGIN
  -- Get user's location from profile
  SELECT city, state INTO user_city, user_state
  FROM public.profiles
  WHERE id = NEW.user_id;

  -- Only update if user has location data
  IF user_city IS NOT NULL AND user_state IS NOT NULL THEN
    -- Insert or update geographic vote count
    INSERT INTO public.geographic_votes (bill_id, city, state, vote_count)
    VALUES (NEW.bill_id, user_city, user_state, 1)
    ON CONFLICT (bill_id, city, state)
    DO UPDATE SET
      vote_count = public.geographic_votes.vote_count + 1,
      updated_at = NOW();
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER track_geographic_votes
  AFTER INSERT ON public.votes
  FOR EACH ROW EXECUTE FUNCTION update_geographic_votes();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sentiment_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.arguments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.geographic_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bill_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bill_categories ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (TRUE);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Bills policies (everyone can read)
CREATE POLICY "Bills are viewable by everyone"
  ON public.bills FOR SELECT
  USING (TRUE);

CREATE POLICY "Only government workers can create bills"
  ON public.bills FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND user_role = 'GOVERNMENT_WORKER'
    )
  );

CREATE POLICY "Only government workers can update bills"
  ON public.bills FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND user_role = 'GOVERNMENT_WORKER'
    )
  );

-- Votes policies
CREATE POLICY "Users can view all votes"
  ON public.votes FOR SELECT
  USING (TRUE);

CREATE POLICY "Users can create their own votes"
  ON public.votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own votes"
  ON public.votes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own votes"
  ON public.votes FOR DELETE
  USING (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Comments are viewable by everyone"
  ON public.comments FOR SELECT
  USING (TRUE);

CREATE POLICY "Authenticated users can create comments"
  ON public.comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
  ON public.comments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON public.comments FOR DELETE
  USING (auth.uid() = user_id);

-- Analytics data policies (read-only for government workers)
CREATE POLICY "Analytics viewable by government workers"
  ON public.sentiment_data FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND user_role = 'GOVERNMENT_WORKER'
    )
  );

CREATE POLICY "Arguments viewable by government workers"
  ON public.arguments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND user_role = 'GOVERNMENT_WORKER'
    )
  );

CREATE POLICY "Geographic votes viewable by government workers"
  ON public.geographic_votes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND user_role = 'GOVERNMENT_WORKER'
    )
  );

CREATE POLICY "Bill analytics viewable by government workers"
  ON public.bill_analytics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND user_role = 'GOVERNMENT_WORKER'
    )
  );

-- Categories are public
CREATE POLICY "Categories are viewable by everyone"
  ON public.bill_categories FOR SELECT
  USING (TRUE);

-- =====================================================
-- SEED DATA
-- =====================================================

-- Insert bill categories
INSERT INTO public.bill_categories (name, slug, description) VALUES
  ('Energy & Environment', 'energy-environment', 'Bills related to renewable energy, climate change, and environmental protection'),
  ('Family & Social Services', 'family-social', 'Bills concerning family support, childcare, and social welfare programs'),
  ('Technology & Privacy', 'tech-privacy', 'Bills addressing digital privacy, data protection, and technology regulation'),
  ('Economy & Business', 'economy-business', 'Bills related to economic policy, business regulations, and tax reform'),
  ('Infrastructure & Transportation', 'infrastructure-transport', 'Bills concerning public infrastructure, transportation systems, and urban development'),
  ('Healthcare', 'healthcare', 'Bills related to healthcare access, insurance, and medical services'),
  ('Education', 'education', 'Bills concerning education policy, student support, and academic funding'),
  ('Housing & Urban Development', 'housing-urban', 'Bills addressing affordable housing, urban planning, and community development');

-- =====================================================
-- VIEWS (Optional - for easier querying)
-- =====================================================

-- View: Bills with vote counts and comment counts
CREATE OR REPLACE VIEW public.bills_with_stats AS
SELECT
  b.*,
  bc.name as category_name,
  bc.slug as category_slug,
  COUNT(DISTINCT v.id) as vote_count,
  COUNT(DISTINCT c.id) as comment_count
FROM public.bills b
LEFT JOIN public.bill_categories bc ON b.category_id = bc.id
LEFT JOIN public.votes v ON b.id = v.bill_id AND v.has_voted = TRUE
LEFT JOIN public.comments c ON b.id = c.bill_id
GROUP BY b.id, bc.name, bc.slug;

-- View: User voting history
CREATE OR REPLACE VIEW public.user_votes_view AS
SELECT
  v.user_id,
  v.bill_id,
  v.has_voted,
  v.voted_at,
  b.title as bill_title,
  b.bill_number,
  bc.name as category_name
FROM public.votes v
JOIN public.bills b ON v.bill_id = b.id
LEFT JOIN public.bill_categories bc ON b.category_id = bc.id;

-- View: Comment details with user info
CREATE OR REPLACE VIEW public.comments_with_users AS
SELECT
  c.id,
  c.bill_id,
  c.content,
  c.created_at,
  c.updated_at,
  p.full_name as author_name,
  p.avatar_url as author_avatar,
  p.user_role as author_role
FROM public.comments c
JOIN public.profiles p ON c.user_id = p.id;

-- =====================================================
-- HELPFUL FUNCTIONS FOR APPLICATION
-- =====================================================

-- Function to check if user has voted on a bill
CREATE OR REPLACE FUNCTION has_user_voted(p_user_id UUID, p_bill_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.votes
    WHERE user_id = p_user_id
      AND bill_id = p_bill_id
      AND has_voted = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get top bills by votes
CREATE OR REPLACE FUNCTION get_top_bills(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  category_name TEXT,
  total_votes INTEGER,
  comment_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    b.id,
    b.title,
    b.description,
    bc.name as category_name,
    b.total_votes,
    COUNT(c.id) as comment_count
  FROM public.bills b
  LEFT JOIN public.bill_categories bc ON b.category_id = bc.id
  LEFT JOIN public.comments c ON b.id = c.bill_id
  GROUP BY b.id, bc.name
  ORDER BY b.total_votes DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
