import type { LearningModule, SectionId } from "../types";

interface ModuleNavProps {
  module: LearningModule;
  selectedSectionId: SectionId;
  onSelect: (sectionId: SectionId) => void;
}

export function ModuleNav({
  module,
  selectedSectionId,
  onSelect
}: ModuleNavProps) {
  return (
    <nav className="module-nav" aria-label={`${module.title} sections`}>
      {module.sections.map((section) => (
        <button
          key={section.id}
          type="button"
          className={section.id === selectedSectionId ? "nav-pill is-active" : "nav-pill"}
          aria-current={section.id === selectedSectionId ? "page" : undefined}
          onClick={() => onSelect(section.id)}
        >
          {section.navLabel}
        </button>
      ))}
    </nav>
  );
}