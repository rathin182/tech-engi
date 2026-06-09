"use client"
import { AlertCircle, LucideLoader, Upload, Download, Copy, Check, Eye, EyeOff, } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import toast, { Toaster } from "react-hot-toast";

const getTypeBadgeClass = (type: string) => {
    switch (type) {
        case "FILE":
            return "bg-slate-100 text-slate-700 border border-slate-200";

        case "IMAGE":
            return "bg-green-100 text-green-700 border border-green-200";

        case "LINK":
            return "bg-purple-100 text-purple-700 border border-purple-200";

        case "TEXT":
            return "bg-amber-100 text-amber-700 border border-amber-200";

        case "CREDENTIALS":
            return "bg-red-100 text-red-700 border border-red-200";

        default:
            return "bg-gray-100 text-gray-700 border border-gray-200";
    }
};

const ProjectAssets = () => {
    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState<any[]>([]);
    const [visibleCredentials, setVisibleCredentials] = useState<Record<string, boolean>>({});
    const [copiedResource, setCopiedResource] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProject, setSelectedProject] = useState("ALL");
    const [assetLoading, setAssetLoading] = useState(false)
    const [selectedType, setSelectedType] = useState("ALL");
    const [resource, setResource] = useState({
        projectId: "",
        title: "",
        type: "FILE",
        content: "",
        isLocked: false,
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [actionState, setActionState] = useState<{
        id: string | null;
        action: "copy" | "download" | null;
    }>({
        id: null,
        action: null,
    });

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

    const handleCreateResource = async () => {
        try {
            setAssetLoading(true);
            let content = resource.content;

            // Upload file/image first
            if (
                ["IMAGE", "FILE"].includes(resource.type) &&
                selectedFile
            ) {
                const uploadFormData = new FormData();
                uploadFormData.append("file", selectedFile);

                const uploadRes = await fetch(
                    "/api/client/project-resources/upload",
                    {
                        method: "POST",
                        body: uploadFormData,
                    }
                );

                const uploadData = await uploadRes.json();

                if (!uploadRes.ok || !uploadData.success) {
                    return toast.error(
                        uploadData.message || "Failed to upload file"
                    );
                }

                content = uploadData.url;
            }

            // Create resource
            const formData = new FormData();

            formData.append("projectId", selectedProjectId);
            formData.append("title", resource.title);
            formData.append("type", resource.type);
            formData.append("content", content);
            formData.append(
                "isLocked",
                resource.isLocked.toString()
            );

            const res = await fetch(
                "/api/client/project-resources",
                {
                    method: "POST",
                    body: formData,
                }
            );
            const data = await res.json();

            if (!res.ok || !data.success) {
                return toast.error(
                    data.message || "Failed to create resource"
                );
            }

            toast.success("Resource created successfully");

            // Reset form
            setResource({
                projectId: "",
                title: "",
                type: "FILE",
                content: "",
                isLocked: false,
            });

            setSelectedFile(null);
            setShowModal(false);

            // Optional refresh
            fetchProjects();
        } catch (err: any) {
            console.error(err);
            toast.error(
                err.message || "Something went wrong"
            );
        } finally {
            setAssetLoading(false)
            setShowModal(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const allResources = projects.flatMap((project: any) =>
        (project.resources || []).map((resource: any) => ({
            ...resource,
            projectTitle: project.title,
        }))
    );

    const truncateText = (text: string, length = 35) => {
        if (!text) return "-";
        return text.length > length
            ? `${text.substring(0, length)}...`
            : text;
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const triggerSuccess = (
        resourceId: string,
        action: "copy" | "download"
    ) => {
        setActionState({
            id: resourceId,
            action,
        });

        setTimeout(() => {
            setActionState({
                id: null,
                action: null,
            });
        }, 1000);
    };

    const projectOptions = [
        "ALL",
        ...new Set(
            allResources.map(
                (resource: any) => resource.projectTitle
            )
        ),
    ];

    const typeOptions = [
        "ALL",
        ...new Set(
            allResources.map(
                (resource: any) => resource.type
            )
        ),
    ];

    const filteredResources = allResources.filter(
        (resource: any) => {
            const searchMatch =
                (
                    resource.fileName ||
                    resource.title ||
                    ""
                )
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                resource.projectTitle
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase());

            const projectMatch =
                selectedProject === "ALL" ||
                resource.projectTitle === selectedProject;

            const typeMatch =
                selectedType === "ALL" ||
                resource.type === selectedType;

            return (
                searchMatch &&
                projectMatch &&
                typeMatch
            );
        }
    );

    if (loading)
        return (
            <div className="flex items-center justify-center py-12 w-full h-screen">
                <LucideLoader
                    className="animate-spin"
                    style={{ color: "var(--primary)" }}
                    size={40}
                />
            </div>
        );


    return (
        <div className='w-full h-full flex flex-1 flex-col'>
            {/* Header Section */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2
                        className="text-2xl font-semibold"
                        style={{ color: "var(--text-primary)" }}
                    >
                        Uplaod Assets
                    </h2>

                    <p
                        className="text-sm mt-1"
                        style={{ color: "var(--text-secondary)" }}
                    >
                        Select a project and Uplaod Assets.
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
                        Uplaod Assets
                    </span>
                </button>
            </div>

            {/* GuideLine Section */}
            <div
                className="rounded-lg p-4 border"
                style={{ background: "var(--primary-light)", borderColor: "#ffd9a8" }}
            >
                <h3
                    className="font-semibold text-sm mb-1"
                    style={{ color: "var(--text-primary)" }}
                >
                    Asset Upload Guidelines
                </h3>

                <ul
                    className="text-xs space-y-0.5"
                    style={{ color: "var(--text-secondary)" }}
                >
                    <li>
                        <strong>Images:</strong> Upload design mockups, screenshots, references, banners, and other visual assets.
                    </li>

                    <li>
                        <strong>Documents & Files:</strong> Upload project requirements, PDFs, spreadsheets, presentations, source files, and other supporting materials.
                    </li>

                    <li>
                        <strong>Organization:</strong> Use clear file names to help team members quickly identify and access assets.
                    </li>
                </ul>
            </div>

            <div className="mt-5 mb-4 flex flex-col lg:flex-row gap-4">

                {/* Search */}
                <input
                    type="text"
                    placeholder="Search resources..."
                    value={searchTerm}
                    onChange={(e) =>
                        setSearchTerm(e.target.value)
                    }
                    className="flex-1 px-4 py-3 rounded-xl border focus:outline-none focus:ring-orange-400 focus:border-orange-500"
                />

                {/* Project Filter */}
                <select
                    value={selectedProject}
                    onChange={(e) =>
                        setSelectedProject(e.target.value)
                    }
                    className="px-4 py-3 rounded-xl border"
                >
                    {projectOptions.map((project) => (
                        <option
                            key={project}
                            value={project}
                        >
                            {project === "ALL"
                                ? "All Projects"
                                : project}
                        </option>
                    ))}
                </select>

                {/* Type Filter */}
                <select
                    value={selectedType}
                    onChange={(e) =>
                        setSelectedType(e.target.value)
                    }
                    className="px-4 py-3 rounded-xl border"
                >
                    {typeOptions.map((type) => (
                        <option
                            key={type}
                            value={type}
                        >
                            {type === "ALL"
                                ? "All Types"
                                : type}
                        </option>
                    ))}
                </select>

            </div>

            {/* Main Section */}
            <div className="mt-5 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                {/* Header */}
                <div className="grid grid-cols-12 gap-4 px-5 py-4 border-b bg-gray-50 dark:bg-gray-800 font-medium text-sm text-gray-600 dark:text-gray-300">
                    <div className="col-span-4">Resource Title</div>
                    <div className="col-span-2">Type</div>
                    <div className="col-span-3">Project</div>
                    <div className="col-span-2">Created</div>
                    <div className="col-span-1 text-right">Action</div>
                </div>

                {/* Rows */}
                {filteredResources.length > 0 ? (
                    filteredResources.map((resource: any) => (
                        <div
                            key={resource.id}
                            className="grid grid-cols-12 gap-4 px-5 py-4 border-b border-gray-100 dark:border-gray-800 items-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
                        >
                            {/* File Name */}
                            <div className="col-span-4 min-w-0">
                                {resource.type === "CREDENTIALS" &&
                                    visibleCredentials[resource.id] ? (
                                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg px-3 py-2">
                                        <pre className="text-xs whitespace-pre-wrap overflow-hidden truncate font-mono text-yellow-800 dark:text-yellow-200">
                                            {resource.content}
                                        </pre>
                                    </div>
                                ) : (
                                    <p
                                        className="font-medium text-sm truncate"
                                        title={
                                            resource.fileName ||
                                            resource.title ||
                                            "Untitled Resource"
                                        }
                                    >
                                        {truncateText(
                                            resource.fileName ||
                                            resource.title ||
                                            "Untitled Resource"
                                        )}
                                    </p>
                                )}
                            </div>

                            {/* Type */}
                            <div className="col-span-2">
                                <span
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getTypeBadgeClass(
                                        resource.type
                                    )}`}
                                >
                                    {resource.type}
                                </span>
                            </div>

                            {/* Project */}
                            <div
                                className="col-span-3 truncate text-sm text-gray-700 dark:text-gray-300"
                                title={resource.projectTitle}
                            >
                                {resource.projectTitle}
                            </div>

                            {/* Created */}
                            <div className="col-span-2 text-sm text-gray-500">
                                {formatDate(resource.createdAt)}
                            </div>

                            {/* Actions */}
                            <div className="col-span-1 flex justify-end">
                                {/* FILE / IMAGE */}
                                {(resource.type === "FILE" ||
                                    resource.type === "IMAGE") && (
                                        <a
                                            href={resource.content}
                                            download
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={() =>
                                                triggerSuccess(resource.id, "download")
                                            }
                                            className={`
                inline-flex items-center gap-2
                cursor-pointer
                px-4 py-2
                rounded-xl
                text-xs font-medium
                border
                transition-all duration-300
                shadow-sm hover:shadow-md
                active:scale-95
                ${actionState.id === resource.id &&
                                                    actionState.action === "download"
                                                    ? "bg-emerald-500 text-white border-emerald-500"
                                                    : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:border-emerald-500 hover:text-emerald-600"
                                                }
            `}
                                        >
                                            {actionState.id === resource.id &&
                                                actionState.action === "download" ? (
                                                <>
                                                    <Check size={14} />
                                                    Downloading...
                                                </>
                                            ) : (
                                                <>
                                                    <Download size={14} />
                                                    Download
                                                </>
                                            )}
                                        </a>
                                    )}

                                {/* LINK */}
                                {resource.type === "LINK" && (
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(
                                                resource.content
                                            );

                                            triggerSuccess(resource.id, "copy");
                                        }}
                                        className={`
                inline-flex items-center gap-2
                cursor-pointer
                px-4 py-2
                rounded-xl
                text-xs font-medium
                border
                transition-all duration-300
                shadow-sm hover:shadow-md
                active:scale-95
                ${actionState.id === resource.id &&
                                                actionState.action === "copy"
                                                ? "bg-emerald-500 text-white border-emerald-500"
                                                : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:border-purple-500 hover:text-purple-600"
                                            }
            `}
                                    >
                                        {actionState.id === resource.id &&
                                            actionState.action === "copy" ? (
                                            <>
                                                <Check size={14} />
                                                Copied!
                                            </>
                                        ) : (
                                            <>
                                                <Copy size={14} />
                                                Copy Link
                                            </>
                                        )}
                                    </button>
                                )}

                                {/* TEXT */}
                                {resource.type === "TEXT" && (
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(
                                                resource.content
                                            );

                                            triggerSuccess(resource.id, "copy");
                                        }}
                                        className={`
                inline-flex items-center gap-2
                cursor-pointer
                px-4 py-2
                rounded-xl
                text-xs font-medium
                border
                transition-all duration-300
                shadow-sm hover:shadow-md
                active:scale-95
                ${actionState.id === resource.id &&
                                                actionState.action === "copy"
                                                ? "bg-emerald-500 text-white border-emerald-500"
                                                : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:border-indigo-500 hover:text-indigo-600"
                                            }
            `}
                                    >
                                        {actionState.id === resource.id &&
                                            actionState.action === "copy" ? (
                                            <>
                                                <Check size={14} />
                                                Copied!
                                            </>
                                        ) : (
                                            <>
                                                <Copy size={14} />
                                                Copy Text
                                            </>
                                        )}
                                    </button>
                                )}

                                {/* CREDENTIALS */}
                                {resource.type === "CREDENTIALS" && (
                                    <button
                                        onClick={() =>
                                            setVisibleCredentials((prev) => ({
                                                ...prev,
                                                [resource.id]:
                                                    !prev[resource.id],
                                            }))
                                        }
                                        className=" cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium border bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:text-blue-600 transition-all duration-300 shadow-sm hover:shadow-md active:scale-95 ">
                                        {visibleCredentials[resource.id] ? (
                                            <>
                                                <EyeOff size={14} />
                                                Hide
                                            </>
                                        ) : (
                                            <>
                                                <Eye size={14} />
                                                View
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-8 text-center">
                        <p className="text-gray-500">
                            No resources found
                        </p>

                        {/* <button
                            onClick={() => {
                                setSearchTerm("");
                                setSelectedProject("ALL");
                                setSelectedType("ALL");
                            }}
                            className="mt-3 px-4 py-2 rounded-lg bg-blue-600 text-white"
                        >
                            Clear Filters
                        </button> */}
                    </div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
                    <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto">

                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">
                                Create Project Resource
                            </h2>

                            <button
                                onClick={() => setShowModal(false)}
                                className="w-8 h-8 rounded-full hover:bg-gray-100"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-5">

                            {/* Project */}
                            <div>
                                <label className="block text-sm font-semibold mb-2">
                                    Project
                                </label>

                                <select
                                    value={selectedProjectId}
                                    onChange={(e) =>
                                        setSelectedProjectId(e.target.value)
                                    }
                                    className="w-full px-4 py-3 rounded-xl border"
                                >
                                    <option value="">
                                        Select Project
                                    </option>

                                    {projects.map((project: any) => (
                                        <option
                                            key={project.id}
                                            value={project.id}
                                        >
                                            {project.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Title */}
                            <div>
                                <label className="block text-sm font-semibold mb-2">
                                    Resource Title
                                </label>

                                <input
                                    type="text"
                                    value={resource.title}
                                    onChange={(e) =>
                                        setResource({
                                            ...resource,
                                            title: e.target.value,
                                        })
                                    }
                                    placeholder="Enter title"
                                    className="w-full px-4 py-3 rounded-xl border"
                                />
                            </div>

                            {/* Type */}
                            <div>
                                <label className="block text-sm font-semibold mb-2">
                                    Resource Type
                                </label>

                                <select
                                    value={resource.type}
                                    onChange={(e) =>
                                        setResource({
                                            ...resource,
                                            type: e.target.value,
                                            content: "",
                                        })
                                    }
                                    className="w-full px-4 py-3 rounded-xl border"
                                >
                                    <option value="FILE">File</option>
                                    <option value="IMAGE">Image</option>
                                    <option value="LINK">Link</option>
                                    <option value="TEXT">Text</option>
                                    <option value="CREDENTIALS">Credentials</option>
                                </select>
                            </div>

                            {/* Lock */}
                            {/* <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={resource.isLocked}
                                    onChange={(e) =>
                                        setResource({
                                            ...resource,
                                            isLocked: e.target.checked,
                                        })
                                    }
                                />

                                <span>Lock Resource</span>
                            </div> */}

                            {/* Upload */}
                            {["IMAGE", "FILE"].includes(resource.type) && (
                                <div>
                                    <label className="block text-sm font-semibold mb-2">
                                        Upload {resource.type}
                                    </label>

                                    <input
                                        type="file"
                                        accept={
                                            resource.type === "IMAGE"
                                                ? "image/*"
                                                : "*"
                                        }
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];

                                            if (!file) return;

                                            setSelectedFile(file);
                                        }}
                                        className="w-full"
                                    />

                                    {selectedFile && (
                                        <div className="mt-3">
                                            {resource.type === "IMAGE" ? (
                                                <img
                                                    src={URL.createObjectURL(
                                                        selectedFile
                                                    )}
                                                    alt="Preview"
                                                    className="h-32 rounded-lg border"
                                                />
                                            ) : (
                                                <div className="text-sm text-green-600">
                                                    {selectedFile.name}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Link */}
                            {resource.type === "LINK" && (
                                <input
                                    type="url"
                                    value={resource.content}
                                    onChange={(e) =>
                                        setResource({
                                            ...resource,
                                            content: e.target.value,
                                        })
                                    }
                                    placeholder="https://example.com"
                                    className="w-full px-4 py-3 rounded-xl border"
                                />
                            )}

                            {/* Text */}
                            {resource.type === "TEXT" && (
                                <textarea
                                    rows={6}
                                    value={resource.content}
                                    onChange={(e) =>
                                        setResource({
                                            ...resource,
                                            content: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-3 rounded-xl border"
                                    placeholder="Enter text..."
                                />
                            )}

                            {/* Credentials */}
                            {resource.type === "CREDENTIALS" && (
                                <textarea
                                    rows={6}
                                    value={resource.content}
                                    onChange={(e) =>
                                        setResource({
                                            ...resource,
                                            content: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-3 rounded-xl border font-mono"
                                    placeholder={`Email: admin@test.com Password: Test@123`}
                                />
                            )}

                            {/* Footer */}
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-5 py-2.5 border rounded-xl"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={handleCreateResource}
                                    disabled={
                                        assetLoading ||
                                        !selectedProjectId ||
                                        !resource.title
                                    }
                                    className={`
        px-5 py-2.5
        rounded-xl
        font-medium
        text-white
        transition-all
        duration-300
        ${assetLoading ||
                                            !selectedProjectId ||
                                            !resource.title
                                            ? "bg-gray-400 cursor-not-allowed opacity-70"
                                            : "bg-orange-500 hover:bg-orange-600 hover:shadow-lg active:scale-95 cursor-pointer"
                                        }
    `}
                                >
                                    {assetLoading ? (
                                        <span className="flex items-center gap-2">
                                            <LucideLoader
                                                size={16}
                                                className="animate-spin"
                                            />
                                            Creating...
                                        </span>
                                    ) : (
                                        "Create Resource"
                                    )}
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}

export default ProjectAssets