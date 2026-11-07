import React, { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FaBullhorn, FaShieldAlt, FaRegClock } from 'react-icons/fa';

const listVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1] },
  },
};

/**
 * VIP "Important Notes" advisory panel with a pulsing alert badge,
 * a megaphone announcement icon and subtle motion.
 */
export default function ImportantNotes({ items, title, renderItem, className = '' }) {
  const { t } = useTranslation();
  const headingId = useId();

  if (!Array.isArray(items) || items.length === 0) return null;

  const resolve = renderItem || ((item) => (typeof item === 'string' ? item : item?.text || ''));
  const heading = title || t('tourDetail.importantNotes', 'Important Notes');

  return (
    <section
      aria-labelledby={headingId}
      className={`dunas-notes relative ${className}`}
    >
      <style>{`
        .dunas-notes-ring {
          animation: dunas-notes-ring 2.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        @keyframes dunas-notes-ring {
          0% { opacity: 0.7; transform: scale(1); }
          70%, 100% { opacity: 0; transform: scale(1.38); }
        }
        .dunas-notes-horn {
          transform-origin: 50% 60%;
          animation: dunas-notes-horn 4.6s ease-in-out infinite;
        }
        @keyframes dunas-notes-horn {
          0%, 84%, 100% { transform: rotate(0deg); }
          87% { transform: rotate(-10deg); }
          90% { transform: rotate(9deg); }
          93% { transform: rotate(-6deg); }
          96% { transform: rotate(3deg); }
        }
        .dunas-notes-float {
          animation: dunas-notes-float 7s ease-in-out infinite;
        }
        @keyframes dunas-notes-float {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(0, -14px, 0) scale(1.06); }
        }
        .dunas-notes-shimmer {
          animation: dunas-notes-shimmer 2.6s ease-in-out infinite;
          transform-origin: center;
        }
        @keyframes dunas-notes-shimmer {
          0%, 100% { opacity: 0.35; transform: scaleX(0.7); }
          50% { opacity: 1; transform: scaleX(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .dunas-notes-ring,
          .dunas-notes-horn,
          .dunas-notes-float,
          .dunas-notes-shimmer,
          .dunas-notes .animate-ping {
            animation: none !important;
          }
        }
      `}</style>

      {/* Ambient glow around the card */}
      <div
        className="pointer-events-none absolute -inset-3 rounded-[34px] bg-gold-500/10 blur-2xl dark:bg-gold-400/10"
        aria-hidden="true"
      />

      <div className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-amber-300/90 via-gold-500/70 to-amber-700/90 p-[1.5px] shadow-[0_30px_80px_-30px_rgba(245,166,35,0.65)] dark:from-gold-400/60 dark:via-gold-500/40 dark:to-amber-700/60">
        <div className="relative overflow-hidden rounded-[28.5px] bg-[linear-gradient(135deg,#fffdf7_0%,#fff8e7_45%,#fdf2d8_100%)] px-5 py-7 sm:px-8 sm:py-9 dark:bg-[linear-gradient(135deg,#100f0b_0%,#121a2e_55%,#0d1526_100%)]">
          {/* Decorative glows + dot grid */}
          <div
            className="pointer-events-none absolute -left-16 -top-20 h-56 w-56 rounded-full bg-gold-400/25 blur-3xl dark:bg-gold-400/15"
            aria-hidden="true"
          />
          <div
            className="dunas-notes-float pointer-events-none absolute -right-12 top-10 h-32 w-32 rounded-full bg-amber-600/15 blur-2xl dark:bg-gold-500/10"
            aria-hidden="true"
          />
          <div
            className="dunas-notes-float pointer-events-none absolute -bottom-16 left-1/3 h-40 w-40 rounded-full bg-gold-500/10 blur-3xl [animation-delay:2.2s]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.045] dark:opacity-[0.07]"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, #92400e 1px, transparent 0)',
              backgroundSize: '18px 18px',
            }}
            aria-hidden="true"
          />
          <FaBullhorn
            className="pointer-events-none absolute -bottom-10 end-0 h-40 w-40 translate-x-1/4 text-amber-900/[0.03] rtl:-translate-x-1/4 dark:text-gold-300/[0.035]"
            aria-hidden="true"
          />

          {/* Header */}
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
            <div className="relative mx-auto shrink-0 sm:mx-0">
              <span className="absolute inset-0 rounded-2xl bg-gold-500/30 blur-xl" aria-hidden="true" />
              <span className="dunas-notes-ring absolute inset-0 rounded-2xl border border-gold-500/60" aria-hidden="true" />
              <span className="dunas-notes-ring absolute inset-0 rounded-2xl border border-gold-500/40 [animation-delay:1.4s]" aria-hidden="true" />

              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-300 via-gold-500 to-amber-700 text-white shadow-[0_18px_40px_-12px_rgba(245,166,35,0.9)] ring-1 ring-white/60 sm:h-[72px] sm:w-[72px]">
                <FaBullhorn className="dunas-notes-horn h-7 w-7 sm:h-8 sm:w-8" aria-hidden="true" />
                <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-950 text-[11px] font-black text-gold-200 ring-2 ring-amber-100 dark:ring-[#121a2e]">
                  !
                </span>
              </div>
            </div>

            <div className="min-w-0 flex-1 text-center sm:text-start">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-600/30 bg-amber-500/10 px-3 py-1.5 dark:border-gold-400/30 dark:bg-gold-400/10">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-500 opacity-70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-600 dark:bg-gold-300" />
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.28em] text-amber-800 dark:text-gold-300">
                  {t('tourDetail.noticeBadge', 'Important Notice')}
                </span>
              </div>

              <h3
                id={headingId}
                className="mt-3 font-display text-2xl font-black leading-tight text-amber-950 sm:text-3xl dark:text-gold-50"
                style={{ fontFamily: "'Playfair Display', 'Cairo', serif" }}
              >
                {heading}
              </h3>

              <p className="no-capitalize mt-2 max-w-2xl text-xs font-semibold leading-relaxed text-amber-900/70 sm:text-sm dark:text-gold-100/70">
                {t(
                  'tourDetail.notesSubtitle',
                  'Please review these details carefully before confirming your booking.'
                )}
              </p>
            </div>

            <div className="hidden shrink-0 items-center gap-2 rounded-full border border-amber-700/20 bg-white/60 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-amber-800 shadow-sm lg:flex dark:border-gold-400/20 dark:bg-white/5 dark:text-gold-200">
              <FaShieldAlt className="text-gold-600 dark:text-gold-300" aria-hidden="true" />
              {t('tourDetail.notesVerified', 'Concierge Approved')}
            </div>
          </div>

          {/* Divider */}
          <div className="relative my-6 flex items-center gap-3" aria-hidden="true">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-500/40 to-amber-500/40 dark:via-gold-400/30" />
            <span className="h-1.5 w-1.5 rotate-45 bg-gold-500/70 dark:bg-gold-400/70" />
            <span className="h-px flex-1 bg-gradient-to-r from-amber-500/40 via-amber-500/40 to-transparent dark:via-gold-400/30" />
          </div>

          {/* Notes */}
          <motion.ul
            variants={listVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="relative grid gap-3"
          >
            {items.map((item, idx) => (
              <motion.li
                key={idx}
                variants={itemVariants}
                className="group/note relative flex items-start gap-3.5 overflow-hidden rounded-2xl border border-amber-900/10 bg-white/60 p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-500/40 hover:bg-white/85 hover:shadow-[0_12px_30px_-16px_rgba(245,166,35,0.55)] sm:gap-4 sm:p-4 dark:border-gold-400/10 dark:bg-white/[0.035] dark:hover:border-gold-400/30 dark:hover:bg-white/[0.07]"
              >
                <span className="relative mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 text-[11px] font-black text-amber-900 shadow-inner ring-1 ring-amber-500/30 dark:from-gold-500/25 dark:to-amber-700/25 dark:text-gold-200 dark:ring-gold-400/30">
                  {String(idx + 1).padStart(2, '0')}
                </span>

                <span className="no-capitalize min-w-0 flex-1 text-start text-[13px] font-medium leading-relaxed text-amber-950/90 sm:text-sm dark:text-gold-50/90">
                  {resolve(item)}
                </span>

                <span
                  className="absolute inset-y-2 start-0 w-[3px] rounded-full bg-gradient-to-b from-gold-300 via-gold-500 to-amber-700 opacity-0 transition-opacity duration-300 group-hover/note:opacity-100"
                  aria-hidden="true"
                />
              </motion.li>
            ))}
          </motion.ul>

          {/* Footer */}
          <div className="relative mt-6 flex flex-col items-start justify-between gap-3 rounded-2xl border border-amber-900/10 bg-amber-50/70 px-4 py-3 sm:flex-row sm:items-center dark:border-gold-400/10 dark:bg-gold-400/[0.06]">
            <div className="no-capitalize flex items-center gap-2.5 text-[11px] font-bold text-amber-900/80 dark:text-gold-100/80">
              <FaRegClock className="h-3.5 w-3.5 shrink-0 text-gold-600 dark:text-gold-300" aria-hidden="true" />
              {t(
                'tourDetail.notesFooter',
                'Our concierge team is available around the clock to assist you.'
              )}
            </div>
            <span
              className="dunas-notes-shimmer h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-gold-500 to-transparent"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
