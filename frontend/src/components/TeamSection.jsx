import React, { useState } from 'react';
import { Users, Mail, Github, ExternalLink, ShieldCheck, Cpu, Code2, Award, Copy, Check, Sparkles } from 'lucide-react';

export default function TeamSection() {
  const [copiedEmail, setCopiedEmail] = useState(null);

  const copyToClipboard = (email) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2500);
  };

  const members = [
    {
      name: "Nguyen Xuan Hau",
      role: "Team Leader / AI Solutions & Prompt Engineer",
      email: "nguyenxuanhau890@gmail.com",
      github: "XuanHauNguyen2405",
      githubUrl: "https://github.com/XuanHauNguyen2405",
      avatarInitials: "NH",
      accentColor: "from-berry-500 to-rose-600",
      badgeColor: "bg-berry-500/10 text-berry-400 border-berry-500/30",
      bio: "Leads team coordination, structured prompt engineering, AMD Token Factory LLM integration, and commerce complaint-to-task workflow formulation.",
      contributions: [
        "LLM root-cause clustering and task synthesis prompt design",
        "AMD Radeon Cloud Token Factory model orchestration",
        "Commerce operations ontology and checklist design",
        "Product scoping and hackathon submission lead"
      ]
    },
    {
      name: "Senuke Weragama",
      role: "Full-Stack Developer & Cloud Architect",
      email: "senukeweragama2004@gmail.com",
      github: "senu-io",
      githubUrl: "https://github.com/senu-io",
      avatarInitials: "SW",
      accentColor: "from-neon-cyan to-blue-600",
      badgeColor: "bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30",
      bio: "Engineered the full-stack architecture, FastAPI async backend, React dashboard with real-time telemetry, and resilient multi-model failover engine.",
      contributions: [
        "FastAPI async backend with AMD Token Factory integration",
        "React interactive dashboard, Kanban board, and modals",
        "Multi-model failover and token budget optimizer",
        "Containerization and GitHub repository orchestration"
      ]
    }
  ];

  return (
    <div className="space-y-6 pt-2">
      {/* Section Header Banner */}
      <div className="bg-gradient-to-r from-obsidian-900 via-obsidian-850 to-obsidian-900 border border-obsidian-750/90 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-berry-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-berry-500/15 text-berry-400 border border-berry-500/30 uppercase tracking-wider">
                Hackathon Team Profile
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-neon-purple/15 text-neon-purple border border-neon-purple/30">
                Track 3: Reinvent Commerce
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>Team Voyagers</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-obsidian-800 text-slate-300 border border-obsidian-700">
                Rome, Italy (On-Site)
              </span>
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Formed for the <strong className="text-white">AMD Developer Hackathon: ACT III</strong> in Rome, Italy. 
              Reviewberry transforms unstructured customer complaints across delivery and retail channels into concrete, assignable business tasks powered by AMD Radeon Cloud.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 font-mono text-xs text-slate-300">
            <div className="bg-obsidian-950/80 px-4 py-2.5 rounded-xl border border-obsidian-750 flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-red-500" />
              <span>AMD Radeon Cloud Acceleration</span>
            </div>
            <a
              href="https://github.com/senu-io/Reviewberry"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-obsidian-950/80 hover:bg-obsidian-800 px-4 py-2.5 rounded-xl border border-obsidian-750 hover:border-berry-500/50 flex items-center space-x-2 text-slate-200 transition-colors"
            >
              <Github className="w-4 h-4 text-slate-300" />
              <span>GitHub Repository</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>
        </div>
      </div>

      {/* Member Profile Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {members.map((member, idx) => (
          <div
            key={idx}
            className="bg-obsidian-900/90 border border-obsidian-750/90 rounded-2xl p-6 shadow-xl flex flex-col justify-between hover:border-berry-500/40 transition-all group relative overflow-hidden"
          >
            <div className="space-y-4">
              {/* Header: Avatar, Name, Role */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center space-x-3.5">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${member.accentColor} flex items-center justify-center text-white font-extrabold text-lg shadow-md flex-shrink-0`}>
                    {member.avatarInitials}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-berry-400 transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">
                      {member.role}
                    </p>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${member.badgeColor}`}>
                  Voyagers
                </span>
              </div>

              {/* Bio */}
              <p className="text-xs text-slate-300 leading-relaxed">
                {member.bio}
              </p>

              {/* Core Contributions */}
              <div className="space-y-1.5 pt-2 border-t border-obsidian-800">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Core Responsibilities
                </span>
                <ul className="space-y-1 text-xs text-slate-300">
                  {member.contributions.map((c, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-berry-500 mt-1.5 flex-shrink-0" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Footer Contact Actions */}
            <div className="pt-5 mt-5 border-t border-obsidian-800/80 flex flex-wrap items-center justify-between gap-2.5">
              {/* Email Button */}
              <div className="flex items-center space-x-2">
                <a
                  href={`mailto:${member.email}`}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-obsidian-950 hover:bg-obsidian-800 border border-obsidian-750 text-xs font-mono text-slate-300 hover:text-white transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-berry-400" />
                  <span>{member.email}</span>
                </a>
                <button
                  onClick={() => copyToClipboard(member.email)}
                  className="p-1.5 rounded-lg bg-obsidian-950 hover:bg-obsidian-800 border border-obsidian-750 text-slate-400 hover:text-white transition-colors"
                  title="Copy email address"
                >
                  {copiedEmail === member.email ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* GitHub Link */}
              <a
                href={member.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-obsidian-950 hover:bg-obsidian-800 border border-obsidian-750 text-xs text-slate-300 hover:text-white transition-colors"
              >
                <Github className="w-3.5 h-3.5 text-slate-400" />
                <span>@{member.github}</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Project & Event Highlights Card */}
      <div className="bg-obsidian-900/60 border border-obsidian-750/70 rounded-2xl p-5 text-xs text-slate-400 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-obsidian-800 gap-2">
          <div className="font-bold text-slate-200 text-sm">
            AMD ACT III Hackathon: Rome, Italy
          </div>
          <div className="text-slate-400 font-mono text-[11px]">
            Track: Reinvent Commerce (Vibe Generation with AMD)
          </div>
        </div>
        <p className="leading-relaxed">
          Reviewberry demonstrates how modern commerce operations can proactively convert fragmented customer sentiment into structured action. Instead of a passive analytics dashboard, Reviewberry provides root-cause diagnosis, verbatim evidence linking, actionable Kanban tasking, closed-loop customer apology replies, and internal staff SOP briefing memos powered by the AMD Radeon Cloud Token Factory.
        </p>
      </div>
    </div>
  );
}
