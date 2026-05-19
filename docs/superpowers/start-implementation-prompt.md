# Start-implementation prompt

Paste this into a fresh Claude Code session opened at the repo root
(`C:\projects\smallprojects\zoltan-mobila`).

---

Read the approved design spec at `docs/superpowers/specs/2026-05-19-zoltan-mobila-poc-design.md`
and implement it. Also read the sister project at `../totalparquet` (`CLAUDE.md`, `package.json`,
`components/`, `app/`) for stack patterns to mirror — same Next.js 16 + TS + Tailwind v4 setup,
same `next/font/google` approach, same `yet-another-react-lightbox`. Don't copy code wholesale;
mirror the conventions.

Working preferences (same as totalparquet):
- Main branch is `develop`. Work directly on it; no feature branches, no PRs.
- Do NOT run `git commit`, `git push`, `netlify`, or `vercel` commands. I handle all commits,
  pushes, and deploys myself. If you need me to commit something, ask.
- Romanian copy is non-negotiable — never translate UI strings to English.
- Keep responses concise. Push back if I ask for overkill.

Process:

1. First, invoke the `superpowers:writing-plans` skill to turn the spec into a step-by-step
   implementation plan. Save the plan to `docs/superpowers/plans/2026-05-19-zoltan-mobila-poc-plan.md`.
   Show me the plan before starting any code.
2. Then invoke `superpowers:subagent-driven-development` to execute the plan in this same session.
   Dispatch Sonnet subagents for the mechanical/parallel parts (multiple page builds, swatch tiles,
   per-project portfolio detail files) but build the foundation yourself first — scaffold, design
   tokens in `globals.css` + `tailwind.config`, layout shell (Navbar + Footer + Container + Section +
   PillButton), and the `/data/types.ts` + stub data files. Subagents need that foundation locked
   before they diverge on conventions.
3. Before downloading photos, commit `photo-manifest.json` so I can review the Unsplash picks
   in the diff. Wait for my OK, then run the download script.
4. Test the contact form end-to-end (Server Action + Resend) before claiming done. I'll need to
   provide a `RESEND_API_KEY` — ask me when you reach that step.
5. End state: site runs on `npm run dev`, all six pages work, contact form sends a real email
   to my address, demonstration banner shows on staging. I'll deploy to Netlify separately.

Reference for stock photos: Unsplash only (free, commercial-OK, no attribution required but I
want a `photos-attribution.md` anyway). Brand name placeholder throughout: "Zoltan · Mobilă la
comandă". Photo curation principles, color tokens, page layouts, and full component inventory
are all in the spec — follow it.
