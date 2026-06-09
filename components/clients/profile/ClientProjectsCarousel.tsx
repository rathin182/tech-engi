"use client";
import { useRef } from "react";
import { ChevronLeft, ChevronRight, FolderKanban, ArrowUpRight, } from "lucide-react";

type Project = {
    id: string;
    title: string;
    description?: string;
    budget?: number;
    progress?: number;
    currentPhase?: string;
    status?: string;
};

interface ClientProjectsCarouselProps {
    projects: Project[];
    onProjectSelect?: (project: Project) => void;
}

export default function ClientProjectsCarousel({ projects, onProjectSelect,}: ClientProjectsCarouselProps) {
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

            default:
                return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    return (
        <div className="bg-white rounded-3xl border border-[var(--border)] p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2
                        className="text-xl font-semibold"
                        style={{ color: "var(--text-primary)" }}
                    >
                        Projects Portfolio
                    </h2>

                    <p
                        className="text-sm mt-1"
                        style={{ color: "var(--text-secondary)" }}
                    >
                        {projects.length} project
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
                                        {project.currentPhase || "Planning"}
                                    </p>
                                </div>
                            </div>

                            <span
                                className={`px-3 py-1 rounded-full border text-xs font-semibold w-27 opacity-70 ${getStatusColor(
                                    project.status
                                )}`}
                            >
                                {(project.status || "PENDING").replace(
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

                        <div className="mb-5">
                            <div className="flex justify-between text-xs mb-2">
                                <span>Completion</span>
                                <span>{project.progress || 0}%</span>
                            </div>

                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                    className="h-2.5 rounded-full transition-all"
                                    style={{
                                        width: `${project.progress || 0}%`,
                                        background:
                                            "var(--primary)",
                                    }}
                                />
                            </div>
                        </div>

                        <button
                            onClick={() =>
                                onProjectSelect?.(project)
                            }
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
        </div>
    );
}