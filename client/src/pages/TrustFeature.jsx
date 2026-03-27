import { Video, Wallet, ShieldCheck } from "lucide-react";

 function TrustFeatures() {
  return (
    <div className="w-full bg-black py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Free Consultation */}
          <div className="flex items-center gap-4 rounded-2xl bg-neutral-900 border border-neutral-800 p-6 hover:border-neutral-700 transition">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/10">
              <Video className="text-emerald-400 w-6 h-6" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">
                Free Consultation
              </h3>
              <p className="text-neutral-400 text-sm">
                Video call first
              </p>
            </div>
          </div>

          {/* Secure Escrow */}
          <div className="flex items-center gap-4 rounded-2xl bg-neutral-900 border border-neutral-800 p-6 hover:border-neutral-700 transition">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500/10">
              <Wallet className="text-green-400 w-6 h-6" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">
                Secure Escrow
              </h3>
              <p className="text-neutral-400 text-sm">
                Payment protected
              </p>
            </div>
          </div>

          {/* Money Back */}
          <div className="flex items-center gap-4 rounded-2xl bg-neutral-900 border border-neutral-800 p-6 hover:border-neutral-700 transition">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/10">
              <ShieldCheck className="text-blue-400 w-6 h-6" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">
                Money Back
              </h3>
              <p className="text-neutral-400 text-sm">
                100% guaranteed
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}


export default TrustFeatures