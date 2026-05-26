export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Left — brand panel */}
      <div className="relative hidden w-5/12 overflow-hidden bg-stone-900 lg:flex lg:flex-col lg:justify-between lg:p-12">
        {/* Background texture */}
        <div className="absolute inset-0 bg-[radial-gradient(#444_1px,transparent_1px)] bg-[length:20px_20px] opacity-30" />
        <div className="absolute top-0 right-0 h-64 w-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-amber-600/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-80 w-80 -translate-x-1/3 translate-y-1/3 rounded-full bg-rose-600/10 blur-3xl" />

        {/* Brand content */}
        <div className="relative">
          <span className="text-lg font-semibold tracking-tight text-white">
            VibeInvite
          </span>
        </div>

        <div className="relative flex-1 flex flex-col justify-center">
          <blockquote className="font-serif text-2xl italic leading-relaxed text-stone-300">
            &ldquo;The invitation is the first moment your guests will remember.
            Make it count.&rdquo;
          </blockquote>
          <div className="mt-6">
            <p className="font-medium text-stone-200">
              Premium Digital Invitations
            </p>
            <p className="text-sm text-stone-500">
              Wax-sealed envelopes, AI copywriting, effortless RSVP tracking.
            </p>
          </div>
        </div>

        <div className="relative flex gap-2 text-xs text-stone-600">
          <span>★ Trusted by hosts of 1,000+ events</span>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-stone-50 to-amber-50/30 px-4 sm:px-8">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
