"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Plus, Calendar, User, Shield, LucideLoader, Loader2, Upload, } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
const statusColors: Record<string, string> = {
    OPEN: "bg-red-100 text-red-600",
    IN_PROGRESS: "bg-yellow-100 text-yellow-700",
    RESOLVED: "bg-green-100 text-green-600",
    CLOSED: "bg-gray-200 text-gray-700",
};

const typeColors: Record<string, string> = {
    PAYMENT: "bg-purple-100 text-purple-600",
    COMMUNICATION: "bg-blue-100 text-blue-600",
    TECHNICAL: "bg-orange-100 text-orange-600",
    DELIVERY: "bg-pink-100 text-pink-600",
    OTHER: "bg-gray-100 text-gray-600",
};
const ClientReportIssue = () => {
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [fetchTicket, setFetchTicket] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [creating, setCreating] = useState(false);
    const [projectClient, setProjectClient] = useState(null);
    const { data: session, status: sessionStatus } = useSession();
    const role = session?.user?.role?.toUpperCase()?.trim() || "";
    const isAdmin = role === "ADMIN";
    const isEngineer = role === "ENGINEER";
    const [updating, setUpdating] = useState(false);
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const [projects, setProjects] = useState<any[]>([]);
    const [selectedProjectId, setSelectedProjectId] = useState("");
    const isClient = role === "CLIENT";
    const [newTicket, setNewTicket] = useState({
        issueType: "",
        target: role === "ADMIN" ? "Engineer" : "PLATFORM",
        description: "",
        images: [] as File[],
    });
    const [activeTab, setActiveTab] = useState("ME");

    const fetchTickets = async () => {
        try {
            setFetchTicket(true);
            const res = await fetch(`/api/tickets?projectId=${selectedProjectId}`);
            const data = await res.json();
            console.log(data, "datataa");
            if (!res.ok || !data.success) {
                throw new Error(data.message || "Failed to fetch tickets");
            }

            setTickets(data.tickets);
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setFetchTicket(false);
        }
    };

    const updateTicketStatus = async ({ ticketId, status, }: { ticketId: string; status: string; }) => {
        try {
            setUpdating(true);

            const res = await fetch(`/api/tickets/${ticketId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || "Failed to update status");
            }

            await fetchTickets();
            toast.success("Status updated");
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setUpdating(false);
        }
    };

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                const res = await fetch("/api/client/projects");
                const data = await res.json();
                console.log(data, "datataa");

                if (data.success) {
                    setProjects(data.projects);
                } else {
                    toast.error(data.message || "Failed to fetch tickets");
                }
            } catch (error) {
                console.error("Error fetching tickets:", error);
                toast.error(
                    error instanceof Error ? error.message : "Failed to fetch tickets"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    useEffect(() => {
        fetchTickets();
    }, [selectedProjectId]);

    const roleTabs = role === "ADMIN" ? ["ME", "ENGINEER", "CLIENT"] : ["ME", "ENGINEER", "CLIENT", "ADMIN"];

    const inputCls = "w-full px-3 py-2 rounded-lg bg-white border border-[var(--border)]  text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]";

    const currentUserId = session?.user?.id;

    const filteredTickets = tickets.filter((ticket) => {
        const raisedRole = ticket.raisedBy?.role?.toUpperCase()?.trim() || "";

        switch (activeTab) {
            case "ME":
                return ticket?.raisedById === currentUserId;

            case "ENGINEER":
                if (ticket?.raisedById === currentUserId) {
                    return false;
                } else {
                    return raisedRole === "ENGINEER";
                }

            case "CLIENT":
                if (ticket?.raisedById === currentUserId) {
                    return false;
                } else {
                    return raisedRole === "CLIENT";
                }

            case "ADMIN":
                return raisedRole === "ADMIN";

            default:
                return true;
        }
    });

    if (loading)
        return (
            <div className="flex items-center justify-center py-12">
                <LucideLoader
                    className="animate-spin"
                    style={{ color: "var(--primary)" }}
                    size={40}
                />
            </div>
        );

    const targetOptions = role === "ADMIN" ? ["Engineer"] : ["PLATFORM", "CLIENT"];

    return (
        <div className="h-full w-full p-4">
            <div className="px-2">
                <div className=" rounded-2xl ">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2
                                className="text-2xl font-semibold"
                                style={{ color: "var(--text-primary)" }}
                            >
                                Report Issue
                            </h2>

                            <p
                                className="text-sm mt-1"
                                style={{ color: "var(--text-secondary)" }}
                            >
                                Select a project to view and create tickets.
                            </p>
                        </div>

                        <div className="w-[320px]">
                            <select
                                value={selectedProjectId}
                                onChange={(e) => setSelectedProjectId(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                            >
                                <option value="" disabled>
                                    Select Project
                                </option>

                                {projects.map((project) => (
                                    <option
                                        key={project.id}
                                        value={project.id}
                                    >
                                        {project.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* {selectedProjectId && (
                        <div
                            className="rounded-xl border border-[#FFD9A8] bg-[#FFF8F1] p-4"
                        >
                            <p className="text-sm text-gray-600">
                                Selected Project
                            </p>

                            <h3 className="font-semibold text-lg text-gray-900 mt-1">
                                {
                                    projects.find(
                                        (p) => p.id === selectedProjectId
                                    )?.title
                                }
                            </h3>
                        </div>
                    )} */}
                </div>

                {/* Tickets Section Here */}
                <div
                    className="rounded-lg p-4 border"
                    style={{ background: "var(--primary-light)", borderColor: "#ffd9a8" }}
                >
                    <h3
                        className="font-semibold  text-sm mb-1"
                        style={{ color: "var(--text-primary)" }}
                    >
                        Issue Reporting Guidelines
                    </h3>
                    <ul
                        className="text-xs  space-y-0.5"
                        style={{ color: "var(--text-secondary)" }}
                    >
                        <li>
                            <strong>Project-Wide:</strong> General problems affecting the entire
                            project
                        </li>
                        <li>
                            <strong>Task-Specific:</strong> Problems related to individual tasks
                        </li>
                    </ul>
                </div>

                <div className="flex flex-col lg:flex-row gap-6 mt-2">
                    {/* Sidebar */}
                    <div className="w-full shrink-0">
                        <div className="bg-white rounded-xl border border-[var(--border)] p-2 mb-3">
                            <div className="flex gap-2 overflow-x-auto">
                                {roleTabs.map((tab) => {
                                    const count = tickets.filter((ticket) => {
                                        const raisedRole = ticket.raisedBy?.role?.toUpperCase()?.trim() || "";

                                        if (tab === "ME") {
                                            return ticket?.raisedById === currentUserId;
                                        }

                                        if (ticket?.raisedById === currentUserId) {
                                            return false;
                                        } else {
                                            return raisedRole === tab;
                                        }

                                        return raisedRole === tab;
                                    }).length;

                                    return (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab
                                                ? "text-white"
                                                : "hover:bg-gray-100 text-gray-700"
                                                }`}
                                            style={
                                                activeTab === tab
                                                    ? { background: "var(--primary)" }
                                                    : {}
                                            }
                                        >
                                            <span>{tab}</span>
                                            <span className="text-xs opacity-80 px-2">
                                                {count}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Tickets */}
                        <div className="flex-1">
                            {/* Ticket List Here */}

                            {filteredTickets.length === 0 ? (
                                fetchTicket ? (
                                    <div className="min-h-full w-full flex justify-center items-center">
                                        <Loader2 className="animate-spin" color="var(--primary)" />
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <AlertCircle
                                            className="mx-auto h-10 w-10 mb-3"
                                            style={{ color: "var(--border)" }}
                                        />
                                        <p
                                            className="text-sm"
                                            style={{ color: "var(--text-muted)" }}
                                        >
                                            {activeTab === "ME"
                                                ? "You haven't reported any issues yet."
                                                : `No ${activeTab.toLowerCase()} issues found.`}
                                        </p>
                                    </div>
                                )
                            ) : (
                                <div className="space-y-3">
                                    {filteredTickets.map((report: any) => {
                                        return (
                                            <div
                                                key={report.id}
                                                className="bg-white rounded-xl border border-[var(--border)] p-5"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <AlertCircle
                                                        size={18}
                                                        className="text-red-500"
                                                        style={{ marginTop: 2 }}
                                                    />

                                                    <div className="flex-1">
                                                        {/* Top Row */}
                                                        <div className="flex items-center justify-between">
                                                            {/* Type Badge */}
                                                            <span className="text-xs uppercase font-semibold px-2.5 py-0.5 rounded-full border bg-gray-100 text-gray-700 border-gray-200">
                                                                {report.issueType}
                                                            </span>

                                                            {/* ✅ Status Dropdown */}
                                                            <div className="relative">
                                                                <button
                                                                    disabled={updating}
                                                                    onClick={() => {
                                                                        if (updating) return;

                                                                        setOpenDropdownId((prev) =>
                                                                            prev === report.id ? null : report.id
                                                                        );
                                                                    }}
                                                                    className={`text-xs px-2.5 py-1 rounded-full border flex items-center gap-1 ${statusColors[report.status]
                                                                        } ${updating ? "opacity-60 cursor-not-allowed" : ""}`}
                                                                >
                                                                    {updating
                                                                        ? "Updating..."
                                                                        : report.status.replace("_", " ")}

                                                                    {role !== "ENGINEER" && !updating && (
                                                                        <span className="text-[10px]">▼</span>
                                                                    )}
                                                                </button>

                                                                {/* ✅ Controlled Dropdown */}
                                                                {openDropdownId === report.id &&
                                                                    role !== "ENGINEER" &&
                                                                    !updating && (
                                                                        <div className="absolute right-0 mt-1 w-36 bg-white border rounded-lg shadow-md z-10">
                                                                            {[
                                                                                "OPEN",
                                                                                "IN_PROGRESS",
                                                                                "RESOLVED",
                                                                                "CLOSED",
                                                                            ].map((status) => (
                                                                                <button
                                                                                    key={status}
                                                                                    onClick={async () => {
                                                                                        // ✅ Close dropdown immediately
                                                                                        setOpenDropdownId(null);

                                                                                        // ✅ Update status
                                                                                        await updateTicketStatus({
                                                                                            ticketId: report.id,
                                                                                            status,
                                                                                        });
                                                                                    }}
                                                                                    className="w-full text-black text-left px-3 py-2 text-xs hover:bg-gray-100"
                                                                                >
                                                                                    {status.replace("_", " ")}
                                                                                </button>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                            </div>
                                                        </div>

                                                        {/* Description */}
                                                        <p
                                                            className="text-sm mt-2"
                                                            style={{ color: "var(--text-secondary)" }}
                                                        >
                                                            {report.description}
                                                        </p>

                                                        {/* Images */}
                                                        {report.images?.length > 0 && (
                                                            <div className="flex gap-2 mt-3 flex-wrap">
                                                                {report.images.map((img: string, i: number) => (
                                                                    <a
                                                                        key={i}
                                                                        href={img}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                    >
                                                                        <img
                                                                            src={img}
                                                                            alt="ticket"
                                                                            className="w-16 h-16 object-cover rounded-lg border cursor-pointer hover:opacity-80 transition"
                                                                        />
                                                                    </a>
                                                                ))}
                                                            </div>
                                                        )}

                                                        {/* Footer */}
                                                        <div
                                                            className="flex items-center gap-4 mt-3 text-xs"
                                                            style={{ color: "var(--text-muted)" }}
                                                        >
                                                            <span className="flex items-center gap-1">
                                                                <User size={11} /> {report.raisedBy?.name || "User"}
                                                            </span>

                                                            <span className="flex items-center gap-1">
                                                                <Calendar size={11} />
                                                                {new Date(report.createdAt).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default ClientReportIssue