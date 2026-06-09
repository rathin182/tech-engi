"use client";

import { AlertTriangle, Bug, ShieldAlert, Clock3, ArrowUpRight, } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Ticket {
    id: string;
    issueType: string;
    description: string;
    status: string;
    createdAt: string;

    raisedBy: {
        name: string;
    };
}

interface Project {
    id: string;
    title: string;
    tickets: Ticket[];
}

interface TicketIssuesCardProps {
    projects: Project[];
}

const ISSUE_STYLES: Record<
    string,
    {
        icon: React.ReactNode;
        bg: string;
        text: string;
        border: string;
    }
> = {
    BUG: {
        icon: <Bug size={14} />,
        bg: "bg-[#FFF2F0]",
        text: "text-[#E5484D]",
        border: "border-[#FFD6D3]",
    },

    SECURITY: {
        icon: <ShieldAlert size={14} />,
        bg: "bg-[#FFF7E8]",
        text: "text-[#D97706]",
        border: "border-[#FFE2A8]",
    },

    PAYMENT: {
        icon: <AlertTriangle size={14} />,
        bg: "bg-[#EEF9F1]",
        text: "text-[#238B57]",
        border: "border-[#D7F0DD]",
    },

    DEFAULT: {
        icon: <AlertTriangle size={14} />,
        bg: "bg-[#F4F4F5]",
        text: "text-[#52525B]",
        border: "border-[#E4E4E7]",
    },
};

function formatTimeAgo(date: string) {
    const now = new Date().getTime();
    const created = new Date(date).getTime();

    const diff = Math.floor((now - created) / 1000 / 60);

    if (diff < 60) return `${diff}m ago`;

    if (diff < 1440)
        return `${Math.floor(diff / 60)}h ago`;

    return `${Math.floor(diff / 1440)}d ago`;
}

export default function TicketIssuesCard({ projects, }: TicketIssuesCardProps) {
    const router = useRouter();

    const allTickets = projects.flatMap((project) =>
        project.tickets.map((ticket) => ({
            ...ticket,
            projectTitle: project.title,
            projectId: project.id,
        }))
    );

    return (
        <div className="bg-white w-full  self-start rounded-[28px] border border-[#ECECEC] p-5 h-screen overflow-hidden flex flex-col">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-[1.4rem] font-semibold text-[#111]">
                        Recent issue reported
                    </h2>

                    <p className="text-[13px] text-[#8B8B8B] mt-1">
                        active tickets {allTickets.length}
                    </p>
                </div>

                <div className="w-10 h-10 rounded-full border border-[#E5E5E5] flex items-center justify-center">
                    <ArrowUpRight size={18} />
                </div>
            </div>

            {/* COUNT */}
            {/* <div className="mb-5">
        <div className="flex items-end gap-2">
          <h1 className="text-[52px] leading-none font-semibold tracking-tight text-[#111]">
            {allTickets.length}
          </h1>

          <p className="text-[#8B8B8B] text-sm mb-1">
            Open Tickets
          </p>
        </div>
      </div> */}

            {/* TICKETS */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-4 custom-scroll">
                {allTickets.map((ticket) => {
                    const style =
                        ISSUE_STYLES[ticket.issueType] ||
                        ISSUE_STYLES.DEFAULT;

                    return (

                        <div
                            onClick={() => router.push(`/admin/project/${ticket.projectId}`)}
                            key={ticket.id}
                            className="relative overflow-hidden rounded-[24px] border border-white/10 p-4 transition-all duration-300 ease-in-out cursor-pointer"
                            style={{
                                background: `
      radial-gradient(
        circle at top right,
        rgba(255,255,255,0.18),
        transparent 30%
      ),
      linear-gradient(
        135deg,
        #5E1014 0%,
        #7F1D1D 35%,
        #991B1B 65%,
        #DC2626 100%
      )
    `,
                            }}
                        >
                            {/* TOP */}
                            <div className="mb-4 flex items-start justify-between">
                                <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/12 px-3 py-1.5 text-[11px] font-medium text-white backdrop-blur-[10px]">
                                    {style.icon}
                                    <span>{ticket.issueType}</span>
                                </div>

                                <div className="flex items-center gap-1 text-[11px] text-white/70">
                                    <Clock3 size={11} />
                                    <span>{formatTimeAgo(ticket.createdAt)}</span>
                                </div>
                            </div>

                            {/* PROJECT */}
                            <h3 className="mb-2 text-[18px] font-semibold leading-[1.3] text-white">
                                {ticket.projectTitle}
                            </h3>

                            {/* DESCRIPTION */}
                            <p className="mb-5 text-[13px] leading-[1.6] text-white/75">
                                {ticket.description}
                            </p>

                            {/* FOOTER */}
                            <div className="flex items-end justify-between">
                                <div>
                                    <p className="mb-1 text-[11px] text-white/50">
                                        Raised by
                                    </p>

                                    <p className="text-[14px] font-medium text-white">
                                        {ticket.raisedBy.name}
                                    </p>
                                </div>

                                <div className="rounded-full bg-white px-2 py-1 text-[11px] font-semibold text-red-800 shadow-[0_2px_10px_rgba(0,0,0,0.08)]">
                                    {ticket.status}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <style jsx>{`
        .custom-scroll::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scroll::-webkit-scrollbar-thumb {
          background: #e4e4e7;
          border-radius: 999px;
        }

        .custom-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
        </div>
    );
}