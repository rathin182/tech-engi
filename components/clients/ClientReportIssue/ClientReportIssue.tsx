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
            const res = await fetch(`/api/tickets?all=true`);
            const data = await res.json();
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

    const handleCreateTicket = async ({ }) => {
        try {
            setCreating(true);

            const formData = new FormData();
            formData.append("projectId", selectedProjectId);
            formData.append("issueType", newTicket.issueType);
            formData.append("target", newTicket.target);
            formData.append("description", newTicket.description);

            newTicket.images.forEach((file) => {
                formData.append("images", file);
            });

            const res = await fetch("/api/tickets", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || "Failed to create ticket");
            }

            toast.success("Ticket submitted successfully");
            await fetchTickets();
            // onSuccess?.(); // close modal / refresh
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setShowModal(false);
            setCreating(false);
            
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
        fetchTickets();
    }, []);

    const roleTabs = role === "ADMIN" ? ["ME", "ENGINEER", "CLIENT"] : ["ME", "ENGINEER", "ADMIN"];

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

    const targetOptions = role === "ADMIN" ? ["Engineer"] : ["PLATFORM", "ENGINEER"];

    return (
        <div className="h-full w-full">
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

                        <button
                            onClick={() => setShowModal(true)}
                            className="cursor-pointer group relative overflow-hidden rounded-xl px-5 py-2.5 font-semibold text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                            style={{
                                background: "linear-gradient(135deg, #FFAE58 0%, #FF9D2E 100%)",
                                boxShadow: "0 10px 25px rgba(255, 174, 88, 0.35)",
                            }}
                        >
                            <span className="absolute inset-0 bg-white/20 translate-x-[-120%] group-hover:translate-x-[120%] transition-transform duration-700" />
                            <span className="relative flex items-center gap-2">
                                <AlertCircle size={16} />
                                Report Issue
                            </span>
                        </button>
                        {/* <div className="w-[320px]">
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
                        </div> */}
                    </div>
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
                                                            <div className="flex gap-4">
                                                                <span className="text-xs uppercase font-semibold px-2.5 py-0.5 rounded-full border bg-gray-100 text-gray-700 border-gray-200">
                                                                    {report.issueType}
                                                                </span>
                                                                {/* <span className="text-xs uppercase font-semibold px-2.5 py-0.5 rounded-full border bg-gray-100 text-gray-700 border-gray-200">{report.project?.title}</span> */}
                                                            </div>

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

                                                                    {report.raisedById === currentUserId && !updating && (
                                                                        <span className="text-[10px]">▼</span>
                                                                    )}
                                                                </button>

                                                                {/* ✅ Controlled Dropdown */}
                                                                {openDropdownId === report.id &&
                                                                    report.raisedById === currentUserId &&
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
                                                        <p className="text-sm mt-2" style={{ color: "var(--text-secondary)" }}>Project: {report.project?.title}</p>

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

            {showModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
                    <div className="bg-white text-black! w-full max-w-md p-6 rounded-xl border border-[var(--border)] shadow-lg">
                        <h3
                            className="text-lg font-semibold  mb-4"
                            style={{ color: "var(--text-primary)" }}
                        >
                            Raise a Ticket
                        </h3>

                        <div className="space-y-4">
                            {/* Ticket Type */}
                            <div>
                                <label className="block text-sm font-medium mb-1.5">
                                    Issue Type *
                                </label>
                                <select
                                    value={newTicket.issueType}
                                    onChange={(e) =>
                                        setNewTicket({ ...newTicket, issueType: e.target.value })
                                    }
                                    className={inputCls}
                                    disabled={creating}
                                >
                                    <option value="">Select issue type</option>
                                    <option value="PAYMENT">Payment</option>
                                    <option value="COMMUNICATION">Communication</option>
                                    <option value="TECHNICAL">Technical</option>
                                    <option value="DELIVERY">Delivery</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>

                            {/* select project */}

                            <div className="">
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

                            {/* Target */}
                            <div>
                                <label className="block text-sm font-medium mb-1.5">
                                    Target *
                                </label>
                                <div className="flex gap-4">
                                    {targetOptions.map((t) => (
                                        <label
                                            key={t}
                                            className="flex items-center gap-2 cursor-pointer text-sm"
                                        >
                                            <input
                                                type="radio"
                                                value={t}
                                                checked={newTicket.target === t}
                                                onChange={(e) =>
                                                    setNewTicket({ ...newTicket, target: e.target.value })
                                                }
                                                disabled={creating}
                                            />
                                            {t}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium mb-1.5">
                                    Description *
                                </label>
                                <textarea
                                    value={newTicket.description}
                                    onChange={(e) =>
                                        setNewTicket({ ...newTicket, description: e.target.value })
                                    }
                                    className={`${inputCls} resize-none`}
                                    rows={4}
                                    placeholder="Describe the issue..."
                                    disabled={creating}
                                />
                            </div>

                            {/* Images */}
                            {/* <div>
                <label className="block text-sm font-medium mb-1.5">
                  Upload Images
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) =>
                    setNewTicket({
                      ...newTicket,
                      images: Array.from(e.target.files || []),
                    })
                  }
                  disabled={creating}
                />
              </div> */}
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-[var(--text-primary)]">
                                    Upload Images
                                </label>

                                <label
                                    htmlFor="ticket-images"
                                    className={` group flex flex-col items-center justify-center w-full min-h-[140px] rounded-2xl border-2 border-dashed border-[#FFD4A6] bg-gradient-to-br from-[#FFF8F1] to-[#FFF3E6] cursor-pointer transition-all duration-300 hover:border-[#FFAE58] hover:shadow-[0_8px_30px_rgba(255,174,88,0.15)]`}>
                                    <input
                                        id="ticket-images"
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        disabled={creating}
                                        className="hidden"
                                        onChange={(e) =>
                                            setNewTicket({
                                                ...newTicket,
                                                images: Array.from(e.target.files || []),
                                            })
                                        }
                                    />

                                    <div className="w-12 h-12 rounded-2xl bg-[#FFAE58]/15 flex items-center justify-center mb-3">
                                        <Upload className="w-6 h-6 text-[#FFAE58]" />
                                    </div>

                                    <p className="text-sm font-semibold text-gray-800">
                                        Click to upload images
                                    </p>

                                    <p className="text-xs text-gray-500 mt-1">
                                        PNG, JPG, JPEG • Multiple files supported
                                    </p>

                                    {newTicket.images.length > 0 && (
                                        <div className="mt-5 grid grid-cols-3 gap-3 w-full px-4">
                                            {newTicket.images.map((file, index) => (
                                                <div
                                                    key={index}
                                                    className=" relative group overflow-hidden rounded-xl border border-[#FFD4A6] bg-white">
                                                    <img
                                                        src={URL.createObjectURL(file)}
                                                        alt={file.name}
                                                        className=" h-24 w-full object-cover" />

                                                    <div
                                                        className=" absolute bottom-0 left-0 right-0 bg-black/50 px-2 py-1">
                                                        <p
                                                            className=" text-white text-[10px] truncate">
                                                            {file.name}
                                                        </p>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.preventDefault();

                                                            setNewTicket((prev) => ({
                                                                ...prev,
                                                                images: prev.images.filter(
                                                                    (_, i) => i !== index
                                                                ),
                                                            }));
                                                        }}
                                                        className=" absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white text-xs opacity-0 group-hover:opacity-100 transition">
                                                        ✕
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </label>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setNewTicket({
                                        issueType: "",
                                        target: "PLATFORM",
                                        description: "",
                                        images: [],
                                    });
                                }}
                                className="px-4 py-2 border rounded-lg text-sm"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleCreateTicket}
                                disabled={
                                    creating ||
                                    !newTicket.issueType ||
                                    !newTicket.description.trim()
                                }
                                className="px-4 py-2 text-white rounded-lg text-sm disabled:opacity-40"
                                style={{ background: "var(--primary)" }}
                            >
                                {creating ? "Submitting..." : "Submit Ticket"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ClientReportIssue