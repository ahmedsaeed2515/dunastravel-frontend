import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { optimizeImageUrl } from '../../utils/imageOptimizer';

const teamMembers = [
  {
    id: 1,
    name: 'Attia Yamany',
    roleKey: 'about.roles.ceo',
    role: 'CEO & Founder',
    countryKey: 'about.countries.egypt',
    country: 'Egypt — Headquarters',
    flag: '🇪🇬',
    image: 'https://res.cloudinary.com/degbrq3ck/image/upload/v1789411866/IMG-20260712-WA0025_abil0e.jpg',
    objectPosition: '18% center',
  },
  {
    id: 2,
    name: 'Miguel Selma',
    roleKey: 'about.roles.generalDirector',
    role: 'General Director',
    countryKey: 'about.countries.spain',
    country: 'Spain',
    flag: '🇪🇸',
    initials: 'MS',
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
  },
];

export default function TeamSection() {
  const { t } = useTranslation();
  const [imgErrors, setImgErrors] = useState({});

  return (
    <section
      id="team"
      className="relative py-20 md:py-28 px-5 flex flex-col items-center font-sans overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse 100% 55% at 50% 0%, #16386B 0%, #0c1c38 35%, #081224 65%, #050811 100%)',
      }}
    >
      {/* Decorative ambient background lights (Royal Blue, Brown, Gold) */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[320px] pointer-events-none opacity-40 blur-[100px]"
        style={{ background: 'radial-gradient(circle, #1E3A8A 0%, #8B4513 45%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-0 right-0 w-[500px] h-[300px] pointer-events-none opacity-20 blur-[120px]"
        style={{ background: 'radial-gradient(circle, #F5A623 0%, #321606 50%, transparent 70%)' }}
      />

      {/* Header */}
      <div className="relative z-10 text-center mb-16 max-w-3xl mx-auto reveal">
        {/* Top Tag */}
        <span className="inline-flex items-center gap-2 border border-[#D4AF37]/50 bg-gradient-to-r from-[#1E3A8A]/50 via-[#321606]/40 to-[#1E3A8A]/50 backdrop-blur-md text-[#FBBF24] text-xs font-bold tracking-[2.5px] py-1.5 px-5 rounded-full uppercase mb-5 shadow-[0_2px_15px_rgba(212,175,55,0.18)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FBBF24] animate-pulse" />
          {t('about.teamTag', '06 — OUR TEAM')}
        </span>

        {/* Title */}
        <h2 className="text-white text-3xl md:text-5xl font-bold uppercase tracking-wide leading-tight mb-4">
          <span>{t('about.teamTitle1', 'One House, Six Countries,')}</span>
          <br />
          <span className="bg-gradient-to-r from-white via-[#FDE9BC] to-[#F5A623] bg-clip-text text-transparent">
            {t('about.teamTitle2', 'One Standard Of Care')}
          </span>
        </h2>

        {/* Gold & Diamond divider */}
        <div className="flex items-center justify-center gap-3 my-5">
          <div className="h-[1px] w-14 bg-gradient-to-r from-transparent to-[#D4AF37]" />
          <div className="w-2 h-2 rotate-45 bg-[#F5A623] shadow-[0_0_8px_#F5A623]" />
          <div className="h-[1px] w-14 bg-gradient-to-l from-transparent to-[#D4AF37]" />
        </div>

        {/* Description */}
        <p className="text-[#E8D0BF]/90 text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-light">
          {t(
            'about.teamDesc',
            'From Cairo to Bogotá, our directors and specialists work as a single team — fluent in the cities, languages, and details that turn a trip into a story worth telling.'
          )}
        </p>
      </div>

      {/* Team Cards Grid */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-6 w-full max-w-7xl justify-items-center reveal">
        {teamMembers.map((member) => {
          const hasImage = member.image && !imgErrors[member.id];

          return (
            <div
              key={member.id}
              className="group flex flex-col items-center w-full max-w-[290px] transition-all duration-300 hover:-translate-y-2"
            >
              {/* Photo / Initials Container */}
              <div className="relative w-full h-[375px] rounded-3xl overflow-hidden flex items-center justify-center shadow-[0_14px_35px_rgba(0,0,0,0.7)] bg-gradient-to-br from-[#0F224A] via-[#24140A] to-[#050811] border border-[#D4AF37]/30 group-hover:border-[#F5A623] group-hover:shadow-[0_18px_40px_rgba(245,166,35,0.24)] transition-all duration-300">
                {hasImage ? (
                  <>
                    <img
                      src={optimizeImageUrl(member.image, { width: 400, quality: 75 })}
                      alt={member.name}
                      loading="lazy"
                      decoding="async"
                      onError={() => setImgErrors((prev) => ({ ...prev, [member.id]: true }))}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      style={member.objectPosition ? { objectPosition: member.objectPosition } : undefined}
                    />
                    {/* Dark gradient overlay at bottom for smooth contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050811]/90 via-[#050811]/25 to-transparent pointer-events-none" />
                  </>
                ) : (
                  <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center select-none">
                    {/* Decorative subtle gold rings */}
                    <div className="absolute w-36 h-36 rounded-full border border-[#D4AF37]/15 pointer-events-none group-hover:border-[#D4AF37]/30 transition-colors" />
                    <div className="absolute w-52 h-52 rounded-full border border-[#D4AF37]/10 pointer-events-none" />

                    <span className="text-5xl md:text-6xl font-extrabold tracking-widest uppercase bg-gradient-to-br from-white via-[#FDE9BC] to-[#F5A623] bg-clip-text text-transparent drop-shadow-[0_4px_16px_rgba(245,166,35,0.35)]">
                      {member.initials || member.name.split(' ').map((n) => n[0]).join('')}
                    </span>
                    <span className="text-[11px] tracking-[3px] uppercase text-[#D4AF37]/80 mt-3 font-semibold">
                      Dunas Travel
                    </span>
                  </div>
                )}
              </div>

              {/* Member Details */}
              <div className="text-center mt-4 flex flex-col items-center gap-1.5 w-full">
                <h3 className="text-white text-lg font-bold tracking-wide uppercase group-hover:text-[#FDE9BC] transition-colors">
                  {member.name}
                </h3>

                <span className="text-[#F9C76B] text-xs md:text-sm font-medium flex items-center gap-1.5">
                  <span className="text-base">{member.flag}</span>
                  <span>{t(member.countryKey, member.country)}</span>
                </span>

                <span className="inline-flex items-center mt-1 bg-gradient-to-r from-[#152B6B] via-[#321606] to-[#152B6B] border border-[#D4AF37]/50 group-hover:border-[#F5A623] text-[#FEFCF7] text-[11px] font-bold tracking-wider py-1.5 px-4 rounded-full uppercase shadow-[0_4px_14px_rgba(0,0,0,0.5)] group-hover:shadow-[0_4px_16px_rgba(245,166,35,0.3)] transition-all duration-300">
                  {t(member.roleKey, member.role)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
