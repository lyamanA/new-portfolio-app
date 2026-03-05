'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { contactSchema, ContactFormData } from '@/lib/validations';

export default function Contact() {
  const t = useTranslations('contact');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const contactInfo = [
    {
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
      label: 'Email', value: 'aslanovalyaman515@gmail.com', href: 'mailto:aslanovalyaman515@gmail.com',
    },
    {
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
      label: 'Phone', value: '+994 XX XXX XX XX', href: 'tel:+994XXXXXXXXX',
    },
    {
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
      label: 'Location', value: 'Baku, Azerbaijan', href: null,
    },
  ];

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  // const onSubmit = async (data: ContactFormData) => {
  //   setLoading(true);
  //   console.log('Form data:', data);
  //   await new Promise((r) => setTimeout(r, 1000));
  //   setLoading(false);
  //   setSubmitted(true);
  //   reset();
  //   setTimeout(() => setSubmitted(false), 4000);
  // };

  const onSubmit = async (data: ContactFormData) => {
  setLoading(true);
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      setSubmitted(true);
      reset();
      setTimeout(() => setSubmitted(false), 4000);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    setLoading(false);
  }
};

  return (
    <section className="min-h-screen bg-[#0d0a1e] relative flex flex-col items-center justify-center py-24 overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)`,
        backgroundSize: '80px 80px',
      }} />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[400px] bg-purple-700 opacity-10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-cyan-700 opacity-10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-6xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-6xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              {t('title')}
            </span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-cyan-400 mx-auto mb-4 rounded-full" />
          <p className="text-gray-400 text-base">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="opacity-0 animate-[slideInLeft_0.7s_ease_0.2s_forwards]">
            <h3 className="text-2xl font-bold text-white mb-3">{t('leftTitle')}</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-10">{t('leftText')}</p>

            <div className="flex flex-col gap-6">
              {contactInfo.map((item) => (
                <div key={item.label} className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center text-white shrink-0 shadow-[0_0_20px_rgba(139,92,246,0.3)] group-hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-shadow duration-300">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-0.5">{item.label}</p>
                    {item.href
                      ? <a href={item.href} className="text-white text-sm font-medium hover:text-cyan-400 transition-colors">{item.value}</a>
                      : <p className="text-white text-sm font-medium">{item.value}</p>
                    }
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4 mt-10">
              <a href="https://github.com/lyamanA" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-purple-500/50 hover:bg-purple-500/10 transition-all duration-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" /></svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all duration-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
              </a>
            </div>
          </div>

          <div className="opacity-0 animate-[slideInRight_0.7s_ease_0.2s_forwards] bg-[#13102a] border border-white/5 rounded-2xl p-8">
            {submitted && (
              <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm text-center">
                ✅ {t('success')}
              </div>
            )}

            <div className="flex flex-col gap-5">
              <div>
                <label className="text-gray-400 text-xs font-medium mb-2 block">{t('nameLabel')}</label>
                <input {...register('name')} placeholder={t('namePlaceholder')}
                  className="w-full bg-[#0d0a1e] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1)] transition-all duration-200" />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="text-gray-400 text-xs font-medium mb-2 block">{t('emailLabel')}</label>
                <input {...register('email')} placeholder={t('emailPlaceholder')} type="email"
                  className="w-full bg-[#0d0a1e] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1)] transition-all duration-200" />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="text-gray-400 text-xs font-medium mb-2 block">{t('messageLabel')}</label>
                <textarea {...register('message')} placeholder={t('messagePlaceholder')} rows={5}
                  className="w-full bg-[#0d0a1e] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1)] transition-all duration-200 resize-none" />
                {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>}
              </div>

              <button onClick={handleSubmit(onSubmit)} disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold text-sm hover:opacity-90 hover:scale-[1.02] disabled:opacity-60 disabled:scale-100 transition-all duration-300 shadow-[0_0_30px_rgba(139,92,246,0.3)]">
                {loading
                  ? <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                }
                {loading ? t('sending') : t('send')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}