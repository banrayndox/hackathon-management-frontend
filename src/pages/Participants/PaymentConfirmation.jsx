import { useState, useEffect } from "react";
import { FaCheckCircle, FaWallet, FaReceipt } from "react-icons/fa";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function PaymentConfirmation() {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState("bkash");
  const [transactionId, setTransactionId] = useState("");
  const [senderNumber, setSenderNumber] = useState("");
  const [referenceName, setReferenceName] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [teamId, setTeamId] = useState(null);
  const [loading, setLoading] = useState(true);

  const paymentMethods = [
    { id: "bkash", name: "bKash", logo: "🇧🇩", color: "hover:border-pink-500/40 text-pink-400 bg-pink-500/5" },
    { id: "nagad", name: "Nagad", logo: "🔶", color: "hover:border-orange-500/40 text-orange-400 bg-orange-500/5" },
    { id: "rocket", name: "Rocket", logo: "💜", color: "hover:border-purple-500/40 text-purple-400 bg-purple-500/5" },
    { id: "cash", name: "Hand Cash", logo: "💵", color: "hover:border-emerald-500/40 text-emerald-400 bg-emerald-500/5" },
  ];

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        
        const res = await API.get("/api/participant/my-teams");
        if (res.data && res.data.length > 0) {
          setTeamId(res.data[0]._id);
        } else {
          toast.error("You are not in any team. Create or join a team first.");
          navigate("/participants/dashboard");
        }
      } catch (err) {
        console.error("Failed to fetch team details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, [navigate]);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!teamId) return;

    const tid = toast.loading("Submitting payment details...");
    try {
      setLoading(true);
      const isCash = selectedMethod === "cash";
      await API.put(`/api/participant/teams/${teamId}/payment`, {
        paymentMethod: selectedMethod,
        transactionId: isCash ? referenceName.trim() : transactionId.trim(),
        paid: false
      });
      toast.success("Payment details submitted! Awaiting admin approval.", { id: tid });
      setIsSubmitted(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit payment details", { id: tid });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#090411] text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#090411] text-slate-100 px-4 sm:px-6 md:px-10 py-16 overflow-hidden flex items-center justify-center">
      {/* Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-pink-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-xl bg-white/[0.02] border border-white/[0.06] rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl shadow-black/50 relative z-10">
        
        {!isSubmitted ? (
          <form onSubmit={handlePaymentSubmit} className="space-y-6">
            {/* HEADER */}
            <div className="text-center border-b border-white/[0.06] pb-5">
              <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Payment Verification
              </h1>
              <p className="text-slate-400 text-xs mt-1.5 font-medium">
                Confirm your registration fee using standard payment channels.
              </p>
            </div>

            {/* AMOUNT SUMMARY PILL */}
            <div className="bg-[#120A24] border border-white/[0.04] rounded-2xl p-4 flex justify-between items-center px-6">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-2">
              Registration Payable
              </span>
              <span className="text-xl font-black text-purple-400 tracking-tight">
                ৳ 700 <span className="text-xs text-slate-500 font-bold">BDT</span>
              </span>
            </div>

            {/* PAYMENT METHODS GRID */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Select Payment Channel
              </label>
              <div className="grid grid-cols-2 gap-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => {
                      setSelectedMethod(method.id);
                      setTransactionId("");
                      setSenderNumber("");
                      setReferenceName("");
                    }}
                    className={`p-3.5 rounded-xl border text-sm font-bold flex items-center gap-3 transition-all ${
                      selectedMethod === method.id
                        ? "border-purple-500/60 bg-purple-500/10 text-white shadow-lg shadow-purple-950/30"
                        : "border-white/[0.04] bg-white/[0.01] text-slate-400 " + method.color
                    }`}
                  >
                    <span className="text-base">{method.logo}</span>
                    {method.name}
                  </button>
                ))}
              </div>
            </div>

            {/* DYNAMIC INPUT FIELDS BASED ON CHANNEL */}
            <div className="space-y-4 animate-fadeIn">
              {selectedMethod !== "cash" ? (
                <>
                  {/* Sender Mobile Number */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <FaWallet className="text-slate-500 text-[10px]" /> Sender Mobile Number
                    </label>
                    <input
                      type="text"
                      required
                      pattern="^(?:\+88|88)?(01[3-9]\d{8})$"
                      placeholder="e.g., 017XXXXXXXX"
                      value={senderNumber}
                      onChange={(e) => setSenderNumber(e.target.value)}
                      className="w-full bg-[#120A24] border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition"
                    />
                  </div>

                  {/* Transaction ID */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <FaReceipt className="text-slate-500 text-[10px]" /> Transaction ID (TrxID)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., BK28M9LK12"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      className="w-full bg-[#120A24] border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 uppercase outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition tracking-wider font-semibold"
                    />
                  </div>
                </>
              ) : (
                /* Hand Cash Reference Field */
                <div className="animate-fadeIn">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <FaReceipt className="text-slate-500 text-[10px]" /> Authority Reference / Collector Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Collected by Organizer (Name / Token)"
                    value={referenceName}
                    onChange={(e) => setReferenceName(e.target.value)}
                    className="w-full bg-[#120A24] border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition"
                  />
                </div>
              )}
            </div>

            {/* CONFIRM BUTTON */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-bold text-sm tracking-wide shadow-lg shadow-purple-900/40 active:scale-[0.99] transition transform hover:-translate-y-0.5"
            >
              Confirm Payment
            </button>
          </form>
        ) : (
          /* SUCCESS STATE PANEL */
          <div className="text-center py-8 space-y-5 animate-fadeIn">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-3xl mx-auto shadow-xl shadow-emerald-950/20">
              <FaCheckCircle />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-200">Verification Request Done</h2>
              <p className="text-xs text-slate-400 max-w-xs mx-auto mt-2 leading-relaxed font-medium">
                Your payment information have been submitted. The admin desk will audit the ledger statement and approve your status shortly.
              </p>
            </div>
            <div className="pt-4 flex justify-center gap-2">
              <button
                onClick={() => navigate("/participants/dashboard")}
                className="px-6 py-2 text-xs font-semibold rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition"
              >
                Go to Dashboard
              </button>
              {/* <button
                onClick={() => setIsSubmitted(false)}
                className="px-6 py-2 text-xs font-semibold rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] text-slate-300 transition"
              >
                Submit Another Receipt
              </button> */}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}