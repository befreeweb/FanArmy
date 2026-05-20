export interface Profile {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  region: string | null;
  role: 'fan' | 'editor' | 'admin';
  rank: 'rookie' | 'analyst' | 'strategist' | 'oracle' | 'scout';
  total_points: number;
  prediction_accuracy: number;
  streak_days: number;
  created_at: string;
}

export interface Actor {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  bio: string | null;
  language: string;
  debut_year: number | null;
  is_active: boolean;
  created_at: string;
}

export interface Army {
  id: string;
  actor_id: string;
  name: string;
  slug: string;
  total_score: number;
  member_count: number;
  credibility_rating: number;
  created_at: string;
  actor?: Actor;
}

export interface ArmyMember {
  id: string;
  user_id: string;
  army_id: string;
  contribution_score: number;
  rank_in_army: number;
  joined_at: string;
  profile?: Profile;
}

export interface Film {
  id: string;
  title: string;
  slug: string;
  poster_url: string | null;
  synopsis: string | null;
  release_date: string;
  genre: string;
  language: string;
  budget_range: string | null;
  box_office_expected_low: number | null;
  box_office_expected_high: number | null;
  box_office_actual: number | null;
  trailer_url: string | null;
  status: 'upcoming' | 'released' | 'archived';
  created_at: string;
}

export interface FilmCast {
  id: string;
  film_id: string;
  actor_id: string;
  role_name: string | null;
  actor?: Actor;
}

export interface FilmCampaign {
  id: string;
  film_id: string;
  start_date: string;
  end_date: string;
  phase: 'pre_release' | 'release_week' | 'post_release';
  is_sponsored: boolean;
  created_at: string;
  film?: Film;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  mission_type: 'trailer_intelligence' | 'momentum_watch' | 'buzz_poll' | 'activation' | 'directors_cut' | 'custom';
  campaign_id: string;
  points_value: number;
  starts_at: string;
  ends_at: string;
  is_active: boolean;
  participation_count: number;
  created_at: string;
  campaign?: FilmCampaign;
}

export interface MissionSubmission {
  id: string;
  user_id: string;
  mission_id: string;
  submission_data: Record<string, unknown>;
  is_validated: boolean;
  points_awarded: number;
  created_at: string;
}

export interface Prediction {
  id: string;
  user_id: string;
  film_id: string;
  prediction_type: 'opening_day' | 'opening_weekend' | 'lifetime' | 'day_breakdown';
  predicted_value: number;
  actual_value: number | null;
  accuracy_score: number | null;
  created_at: string;
  film?: Film;
}

export interface DailyQuestion {
  id: string;
  question_text: string;
  question_type: 'over_under' | 'true_false' | 'multiple_choice' | 'prediction';
  options: Record<string, unknown> | null;
  correct_answer: string | null;
  points_value: number;
  active_date: string;
  is_resolved: boolean;
  created_at: string;
}

export interface DailyAnswer {
  id: string;
  user_id: string;
  question_id: string;
  answer: string;
  is_correct: boolean | null;
  points_awarded: number;
  created_at: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  criteria: Record<string, unknown>;
  created_at: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
  badge?: Badge;
}

export interface Season {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  status: 'active' | 'completed' | 'upcoming';
  created_at: string;
}
