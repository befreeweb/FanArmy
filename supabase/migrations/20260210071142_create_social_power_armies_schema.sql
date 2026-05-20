/*
  # Social Power Armies - Core Schema

  1. New Tables
    - `profiles` - User profiles extending auth.users
      - `id` (uuid, primary key, references auth.users)
      - `email` (text)
      - `display_name` (text)
      - `avatar_url` (text, nullable)
      - `bio` (text, nullable)
      - `region` (text, nullable)
      - `role` (text: fan/editor/admin)
      - `rank` (text: rookie/analyst/strategist/oracle/scout)
      - `total_points` (integer)
      - `prediction_accuracy` (numeric)
      - `streak_days` (integer)
    - `actors` - Actor profiles
      - `id` (uuid, primary key)
      - `name`, `slug`, `image_url`, `bio`, `language`, `debut_year`, `is_active`
    - `armies` - One army per actor
      - `id` (uuid, primary key)
      - `actor_id` (references actors)
      - `name`, `slug`, `total_score`, `member_count`, `credibility_rating`
    - `army_members` - User-army membership
      - `id` (uuid, primary key)
      - `user_id` (references profiles), `army_id` (references armies)
      - `contribution_score`, `rank_in_army`
    - `films` - Film entries
      - `id` (uuid, primary key)
      - `title`, `slug`, `poster_url`, `synopsis`, `release_date`, `genre`, `language`
      - `budget_range`, `box_office_expected_low`, `box_office_expected_high`, `box_office_actual`
      - `trailer_url`, `status`
    - `film_cast` - Links films to actors
    - `film_campaigns` - Promotion lifecycle per film
    - `missions` - Tasks for army members
    - `mission_submissions` - User submissions for missions
    - `predictions` - Box office predictions
    - `daily_questions` - Daily micro-prediction questions
    - `daily_answers` - User answers to daily questions
    - `badges` - Achievement badges
    - `user_badges` - Earned badges
    - `seasons` - Competitive seasons

  2. Security
    - RLS enabled on all tables
    - Public read on actors, armies, films, missions, daily_questions, badges, seasons
    - Authenticated write on profiles (own), army_members (own), mission_submissions (own), predictions (own), daily_answers (own)
    - Admin write on actors, films, missions, campaigns, daily_questions, badges

  3. Notes
    - All IDs use uuid with gen_random_uuid()
    - Timestamps default to now()
    - Scoring defaults to 0
*/

-- Profiles
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL DEFAULT '',
  display_name text NOT NULL DEFAULT '',
  avatar_url text,
  bio text,
  region text,
  role text NOT NULL DEFAULT 'fan' CHECK (role IN ('fan', 'editor', 'admin')),
  rank text NOT NULL DEFAULT 'rookie' CHECK (rank IN ('rookie', 'analyst', 'strategist', 'oracle', 'scout')),
  total_points integer NOT NULL DEFAULT 0,
  prediction_accuracy numeric NOT NULL DEFAULT 0,
  streak_days integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION handle_new_user();
  END IF;
END $$;

-- Actors
CREATE TABLE IF NOT EXISTS actors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  image_url text,
  bio text,
  language text NOT NULL DEFAULT 'Hindi',
  debut_year integer,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE actors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view actors"
  ON actors FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert actors"
  ON actors FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
  );

CREATE POLICY "Admins can update actors"
  ON actors FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
  );

-- Armies
CREATE TABLE IF NOT EXISTS armies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid NOT NULL REFERENCES actors(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  total_score integer NOT NULL DEFAULT 0,
  member_count integer NOT NULL DEFAULT 0,
  credibility_rating numeric NOT NULL DEFAULT 50,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE armies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view armies"
  ON armies FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert armies"
  ON armies FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
  );

CREATE POLICY "Admins can update armies"
  ON armies FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
  );

-- Army Members
CREATE TABLE IF NOT EXISTS army_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  army_id uuid NOT NULL REFERENCES armies(id) ON DELETE CASCADE,
  contribution_score integer NOT NULL DEFAULT 0,
  rank_in_army integer NOT NULL DEFAULT 0,
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, army_id)
);

ALTER TABLE army_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view army members"
  ON army_members FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can join armies"
  ON army_members FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave armies"
  ON army_members FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Films
CREATE TABLE IF NOT EXISTS films (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  poster_url text,
  synopsis text,
  release_date date NOT NULL,
  genre text NOT NULL DEFAULT '',
  language text NOT NULL DEFAULT 'Hindi',
  budget_range text,
  box_office_expected_low numeric,
  box_office_expected_high numeric,
  box_office_actual numeric,
  trailer_url text,
  status text NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'released', 'archived')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE films ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view films"
  ON films FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert films"
  ON films FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
  );

CREATE POLICY "Admins can update films"
  ON films FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
  );

-- Film Cast
CREATE TABLE IF NOT EXISTS film_cast (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  film_id uuid NOT NULL REFERENCES films(id) ON DELETE CASCADE,
  actor_id uuid NOT NULL REFERENCES actors(id) ON DELETE CASCADE,
  role_name text,
  UNIQUE(film_id, actor_id)
);

ALTER TABLE film_cast ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view film cast"
  ON film_cast FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage film cast"
  ON film_cast FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
  );

-- Film Campaigns
CREATE TABLE IF NOT EXISTS film_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  film_id uuid NOT NULL REFERENCES films(id) ON DELETE CASCADE,
  start_date date NOT NULL,
  end_date date NOT NULL,
  phase text NOT NULL DEFAULT 'pre_release' CHECK (phase IN ('pre_release', 'release_week', 'post_release')),
  is_sponsored boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE film_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view campaigns"
  ON film_campaigns FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert campaigns"
  ON film_campaigns FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
  );

CREATE POLICY "Admins can update campaigns"
  ON film_campaigns FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
  );

-- Missions
CREATE TABLE IF NOT EXISTS missions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  mission_type text NOT NULL DEFAULT 'custom' CHECK (mission_type IN ('trailer_intelligence', 'momentum_watch', 'buzz_poll', 'activation', 'directors_cut', 'custom')),
  campaign_id uuid NOT NULL REFERENCES film_campaigns(id) ON DELETE CASCADE,
  points_value integer NOT NULL DEFAULT 10,
  starts_at timestamptz NOT NULL DEFAULT now(),
  ends_at timestamptz NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  participation_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE missions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view missions"
  ON missions FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert missions"
  ON missions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
  );

CREATE POLICY "Admins can update missions"
  ON missions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
  );

-- Mission Submissions
CREATE TABLE IF NOT EXISTS mission_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  mission_id uuid NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  submission_data jsonb NOT NULL DEFAULT '{}',
  is_validated boolean NOT NULL DEFAULT false,
  points_awarded integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, mission_id)
);

ALTER TABLE mission_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own submissions"
  ON mission_submissions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all submissions"
  ON mission_submissions FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
  );

CREATE POLICY "Users can submit missions"
  ON mission_submissions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Predictions
CREATE TABLE IF NOT EXISTS predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  film_id uuid NOT NULL REFERENCES films(id) ON DELETE CASCADE,
  prediction_type text NOT NULL DEFAULT 'opening_weekend' CHECK (prediction_type IN ('opening_day', 'opening_weekend', 'lifetime', 'day_breakdown')),
  predicted_value numeric NOT NULL,
  actual_value numeric,
  accuracy_score numeric,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, film_id, prediction_type)
);

ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own predictions"
  ON predictions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all predictions"
  ON predictions FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
  );

CREATE POLICY "Users can create predictions"
  ON predictions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own predictions"
  ON predictions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Daily Questions
CREATE TABLE IF NOT EXISTS daily_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_text text NOT NULL,
  question_type text NOT NULL DEFAULT 'over_under' CHECK (question_type IN ('over_under', 'true_false', 'multiple_choice', 'prediction')),
  options jsonb,
  correct_answer text,
  points_value integer NOT NULL DEFAULT 5,
  active_date date NOT NULL DEFAULT CURRENT_DATE,
  is_resolved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE daily_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view daily questions"
  ON daily_questions FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage daily questions"
  ON daily_questions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
  );

CREATE POLICY "Admins can update daily questions"
  ON daily_questions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
  );

-- Daily Answers
CREATE TABLE IF NOT EXISTS daily_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES daily_questions(id) ON DELETE CASCADE,
  answer text NOT NULL,
  is_correct boolean,
  points_awarded integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, question_id)
);

ALTER TABLE daily_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own daily answers"
  ON daily_answers FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can submit daily answers"
  ON daily_answers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Badges
CREATE TABLE IF NOT EXISTS badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT 'award',
  tier text NOT NULL DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
  criteria jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view badges"
  ON badges FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage badges"
  ON badges FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
  );

-- User Badges
CREATE TABLE IF NOT EXISTS user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id uuid NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  earned_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own badges"
  ON user_badges FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can grant badges"
  ON user_badges FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Seasons
CREATE TABLE IF NOT EXISTS seasons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  status text NOT NULL DEFAULT 'upcoming' CHECK (status IN ('active', 'completed', 'upcoming')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE seasons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view seasons"
  ON seasons FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage seasons"
  ON seasons FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
  );

CREATE POLICY "Admins can update seasons"
  ON seasons FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_armies_actor_id ON armies(actor_id);
CREATE INDEX IF NOT EXISTS idx_armies_total_score ON armies(total_score DESC);
CREATE INDEX IF NOT EXISTS idx_army_members_user_id ON army_members(user_id);
CREATE INDEX IF NOT EXISTS idx_army_members_army_id ON army_members(army_id);
CREATE INDEX IF NOT EXISTS idx_films_status ON films(status);
CREATE INDEX IF NOT EXISTS idx_films_release_date ON films(release_date);
CREATE INDEX IF NOT EXISTS idx_film_cast_film_id ON film_cast(film_id);
CREATE INDEX IF NOT EXISTS idx_film_cast_actor_id ON film_cast(actor_id);
CREATE INDEX IF NOT EXISTS idx_missions_campaign_id ON missions(campaign_id);
CREATE INDEX IF NOT EXISTS idx_missions_active ON missions(is_active, ends_at);
CREATE INDEX IF NOT EXISTS idx_mission_submissions_user ON mission_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_mission_submissions_mission ON mission_submissions(mission_id);
CREATE INDEX IF NOT EXISTS idx_predictions_user ON predictions(user_id);
CREATE INDEX IF NOT EXISTS idx_predictions_film ON predictions(film_id);
CREATE INDEX IF NOT EXISTS idx_daily_questions_date ON daily_questions(active_date);
CREATE INDEX IF NOT EXISTS idx_daily_answers_user ON daily_answers(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_region ON profiles(region);
CREATE INDEX IF NOT EXISTS idx_profiles_rank ON profiles(rank);
