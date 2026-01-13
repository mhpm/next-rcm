'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Locale } from '@/i18n/config';

interface PricingSectionProps {
  dict: any;
  lang: Locale;
}

export function PricingSection({ dict, lang }: PricingSectionProps) {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>(
    'monthly'
  );

  const toggleBilling = () => {
    setBillingPeriod((prev) => (prev === 'monthly' ? 'yearly' : 'monthly'));
  };

  return (
    <section id="pricing" className="py-24 relative">
      <div className="container px-6 mx-auto relative z-10">
        <div className="text-center mb-16 space-y-6">
          <h2 className="text-3xl md:text-5xl font-bold text-white">
            {dict.pricing.title}
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            {dict.pricing.subtitle}
          </p>

          {/* Billing Toggle */}
          <div className="flex flex-col items-center gap-4 pt-4">
            <div className="flex items-center justify-center gap-4">
              <span
                className={`text-sm font-medium transition-colors duration-200 ${
                  billingPeriod === 'monthly' ? 'text-white' : 'text-slate-500'
                }`}
              >
                {dict.chart.periods.month}
              </span>
              <button
                onClick={toggleBilling}
                className="w-12 h-6 rounded-full bg-white/10 border border-white/10 p-1 flex items-center transition-colors hover:border-primary/50 relative"
                aria-label="Toggle billing period"
              >
                <div
                  className={`w-4 h-4 rounded-full bg-primary shadow-lg shadow-primary/50 transition-transform duration-300 ${
                    billingPeriod === 'yearly'
                      ? 'translate-x-6'
                      : 'translate-x-0'
                  }`}
                />
              </button>
              <span
                className={`text-sm font-medium transition-colors duration-200 ${
                  billingPeriod === 'yearly' ? 'text-white' : 'text-slate-500'
                }`}
              >
                {dict.chart.periods.year}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
                {dict.pricing.yearlyDiscount}
              </span>
            </div>
            <p className="text-xs text-slate-500">{dict.pricing.microcopy}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Plan */}
          <PricingCard
            name={dict.pricing.free.name}
            price={dict.pricing.free.price}
            priceMXN={dict.pricing.free.priceMXN}
            description={dict.pricing.free.description}
            features={dict.pricing.free.features}
            cta={dict.pricing.free.cta}
            monthly={
              billingPeriod === 'monthly'
                ? dict.pricing.monthly
                : dict.pricing.yearly
            }
            lang={lang}
            billingPeriod={billingPeriod}
          />

          {/* Plus Plan */}
          <PricingCard
            name={dict.pricing.plus.name}
            price={dict.pricing.plus.price}
            priceMXN={dict.pricing.plus.priceMXN}
            description={dict.pricing.plus.description}
            features={dict.pricing.plus.features}
            cta={dict.pricing.plus.cta}
            monthly={
              billingPeriod === 'monthly'
                ? dict.pricing.monthly
                : dict.pricing.yearly
            }
            popular
            lang={lang}
            billingPeriod={billingPeriod}
          />

          {/* Premium Plan */}
          <PricingCard
            name={dict.pricing.premium.name}
            price={dict.pricing.premium.price}
            priceMXN={dict.pricing.premium.priceMXN}
            description={dict.pricing.premium.description}
            features={dict.pricing.premium.features}
            cta={dict.pricing.premium.cta}
            monthly={
              billingPeriod === 'monthly'
                ? dict.pricing.monthly
                : dict.pricing.yearly
            }
            extraCost={dict.pricing.premium.extraCost}
            lang={lang}
            billingPeriod={billingPeriod}
          />
        </div>
      </div>
    </section>
  );
}

function PricingCard({
  name,
  price,
  priceMXN,
  description,
  features,
  cta,
  monthly,
  extraCost,
  popular = false,
  lang,
  billingPeriod,
}: {
  name: string;
  price: string;
  priceMXN: string;
  description: string;
  features: string[];
  cta: string;
  monthly: string;
  extraCost?: string;
  popular?: boolean;
  lang: Locale;
  billingPeriod: 'monthly' | 'yearly';
}) {
  const isUSD = lang === 'en';

  // Calculate price based on billing period
  const basePrice = isUSD ? parseFloat(price) : parseFloat(priceMXN);
  let displayPrice = basePrice;

  if (billingPeriod === 'yearly' && basePrice > 0) {
    // Apply 20% discount for yearly billing
    displayPrice = basePrice * 0.8;
  }

  // Format price to remove .00 if it's an integer
  const formattedPrice = Number.isInteger(displayPrice)
    ? displayPrice.toString()
    : displayPrice.toFixed(2);

  return (
    <div
      className={`relative p-8 rounded-3xl border flex flex-col transition-all duration-300 ${
        popular
          ? 'bg-white/10 border-primary/50 shadow-2xl shadow-primary/20 scale-105 z-10'
          : 'bg-white/5 border-white/5 hover:bg-white/[0.08] hover:border-white/10'
      } backdrop-blur-sm group overflow-hidden`}
    >
      {/* Background Glow */}
      <div
        className={`absolute -right-20 -top-20 w-64 h-64 rounded-full blur-3xl transition-all duration-700 group-hover:scale-150 opacity-0 group-hover:opacity-100 ${
          popular ? 'bg-primary/20 opacity-100' : 'bg-primary/10'
        }`}
      />

      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg animate-pulse z-20">
          Most Popular
        </div>
      )}

      <div className="mb-8 relative z-10">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
          {name}
        </h3>
        <p className="text-slate-400 text-sm h-10">{description}</p>
      </div>

      <div className="mb-8 relative z-10">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold text-white">
            {isUSD ? '$' : '$'}
            {formattedPrice}
          </span>
          <span className="text-slate-500">
            {isUSD ? 'USD' : 'MXN'} / {monthly}
          </span>
        </div>
        {extraCost && (
          <p className="text-xs text-primary font-medium mt-2 bg-primary/10 inline-block px-2 py-1 rounded-md border border-primary/20">
            {extraCost}
          </p>
        )}
      </div>

      <ul className="space-y-4 mb-8 flex-1 relative z-10">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3 text-slate-300 text-sm">
            <Check className="h-5 w-5 text-primary shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        className={`w-full rounded-full h-12 font-bold transition-all duration-300 relative z-10 ${
          popular
            ? 'bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 hover:scale-105'
            : 'bg-white/10 hover:bg-white/20 text-white border border-white/10 hover:scale-105'
        }`}
      >
        {cta}
      </Button>
    </div>
  );
}
