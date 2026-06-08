"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, FolderKanban, ArrowUpRight,} from "lucide-react";

type Project = {
  id: string;
  title: string;
  description?: string;
  budget?: number;
  progress?: number;
  currentPhase?: string | string[];
  status?: string;
  startDate?: string;
  endDate?: string;
};

interface EngineerProjectsCarouselProps {
  projects: Project[];
  onProjectSelect?: (project: Project) => void;
}

export default function EngineerProjectsCarousel({
  projects,
  onProjectSelect,
}: EngineerProjectsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({
      left: -380,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({
      left: 380,
      behavior: "smooth",
    });
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";

      case "COMPLETED":
        return "bg-green-100 text-green-700 border-green-200";

      case "CANCELLED":
        return "bg-red-100 text-red-700 border-red-200";

      case "AWAITING_ADVANCE":
        return "bg-orange-100 text-orange-700 border-orange-200";

      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getPhase = (phase?: string | string[]) => {
    if (Array.isArray(phase)) {
      return phase[0] || "Planning";
    }

    return phase || "Planning";
  };

  return (
    <div className="bg-white rounded-3xl border border-[var(--border)] p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2
            className="text-2xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Assigned Projects
          </h2>

          <p
            className="text-sm mt-1"
            style={{ color: "var(--text-secondary)" }}
          >
            {projects.length} assigned project
            {projects.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={scrollLeft}
            className="w-11 h-11 rounded-xl border border-[var(--border)] flex items-center justify-center hover:bg-gray-50 transition"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            onClick={scrollRight}
            className="w-11 h-11 rounded-xl border border-[var(--border)] flex items-center justify-center hover:bg-gray-50 transition"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="h-[250px] flex items-center justify-center rounded-2xl border border-dashed border-gray-300">
          <p className="text-gray-500">
            No assigned projects yet
          </p>
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
        >
          {projects.map((project) => (
            <div
              key={project.id}
              className="min-w-[360px] max-w-[360px] shrink-0 rounded-3xl border border-[var(--border)] bg-gradient-to-br from-white to-[#fafafa] p-5 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{
                      background: "var(--primary-light)",
                    }}
                  >
                    <FolderKanban
                      size={22}
                      color="var(--primary)"
                    />
                  </div>

                  <div>
                    <h3
                      className="font-bold text-lg line-clamp-1"
                      style={{
                        color: "var(--text-primary)",
                      }}
                    >
                      {project.title}
                    </h3>

                    <p className="text-xs text-gray-500">
                      {getPhase(project.currentPhase)}
                    </p>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full border text-xs font-semibold ${getStatusColor(
                    project.status
                  )}`}
                >
                  {(project.status || "PENDING").replaceAll(
                    "_",
                    " "
                  )}
                </span>
              </div>

              <p
                className="text-sm leading-relaxed min-h-[48px] line-clamp-2 mb-5"
                style={{
                  color: "var(--text-secondary)",
                }}
              >
                {project.description ||
                  "No project description available."}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="rounded-xl bg-gray-50 p-3">
                  <p className="text-xs text-gray-500 mb-1">
                    Budget
                  </p>

                  <p className="font-bold text-gray-900">
                    ₹
                    {(project.budget || 0).toLocaleString()}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-3">
                  <p className="text-xs text-gray-500 mb-1">
                    Progress
                  </p>

                  <p className="font-bold text-gray-900">
                    {project.progress || 0}%
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-xs mb-2">
                  <span>Completion</span>
                  <span>{project.progress || 0}%</span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full transition-all"
                    style={{
                      width: `${project.progress || 0}%`,
                      background: "var(--primary)",
                    }}
                  />
                </div>
              </div>

              {project.endDate && (
                <div className="mb-5 text-xs text-gray-500">
                  Due:{" "}
                  {new Date(
                    project.endDate
                  ).toLocaleDateString()}
                </div>
              )}

              <button
                onClick={() => onProjectSelect?.(project)}
                className="w-full py-3 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition hover:opacity-90"
                style={{
                  background: "var(--primary)",
                }}
              >
                View Project
                <ArrowUpRight size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}