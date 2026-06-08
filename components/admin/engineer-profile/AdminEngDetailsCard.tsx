"use client";

import React, { useState } from "react";
import { Edit2 } from "lucide-react";
import DocumentViewer from "@/components/ui/DocumentViewer";
import CertificateSlider from "@/components/ui/CertificateSlider";
import AdminEngineerDetailsModal from "./AdminEngDetailsModal";

const EXP_LABELS: Record<string, string> = {
  FRESHER: "Fresher",
  ONE_TO_TWO_YEARS: "1-2 Years",
  THREE_TO_FIVE_YEARS: "3-5 Years",
  FIVE_TO_EIGHT_YEARS: "5-8 Years",
  EIGHT_PLUS_YEARS: "8+ Years",
};

export default function AdminEngDetailsCard({ profile, user, onUpdate }: { profile: any, user: any, onUpdate: () => void }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="p-6 border border-[var(--border)] rounded-2xl bg-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-[var(--border)] pb-4">
          <h4 className="text-lg font-bold font-inter text-[var(--text-primary)]">Professional Details</h4>
          <button onClick={() => setIsOpen(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[var(--border)] text-sm font-semibold hover:bg-gray-50 transition-colors">
            <Edit2 size={14} /> Edit
          </button>
        </div>

        {!profile ? (
          <p className="text-sm font-semibold text-orange-600 bg-orange-50 p-4 rounded-lg">No professional details submitted.</p>
        ) : (
          <div>
            <div className="flex flex-wrap gap-x-12 gap-y-6 mb-8 pb-6 border-b border-dashed border-[var(--border)]">
              <div className="flex-1 min-w-[120px]">
                <p className="text-xs text-[var(--text-muted)] font-semibold mb-1 uppercase tracking-wider">Qualification</p>
                <p className="font-semibold text-sm text-[var(--text-primary)]">{profile.qualification}</p>
              </div>
              
              <div className="flex-1 min-w-[120px]">
                <p className="text-xs text-[var(--text-muted)] font-semibold mb-1 uppercase tracking-wider">Experience</p>
                <p className="font-semibold text-sm text-[var(--text-primary)]">
                  {profile.yearsOfExperience ? EXP_LABELS[profile.yearsOfExperience] : "Not specified"}
                </p>
              </div>

              <div className="flex-1 min-w-[120px]">
                <p className="text-xs text-[var(--text-muted)] font-semibold mb-1 uppercase tracking-wider">Approval Status</p>
                <span className={`inline-block px-2.5 py-1 rounded text-xs font-bold tracking-wider ${
                  profile.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 
                  profile.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {profile.status}
                </span>
              </div>
            </div>

            <div className="md:col-span-2 pt-4 border-t border-dashed border-[var(--border)] mb-3">
              <p className="text-xs text-[var(--text-muted)] font-semibold mb-4 uppercase tracking-wider">
                Professional Links & Achievements
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <p className="text-xs text-[var(--text-muted)] mb-1">GitHub</p>
                  {profile.github ? (
                    <a
                      href={profile.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm font-medium break-all"
                    >
                      {profile.github}
                    </a>
                  ) : (
                    <p className="text-sm text-gray-500">Not Provided</p>
                  )}
                </div>

                <div>
                  <p className="text-xs text-[var(--text-muted)] mb-1">LinkedIn</p>
                  {profile.linkedin ? (
                    <a
                      href={profile.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm font-medium break-all"
                    >
                      {profile.linkedin}
                    </a>
                  ) : (
                    <p className="text-sm text-gray-500">Not Provided</p>
                  )}
                </div>

                <div>
                  <p className="text-xs text-[var(--text-muted)] mb-1">Portfolio</p>
                  {profile.portfolio ? (
                    <a
                      href={profile.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm font-medium break-all"
                    >
                      {profile.portfolio}
                    </a>
                  ) : (
                    <p className="text-sm text-gray-500">Not Provided</p>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs text-[var(--text-muted)] mb-2">Achievements</p>

                {profile.achievements?.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {profile.achievements.map((achievement: string, index: number) => (
                      <div
                        key={index}
                        className="bg-gray-50 border border-[var(--border)] rounded-lg px-4 py-3 text-sm"
                      >
                        {achievement}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No achievements added yet.</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              <div className="md:col-span-2">
                <p className="text-xs text-[var(--text-muted)] font-semibold mb-2 uppercase tracking-wider">ID Document ({profile.idType})</p>
                <p className="font-mono text-sm text-[var(--text-primary)] font-semibold mb-3">ID Number: {profile.idNumber}</p>
                {profile.idFile && (
                  <div className="h-[250px] max-w-sm">
                    <DocumentViewer url={profile.idFile} altText="ID Proof" className="w-full h-full" />
                  </div>
                )}
              </div>

              <div className="md:col-span-2 pt-4 border-t border-dashed border-[var(--border)]">
                <p className="text-xs text-[var(--text-muted)] font-semibold mb-3 uppercase tracking-wider">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {profile.skills?.map((s: string) => <span key={s} className="bg-gray-100 border border-[var(--border)] text-[var(--text-secondary)] text-xs font-semibold px-3 py-1.5 rounded-md shadow-sm">{s}</span>)}
                </div>
              </div>

              <div className="md:col-span-2 pt-4 border-t border-dashed border-[var(--border)]">
                <p className="text-xs text-[var(--text-muted)] font-semibold mb-4 uppercase tracking-wider">Certifications & Proofs</p>
                <CertificateSlider certificates={profile.certifications} />
              </div>
            </div>
          </div>
        )}
      </div>

      <AdminEngineerDetailsModal isOpen={isOpen} onClose={() => setIsOpen(false)} user={user} profile={profile} onUpdate={onUpdate} />
    </>
  );
}