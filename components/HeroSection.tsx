import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="pt-40 pb-24 max-w-6xl mx-auto px-6">
      <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight mb-6">
        Stop secrets from leaking
        <br />
        <span className="text-softLime">before they ship.</span>
      </h1>

      <p className="text-2xl text-mutedBlueGrey max-w-2xl mb-12">
        Exposed secrets are the #1 entry point for attackers.
        Simulate exposure and understand risk — locally, safely, instantly.
      </p>

      <div className="flex gap-6">
        <a
          href="#analyze"
          className="px-8 py-4 rounded-full bg-softLime text-black font-black text-xl hover:bg-white transition"
        >
          Analyze Secrets
        </a>

        <a
          href="#contact"
          className="px-8 py-4 rounded-full border-2 border-deepTeal text-white font-bold text-xl hover:border-softLime transition"
        >
          Talk to Us
        </a>
      </div>
    </section>
  );
};

export default Hero;
