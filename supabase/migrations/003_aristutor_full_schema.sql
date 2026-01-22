-- ArisTutor Full Database Schema
-- This migration creates a comprehensive schema for the peer-to-peer tutoring platform

-- ============================================================================
-- CORE USER EXTENSIONS
-- ============================================================================

-- Extended profile information
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS education_level VARCHAR(50);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS school_year VARCHAR(20);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS school_name VARCHAR(255);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS timezone VARCHAR(50) DEFAULT 'UTC';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_minor BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS parent_account_id UUID REFERENCES profiles(id);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS current_mode VARCHAR(20) DEFAULT 'student' CHECK (current_mode IN ('student', 'tutor'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS tutor_active BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS instant_tutoring_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS scheduled_tutoring_enabled BOOLEAN DEFAULT TRUE;

-- ============================================================================
-- SUBJECTS & VERIFICATION
-- ============================================================================

-- Subjects taxonomy
CREATE TABLE IF NOT EXISTS subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  category VARCHAR(50),
  difficulty_level INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User subjects (what they study or can teach)
CREATE TABLE IF NOT EXISTS user_subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  role VARCHAR(20) CHECK (role IN ('student', 'tutor', 'both')),
  level VARCHAR(50),
  grade VARCHAR(10),
  verified BOOLEAN DEFAULT FALSE,
  verification_document_url TEXT,
  verification_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, subject_id, role)
);

-- ============================================================================
-- CREDIT SYSTEM
-- ============================================================================

-- Credit transactions
CREATE TABLE IF NOT EXISTS credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  type VARCHAR(50) CHECK (type IN ('purchase', 'earned_tutoring', 'earned_qa', 'earned_notes', 'earned_group', 'earned_accountability', 'spent_tutoring', 'spent_qa', 'spent_notes', 'spent_group', 'accountability_stake', 'accountability_return', 'refund', 'bonus', 'penalty')),
  status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('pending', 'held', 'completed', 'failed', 'refunded')),
  related_session_id UUID,
  related_question_id UUID,
  related_note_id UUID,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Credit holds (for pending sessions)
CREATE TABLE IF NOT EXISTS credit_holds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  reason VARCHAR(100),
  related_session_id UUID,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'released', 'captured')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  released_at TIMESTAMPTZ
);

-- Credit packages for purchase
CREATE TABLE IF NOT EXISTS credit_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  credits INTEGER NOT NULL,
  price_usd DECIMAL(10, 2) NOT NULL,
  bonus_credits INTEGER DEFAULT 0,
  popular BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TUTOR PROFILES & PRICING
-- ============================================================================

-- Tutor pricing per subject
CREATE TABLE IF NOT EXISTS tutor_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  credits_per_hour INTEGER NOT NULL,
  min_session_duration INTEGER DEFAULT 30,
  instant_rate_multiplier DECIMAL(3, 2) DEFAULT 1.2,
  group_rate_discount DECIMAL(3, 2) DEFAULT 0.7,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tutor_id, subject_id)
);

-- Tutor availability slots
CREATE TABLE IF NOT EXISTS tutor_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_recurring BOOLEAN DEFAULT TRUE,
  specific_date DATE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tutor stats and metrics
CREATE TABLE IF NOT EXISTS tutor_stats (
  tutor_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  total_sessions INTEGER DEFAULT 0,
  completed_sessions INTEGER DEFAULT 0,
  cancelled_sessions INTEGER DEFAULT 0,
  average_rating DECIMAL(3, 2) DEFAULT 0,
  total_ratings INTEGER DEFAULT 0,
  total_credits_earned INTEGER DEFAULT 0,
  response_rate DECIMAL(5, 2) DEFAULT 0,
  acceptance_rate DECIMAL(5, 2) DEFAULT 0,
  reliability_score DECIMAL(3, 2) DEFAULT 5.0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- SESSIONS (Enhanced)
-- ============================================================================

-- Update sessions table
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS session_type VARCHAR(20) DEFAULT 'scheduled' CHECK (session_type IN ('instant', 'scheduled', 'group'));
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS max_participants INTEGER DEFAULT 1;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS current_participants INTEGER DEFAULT 0;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS credits_per_participant INTEGER;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS total_credits INTEGER;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS recording_url TEXT;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS recording_duration INTEGER;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS whiteboard_data JSONB;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS started_at TIMESTAMPTZ;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS ended_at TIMESTAMPTZ;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS actual_duration INTEGER;

-- Session participants (for group sessions)
CREATE TABLE IF NOT EXISTS session_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role VARCHAR(20) CHECK (role IN ('tutor', 'student')),
  joined_at TIMESTAMPTZ,
  left_at TIMESTAMPTZ,
  credits_paid INTEGER,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  review TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, user_id)
);

-- Session requests (for instant tutoring)
CREATE TABLE IF NOT EXISTS session_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id),
  level VARCHAR(50),
  description TEXT,
  max_credits INTEGER,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired', 'cancelled')),
  accepted_by UUID REFERENCES profiles(id),
  session_id UUID REFERENCES sessions(id),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  responded_at TIMESTAMPTZ
);

-- ============================================================================
-- RATINGS & REVIEWS
-- ============================================================================

CREATE TABLE IF NOT EXISTS ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  reviewee_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review TEXT,
  categories JSONB, -- {"punctuality": 5, "knowledge": 5, "communication": 5}
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, reviewer_id, reviewee_id)
);

-- ============================================================================
-- Q&A SYSTEM
-- ============================================================================

CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  images TEXT[],
  level VARCHAR(50),
  bounty_credits INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'answered', 'closed')),
  views INTEGER DEFAULT 0,
  accepted_answer_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  images TEXT[],
  is_accepted BOOLEAN DEFAULT FALSE,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- NOTES MARKETPLACE
-- ============================================================================

CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content_url TEXT NOT NULL,
  preview_url TEXT,
  file_type VARCHAR(50),
  file_size INTEGER,
  level VARCHAR(50),
  price_credits INTEGER NOT NULL,
  downloads INTEGER DEFAULT 0,
  average_rating DECIMAL(3, 2) DEFAULT 0,
  total_ratings INTEGER DEFAULT 0,
  tags TEXT[],
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'flagged')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS note_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id UUID REFERENCES notes(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  credits_paid INTEGER NOT NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  review TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(note_id, buyer_id)
);

-- ============================================================================
-- STUDY BUDDY MATCHING
-- ============================================================================

CREATE TABLE IF NOT EXISTS study_buddy_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  subjects UUID[] NOT NULL,
  goals TEXT,
  study_style VARCHAR(50),
  preferred_schedule JSONB,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS study_buddy_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  user2_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  subjects UUID[],
  compatibility_score DECIMAL(3, 2),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user1_id, user2_id)
);

-- ============================================================================
-- ACCOUNTABILITY PROGRAMS
-- ============================================================================

CREATE TABLE IF NOT EXISTS accountability_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  goal_type VARCHAR(50),
  goal_description TEXT,
  credits_staked INTEGER NOT NULL,
  target_date DATE,
  frequency VARCHAR(20),
  required_checkins INTEGER,
  completed_checkins INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'failed', 'cancelled')),
  credits_returned INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS accountability_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID REFERENCES accountability_programs(id) ON DELETE CASCADE,
  checkin_date DATE NOT NULL,
  notes TEXT,
  proof_url TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- MESSAGING
-- ============================================================================

CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS conversation_participants (
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  last_read_at TIMESTAMPTZ,
  PRIMARY KEY (conversation_id, user_id)
);

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  attachments TEXT[],
  read_by UUID[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- MODERATION & REPORTING
-- ============================================================================

CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  reported_user_id UUID REFERENCES profiles(id),
  reported_content_type VARCHAR(50),
  reported_content_id UUID,
  reason VARCHAR(100) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'investigating', 'resolved', 'dismissed')),
  moderator_id UUID REFERENCES profiles(id),
  moderator_notes TEXT,
  action_taken VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- ============================================================================
-- NOTIFICATIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_user_subjects_user ON user_subjects(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subjects_subject ON user_subjects(subject_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user ON credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_holds_user ON credit_holds(user_id);
CREATE INDEX IF NOT EXISTS idx_tutor_pricing_tutor ON tutor_pricing(tutor_id);
CREATE INDEX IF NOT EXISTS idx_tutor_availability_tutor ON tutor_availability(tutor_id);
CREATE INDEX IF NOT EXISTS idx_sessions_student ON sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_sessions_tutor ON sessions(tutor_id);
CREATE INDEX IF NOT EXISTS idx_session_requests_student ON session_requests(student_id);
CREATE INDEX IF NOT EXISTS idx_questions_author ON questions(author_id);
CREATE INDEX IF NOT EXISTS idx_questions_subject ON questions(subject_id);
CREATE INDEX IF NOT EXISTS idx_answers_question ON answers(question_id);
CREATE INDEX IF NOT EXISTS idx_notes_author ON notes(author_id);
CREATE INDEX IF NOT EXISTS idx_notes_subject ON notes(subject_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_holds ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutor_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutor_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutor_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Public read for subjects
CREATE POLICY "Subjects are viewable by everyone" ON subjects FOR SELECT USING (true);

-- User subjects policies
CREATE POLICY "Users can view all user subjects" ON user_subjects FOR SELECT USING (true);
CREATE POLICY "Users can manage their own subjects" ON user_subjects FOR ALL USING (auth.uid() = user_id);

-- Credit transactions policies
CREATE POLICY "Users can view their own transactions" ON credit_transactions FOR SELECT USING (auth.uid() = user_id);

-- Tutor policies
CREATE POLICY "Tutor pricing is viewable by all" ON tutor_pricing FOR SELECT USING (active = true);
CREATE POLICY "Tutors can manage their own pricing" ON tutor_pricing FOR ALL USING (auth.uid() = tutor_id);

CREATE POLICY "Availability is viewable by all" ON tutor_availability FOR SELECT USING (active = true);
CREATE POLICY "Tutors can manage their availability" ON tutor_availability FOR ALL USING (auth.uid() = tutor_id);

CREATE POLICY "Tutor stats are viewable by all" ON tutor_stats FOR SELECT USING (true);

-- Session policies
CREATE POLICY "Users can view sessions they're part of" ON session_participants FOR SELECT 
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM sessions WHERE id = session_id AND (student_id = auth.uid() OR tutor_id = auth.uid())
  ));

CREATE POLICY "Session requests viewable by creator and tutors" ON session_requests FOR SELECT USING (
  auth.uid() = student_id OR 
  (status = 'pending' AND EXISTS (SELECT 1 FROM tutor_pricing WHERE tutor_id = auth.uid()))
);

-- Q&A policies
CREATE POLICY "Questions are viewable by all" ON questions FOR SELECT USING (true);
CREATE POLICY "Users can create questions" ON questions FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update their own questions" ON questions FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Answers are viewable by all" ON answers FOR SELECT USING (true);
CREATE POLICY "Users can create answers" ON answers FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Notes policies
CREATE POLICY "Active notes are viewable by all" ON notes FOR SELECT USING (status = 'active');
CREATE POLICY "Authors can manage their notes" ON notes FOR ALL USING (auth.uid() = author_id);

CREATE POLICY "Users can view their purchases" ON note_purchases FOR SELECT USING (auth.uid() = buyer_id);

-- Messaging policies
CREATE POLICY "Users can view their conversations" ON conversation_participants FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view messages in their conversations" ON messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM conversation_participants WHERE conversation_id = messages.conversation_id AND user_id = auth.uid())
);

-- Notification policies
CREATE POLICY "Users can view their own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Insert default subjects
INSERT INTO subjects (name, category, difficulty_level) VALUES
  ('Mathematics', 'STEM', 3),
  ('Physics', 'STEM', 4),
  ('Chemistry', 'STEM', 4),
  ('Biology', 'STEM', 3),
  ('English', 'Language Arts', 2),
  ('Spanish', 'Language', 2),
  ('French', 'Language', 2),
  ('History', 'Social Studies', 2),
  ('Computer Science', 'STEM', 4),
  ('Statistics', 'STEM', 3)
ON CONFLICT (name) DO NOTHING;

-- Insert credit packages
INSERT INTO credit_packages (name, credits, price_usd, bonus_credits, popular) VALUES
  ('Starter Pack', 10, 5.00, 0, false),
  ('Student Pack', 25, 10.00, 2, true),
  ('Pro Pack', 50, 18.00, 5, false),
  ('Premium Pack', 100, 30.00, 15, true),
  ('Ultimate Pack', 250, 65.00, 50, false)
ON CONFLICT DO NOTHING;
