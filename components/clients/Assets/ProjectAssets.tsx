"use client"
import { AlertCircle, LucideLoader, Upload } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import toast, { Toaster } from "react-hot-toast";

const ProjectAssets = () => {
    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState<any[]>([]);
    const [visibleCredentials, setVisibleCredentials] = useState<Record<string, boolean>>({});
    const [copiedResource, setCopiedResource] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState("");
    const [resource, setResource] = useState({
        projectId: "",
        title: "",
        type: "FILE",
        content: "",
        isLocked: false,
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
    }
};

    useEffect(() => {
        fetchProjects();
    }, []);

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

            {/* Main Section */}
            <div className="mt-5 space-y-6">
                {projects.map((project: any) => (
                    <div
                        key={project.id}
                        className="border rounded-xl p-5 bg-white dark:bg-gray-900 shadow-sm"
                    >
                        {/* Project Details */}
                        <div className="mb-5">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {project.title}
                            </h3>

                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {project.description}
                            </p>

                            <div className="flex flex-wrap gap-3 mt-3 text-xs">
                                <span className="px-2 py-1 rounded bg-blue-100 text-blue-700">
                                    {project.status}
                                </span>

                                <span className="px-2 py-1 rounded bg-purple-100 text-purple-700">
                                    {project.priority}
                                </span>

                                <span className="px-2 py-1 rounded bg-green-100 text-green-700">
                                    {project.resources?.length || 0} Resources
                                </span>
                            </div>
                        </div>

                        {/* Resources */}
                        {project.resources?.length > 0 ? (
                            <div className="space-y-4">
                                {project.resources.map((resource: any) => (
                                    <div
                                        key={resource.id}
                                        className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                                    >
                                        {/* Header */}
                                        <div className="flex items-center justify-between p-3 border-b bg-gray-50 dark:bg-gray-800">
                                            <div>
                                                <h4 className="font-medium text-sm">
                                                    {resource.title}
                                                </h4>

                                                <p className="text-xs text-gray-500">
                                                    {resource.type}
                                                </p>
                                            </div>

                                            <div className="flex gap-2">
                                                {/* IMAGE */}
                                                {resource.type === "IMAGE" && (
                                                    <a
                                                        href={resource.content}
                                                        download
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="px-3 py-1 text-xs rounded bg-green-600 text-white"
                                                    >
                                                        Download
                                                    </a>
                                                )}

                                                {/* FILE */}
                                                {resource.type === "FILE" && (
                                                    <a
                                                        href={resource.content}
                                                        download
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="px-3 py-1 text-xs rounded bg-green-600 text-white"
                                                    >
                                                        Download
                                                    </a>
                                                )}

                                                {/* LINK */}
                                                {resource.type === "LINK" && (
                                                    <button
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(resource.content);

                                                            setCopiedResource(resource.id);

                                                            setTimeout(() => {
                                                                setCopiedResource(null);
                                                            }, 2000);
                                                        }}
                                                        className={` px-4 py-2 text-xs font-medium rounded-lg transition-all duration-300 shadow-sm hover:shadow-md active:scale-95 flex items-center gap-2
    ${copiedResource === resource.id
                                                                ? "bg-emerald-500 text-white"
                                                                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:border-purple-500 hover:text-purple-600"
                                                            }
  `}
                                                    >
                                                        {copiedResource === resource.id ? (
                                                            <>
                                                                ✓ Copied!
                                                            </>
                                                        ) : (
                                                            <>
                                                                Copy Link
                                                            </>
                                                        )}
                                                    </button>
                                                )}

                                                {/* TEXT */}
                                                {resource.type === "TEXT" && (
                                                    <button
                                                        onClick={() =>
                                                            navigator.clipboard.writeText(
                                                                resource.content
                                                            )
                                                        }
                                                        className="px-3 py-1 text-xs rounded bg-purple-600 text-white"
                                                    >
                                                        Copy Text
                                                    </button>
                                                )}

                                                {/* CREDENTIALS */}
                                                {resource.type === "CREDENTIALS" && (
                                                    <button
                                                        onClick={() =>
                                                            setVisibleCredentials(prev => ({
                                                                ...prev,
                                                                [resource.id]:
                                                                    !prev[resource.id],
                                                            }))
                                                        }
                                                        className="px-3 py-1 text-xs rounded bg-blue-600 text-white"
                                                    >
                                                        {visibleCredentials[resource.id]
                                                            ? "Hide"
                                                            : "View"}
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* IMAGE PREVIEW */}
                                        {resource.type === "IMAGE" && (
                                            <div className="p-4">
                                                {resource.content ? (
                                                    <img
                                                        src={resource.content}
                                                        alt={resource.title}
                                                        className="w-full max-h-80 object-contain rounded border"
                                                    />
                                                ) : (
                                                    <div className="text-sm text-gray-500">
                                                        No preview available
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* FILE */}
                                        {resource.type === "FILE" && (
                                            <div className="p-4">
                                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                                    {resource.fileName ||
                                                        resource.content
                                                            .split("/")
                                                            .pop() ||
                                                        "Unknown File"}
                                                </p>
                                            </div>
                                        )}

                                        {/* LINK */}
                                        {resource.type === "LINK" && (
                                            <div className="p-4">
                                                <a
                                                    href={resource.content}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline break-all"
                                                >
                                                    {resource.content}
                                                </a>
                                            </div>
                                        )}

                                        {/* TEXT */}
                                        {resource.type === "TEXT" && (
                                            <div className="p-4">
                                                <div className="bg-gray-50 dark:bg-gray-800 border rounded p-3 whitespace-pre-wrap text-sm">
                                                    {resource.content}
                                                </div>
                                            </div>
                                        )}

                                        {/* CREDENTIALS */}
                                        {resource.type === "CREDENTIALS" && (
                                            <div className="p-4">
                                                <div className="bg-yellow-50 dark:bg-yellow-900/20 border rounded p-3">
                                                    {visibleCredentials[resource.id] ? (
                                                        <pre className="text-xs whitespace-pre-wrap overflow-auto">
                                                            {resource.content}
                                                        </pre>
                                                    ) : (
                                                        <div className="font-mono">
                                                            ***************
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="border rounded-lg p-4 text-sm text-gray-500">
                                No resources available
                            </div>
                        )}
                    </div>
                ))}
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
        <div className="flex items-center gap-3">
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
        </div>

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
            placeholder={`Email: admin@test.com
Password: Test@123`}
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
              !selectedProjectId ||
              !resource.title
            }
            className="px-5 py-2.5 rounded-xl text-white bg-blue-600 disabled:opacity-50"
          >
            Create Resource
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