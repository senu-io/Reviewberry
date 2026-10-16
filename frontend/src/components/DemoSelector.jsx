import React from 'react';
import { Utensils, Shirt, Upload, Play, CheckCircle2, MapPin } from 'lucide-react';

export default function DemoSelector({ activeDemoId, onSelectDemo, onOpenUpload, loading }) {
  return (
    <div className="bg-slate-900/60 rounded-2xl p-5 border border-slate-800 shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>⚡ Interactive Live Demos (1-Click Evaluation)</span>
          </h2>
          <p className="text-xs text-slate-400">
            Load realistic commercial review datasets or test with your own custom customer feedback.
          </p>
        </div>

        <button
          onClick={onOpenUpload}
          className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors shadow-sm self-start sm:self-auto"
        >
          <Upload className="w-3.5 h-3.5 text-berry-400" />
          <span>Upload Custom Reviews (CSV)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        
        {/* Scenario 1: Trattoria Luigi (Rome) */}
        <div
          onClick={() => !loading && onSelectDemo('trattoria')}
          className={`cursor-pointer rounded-xl p-4 border transition-all ${
            activeDemoId === 'trattoria'
              ? 'bg-berry-950/20 border-berry-500 shadow-md shadow-berry-950/40 ring-1 ring-berry-500/50'
              : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700 hover:bg-slate-950/90'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-sm text-white">Trattoria Luigi & Delivery</h3>
                  <span className="text-[10px] font-medium text-slate-400 flex items-center gap-0.5">
                    <MapPin className="w-2.5 h-2.5 text-red-400" /> Rome, IT
                  </span>
                </div>
                <span className="text-[11px] text-amber-300 font-medium">Food & Courier Logistics (12 Reviews)</span>
              </div>
            </div>

            {activeDemoId === 'trattoria' ? (
              <span className="flex items-center space-x-1 text-[11px] font-semibold text-berry-400 bg-berry-500/10 px-2 py-0.5 rounded-full border border-berry-500/20">
                <CheckCircle2 className="w-3 h-3" />
                <span>Active</span>
              </span>
            ) : (
              <span className="text-xs text-slate-400 group-hover:text-white flex items-center gap-1 font-medium">
                <Play className="w-3 h-3 fill-slate-400" /> Run
              </span>
            )}
          </div>

          <p className="text-xs text-slate-400 mt-2.5 line-clamp-2">
            Cold pasta transit delays, couriers without thermal bags, missing dipping sauces and cannoli, and POS receipt address truncation in Trastevere.
          </p>
        </div>

        {/* Scenario 2: UrbanVibe Boutique (Milan) */}
        <div
          onClick={() => !loading && onSelectDemo('retail')}
          className={`cursor-pointer rounded-xl p-4 border transition-all ${
            activeDemoId === 'retail'
              ? 'bg-berry-950/20 border-berry-500 shadow-md shadow-berry-950/40 ring-1 ring-berry-500/50'
              : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700 hover:bg-slate-950/90'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Shirt className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-sm text-white">UrbanVibe Boutique & Retail</h3>
                  <span className="text-[10px] font-medium text-slate-400 flex items-center gap-0.5">
                    <MapPin className="w-2.5 h-2.5 text-indigo-400" /> Milan, IT
                  </span>
                </div>
                <span className="text-[11px] text-indigo-300 font-medium">Fashion Merchandising (8 Reviews)</span>
              </div>
            </div>

            {activeDemoId === 'retail' ? (
              <span className="flex items-center space-x-1 text-[11px] font-semibold text-berry-400 bg-berry-500/10 px-2 py-0.5 rounded-full border border-berry-500/20">
                <CheckCircle2 className="w-3 h-3" />
                <span>Active</span>
              </span>
            ) : (
              <span className="text-xs text-slate-400 group-hover:text-white flex items-center gap-1 font-medium">
                <Play className="w-3 h-3 fill-slate-400" /> Run
              </span>
            )}
          </div>

          <p className="text-xs text-slate-400 mt-2.5 line-clamp-2">
            Misleading size chart on linen shirts running 2 sizes small, self-checkout RFID tag alarms, and 16+ day delays in refund processing.
          </p>
        </div>

      </div>
    </div>
  );
}
