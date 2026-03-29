-- Post-it Notes 테이블
create table post_it_notes (
  id uuid default gen_random_uuid() primary key,
  content text not null check (char_length(content) <= 100),
  x float not null,
  y float not null,
  color text not null,
  rotation float not null default 0,
  fingerprint text not null,
  avatar_url text not null,
  created_at timestamptz default now() not null
);

-- 아바타 이미지 저장용 스토리지 버킷
-- Supabase 대시보드 > Storage > New bucket 에서 생성:
--   이름: avatars
--   Public: true (누구나 이미지 접근 가능)
-- 이후 애니 캐릭터 이미지 업로드 (예: avatar-01.png ~ avatar-20.png)

-- 최대 20개 제한을 위한 함수
create or replace function check_post_it_limit()
returns trigger as $$
begin
  if (select count(*) from post_it_notes) >= 20 then
    raise exception 'Maximum 20 post-it notes allowed';
  end if;
  return new;
end;
$$ language plpgsql;

create trigger enforce_post_it_limit
  before insert on post_it_notes
  for each row execute function check_post_it_limit();

-- 같은 fingerprint 중복 방지
create unique index unique_fingerprint on post_it_notes (fingerprint);

-- RLS 활성화
alter table post_it_notes enable row level security;

-- 누구나 읽기 가능
create policy "Anyone can read post-it notes"
  on post_it_notes for select
  using (true);

-- 검증 강화된 insert 정책 (curl 등 직접 API 호출 방어)
create policy "Validated insert only"
  on post_it_notes for insert
  with check (
    char_length(content) between 1 and 100
    and x between 0 and 100
    and y between 0 and 100
    and rotation between -10 and 10
    and color in ('#FF6B6B','#4ECDC4','#FFE66D','#A8E6CF','#FF8B94','#DDA0DD','#87CEEB')
    and avatar_url like '%supabase.co/storage/v1/object/public/avatars/%'
  );

-- 삭제는 service_role만 가능 (관리자용 — Supabase 대시보드에서 직접 삭제)
-- anon key로는 삭제 불가
