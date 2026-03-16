"use client";

export function ResumeContent() {
  return (
    <div className="p-6 font-neo text-sm text-neo-text">
      <div className="flex gap-4 items-center mb-5">
        <div className="w-16 h-16 rounded-xl bg-neo-accent border-3 border-neo-border shadow-neo-md flex items-center justify-center text-[28px]">
          👤
        </div>
        <div>
          <p className="text-lg font-bold m-0 font-neo-heading">곡식규 (Kyu-sik Ko)</p>
          <p className="text-gray-500 my-1 text-[13px] font-medium">Full-Stack Developer</p>
          <p className="text-neo-primary m-0 text-xs font-semibold">kks@adenasoft.com</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-[13px] font-bold text-neo-text mb-2 uppercase tracking-wide font-neo-heading">Skills</p>
        <div className="flex gap-1.5 flex-wrap">
          {[
            { name: "React", color: "bg-neo-secondary" },
            { name: "Next.js", color: "bg-neo-primary" },
            { name: "TypeScript", color: "bg-neo-info" },
            { name: "NestJS", color: "bg-neo-warning" },
            { name: "Docker", color: "bg-neo-secondary" },
            { name: "Svelte", color: "bg-neo-accent" },
            { name: "Vue", color: "bg-neo-success" },
          ].map((s) => (
            <span key={s.name} className={`${s.color} py-0.5 px-2.5 text-xs rounded-lg font-semibold text-neo-text border-2 border-neo-border shadow-neo-sm`}>
              {s.name}
            </span>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[13px] font-bold text-neo-text mb-2 uppercase tracking-wide font-neo-heading">About</p>
        <div className="p-4 bg-neo-bg border-3 border-neo-border rounded-xl shadow-neo-md">
          <p className="m-0 leading-7 text-[13px] font-medium">
            큐니버스에 오신 것을 환영합니다! 🌍<br />
            개발, 운동, 독서, 패션을 좋아하는 풀스택 개발자입니다.
          </p>
        </div>
      </div>
    </div>
  );
}

export function GithubContent() {
  const repos = [
    { name: "kyuniverse", lang: "TypeScript", color: "bg-neo-info" },
    { name: "kofetch", lang: "JavaScript", color: "bg-neo-accent" },
    { name: "medic-app", lang: "TypeScript", color: "bg-neo-info" },
    { name: "ilove-skills", lang: "TypeScript", color: "bg-neo-info" },
  ];

  return (
    <div className="p-6 font-neo text-sm text-neo-text">
      <p className="text-[13px] font-bold mb-3 uppercase tracking-wide font-neo-heading">
        GitHub Repositories
      </p>
      <div className="flex flex-col gap-2">
        {repos.map((repo) => (
          <div key={repo.name} className="py-3 px-4 bg-neo-surface border-3 border-neo-border rounded-xl shadow-neo-md flex items-center justify-between">
            <div>
              <p className="m-0 font-bold text-sm">{repo.name}</p>
              <span className={`${repo.color} inline-block mt-1 text-[11px] py-px px-2 rounded-md font-semibold border-2 border-neo-border`}>
                {repo.lang}
              </span>
            </div>
            <span className="text-sm font-bold">⭐</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PlaceholderContent({ title, icon }: { title: string; icon: string }) {
  return (
    <div className="p-8 font-neo flex flex-col items-center justify-center h-full gap-3 text-neo-text">
      <div className="w-[72px] h-[72px] rounded-2xl bg-neo-accent border-3 border-neo-border shadow-neo-md flex items-center justify-center text-4xl">
        {icon}
      </div>
      <p className="text-base font-bold m-0 font-neo-heading">{title}</p>
      <div className="py-3 px-5 bg-neo-bg border-3 border-neo-border rounded-xl shadow-neo-sm text-center">
        <p className="text-[13px] m-0 text-gray-500 font-medium leading-relaxed">
          컨텐츠가 이곳에 표시됩니다.<br />(리뉴얼 시 기존 컨텐츠가 이식될 예정)
        </p>
      </div>
    </div>
  );
}
