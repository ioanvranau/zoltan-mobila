import type { Project } from "@/data/types";

export function ProjectMeta({ project }: { project: Project }) {
  const rows: { label: string; value: string }[] = [
    { label: "Categorie", value: { bucatarii: "Bucătărie", dressing: "Dressing", living: "Living", dormitor: "Dormitor" }[project.category] },
    { label: "Material", value: project.meta.material },
    { label: "An", value: String(project.meta.year) },
    { label: "Locație", value: project.meta.location },
    ...(project.meta.surface ? [{ label: "Suprafață", value: `${project.meta.surface} mp` }] : []),
    ...(project.meta.finishes?.length ? [{ label: "Finisaje", value: project.meta.finishes.join(" · ") }] : []),
  ];
  return (
    <dl className="divide-y divide-line border-y border-line">
      {rows.map((r) => (
        <div key={r.label} className="grid grid-cols-[7rem_1fr] gap-4 py-3 text-sm">
          <dt className="text-text-muted">{r.label}</dt>
          <dd className="text-text">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}
