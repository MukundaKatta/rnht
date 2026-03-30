"use client";

import { useState } from "react";
import {
  Heart,
  CreditCard,
  ShieldCheck,
  CheckCircle,
  RefreshCw,
  Star,
} from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { useLanguageStore } from "@/store/language";
import { t } from "@/lib/i18n/translations";

const fundTypes = [
  { value: "general", label: "General Temple Fund", description: "Unrestricted contribution supporting all temple activities" },
  { value: "building", label: "Building Fund", description: "Temple construction and maintenance" },
  { value: "priest", label: "Priest Fund", description: "Support our temple priests and their families" },
  { value: "annadanam", label: "Annadanam Fund", description: "Community meal service program" },
  { value: "festival", label: "Festival Fund", description: "Temple festivals and celebrations" },
  { value: "education", label: "Education Fund", description: "Vedic school and children's programs" },
];

const suggestedAmounts = [11, 21, 51, 101, 251, 501];

export default function DonatePage() {
  const [amount, setAmount] = useState<number>(51);
  const [customAmount, setCustomAmount] = useState("");
  const [fundType, setFundType] = useState("general");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [message, setMessage] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState<"monthly" | "quarterly" | "annual">("monthly");
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "zelle" | "paypal">(
    "stripe"
  );
  const [submitted, setSubmitted] = useState(false);
  const locale = useLanguageStore((s) => s.locale);

  // BUG FIX: guard against NaN when user types non-numeric text
  const effectiveAmount = customAmount ? (parseFloat(customAmount) || 0) : amount;

  const handleDonate = async () => {
    // Demo: simulate donation success
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <CheckCircle className="mx-auto h-20 w-20 text-green-500" />
        <h1 className="mt-6 text-3xl font-heading font-bold text-gray-900">
          {t("donate.thankYou", locale)}
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Your donation of{" "}
          <strong>{formatCurrency(effectiveAmount)}</strong> to the{" "}
          {fundTypes.find((f) => f.value === fundType)?.label} has been received.
        </p>
        <div className="mt-6 rounded-lg bg-green-50 p-4 text-sm text-green-800">
          <p>
            A tax-deductible receipt will be sent to your email. RNHT is a
            registered 501(c)(3) nonprofit organization.
          </p>
          {paymentMethod === "zelle" && (
            <p className="mt-2 font-semibold">
              Please send your Zelle payment of{" "}
              {formatCurrency(effectiveAmount)} to (512) 545-0473
            </p>
          )}
        </div>
        <button
          className="btn-primary mt-8"
          onClick={() => setSubmitted(false)}
        >
          Make Another Donation
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="text-center">
        <Heart className="mx-auto h-10 w-10 text-temple-red" />
        <h1 className="mt-4 section-heading">{t("donate.title", locale)}</h1>
        <p className="mt-3 text-gray-600">
          {t("donate.subtitle", locale)}
        </p>
        <p className="mt-2 text-sm text-gray-500">
          All donations are tax-deductible under 501(c)(3).
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-5">
        {/* Donation Form */}
        <div className="lg:col-span-3 space-y-6">
          {/* Fund Selection */}
          <div className="card p-5">
            <h2 className="font-heading text-lg font-bold text-gray-900">
              {t("donate.fund", locale)}
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {fundTypes.map((fund) => (
                <label
                  key={fund.value}
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                    fundType === fund.value
                      ? "border-temple-red bg-red-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="fund"
                    checked={fundType === fund.value}
                    onChange={() => setFundType(fund.value)}
                    className="mt-1 text-temple-red"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {fund.label}
                    </p>
                    <p className="text-xs text-gray-500">{fund.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Amount Selection */}
          <div className="card p-5">
            <h2 className="font-heading text-lg font-bold text-gray-900">
              {t("donate.amount", locale)}
            </h2>
            <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
              {suggestedAmounts.map((amt) => (
                <button
                  key={amt}
                  onClick={() => {
                    setAmount(amt);
                    setCustomAmount("");
                  }}
                  className={`rounded-lg border py-3 text-center font-semibold transition-colors ${
                    amount === amt && !customAmount
                      ? "border-temple-red bg-red-50 text-temple-red"
                      : "border-gray-200 text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {formatCurrency(amt)}
                </button>
              ))}
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Custom Amount
              </label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  $
                </span>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="Enter amount"
                  className="input-field pl-7"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Dollar A Day Program */}
          <div className="card overflow-hidden">
            <div className="bg-gradient-to-r from-temple-gold/20 to-temple-cream px-5 py-3">
              <h2 className="font-heading text-lg font-bold text-temple-maroon flex items-center gap-2">
                <Star className="h-5 w-5 text-temple-gold" />
                {t("donate.dollarADay", locale)}
              </h2>
            </div>
            <div className="p-5">
              <p className="text-sm text-gray-600">
                Make a lasting impact with just $1 a day. Choose a plan that works for you.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  onClick={() => { setAmount(31); setCustomAmount(""); setIsRecurring(true); setRecurringFrequency("monthly"); }}
                  className="rounded-lg border-2 border-temple-gold bg-amber-50 p-3 text-center hover:bg-amber-100"
                >
                  <p className="text-lg font-bold text-temple-maroon">$31/mo</p>
                  <p className="text-xs text-gray-500">Monthly</p>
                </button>
                <button
                  onClick={() => { setAmount(365); setCustomAmount(""); setIsRecurring(true); setRecurringFrequency("annual"); }}
                  className="rounded-lg border-2 border-temple-gold bg-amber-50 p-3 text-center hover:bg-amber-100"
                >
                  <p className="text-lg font-bold text-temple-maroon">$365/yr</p>
                  <p className="text-xs text-gray-500">Annual (save $7)</p>
                </button>
              </div>
            </div>
          </div>

          {/* Recurring Donation Toggle */}
          <div className="card p-5">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="h-5 w-5 rounded text-temple-red"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 text-temple-red" />
                  {t("donate.recurring", locale)}
                </p>
                <p className="text-xs text-gray-500">
                  Automatic monthly, quarterly, or annual contributions. Cancel anytime.
                </p>
              </div>
            </label>
            {isRecurring && (
              <div className="mt-4 flex gap-2">
                {(["monthly", "quarterly", "annual"] as const).map((freq) => (
                  <button
                    key={freq}
                    onClick={() => setRecurringFrequency(freq)}
                    className={`rounded-full px-4 py-1.5 text-xs font-semibold capitalize ${
                      recurringFrequency === freq
                        ? "bg-temple-red text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {freq}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Deity-Specific Donations */}
          <div className="card p-5">
            <h2 className="font-heading text-lg font-bold text-gray-900">
              Deity-Specific Donations
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              Earmark your donation for a specific deity&apos;s seva and alankaram.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-3">
              {[
                { name: "Sri Rudra Narayana", value: "rudra-narayana" },
                { name: "Lord Ganesha", value: "ganesha" },
                { name: "Goddess Lakshmi", value: "lakshmi" },
                { name: "Lord Hanuman", value: "hanuman" },
                { name: "Lord Shiva", value: "shiva" },
                { name: "Lord Rama", value: "rama" },
              ].map((deity) => (
                <label
                  key={deity.value}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm transition-colors ${
                    fundType === deity.value
                      ? "border-temple-red bg-red-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="fund"
                    checked={fundType === deity.value}
                    onChange={() => setFundType(deity.value)}
                    className="text-temple-red"
                  />
                  <span className="font-medium text-gray-900">{deity.name}</span>
                </label>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link href="/sponsorship" className="text-sm text-temple-red hover:underline font-medium">
                View Ornament & Alankaram Sponsorships &rarr;
              </Link>
            </div>
          </div>

          {/* Donor Info */}
          <div className="card p-5">
            <h2 className="font-heading text-lg font-bold text-gray-900">
              Your Information
            </h2>
            <div className="mt-4 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    className="input-field mt-1"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email *
                  </label>
                  <input
                    type="email"
                    className="input-field mt-1"
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Message (optional)
                </label>
                <textarea
                  className="input-field mt-1"
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="In memory of, in honor of, or any message..."
                />
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded text-temple-red"
                />
                <span className="text-sm text-gray-700">
                  Make this donation anonymous
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Payment Sidebar */}
        <div className="lg:col-span-2">
          <div className="card sticky top-[calc(var(--header-h,96px)+8px)] p-5">
            <h2 className="font-heading text-lg font-bold text-gray-900">
              Payment
            </h2>

            <div className="mt-4 rounded-lg bg-temple-cream p-4 text-center">
              <p className="text-sm text-gray-600">Your Donation</p>
              <p className="text-3xl font-bold text-temple-red">
                {formatCurrency(effectiveAmount || 0)}
              </p>
              <p className="text-xs text-gray-500">
                {fundTypes.find((f) => f.value === fundType)?.label}
              </p>
            </div>

            <div className="mt-4 space-y-3">
              <label
                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                  paymentMethod === "stripe"
                    ? "border-temple-red bg-red-50"
                    : "border-gray-200"
                }`}
              >
                <input
                  type="radio"
                  name="donatePayment"
                  checked={paymentMethod === "stripe"}
                  onChange={() => setPaymentMethod("stripe")}
                />
                <CreditCard className="h-5 w-5 text-gray-600" />
                <span className="text-sm font-medium">Card / Apple Pay</span>
              </label>

              <label
                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                  paymentMethod === "paypal"
                    ? "border-temple-red bg-red-50"
                    : "border-gray-200"
                }`}
              >
                <input
                  type="radio"
                  name="donatePayment"
                  checked={paymentMethod === "paypal"}
                  onChange={() => setPaymentMethod("paypal")}
                />
                <span className="text-sm font-bold text-blue-600">P</span>
                <span className="text-sm font-medium">PayPal</span>
              </label>

              <label
                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                  paymentMethod === "zelle"
                    ? "border-temple-red bg-red-50"
                    : "border-gray-200"
                }`}
              >
                <input
                  type="radio"
                  name="donatePayment"
                  checked={paymentMethod === "zelle"}
                  onChange={() => setPaymentMethod("zelle")}
                />
                <span className="text-lg">💸</span>
                <span className="text-sm font-medium">Zelle</span>
              </label>
            </div>

            {isRecurring && (
              <div className="mt-3 rounded-lg bg-blue-50 p-3 text-xs text-blue-800">
                <RefreshCw className="inline h-3 w-3 mr-1" />
                Recurring {recurringFrequency} donation. You can cancel anytime from your profile.
              </div>
            )}

            {/* Zelle Info */}
            <div id="zelle" className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
              <h3 className="text-sm font-semibold text-blue-900">
                {t("donate.zelle", locale)}
              </h3>
              <div className="mt-2 space-y-2 text-sm text-blue-800">
                <p>
                  <strong>Phone:</strong> (512) 545-0473
                </p>
                <p>
                  <strong>Name:</strong> Rudra Narayana Hindu Temple
                </p>
                <div className="mx-auto mt-3 flex h-24 w-24 sm:h-32 sm:w-32 items-center justify-center rounded-lg border-2 border-dashed border-blue-300 bg-white text-center text-xs text-blue-400">
                  QR Code
                  <br />
                  (Zelle)
                </div>
                <p className="text-xs text-blue-600">
                  Scan this QR code in your banking app to send payment via
                  Zelle.
                </p>
              </div>
            </div>

            <button
              className="btn-primary mt-6 w-full"
              onClick={handleDonate}
              disabled={!donorName || !donorEmail || !effectiveAmount}
            >
              Donate {formatCurrency(effectiveAmount || 0)}
            </button>

            <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
              <ShieldCheck className="h-4 w-4 text-green-600" />
              <span>Secure & tax-deductible. 501(c)(3) nonprofit.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
