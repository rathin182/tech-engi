"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, Loader2, X, Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function ClientFormPage() {
  const router = useRouter();
  const { status } = useSession();
  const [totalProjects, setTotalProjects] = useState("");
  const [totalBudget, setTotalBudget] = useState("");
  const [expertise, setExpertise] = useState<string[]>([]);
  const [expertiseInput, setExpertiseInput] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/register/client");
    }
  }, [status, router]);

  const addExpertise = () => {
    const val = expertiseInput.trim();
    if (val && !expertise.includes(val)) {
      setExpertise([...expertise, val]);
    }
    setExpertiseInput("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (expertise.length === 0) {
      setError("Please add at least one area of expertise");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/client/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          totalProjects: parseInt(totalProjects) || 0,
          totalBudget: parseFloat(totalBudget) || 0,
          expertise,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message);

      // router.push("/form/payout");
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#f8fafd] flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-[#f0b31e]" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="flex w-full h-screen">
      <div className="w-[50%] h-screen">
        <div className="min-h-screen flex flex-col justify-center items-center p-4 font-sans">
          <div className="w-full max-w-[420px] rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 sm:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-[1rem] bg-[#f0b31e] shadow-lg shadow-yellow-500/30 mx-auto mb-4">
                <Briefcase className="h-7 w-7 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-[#0f172a] tracking-tight">Complete Your Profile</h1>
              <p className="text-gray-500 mt-2 text-sm">Tell us a bit about your project history</p>
            </div>

            {error && (
              <div className="mb-6 text-red-500 text-sm font-medium text-center bg-red-50 p-3 rounded-xl border border-red-100">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700 ml-1">Total Projects Done</label>
                <input
                  type="number"
                  min="0"
                  value={totalProjects}
                  onChange={(e) => setTotalProjects(e.target.value)}
                  placeholder="e.g. 5"
                  className="w-full px-4 h-12 rounded-xl border border-gray-200 bg-transparent focus:bg-white focus:border-[#f0b31e] focus:ring-1 focus:ring-[#f0b31e] outline-none transition-all text-sm text-black"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700 ml-1">Total Budget Spent (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={totalBudget}
                  onChange={(e) => setTotalBudget(e.target.value)}
                  placeholder="e.g. 50000"
                  className="w-full px-4 h-12 rounded-xl border border-gray-200 bg-transparent focus:bg-white focus:border-[#f0b31e] focus:ring-1 focus:ring-[#f0b31e] outline-none transition-all text-sm text-black"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700 ml-1">Areas of Expertise</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={expertiseInput}
                    onChange={(e) => setExpertiseInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addExpertise(); } }}
                    placeholder="e.g. Embedded Systems"
                    className="flex-1 px-4 h-12 rounded-xl border border-gray-200 bg-transparent focus:bg-white focus:border-[#f0b31e] focus:ring-1 focus:ring-[#f0b31e] outline-none transition-all text-sm text-black"
                  />
                  <button
                    type="button"
                    onClick={addExpertise}
                    className="h-12 w-12 flex items-center justify-center rounded-xl bg-[#f0b31e] text-white hover:bg-[#e0a61a] transition-colors"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
                {expertise.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {expertise.map((tag) => (
                      <span key={tag} className="flex items-center gap-1 px-3 py-1 bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs font-medium rounded-full">
                        {tag}
                        <button type="button" onClick={() => setExpertise(expertise.filter(t => t !== tag))}>
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 mt-2 bg-[#f0b31e] hover:bg-[#e0a61a] text-white rounded-xl text-base font-semibold shadow-md shadow-yellow-500/20 transition-all flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Save & Continue"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="w-[50%] rounded-[40px] relative overflow-hidden p-10 flex flex-col justify-between mt-3 mr-3 mb-3">

        {/* MAIN YELLOW GRADIENT LIKE REFERENCE IMAGE */}
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#FFF6D6_0%,#F8D978_18%,#F0B31E_45%,#E8A400_65%,#FFF1C2_100%)]" />

        {/* Soft White Glow Top Left */}
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-white/10 blur-[140px] rounded-full" />
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-white/50 blur-[140px] rounded-full" />

        {/* Warm Golden Glow Center */}
        <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-[#FFD65C]/40 blur-[120px] rounded-full" />

        {/* Light Cream Glow Right */}
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#FFF3CF]/60 blur-[140px] rounded-full" />

        {/* Grain Texture */}
        <div className="absolute inset-0 opacity-[0.12] mix-blend-soft-light bg-[url('https://www.transparenttextures.com/patterns/noise.png')]" />

        {/* Overlay Fade */}
        <div className="absolute inset-0 bg-white/[0.08]" />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full ">

          <div className="mt-20">
            {/* Logo */}
            <div className="w-24 h-24 bg-white rounded-sm flex items-center justify-center text-black font-bold text-sm shadow-xl">
              LOGO
            </div>

            {/* Hero */}
            <div className="mt-12">
              <h1 className="text-white text-7xl font-extrabold tracking-tight leading-none">
                TECH ENGI
              </h1>

              <p className="text-white/85 text-lg max-w-xl mt-4 leading-relaxed">
                Lorem ipsum dolor sit amet consectetur. Suscipit sed amet commodo vel
                ultrices tortor orci. Enim lectus turpis augue donec. Gravida non
              </p>
            </div>
          </div>

          {/* Bottom */}
          {/* Bottom Section */}
          <div className="mt-auto pt-28">

            {/* Testimonials */}
            <div className="flex gap-6 overflow-hidden">

              {/* Card 1 */}
              <div
                className="
        min-w-[420px]
        rounded-3xl
        border
        border-white/20
        bg-white/[0.12]
        backdrop-blur-2xl
        p-6
        shadow-[0_10px_40px_rgba(255,190,40,0.15)]
      "
              >
                <p className="text-white/90 text-sm leading-relaxed font-medium">
                  Dude, your stuff is the bomb! House rent is the real deal! I
                  STRONGLY recommend house rent to EVERYONE interested in running a
                  successful online business!
                </p>

                <div className="flex items-center gap-3 mt-6">
                  <img
                    src="https://i.pravatar.cc/100?img=32"
                    alt=""
                    className="w-10 h-10 rounded-full object-cover border border-white/30"
                  />

                  <div>
                    <h4 className="text-white font-semibold text-sm">
                      Lana Bernier
                    </h4>

                    <p className="text-white/70 text-xs">
                      Senior Paradigm Strategist
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div
                className="
        min-w-[420px]
        rounded-3xl
        border
        border-white/20
        bg-white/[0.12]
        backdrop-blur-2xl
        p-6
        shadow-[0_10px_40px_rgba(255,190,40,0.15)]
      "
              >
                <p className="text-white/90 text-sm leading-relaxed font-medium">
                  Dude, your stuff is the bomb! House rent is the real deal! I
                  STRONGLY recommend house rent to EVERYONE interested in running a
                  successful online business!
                </p>

                <div className="flex items-center gap-3 mt-6">
                  <img
                    src="https://i.pravatar.cc/100?img=12"
                    alt=""
                    className="w-10 h-10 rounded-full object-cover border border-white/30"
                  />

                  <div>
                    <h4 className="text-white font-semibold text-sm">
                      Lana Bernier
                    </h4>

                    <p className="text-white/70 text-xs">
                      Senior Paradigm Strategist
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end mt-16 gap-4 pr-2">
              <div className="w-32 h-[2px] bg-white/70" />

              <p className="text-white text-3xl font-light tracking-tight">
                Build for connectivity
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
