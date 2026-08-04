-- Core member registrations
CREATE TABLE IF NOT EXISTS registrations (
  id SERIAL PRIMARY KEY,

  full_name TEXT NOT NULL,
  father_husband_name TEXT NOT NULL,
  designation TEXT NOT NULL,
  gender TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  cnic_number TEXT NOT NULL,

  member_residence TEXT NOT NULL,
  country TEXT NOT NULL,
  province TEXT NOT NULL,
  city TEXT NOT NULL,
  home_address TEXT NOT NULL,

  institute_name TEXT NOT NULL,
  pmdc_number TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  institute_address TEXT NOT NULL,

  photo_url TEXT NOT NULL,
  mbbs_certificate_url TEXT NOT NULL,
  cnic_copy_url TEXT NOT NULL,
  degree_url TEXT NOT NULL,

  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (email),
  UNIQUE (cnic_number),
  UNIQUE (pmdc_number)
);

-- Auth + membership + profile fields
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS membership_number TEXT UNIQUE;
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS rejected_reason TEXT;
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS qualification TEXT;
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS clinic_hospital TEXT;
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS experience TEXT;
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS areas_of_interest TEXT;
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS publications TEXT;
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS awards TEXT;
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}'::jsonb;

-- Admin accounts
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- News feed
CREATE TABLE IF NOT EXISTS news_posts (
  id SERIAL PRIMARY KEY,
  author_id INTEGER NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS news_likes (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES news_posts(id) ON DELETE CASCADE,
  member_id INTEGER NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (post_id, member_id)
);

CREATE TABLE IF NOT EXISTS news_comments (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES news_posts(id) ON DELETE CASCADE,
  member_id INTEGER NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Events
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL DEFAULT 'conference',
  event_date TIMESTAMPTZ NOT NULL,
  location TEXT,
  banner_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Research library
CREATE TABLE IF NOT EXISTS research_items (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL DEFAULT 'paper',
  title TEXT NOT NULL,
  description TEXT,
  author_or_source TEXT,
  file_url TEXT,
  cover_image_url TEXT,
  published_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Surveys / polls
CREATE TABLE IF NOT EXISTS surveys (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS survey_options (
  id SERIAL PRIMARY KEY,
  survey_id INTEGER NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS survey_votes (
  id SERIAL PRIMARY KEY,
  survey_id INTEGER NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  option_id INTEGER NOT NULL REFERENCES survey_options(id) ON DELETE CASCADE,
  member_id INTEGER NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (survey_id, member_id)
);

-- Ask the Expert forum
CREATE TABLE IF NOT EXISTS expert_threads (
  id SERIAL PRIMARY KEY,
  member_id INTEGER NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS expert_replies (
  id SERIAL PRIMARY KEY,
  thread_id INTEGER NOT NULL REFERENCES expert_threads(id) ON DELETE CASCADE,
  member_id INTEGER NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Chat
CREATE TABLE IF NOT EXISTS chat_conversations (
  id SERIAL PRIMARY KEY,
  is_group BOOLEAN NOT NULL DEFAULT false,
  name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS chat_participants (
  id SERIAL PRIMARY KEY,
  conversation_id INTEGER NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
  member_id INTEGER NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  UNIQUE (conversation_id, member_id)
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id SERIAL PRIMARY KEY,
  conversation_id INTEGER NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
  sender_id INTEGER NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  member_id INTEGER NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_news_posts_created ON news_posts (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_date ON events (event_date DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_conv ON chat_messages (conversation_id, created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_member ON notifications (member_id, created_at DESC);
