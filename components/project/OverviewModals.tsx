import React, { useEffect, useState } from "react";
import { X, Send } from "lucide-react";
import toast from "react-hot-toast";
import { T, inputCls, selectCls, labelStyle, getApiBase } from "./OverviewUI";

export const EditModal = ({ showModel, projectData, userRole }: { showModel: (v: boolean) => void; projectData: any, userRole: string }) => {
  const [loading, setLoading] = useState(false);
  const [instruments, setInstruments] = useState<string[]>(projectData.instruments || []);
  const [techArea, setTechArea] = useState("");
  const [techName, setTechName] = useState("");
  const [colorInput, setColorInput] = useState("");
  const [technology, setTechnology] = useState<
    { area: string; tech: string }[]
  >(
    (projectData.instruments || []).filter(
      (item: any) =>
        typeof item === "object" &&
        item?.area &&
        item?.tech
    )
  );
  const [layoutKey, setLayoutKey] = useState("");
  const [layoutValue, setLayoutValue] = useState("");
  const [visualKey, setVisualKey] = useState("");
  const [visualValue, setVisualValue] = useState("");
  const [keyPagesInput, setKeyPagesInput] = useState("");
  const [designSystem, setDesignSystem] = useState({
    brandName: "",
    colors: [] as string[],

    fonts: {
      primary: "",
      secondary: "",
    },

    designType: [] as string[],

    layoutStyle: {} as Record<string, string>,

    contentTone: [] as string[],

    visualGuidelines: {} as Record<string, string>,

    theme: [] as string[],

    brandFeel: "",

    keyPages: [] as string[],

    uniqueness: {
      differentiator: "",
    },
  });

  const [newInstrument, setNewInstrument] = useState("");
  const isAdmin = userRole === "ADMIN";
  const isEngineer = userRole === "ENGINEER";

  const [formData, setFormData] = useState({
    title: projectData.title || "",
    description: projectData.description || "",
    startDate: projectData.startDate || "",
    endDate: projectData.endDate || "",
    priority: projectData.priority || "LOW",
    repository: projectData.repository || "",
    budget: projectData.budget || 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const apiBase = getApiBase(userRole);
    const action = "UPDATE_PROGRESS"

    try {
      const payload: any = { projectId: projectData.id, ...formData, instruments, techArea, techName, colorInput, technology, designSystem, action };
      if (!isAdmin) { delete payload.repository; delete payload.budget; }

      const res = await fetch(`${apiBase}/${projectData.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload,),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Project updated successfully");
        showModel(false);
        window.location.reload();
      } else { toast.error(data.message || "Failed to update project"); }
    } catch { toast.error("Failed to update project"); }
    finally { setLoading(false); }
  };

  useEffect(() => {
     if (projectData?.technology) {
    setTechnology(projectData.technology);
  }

    if (!projectData?.designSystem) return;

    const ds = projectData.designSystem;

    setDesignSystem({
      brandName: ds.brandName ?? "",
      colors: ds.colors ?? [],

      fonts: {
        primary: ds.fonts?.primary ?? "",
        secondary: ds.fonts?.secondary ?? "",
      },

      designType: ds.designType ?? [],
      layoutStyle: ds.layoutStyle ?? {},
      contentTone: ds.contentTone ?? [],
      visualGuidelines: ds.visualGuidelines ?? {},
      theme: ds.theme ?? [],
      brandFeel: ds.brandFeel ?? "",
      keyPages: ds.keyPages ?? [],

      uniqueness: {
        differentiator: ds.uniqueness?.differentiator ?? "",
      },
    });

    setKeyPagesInput((ds.keyPages ?? []).join(", "));
  }, [projectData]);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(5,10,48,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "1rem" }}>
      <div style={{ background: T.card, borderRadius: 16, width: "100%", maxWidth: 660, maxHeight: "82vh", overflowY: "auto", border: `1px solid ${T.border}`, boxShadow: "0 8px 40px rgba(5,10,48,0.12)" }}>
        <div style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: T.text, margin: 0 }}>Edit Project Details</h2>
            <button onClick={() => showModel(false)} style={{ border: "none", background: "transparent", cursor: "pointer", color: T.textMuted }}><X size={20} /></button>
          </div>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div><label style={labelStyle}>Project Title *</label><input disabled={isEngineer} type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className={inputCls} required /></div>
              <div><label style={labelStyle}>Priority</label>
                <select disabled={isEngineer} value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} className={selectCls}>
                  <option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option>
                </select>
              </div>
              <div><label style={labelStyle}>Start Date</label><input disabled={isEngineer} type="date" value={formData.startDate?.split("T")[0]} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} className={inputCls} /></div>
              <div><label style={labelStyle}>Deadline</label><input type="date" value={formData.endDate?.split("T")[0]} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} className={inputCls} /></div>
              {isAdmin && (
                <>
                  <div><label style={labelStyle}>Budget (₹) *</label><input type="number" value={formData.budget} onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })} className={inputCls} required /></div>
                  <div><label style={labelStyle}>Repository</label><input type="text" value={formData.repository} onChange={(e) => setFormData({ ...formData, repository: e.target.value })} className={inputCls} placeholder="URL ending in .git" /></div>
                </>
              )}
            </div>

            <div>
              <label style={labelStyle}>Requirements / Tech Stack</label>
              <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <input disabled={isEngineer} type="text" placeholder="Add requirement..." value={newInstrument} onChange={(e) => setNewInstrument(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (newInstrument.trim()) { setInstruments([...instruments, newInstrument.trim()]); setNewInstrument(""); } } }} className={inputCls} />
                <button disabled={isEngineer} type="button" onClick={() => { if (newInstrument.trim()) { setInstruments([...instruments, newInstrument.trim()]); setNewInstrument(""); } }} style={{ padding: "8px 14px", background: T.primary, border: "none", borderRadius: 8, color: "#fff", fontWeight: 600, cursor: "pointer" }}>Add</button>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {instruments.map((inst, i) => (
                  <span key={i} style={{ fontSize: 12, padding: "4px 10px", borderRadius: 20, background: T.bg, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 4 }}>
                    {inst} <button disabled={isEngineer} type="button" onClick={() => setInstruments(instruments.filter((_, idx) => idx !== i))} style={{ color: T.danger, background: "none", border: "none", cursor: "pointer" }}>×</button>
                  </span>
                ))}
              </div>
            </div>

            <div><label style={labelStyle}>Description</label><textarea disabled={isEngineer} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className={inputCls} rows={3} /></div>

            <div>
              <label style={labelStyle}>Technology Used</label>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "180px 1fr auto",
                  gap: 8,
                  marginBottom: 12,
                }}
              >
                <select
                  value={techArea}
                  onChange={(e) => setTechArea(e.target.value)}
                  className={selectCls}
                >
                  <option value="">Select Area</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Database">Database</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Cloud">Cloud</option>
                  <option value="Mobile">Mobile</option>
                  <option value="Desktop">Desktop</option>
                  <option value="Testing">Testing</option>
                  <option value="AI/ML">AI/ML</option>
                  <option value="Other">Other</option>
                </select>

                <input
                  type="text"
                  placeholder="React.js, Next.js, PostgreSQL..."
                  value={techName}
                  onChange={(e) => setTechName(e.target.value)}
                  className={inputCls}
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter" &&
                      techArea &&
                      techName.trim()
                    ) {
                      e.preventDefault();

                      setTechnology([
                        ...technology,
                        {
                          area: techArea,
                          tech: techName.trim(),
                        },
                      ]);

                      setTechArea("");
                      setTechName("");
                    }
                  }}
                />

                <button
                  type="button"
                  disabled={!techArea || !techName.trim()}
                  onClick={() => {
                    setTechnology([
                      ...technology,
                      {
                        area: techArea,
                        tech: techName.trim(),
                      },
                    ]);

                    setTechArea("");
                    setTechName("");
                  }}
                  style={{
                    padding: "8px 14px",
                    background:
                      !techArea || !techName.trim()
                        ? "#cbd5e1"
                        : T.primary,
                    border: "none",
                    borderRadius: 8,
                    color: "#fff",
                    fontWeight: 600,
                    cursor:
                      !techArea || !techName.trim()
                        ? "not-allowed"
                        : "pointer",
                    opacity:
                      !techArea || !techName.trim()
                        ? 0.7
                        : 1,
                  }}
                >
                  Add
                </button>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {technology.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 12px",
                      border: `1px solid ${T.border}`,
                      borderRadius: 10,
                      background: T.bg,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: T.primary,
                          textTransform: "uppercase",
                        }}
                      >
                        {item.area}
                      </div>

                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 500,
                          color: T.text,
                        }}
                      >
                        {item.tech}
                      </div>
                    </div>

                    {isEngineer && (
                      <button
                        type="button"
                        onClick={() =>
                          setTechnology(
                            technology.filter(
                              (_, i) => i !== index
                            )
                          )
                        }
                        style={{
                          border: "none",
                          background: "transparent",
                          color: T.danger,
                          cursor: "pointer",
                          fontSize: 18,
                        }}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-5 border rounded-xl p-5 bg-white">

              <div className="flex justify-between px-1">
                {/* Brand Name */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Brand Name
                  </label>

                  <input
                    value={designSystem.brandName}

                    onChange={(e) =>
                      setDesignSystem({
                        ...designSystem,
                        brandName: e.target.value,
                      })
                    }
                    type="text"
                    placeholder="Enter brand name"
                    className="w-full px-4 py-3 rounded-xl border"
                  />
                </div>

                {/* Brand Feel */}
                <div className="w-[38%]">
                  <label className="block text-sm font-semibold mb-2">
                    Brand Feel
                  </label>

                  <select value={designSystem.brandFeel} onChange={(e) =>
                    setDesignSystem({
                      ...designSystem,
                      brandFeel: e.target.value,
                    })
                  } className="w-full px-4 py-3 rounded-xl border">
                    <option>Default</option>
                    <option>Classic</option>
                    <option>Modern</option>
                    <option>Luxury</option>
                    <option>Minimal</option>
                    <option>Corporate</option>
                    <option>Futuristic</option>
                    <option>Playful</option>
                  </select>
                </div>
              </div>

              {/* Colors */}
              <div>
                <label style={labelStyle}>Brand Colors</label>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    gap: 8,
                    marginBottom: 12,
                  }}
                >
                  <input
                    type="text"
                    placeholder="#FF6B35 or Primary Orange"
                    value={colorInput}
                    onChange={(e) => setColorInput(e.target.value)}
                    className={inputCls}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && colorInput.trim()) {
                        e.preventDefault();

                        setDesignSystem({
                          ...designSystem,
                          colors: [
                            ...designSystem.colors,
                            colorInput.trim(),
                          ],
                        });

                        setColorInput("");
                      }
                    }}
                  />

                  <button
                    type="button"
                    disabled={!colorInput.trim()}
                    onClick={() => {
                      setDesignSystem({
                        ...designSystem,
                        colors: [
                          ...designSystem.colors,
                          colorInput.trim(),
                        ],
                      });

                      setColorInput("");
                    }}
                    style={{
                      padding: "8px 14px",
                      background: !colorInput.trim()
                        ? "#cbd5e1"
                        : T.primary,
                      border: "none",
                      borderRadius: 8,
                      color: "#fff",
                      fontWeight: 600,
                      cursor: !colorInput.trim()
                        ? "not-allowed"
                        : "pointer",
                    }}
                  >
                    Add
                  </button>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                  }}
                >
                  {designSystem.colors.map((color, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "8px 12px",
                        border: `1px solid ${T.border}`,
                        borderRadius: 999,
                        background: T.bg,
                      }}
                    >
                      <div
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: "50%",
                          background: color.startsWith("#")
                            ? color
                            : "#e5e7eb",
                          border: "1px solid #d1d5db",
                        }}
                      />

                      <span
                        style={{
                          fontSize: 13,
                          color: T.text,
                        }}
                      >
                        {color}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          setDesignSystem({
                            ...designSystem,
                            colors: designSystem.colors.filter(
                              (_, i) => i !== index
                            ),
                          })
                        }
                        style={{
                          border: "none",
                          background: "transparent",
                          color: T.danger,
                          cursor: "pointer",
                          fontSize: 16,
                          padding: 0,
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fonts */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Primary Font
                  </label>

                  <input
                    value={designSystem.fonts.primary}

                    onChange={(e) =>
                      setDesignSystem({
                        ...designSystem,
                        fonts: {
                          ...designSystem.fonts,
                          primary: e.target.value,
                        },
                      })
                    }
                    type="text"
                    placeholder="Inter"
                    className="w-full px-4 py-3 rounded-xl border"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Secondary Font
                  </label>

                  <input
                    value={designSystem.fonts.secondary}

                    onChange={(e) =>
                      setDesignSystem({
                        ...designSystem,
                        fonts: {
                          ...designSystem.fonts,
                          secondary: e.target.value,
                        },
                      })
                    }
                    type="text"
                    placeholder="Roboto"
                    className="w-full px-4 py-3 rounded-xl border"
                  />
                </div>
              </div>

              {/* Design Type */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Design Type
                </label>

                <input
                  value={designSystem.designType.join(", ")}
                  onChange={(e) =>
                    setDesignSystem({
                      ...designSystem,
                      designType: [e.target.value],
                    })}
                  type="text"
                  placeholder="Dashboard, SaaS, Ecommerce, Portfolio"
                  className="w-full px-4 py-3 rounded-xl border"
                />
              </div>

              <div className="flex gap-3">
                {/* Theme */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Theme
                  </label>

                  <input
                    value={designSystem.theme.join(", ")}
                    onChange={(e) =>
                      setDesignSystem({
                        ...designSystem,
                        theme: [e.target.value],
                      })
                    }
                    type="text"
                    placeholder="Light, Dark, Glassmorphism"
                    className="w-full px-4 py-3 rounded-xl border"
                  />
                </div>

                {/* Content Tone */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Content Tone
                  </label>

                  <input
                    value={designSystem.contentTone.join(", ")}
                    onChange={(e) =>
                      setDesignSystem({
                        ...designSystem,
                        contentTone: [e.target.value],
                      })
                    }
                    type="text"
                    placeholder="Professional, Friendly, Technical"
                    className="w-full px-4 py-3 rounded-xl border"
                  />
                </div>

              </div>
              {/* Layout Style */}
              <div>
                <label style={labelStyle}>Layout Style</label>

                {/* Existing Layout Properties */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    marginBottom: 12,
                  }}
                >
                  {Object.entries(designSystem.layoutStyle).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "10px 12px",
                          border: `1px solid ${T.border}`,
                          borderRadius: 10,
                          background: T.bg,
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              color: T.primary,
                              textTransform: "uppercase",
                            }}
                          >
                            {key}
                          </div>

                          <div
                            style={{
                              fontSize: 14,
                              color: T.text,
                            }}
                          >
                            {value}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setDesignSystem((prev) => {
                              const updated = { ...prev.layoutStyle };
                              delete updated[key];

                              return {
                                ...prev,
                                layoutStyle: updated,
                              };
                            });
                          }}
                          style={{
                            border: "none",
                            background: "transparent",
                            color: T.danger,
                            cursor: "pointer",
                            fontSize: 18,
                          }}
                        >
                          ×
                        </button>
                      </div>
                    )
                  )}
                </div>

                {/* Add New Property */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "180px 1fr auto",
                    gap: 8,
                  }}
                >
                  <input
                    type="text"
                    placeholder="Property (e.g. navigation)"
                    value={layoutKey}
                    onChange={(e) => setLayoutKey(e.target.value)}
                    className={inputCls}
                  />

                  <input
                    type="text"
                    placeholder="Value (e.g. Sticky top navbar)"
                    value={layoutValue}
                    onChange={(e) => setLayoutValue(e.target.value)}
                    className={inputCls}
                    onKeyDown={(e) => {
                      if (
                        e.key === "Enter" &&
                        layoutKey.trim() &&
                        layoutValue.trim()
                      ) {
                        e.preventDefault();

                        setDesignSystem((prev) => ({
                          ...prev,
                          layoutStyle: {
                            ...prev.layoutStyle,
                            [layoutKey.trim()]: layoutValue.trim(),
                          },
                        }));

                        setLayoutKey("");
                        setLayoutValue("");
                      }
                    }}
                  />

                  <button
                    type="button"
                    disabled={!layoutKey.trim() || !layoutValue.trim()}
                    onClick={() => {
                      setDesignSystem((prev) => ({
                        ...prev,
                        layoutStyle: {
                          ...prev.layoutStyle,
                          [layoutKey.trim()]: layoutValue.trim(),
                        },
                      }));

                      setLayoutKey("");
                      setLayoutValue("");
                    }}
                    style={{
                      padding: "8px 14px",
                      background:
                        !layoutKey.trim() || !layoutValue.trim()
                          ? "#cbd5e1"
                          : T.primary,
                      border: "none",
                      borderRadius: 8,
                      color: "#fff",
                      fontWeight: 600,
                      cursor:
                        !layoutKey.trim() || !layoutValue.trim()
                          ? "not-allowed"
                          : "pointer",
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Visual Guidelines */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Visual Guidelines
                </label>

                {/* Add New Guideline */}
                <div className="grid grid-cols-[180px_1fr_auto] gap-2">
                  <input
                    type="text"
                    placeholder="Property (e.g. borderRadius)"
                    value={visualKey}
                    onChange={(e) => setVisualKey(e.target.value)}
                    className="px-4 py-3 rounded-xl border"
                  />

                  <input
                    type="text"
                    placeholder="Value (e.g. 16px rounded corners)"
                    value={visualValue}
                    onChange={(e) => setVisualValue(e.target.value)}
                    className="px-4 py-3 rounded-xl border w-75"
                    onKeyDown={(e) => {
                      if (
                        e.key === "Enter" &&
                        visualKey.trim() &&
                        visualValue.trim()
                      ) {
                        e.preventDefault();

                        setDesignSystem((prev) => ({
                          ...prev,
                          visualGuidelines: {
                            ...prev.visualGuidelines,
                            [visualKey.trim()]: visualValue.trim(),
                          },
                        }));

                        setVisualKey("");
                        setVisualValue("");
                      }
                    }}
                  />

                  <button
                    type="button"
                    disabled={!visualKey.trim() || !visualValue.trim()}
                    onClick={() => {
                      setDesignSystem((prev) => ({
                        ...prev,
                        visualGuidelines: {
                          ...prev.visualGuidelines,
                          [visualKey.trim()]: visualValue.trim(),
                        },
                      }));

                      setVisualKey("");
                      setVisualValue("");
                    }}
                    className="px-6 bg-[#FFAE58] text-white rounded-xl disabled:opacity-50"
                  >
                    Add
                  </button>
                </div>

                {/* Existing Guidelines */}
                <div className="flex flex-col gap-2 mb-3">
                  {Object.entries(designSystem.visualGuidelines).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between p-3 border rounded-xl"
                      >
                        <div>
                          <div className="text-xs font-bold uppercase text-[#FFAE58]">
                            {key}
                          </div>

                          <div className="text-sm">
                            {value}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setDesignSystem((prev) => {
                              const updated = {
                                ...prev.visualGuidelines,
                              };

                              delete updated[key];

                              return {
                                ...prev,
                                visualGuidelines: updated,
                              };
                            });
                          }}
                          className="text-red-500 text-lg"
                        >
                          ×
                        </button>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Key Pages */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Key Pages
                </label>

                <input
                  type="text"
                  placeholder="Home, About, Pricing..."
                  className="w-full px-4 py-3 rounded-xl border"
                  value={keyPagesInput}
                  onChange={(e) => {
                    const value = e.target.value;
                    setKeyPagesInput(value);

                    setDesignSystem((prev) => ({
                      ...prev,
                      keyPages: value
                        .split(",")
                        .map((x) => x.trim())
                        .filter(Boolean),
                    }));
                  }}
                />
              </div>

              {/* Uniqueness */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  What Makes This Design Unique?
                </label>

                <textarea
                  value={designSystem.uniqueness.differentiator}
                  onChange={(e) =>
                    setDesignSystem((prev) => ({
                      ...prev,
                      uniqueness: {
                        ...prev.uniqueness,
                        differentiator: e.target.value,
                      },
                    }))
                  }
                  rows={4}
                  placeholder="Describe the unique visual style, inspiration, differentiators..."
                  className="w-full px-4 py-3 rounded-xl border"
                />
              </div>

            </div>

            <div style={{ display: "flex", gap: 12, paddingTop: 4 }}>
              <button type="button" onClick={() => showModel(false)} style={{ flex: 1, padding: "10px", border: `1px solid ${T.border}`, borderRadius: 8, background: T.card, color: T.text, cursor: "pointer", fontWeight: 500 }}>Cancel</button>
              <button type="submit" disabled={loading} style={{ flex: 1, padding: "10px", background: T.primary, border: "none", borderRadius: 8, color: "#fff", cursor: "pointer", fontWeight: 600, opacity: loading ? 0.7 : 1 }}>
                {loading ? "Updating..." : "Update Project"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export const SubmitReviewModal = ({ showModel, projectData }: { showModel: (v: boolean) => void; projectData: any }) => {
  const [loading, setLoading] = useState(false);
  const [repo, setRepo] = useState(projectData.repository || "");
  const [link, setLink] = useState(projectData.finalProjectLink || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/engineer/projects/${projectData.id}/submit`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ finalProjectLink: link, repository: repo }) });
      const data = await res.json();
      if (data.success) { toast.success("Submitted for review!"); showModel(false); window.location.reload(); }
      else { toast.error(data.message || "Failed to submit"); }
    } catch { toast.error("An error occurred"); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(5,10,48,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
      <div style={{ background: T.card, borderRadius: 16, padding: "1.5rem", width: 400, border: `1px solid ${T.border}` }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: T.text, margin: "0 0 1rem" }}>Submit for Review</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div><label style={labelStyle}>Live Project Link *</label><input type="url" value={link} onChange={(e) => setLink(e.target.value)} className={inputCls} placeholder="https://..." required /></div>
          <div><label style={labelStyle}>Repository URL</label><input type="url" value={repo} onChange={(e) => setRepo(e.target.value)} className={inputCls} placeholder="https://github.com/..." /></div>
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <button type="button" onClick={() => showModel(false)} style={{ flex: 1, padding: "9px", border: `1px solid ${T.border}`, borderRadius: 8, background: T.card, cursor: "pointer", fontWeight: 500 }}>Cancel</button>
            <button type="submit" disabled={loading} style={{ flex: 1, padding: "9px", background: T.success, border: "none", borderRadius: 8, color: "#fff", cursor: "pointer", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <Send size={15} /> {loading ? "Sending..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const ProgressModal = ({ current, onClose, onSave, saving }: any) => {
  const [val, setVal] = useState(current);
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(5,10,48,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
      <div style={{ background: T.card, borderRadius: 16, padding: "1.5rem", width: 340, border: `1px solid ${T.border}`, boxShadow: "0 8px 40px rgba(5,10,48,0.12)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: T.text, margin: 0 }}>Update Progress</h2>
          <button onClick={onClose} style={{ border: "none", background: "transparent", cursor: "pointer", color: T.textMuted }}><X size={18} /></button>
        </div>
        <input type="range" min={0} max={100} value={val} onChange={(e) => setVal(Number(e.target.value))} style={{ width: "100%", accentColor: T.primary }} />
        <p style={{ textAlign: "center", fontWeight: 700, fontSize: 28, color: T.text, margin: "8px 0 16px" }}>{val}%</p>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "9px", border: `1px solid ${T.border}`, borderRadius: 8, background: T.card, cursor: "pointer" }}>Cancel</button>
          <button onClick={() => onSave(val)} disabled={saving} style={{ flex: 1, padding: "9px", background: T.primary, border: "none", borderRadius: 8, color: "#fff", cursor: "pointer", opacity: saving ? 0.7 : 1 }}>{saving ? "Saving..." : "Save"}</button>
        </div>
      </div>
    </div>
  );
};