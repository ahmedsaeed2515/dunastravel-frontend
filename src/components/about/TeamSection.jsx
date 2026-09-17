import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const leadMember = {
  id: 1,
  name: 'Attia Yamany',
  roleKey: 'about.roles.ceo',
  role: 'CEO & Founder',
  countryKey: 'about.countries.egypt',
  country: 'Egypt — Headquarters',
  flag: '🇪🇬',
  image: 'https://res.cloudinary.com/degbrq3ck/image/upload/v1789411866/IMG-20260712-WA0025_abil0e.jpg',
  initials: 'AY',
  objectPosition: '18% center',
};

const teamMembers = [
  {
    id: 2,
    name: 'Miguel Selma',
    roleKey: 'about.roles.generalDirector',
    role: 'General Director',
    countryKey: 'about.countries.spain',
    country: 'Spain',
    flag: '🇪🇸',
    initials: 'MS',
    offset: '0px',
    delay: '.05s',
  },
  {
    id: 3,
    name: 'Giovanni Fiore',
    roleKey: 'about.roles.commercialDirector',
    role: 'Commercial Director',
    countryKey: 'about.countries.italy',
    country: 'Italy',
    flag: '🇮🇹',
    image: 'https://res.cloudinary.com/degbrq3ck/image/upload/v1789472475/IMG-20260630-WA0003_lzlp5c.jpg',
    initials: 'GF',
    offset: '38px',
    delay: '.1s',
  },
  {
    id: 4,
    name: 'Vinicius Barcellos',
    roleKey: 'about.roles.commercialDirector',
    role: 'Commercial Director',
    countryKey: 'about.countries.brazil',
    country: 'Brazil',
    flag: '🇧🇷',
    initials: 'VB',
    offset: '8px',
    delay: '.15s',
  },
  {
    id: 5,
    name: 'Sonia Melo',
    roleKey: 'about.roles.salesDirector',
    role: 'Sales Director',
    countryKey: 'about.countries.brazil',
    country: 'Brazil',
    flag: '🇧🇷',
    image: 'https://res.cloudinary.com/degbrq3ck/image/upload/v1789472475/IMG-20260707-WA0003_bnd0g6.jpg',
    initials: 'SM',
    offset: '46px',
    delay: '.2s',
  },
  {
    id: 6,
    name: 'Luciana Rovaroto',
    roleKey: 'about.roles.customerService',
    role: 'Customer Service',
    countryKey: 'about.countries.brazil',
    country: 'Brazil',
    flag: '🇧🇷',
    image: 'https://res.cloudinary.com/degbrq3ck/image/upload/v1789472475/IMG-20260630-WA0015_jleca3.jpg',
    initials: 'LR',
    offset: '2px',
    delay: '.25s',
  },
  {
    id: 7,
    name: 'Ramiro Poggi',
    roleKey: 'about.roles.commercialDirector',
    role: 'Commercial Director',
    countryKey: 'about.countries.argentina',
    country: 'Argentina',
    flag: '🇦🇷',
    initials: 'RP',
    offset: '32px',
    delay: '.3s',
  },
  {
    id: 8,
    name: 'Edgar Cañón',
    roleKey: 'about.roles.commercialDirector',
    role: 'Commercial Director',
    countryKey: 'about.countries.colombia',
    country: 'Colombia',
    flag: '🇨🇴',
    initials: 'EC',
    offset: '14px',
    delay: '.35s',
  },
];

export default function TeamSection() {
  const { t } = useTranslation();
  const [imgErrors, setImgErrors] = useState({});

  return (
    <section
      id="team"
      className="legacy-team-section relative py-20 md:py-28 px-6 flex flex-col items-center overflow-hidden font-sans"
      style={{
        background: 'radial-gradient(ellipse 110% 80% at 50% -10%, #16386B 0%, #0E2A52 40%, #081830 100%)',
      }}
    >
      <style>{`
        @keyframes floatY {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .legacy-avatar-frame {
          animation: floatY 5.2s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .legacy-avatar-frame { animation: none; }
        }
        .legacy-avatar-ring {
          position: absolute;
          inset: -8px;
          border-radius: 50%;
          border: 1.5px solid #C9A227;
          opacity: 0.55;
          transition: opacity 0.4s ease, transform 0.4s ease, border-color 0.4s ease;
          box-shadow: 0 0 15px rgba(201, 162, 39, 0.2);
        }
        .legacy-avatar-frame:hover .legacy-avatar-ring {
          opacity: 1;
          transform: scale(1.05);
          border-color: #E8CB72;
          box-shadow: 0 0 25px rgba(232, 203, 114, 0.4);
        }
        @media (max-width: 768px) {
          .legacy-team-card {
            margin-top: 0px !important;
          }
        }
      `}</style>

      {/* Background ambient lighting */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] pointer-events-none opacity-30 blur-[110px]"
        style={{ background: 'radial-gradient(circle, #E8CB72 0%, #16386B 60%, transparent 80%)' }}
      />

      {/* Header */}
      <div className="relative z-10 text-center mb-16 max-w-3xl mx-auto reveal">
        <span className="inline-flex items-center gap-2 border border-[#C9A227]/60 bg-[#16386B]/40 backdrop-blur-md text-[#E8CB72] text-xs font-bold tracking-[2.5px] py-1.5 px-5 rounded-full uppercase mb-5 shadow-[0_2px_15px_rgba(201,162,39,0.2)]">
          <span className="w-2 h-2 rounded-full bg-[#C9A227] animate-pulse" />
          {t('about.teamTag', '06 — OUR TEAM')}
        </span>

        <h2 className="text-white text-3xl md:text-5xl font-serif font-normal uppercase tracking-wide leading-tight mb-4">
          <span>{t('about.teamTitle1', 'One House, Six Countries,')}</span>
          <br />
          <span className="text-[#E8CB72] italic font-serif">
            {t('about.teamTitle2', 'One Standard Of Care')}
          </span>
        </h2>

        {/* Gold Rule with Diamond Accent */}
        <div className="flex items-center justify-center gap-3 my-6">
          <div className="h-[1.5px] w-16 bg-gradient-to-r from-transparent to-[#C9A227]" />
          <div className="w-2.5 h-2.5 rotate-45 bg-[#C9A227] shadow-[0_0_10px_#C9A227]" />
          <div className="h-[1.5px] w-16 bg-gradient-to-l from-transparent to-[#C9A227]" />
        </div>

        <p className="text-[#F8F3E6]/80 text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-light">
          {t(
            'about.teamDesc',
            'From Cairo to Bogotá, our directors and specialists work as a single team — fluent in the cities, languages, and details that turn a trip into a story worth telling.'
          )}
        </p>
      </div>

      {/* Team Lead Section (Attia Yamany) */}
      <div className="relative z-10 flex flex-col items-center text-center mb-20 reveal">
        <span className="inline-flex items-center gap-2 bg-[#16386B]/80 border border-[#C9A227]/40 text-[#E8CB72] text-xs font-semibold px-4 py-1.5 rounded-full mb-6 shadow-md">
          <span className="text-base">{leadMember.flag}</span>
          <span>{t(leadMember.countryKey, leadMember.country)}</span>
        </span>

        <div className="legacy-avatar-frame relative w-40 h-40 md:w-48 md:h-48 mb-6 rounded-full cursor-pointer">
          <div className="legacy-avatar-ring" />
          <div className="w-full h-full rounded-full bg-gradient-to-br from-[#16386B] to-[#081830] border border-[#C9A227]/30 flex items-center justify-center overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
            {leadMember.image && !imgErrors[leadMember.id] ? (
              <img
                src={leadMember.image}
                alt={leadMember.name}
                loading="lazy"
                onError={() => setImgErrors((prev) => ({ ...prev, [leadMember.id]: true }))}
                className="w-full h-full object-cover"
                style={leadMember.objectPosition ? { objectPosition: leadMember.objectPosition } : undefined}
              />
            ) : (
              <span className="font-serif text-4xl md:text-5xl text-[#E8CB72] font-semibold tracking-wider">
                {leadMember.initials}
              </span>
            )}
          </div>
        </div>

        <h3 className="text-white font-serif text-2xl md:text-3xl font-semibold mb-1">
          {leadMember.name}
        </h3>
        <p className="text-[#E8CB72] text-xs md:text-sm tracking-[2px] uppercase font-mono">
          {t(leadMember.roleKey, leadMember.role)}
        </p>
      </div>

      {/* Team Grid with Staggered Offsets */}
      <div className="relative z-10 flex flex-wrap justify-center gap-x-12 gap-y-14 max-w-6xl w-full mx-auto reveal">
        {teamMembers.map((member) => {
          const hasImage = member.image && !imgErrors[member.id];

          return (
            <div
              key={member.id}
              className="legacy-team-card flex flex-col items-center text-center w-[180px] md:w-[210px]"
              style={{ marginTop: member.offset, transitionDelay: member.delay }}
            >
              <div className="legacy-avatar-frame relative w-32 h-32 md:w-36 md:h-36 mb-5 rounded-full cursor-pointer">
                <div className="legacy-avatar-ring" />
                <div className="w-full h-full rounded-full bg-gradient-to-br from-[#16386B] to-[#081830] border border-[#C9A227]/30 flex items-center justify-center overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.5)]">
                  {hasImage ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      loading="lazy"
                      onError={() => setImgErrors((prev) => ({ ...prev, [member.id]: true }))}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="font-serif text-3xl md:text-4xl text-[#E8CB72] font-semibold tracking-wider">
                      {member.initials}
                    </span>
                  )}
                </div>
              </div>

              <h4 className="text-white font-serif text-lg font-medium mb-1 tracking-wide">
                {member.name}
              </h4>
              <p className="text-[#E8CB72] text-[11px] tracking-[1.5px] uppercase font-mono mb-1">
                {t(member.roleKey, member.role)}
              </p>
              <p className="text-[#F8F3E6]/60 text-xs font-light flex items-center justify-center gap-1">
                <span>{member.flag}</span>
                <span>{t(member.countryKey, member.country)}</span>
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
