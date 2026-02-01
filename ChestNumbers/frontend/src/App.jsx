import { useState, useEffect, memo, useMemo } from "react";
import axios from "axios";
import { generateLightQr } from "./utils/generateQr";

const getQrForPreview = async (number) => {
  return generateLightQr(
    {
      id: "GNDEC Athletix 2026",
      jerseyNumber: number,
    },
    { width: 240 },
  );
};

// Memoized Jersey Card for browser preview
const JerseyCard = memo(({ number }) => {
  const [qr, setQr] = useState(null);

  useEffect(() => {
    let mounted = true;
    getQrForPreview(number).then((img) => {
      if (mounted) setQr(img);
    });
    return () => (mounted = false);
  }, [number]);

  return (
    <div className="jersey-half border-[6px] border-black border-dotted rounded-[24px] p-10 flex flex-row items-stretch h-[135mm] relative bg-white box-border overflow-hidden">
      <div className="w-[65%] flex flex-col items-center justify-between h-full relative z-10 border-r-2 border-slate-100/50 py-8">
        <div className="w-full flex justify-center">
          <div className="font-['Montserrat'] font-black text-4xl italic tracking-tighter uppercase text-black border-b-[5px] border-black pb-1 leading-none shadow-[0_4px_0_rgba(0,0,0,0.05)]">
            GNDEC Athletix
          </div>
        </div>

        <div className="font-['Montserrat'] font-black leading-none tracking-tighter text-black flex items-center justify-center text-[200px] flex-1">
          {number}
        </div>

        <div className="w-full flex justify-center">
          <div className="text-black font-bold uppercase tracking-[0.25em] text-xl">
            Athletic Meet 2026
          </div>
        </div>
      </div>

      <div className="w-[35%] flex items-center justify-center h-full pl-8">
        {qr ? (
          <img
            src={qr}
            alt={`QR for ${number}`}
            className="w-[260px] h-[260px] object-contain grayscale animate-in fade-in duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-[260px] h-[260px] bg-slate-50 rounded-[32px] animate-pulse flex items-center justify-center border-2 border-slate-100">
            <div className="h-10 w-10 border-4 border-slate-200 border-t-slate-400 rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
});

JerseyCard.displayName = "JerseyCard";

function App() {
  const PREVIEW_PAGE_SIZE = 20;

  const [startInput, setStartInput] = useState(1);
  const [endInput, setEndInput] = useState(500);

  const [activeStart, setActiveStart] = useState(1);
  const [activeEnd, setActiveEnd] = useState(500);

  const [page, setPage] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const [showUrlModal, setShowUrlModal] = useState(false);
  const [customUrl, setCustomUrl] = useState("");
  const [customQr, setCustomQr] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveStart(startInput);
      setActiveEnd(endInput);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [startInput, endInput]);

  const generatePdf = async () => {
    setIsGeneratingPdf(true);
    setIsProcessing(true);
    setGenerationProgress(0);
    setDownloadProgress(0);

    const requestId = `pdf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // 1. Establish SSE connection for generation progress
    const eventSource = new EventSource(
      `http://localhost:8000/api/progress/${requestId}`,
    );

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setGenerationProgress(data.progress);

      if (data.progress >= 100) {
        eventSource.close();
        setIsProcessing(false);
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
      setIsProcessing(false);
    };

    try {
      // 2. Trigger PDF generation
      const response = await axios.post(
        "/api/generate-pdf",
        {
          start: activeStart,
          end: activeEnd,
          requestId: requestId,
        },
        {
          responseType: "blob",
          onDownloadProgress: (progressEvent) => {
            if (!progressEvent.total) return;
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            setDownloadProgress(percent);
          },
        },
      );

      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Jerseys_${activeStart}_to_${activeEnd}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF Generation failed:", err);
      alert("Failed to generate PDF. Make sure the backend is running.");
      eventSource.close();
      setIsProcessing(false);
    } finally {
      setTimeout(() => setIsGeneratingPdf(false), 300);
    }
  };

  const generateCustomQr = async (url) => {
    if (!url) {
      setCustomQr("");
      return;
    }
    const qr = await generateLightQr(url, { width: 400 });
    setCustomQr(qr);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      generateCustomQr(customUrl);
    }, 300);
    return () => clearTimeout(timer);
  }, [customUrl]);

  const totalItems = Math.max(0, activeEnd - activeStart + 1);
  const totalPages = Math.ceil(totalItems / PREVIEW_PAGE_SIZE);

  const visibleNumbers = useMemo(() => {
    const numbers = [];
    const windowStart = activeStart + page * PREVIEW_PAGE_SIZE;
    const windowEnd = Math.min(activeEnd, windowStart + PREVIEW_PAGE_SIZE - 1);

    for (let i = windowStart; i <= windowEnd; i++) {
      numbers.push(i);
    }
    return numbers;
  }, [activeStart, activeEnd, page]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 pb-20">
      <div className="max-w-4xl mx-auto p-8 no-print animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-200/60 border border-slate-100">
          <div className="flex flex-col items-center justify-center gap-4 mb-12 text-center">
            <span className="text-5xl">🏃</span>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Jersey Number Generator
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="group space-y-3">
              <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest ml-1">
                Start Number
              </label>
              <input
                type="number"
                min="1"
                value={startInput}
                onChange={(e) =>
                  setStartInput(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-6 py-4 text-xl font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all duration-300"
              />
            </div>

            <div className="group space-y-3">
              <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest ml-1">
                End Number
              </label>
              <input
                type="number"
                min="1"
                value={endInput}
                onChange={(e) =>
                  setEndInput(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-6 py-4 text-xl font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all duration-300"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="px-8 py-4 bg-slate-900 hover:bg-black text-white font-bold rounded-2xl shadow-lg transition-all duration-300 flex-1 md:flex-none uppercase tracking-widest text-sm"
            >
              {showPreview ? "Hide Preview" : "Show Preview"}
            </button>

            <button
              onClick={generatePdf}
              disabled={isGeneratingPdf}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg transition-all duration-300 flex-1 md:flex-none uppercase tracking-widest text-sm disabled:opacity-50 relative overflow-hidden"
            >
              <span className="relative z-10">
                {isGeneratingPdf ? (
                  isProcessing ? (
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing {generationProgress}%
                    </span>
                  ) : (
                    `Downloading ${downloadProgress}%`
                  )
                ) : (
                  "Download PDF (Print All)"
                )}
              </span>

              {isGeneratingPdf && (
                <div
                  className="absolute left-0 top-0 h-full bg-indigo-800 transition-all duration-300"
                  style={{
                    width: `${isProcessing ? generationProgress : downloadProgress}%`,
                  }}
                />
              )}
            </button>

            <button
              onClick={() => setShowUrlModal(true)}
              className="px-8 py-4 bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-900 font-bold rounded-2xl transition-all duration-300 flex-1 md:flex-none"
            >
              🔗 URL QR
            </button>
          </div>

          <div className="mt-8 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
            Ready to generate {totalItems} jerseys • 2 per A4 page
          </div>
        </div>
      </div>

      {showPreview && (
        <>
          <div className="max-w-4xl mx-auto px-8 no-print flex items-center justify-between mb-8">
            <button
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
              className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 disabled:opacity-30 hover:bg-slate-50 transition-all cursor-pointer"
            >
              &lsaquo; Prev
            </button>

            <div className="flex flex-col items-center">
              <span className="font-bold text-slate-400 text-sm italic">
                Preview Page <span className="text-slate-900">{page + 1}</span>{" "}
                of {totalPages}
              </span>
            </div>

            <button
              disabled={page >= totalPages - 1}
              onClick={() => setPage(page + 1)}
              className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 disabled:opacity-30 hover:bg-slate-50 transition-all cursor-pointer"
            >
              Next &rsaquo;
            </button>
          </div>

          <div className="preview-area w-full max-w-[210mm] mx-auto pb-20 no-print">
            {visibleNumbers.map((number) => (
              <div
                key={number}
                className="bg-white text-black p-[5mm] w-[210mm] h-[297mm] mx-auto mb-8 shadow-2xl flex flex-col justify-around overflow-hidden border border-slate-100"
                style={{ contain: "layout size style" }}
              >
                <JerseyCard number={number} />
                <div className="w-full border-b-2 border-slate-100 border-dashed my-4" />
                <JerseyCard number={number} />
              </div>
            ))}
          </div>
        </>
      )}

      {/* URL QR Modal */}
      {showUrlModal && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md no-print animate-in fade-in duration-300"
          onClick={() => setShowUrlModal(false)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-[40px] p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] relative animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-8 right-8 w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all text-2xl group"
              onClick={() => setShowUrlModal(false)}
            >
              <span className="group-hover:rotate-90 transition-transform duration-300">
                &times;
              </span>
            </button>

            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-3xl">
                🔗
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                  Website QR
                </h2>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">
                  Generate Instant Link QR
                </p>
              </div>
            </div>

            <div className="space-y-10">
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <label className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-1">
                    Target URL
                  </label>
                  {customUrl && (
                    <button
                      onClick={() => setCustomUrl("")}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-widest"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="https://athletix.gndec.ac.in"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    autoFocus
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl px-8 py-5 text-lg font-medium text-slate-900 focus:ring-12 focus:ring-indigo-500/5 focus:border-indigo-500 focus:bg-white outline-none transition-all duration-300 shadow-sm"
                  />
                  {!customUrl && (
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-20">
                      <span className="text-2xl">⌨️</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="relative p-10 bg-slate-50/50 rounded-[40px] border-2 border-slate-100 border-dashed group transition-all duration-500 hover:bg-slate-50 hover:border-indigo-100">
                {customQr ? (
                  <div className="flex flex-col items-center gap-8 animate-in zoom-in-90 duration-500">
                    <div className="relative">
                      <div className="absolute -inset-4 bg-indigo-500/5 blur-3xl rounded-full" />
                      <img
                        src={customQr}
                        alt="Custom QR"
                        className="relative z-10 w-[240px] h-[240px] rounded-3xl shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] border-8 border-white grayscale transition-all duration-500 hover:grayscale-0 hover:scale-105"
                      />
                    </div>

                    <a
                      href={customQr}
                      download="website-qr.png"
                      className="w-full py-5 px-8 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-indigo-600 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
                    >
                      <span>Download PNG</span>
                      <span className="text-xl">📥</span>
                    </a>
                  </div>
                ) : (
                  <div className="py-20 text-slate-400 font-bold text-center flex flex-col items-center gap-4">
                    <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-4xl shadow-sm animate-bounce duration-1000">
                      ✨
                    </div>
                    <div>
                      <p className="text-slate-900">Waiting for URL</p>
                      <p className="text-sm opacity-50 font-medium normal-case mt-1 italic">
                        The magic happens here...
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-slate-50 text-center">
              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">
                High Resolution • Print Ready • Zero Tracking
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
