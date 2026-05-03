import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Award, ExternalLink, Share2, Download, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';

const categoryColors = {
  coding: 'from-blue-500 to-blue-700',
  design: 'from-purple-500 to-purple-700',
  entrepreneurship: 'from-green-500 to-green-700',
  marketing: 'from-orange-500 to-orange-700',
  data: 'from-teal-500 to-teal-700'
};

const categoryBg = {
  coding: '#2563eb',
  design: '#7c3aed',
  entrepreneurship: '#16a34a',
  marketing: '#ea580c',
  data: '#0d9488'
};

function generatePDF(cert, userName, logoBase64) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const W = 297, H = 210;
  const hex = categoryBg[cert.category] || '#2563eb';
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  // Background
  doc.setFillColor(248, 250, 252);
  doc.rect(0, 0, W, H, 'F');

  // Top bar
  doc.setFillColor(r, g, b);
  doc.rect(0, 0, W, 18, 'F');

  // Bottom bar
  doc.rect(0, H - 18, W, 18, 'F');

  // Left & right accent bars
  doc.rect(0, 0, 8, H, 'F');
  doc.rect(W - 8, 0, 8, H, 'F');

  // Outer border
  doc.setDrawColor(r, g, b);
  doc.setLineWidth(0.8);
  doc.rect(14, 22, W - 28, H - 44);

  // Inner border
  doc.setLineWidth(0.3);
  doc.setDrawColor(200, 200, 200);
  doc.rect(17, 25, W - 34, H - 50);

  // Logo in top bar (left & right)
  if (logoBase64) {
    doc.addImage(logoBase64, 'PNG', 16, 2, 14, 14);
    doc.addImage(logoBase64, 'PNG', W - 30, 2, 14, 14);
  }

  // Org name in top bar
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('YOUTHSKILLS PROGRAM', W / 2, 12, { align: 'center' });

  // CERTIFICATE OF COMPLETION heading
  doc.setTextColor(r, g, b);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setCharSpace(3);
  doc.text('CERTIFICATE OF COMPLETION', W / 2, 38, { align: 'center' });
  doc.setCharSpace(0);

  // Decorative line
  doc.setDrawColor(r, g, b);
  doc.setLineWidth(0.5);
  doc.line(80, 42, W - 80, 42);

  // Logo centered
  if (logoBase64) {
    doc.addImage(logoBase64, 'PNG', W / 2 - 10, 44, 20, 20);
  }

  // "This is to certify that"
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'italic');
  doc.text('This is to certify that', W / 2, 72, { align: 'center' });

  // Recipient name
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(30);
  doc.setFont('helvetica', 'bold');
  doc.text(userName, W / 2, 88, { align: 'center' });

  // Underline name
  const nw = doc.getTextWidth(userName);
  doc.setDrawColor(r, g, b);
  doc.setLineWidth(0.8);
  doc.line((W - nw) / 2, 91, (W + nw) / 2, 91);

  // "has successfully completed"
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'italic');
  doc.text('has successfully completed the course', W / 2, 101, { align: 'center' });

  // Course title
  doc.setTextColor(r, g, b);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(cert.course_title, W / 2, 116, { align: 'center' });

  // Category & Level badges
  doc.setFillColor(r, g, b);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.roundedRect(W / 2 - 40, 121, 36, 8, 2, 2, 'F');
  doc.text(cert.category.toUpperCase(), W / 2 - 22, 126.5, { align: 'center' });
  doc.setFillColor(80, 80, 80);
  doc.roundedRect(W / 2 + 4, 121, 36, 8, 2, 2, 'F');
  doc.text(cert.level.toUpperCase(), W / 2 + 22, 126.5, { align: 'center' });

  // Divider
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.3);
  doc.line(40, 140, W - 40, 140);

  const issueDate = new Date(cert.issued_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  // Instructor column
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('INSTRUCTOR', 60, 150, { align: 'center' });
  doc.setDrawColor(180, 180, 180);
  doc.line(30, 152, 90, 152);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 30, 30);
  doc.text(cert.instructor_name, 60, 159, { align: 'center' });

  // Date column
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('DATE ISSUED', W / 2, 150, { align: 'center' });
  doc.setDrawColor(180, 180, 180);
  doc.line(W / 2 - 30, 152, W / 2 + 30, 152);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 30, 30);
  doc.text(issueDate, W / 2, 159, { align: 'center' });

  // Certificate number column
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('CERTIFICATE NO.', W - 60, 150, { align: 'center' });
  doc.setDrawColor(180, 180, 180);
  doc.line(W - 90, 152, W - 30, 152);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(r, g, b);
  doc.text(cert.certificate_number, W - 60, 159, { align: 'center' });

  // Footer
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`Verify at: ${window.location.origin}/verify/${cert.certificate_number}`, W / 2, H - 10, { align: 'center' });

  doc.save(`YouthSkills-Certificate-${cert.certificate_number}.pdf`);
}

export default function CertificatesPage() {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    api.get('/certificates/my').then(res => setCertificates(res.data.certificates)).finally(() => setLoading(false));
  }, []);

  const copyVerifyLink = (certNumber) => {
    const url = `${window.location.origin}/verify/${certNumber}`;
    navigator.clipboard.writeText(url);
    toast.success('Verification link copied!');
  };

  const handleDownload = async (cert) => {
    setDownloading(cert.id);
    try {
      let logoBase64 = null;
      try {
        const res = await fetch('/logo.png');
        const blob = await res.blob();
        logoBase64 = await new Promise(resolve => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
      } catch {}
      generatePDF(cert, user?.name || 'Graduate', logoBase64);
      toast.success('Certificate downloaded!');
    } catch {
      toast.error('Download failed. Please try again.');
    } finally {
      setDownloading(null);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
    </div>
  );

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="section-title">My Certificates</h1>
        <p className="section-subtitle">Your earned digital certificates — download, share, or verify</p>
      </div>

      {certificates.length === 0 ? (
        <div className="card text-center py-16">
          <Award className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="font-bold text-slate-700 text-lg mb-2">No Certificates Yet</h3>
          <p className="text-slate-400 mb-6">Complete a course to earn your first certificate!</p>
          <a href="/courses" className="btn-primary inline-flex">Browse Courses</a>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {certificates.map(cert => (
            <div key={cert.id} className="rounded-2xl overflow-hidden shadow-md border border-slate-100">
              {/* Certificate card visual */}
              <div className={`bg-gradient-to-br ${categoryColors[cert.category] || 'from-blue-500 to-blue-700'} p-8 text-white text-center relative`}>
                <div className="absolute top-4 right-4 opacity-20">
                  <Award className="w-16 h-16" />
                </div>
                {/* Logo */}
                <div className="flex justify-center mb-3">
                  <div className="bg-white rounded-xl p-2 w-16 h-16 flex items-center justify-center shadow-md">
                    <img src="/logo.png" alt="YouthSkills Program" className="w-12 h-12 object-contain" />
                  </div>
                </div>
                <p className="text-sm font-medium opacity-80 uppercase tracking-wider mb-1">Certificate of Completion</p>
                <h3 className="text-xl font-bold mb-2">{cert.course_title}</h3>
                <p className="text-sm opacity-80">Awarded to</p>
                <p className="text-2xl font-extrabold mt-1">{user?.name}</p>
                <div className="mt-4 pt-4 border-t border-white/20">
                  <p className="text-xs opacity-70">Issued by YouthSkills Program</p>
                  <p className="text-xs opacity-70">{new Date(cert.issued_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>

              {/* Certificate details */}
              <div className="bg-white p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-slate-400">Certificate Number</p>
                    <p className="font-mono text-sm font-bold text-slate-700">{cert.certificate_number}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Level</p>
                    <p className="text-sm font-semibold text-slate-700 capitalize">{cert.level}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mb-3">Instructor: {cert.instructor_name}</p>
                <div className="grid grid-cols-3 gap-2">
                  <button onClick={() => handleDownload(cert)} disabled={downloading === cert.id}
                    className="btn-primary text-sm py-2">
                    {downloading === cert.id
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <><Download className="w-4 h-4" /> PDF</>}
                  </button>
                  <button onClick={() => copyVerifyLink(cert.certificate_number)} className="btn-secondary text-sm py-2">
                    <Share2 className="w-4 h-4" /> Share
                  </button>
                  <a href={`/verify/${cert.certificate_number}`} target="_blank" rel="noopener noreferrer" className="btn-outline text-sm py-2">
                    <ExternalLink className="w-4 h-4" /> Verify
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
