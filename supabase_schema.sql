-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles Table (Extends Supabase Auth)
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  role text check (role in ('student', 'tutor', 'parent')) default 'student',
  name text,
  avatar_url text,
  credits int default 100, -- Default free credits
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Tutors Table (Extra info for tutors)
create table public.tutors (
  id uuid references public.profiles(id) not null primary key,
  subjects text[],
  hourly_rate int default 50,
  bio text,
  experience text,
  education text,
  rating numeric default 5.0,
  verified boolean default false
);

-- 3. Sessions Table (Class bookings)
create table public.sessions (
  id uuid default uuid_generate_v4() primary key,
  student_id uuid references public.profiles(id) not null,
  tutor_id uuid references public.profiles(id) not null,
  subject text not null,
  scheduled_time timestamp with time zone not null,
  duration int not null, -- in minutes
  cost int not null,
  status text check (status in ('pending', 'confirmed', 'completed', 'cancelled')) default 'confirmed',
  meeting_link text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.tutors enable row level security;
alter table public.sessions enable row level security;

-- 5. RLS Policies

-- Profiles: Everyone can read basic info, Users can update their own
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using ( true );

create policy "Users can update own profile"
  on public.profiles for update
  using ( auth.uid() = id );

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check ( auth.uid() = id );

-- Tutors: Public read, Tutors update own
create policy "Tutors are viewable by everyone"
  on public.tutors for select
  using ( true );

create policy "Tutors can update own info"
  on public.tutors for update
  using ( auth.uid() = id );

create policy "Tutors can insert own info"
  on public.tutors for insert
  with check ( auth.uid() = id );

-- Sessions: Users can see their own sessions (as student or tutor)
create policy "Users can view own sessions"
  on public.sessions for select
  using ( auth.uid() = student_id or auth.uid() = tutor_id );

create policy "Students can create sessions"
  on public.sessions for insert
  with check ( auth.uid() = student_id );

-- 6. Trigger to automatically create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'name', coalesce(new.raw_user_meta_data->>'role', 'student'));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
