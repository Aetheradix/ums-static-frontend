import React, { useState } from 'react';
import { clsx } from 'clsx';
import Button from '../../ui/Button';
import { CheckCircle, Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';

interface FormData {
  fullName: string;
  universityName: string;
  designation: string;
  email: string;
  phone: string;
  module: string;
  message: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    universityName: '',
    designation: '',
    email: '',
    phone: '',
    module: 'All Modules',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    const newErrors: FormErrors = {};
    if (!formData.fullName) newErrors.fullName = 'Full Name is required';
    if (!formData.universityName)
      newErrors.universityName = 'University Name is required';
    if (!formData.designation)
      newErrors.designation = 'Designation is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone =
        'Invalid Indian phone number (10 digits starting with 6-9)';
    }
    if (!formData.message) newErrors.message = 'Message is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setTimeout(() => {
        setIsSubmitted(true);
      }, 500);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  if (isSubmitted) {
    return (
      <section className="py-24 bg-white">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-12 shadow-sm">
            <span className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8" strokeWidth={2} />
            </span>
            <h2 className="font-display text-3xl font-bold text-navy mb-4">
              Request Sent!
            </h2>
            <p className="text-muted text-base mb-8">
              Thank you for reaching out. Our team will contact you within 24
              hours to schedule a personalized demo for{' '}
              {formData.universityName}.
            </p>
            <Button onClick={() => setIsSubmitted(false)} variant="outline">
              Send Another Request
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-20 bg-white overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Form Side */}
          <div className="w-full lg:w-2/3 reveal-left">
            <div className="mb-6 md:mb-8">
              <h2 className="font-display text-xl md:text-2xl font-bold text-navy mb-1 uppercase tracking-wide">
                Schedule a Demo
              </h2>
              <p className="text-muted text-xs md:text-sm">
                Fill in the form and we'll get back to you within 24 hours.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                <InputField
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  error={errors.fullName}
                  placeholder="e.g. Dr. Rajesh Kumar"
                />
                <InputField
                  label="University / Institution Name"
                  name="universityName"
                  value={formData.universityName}
                  onChange={handleChange}
                  error={errors.universityName}
                  placeholder="e.g. Central University"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                <InputField
                  label="Your Designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  error={errors.designation}
                  placeholder="e.g. Registrar / HOD"
                />
                <InputField
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  placeholder="rajesh@university.edu.in"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                <InputField
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  placeholder="+91 98765 43210"
                />
                <div className="space-y-1.5">
                  <label className="block text-[10px] md:text-[11px] font-black text-navy uppercase tracking-wider">
                    Module Interest
                  </label>
                  <select
                    name="module"
                    value={formData.module}
                    onChange={handleChange}
                    className="w-full bg-surface border border-border rounded-lg p-2.5 md:p-3 text-sm text-navy focus:border-blue outline-none transition-colors"
                  >
                    <option>Academics</option>
                    <option>Governance</option>
                    <option>Finance</option>
                    <option>HR</option>
                    <option>Analytics</option>
                    <option>All Modules</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] md:text-[11px] font-black text-navy uppercase tracking-wider">
                  Message / Requirements
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className={clsx(
                    'w-full bg-surface border rounded-lg p-2.5 md:p-3 text-sm focus:border-blue outline-none transition-colors resize-none',
                    errors.message ? 'border-red-400' : 'border-border'
                  )}
                  placeholder="Tell us about your university size and specific challenges..."
                />
                {errors.message && (
                  <p className="text-red-400 text-xs font-bold">
                    {errors.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" size="lg">
                Send Request →
              </Button>
            </form>
          </div>

          {/* Info Side */}
          <div className="w-full lg:w-1/3 space-y-4 md:space-y-5 reveal-right">
            {/* Why Demo */}
            <div className="bg-surface border border-border rounded-lg p-4 md:p-6">
              <h3 className="font-display text-sm md:text-base font-bold text-navy uppercase tracking-wide mb-3 md:mb-4">
                Why Request a Demo?
              </h3>
              <ul className="space-y-3">
                {[
                  '30-minute personalized live session',
                  'Custom module walkthrough based on your needs',
                  'Free consultation with our ERP experts',
                  'No commitment required',
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-muted text-xs md:text-sm"
                  >
                    <span className="w-5 h-5 bg-blue-100 text-blue-600 flex items-center justify-center rounded shrink-0 mt-0.5">
                      <CheckCircle className="w-3 h-3" strokeWidth={2.5} />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Details */}
            <div className="bg-surface border border-border rounded-lg p-4 md:p-6">
              <h3 className="font-display text-sm md:text-base font-bold text-navy uppercase tracking-wide mb-3 md:mb-4">
                Contact Details
              </h3>
              <div className="space-y-3">
                {[
                  {
                    icon: Mail,
                    label: 'hello@octagonerp.in',
                    href: 'mailto:hello@octagonerp.in',
                    color: { bg: 'bg-blue-100', text: 'text-blue-600' },
                  },
                  {
                    icon: Phone,
                    label: '+91 755 123 4567',
                    href: undefined,
                    color: { bg: 'bg-emerald-100', text: 'text-emerald-600' },
                  },
                  {
                    icon: MapPin,
                    label: 'India',
                    href: undefined,
                    color: { bg: 'bg-purple-100', text: 'text-purple-600' },
                  },
                ].map(({ icon: Icon, label, href, color }, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 text-xs md:text-sm text-muted"
                  >
                    <span
                      className={`w-7 h-7 flex items-center justify-center rounded shrink-0 ${color.bg} ${color.text}`}
                    >
                      <Icon className="w-3.5 h-3.5" strokeWidth={2.5} />
                    </span>
                    {href ? (
                      <a
                        href={href}
                        className="hover:text-blue transition-colors"
                      >
                        {label}
                      </a>
                    ) : (
                      <span>{label}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* STQC Badge */}
            <div className="bg-surface border border-border rounded-lg p-4 md:p-5 flex items-center gap-3 md:gap-4">
              <span className="w-10 h-10 bg-indigo-100 text-indigo-600 flex items-center justify-center rounded shrink-0">
                <ShieldCheck className="w-5 h-5" strokeWidth={2} />
              </span>
              <div>
                <h4 className="font-bold text-navy text-xs md:text-sm">
                  STQC Certified
                </h4>
                <p className="text-muted text-[10px] md:text-[11px]">
                  Government grade security and quality assurance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface InputFieldProps {
  label: string;
  name: keyof FormData;
  type?: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  error?: string;
  placeholder?: string;
}

function InputField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
}: InputFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[10px] md:text-[11px] font-black text-navy uppercase tracking-wider">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={clsx(
          'w-full bg-surface border rounded-lg p-2.5 md:p-3 text-sm focus:border-blue outline-none transition-colors',
          error ? 'border-red-400' : 'border-border'
        )}
      />
      {error && <p className="text-red-400 text-xs font-bold">{error}</p>}
    </div>
  );
}
