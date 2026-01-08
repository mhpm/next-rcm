'use client';

import Image from 'next/image';

const LoadingPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/15 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center space-y-8 animate-in fade-in zoom-in-95 duration-700">
        {/* Logo Container with Glass Effect */}
        <div className="relative group">
          <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl animate-pulse group-hover:bg-primary/50 transition-colors duration-500"></div>
          <div className="relative h-28 w-28 rounded-3xl bg-slate-900/50 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-2xl shadow-primary/20 ring-1 ring-white/20">
            <div className="relative w-16 h-16">
              <Image
                src="/images/logo.png"
                alt="RCM Logo"
                fill
                className="object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                priority={true}
              />
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold bg-linear-to-r from-white to-slate-400 bg-clip-text text-transparent animate-pulse">
            Cargando
          </h2>
          <p className="text-slate-400 text-sm tracking-wide animate-bounce delay-100">
            Preparando tu experiencia...
          </p>
        </div>

        {/* Loading Spinner */}
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-primary animate-[bounce_1s_infinite_0ms]"></div>
          <div className="w-3 h-3 rounded-full bg-primary/70 animate-[bounce_1s_infinite_200ms]"></div>
          <div className="w-3 h-3 rounded-full bg-white animate-[bounce_1s_infinite_400ms]"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
