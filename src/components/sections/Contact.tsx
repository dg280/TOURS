import { useState } from "react";
import { Phone, Mail, Instagram } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { Translations } from "@/lib/translations";
import type { Tour } from "@/lib/types";

interface ContactProps {
  t: Translations;
  instagramUrl: string;
}

export const Contact = ({ t, instagramUrl }: ContactProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [tour, setTour] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error(t.contact.validation_error);
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, tour, date: preferredDate, message }),
      });
      if (!res.ok) throw new Error(t.contact.server_error);
      toast.success(t.contact.success_message);
      setName(""); setEmail(""); setTour(""); setPreferredDate(""); setMessage("");
    } catch {
      toast.error(t.contact.send_error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section-padding bg-white">
      <div className="container-custom">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16">
            <div className="space-y-8">
              <div>
                <p className="text-amber-600 font-medium mb-2">
                  {t.contact.tag}
                </p>
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                  {t.contact.title}
                </h2>
                <p className="text-gray-600 text-lg">{t.contact.desc}</p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all duration-300">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 uppercase tracking-widest font-bold">
                      WhatsApp
                    </p>
                    <a
                      href={`https://wa.me/${t.contact.whatsapp.replace(/\s+/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xl font-bold hover:text-amber-600 transition-colors"
                    >
                      {t.contact.whatsapp}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all duration-300">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 uppercase tracking-widest font-bold">
                      Email
                    </p>
                    <a
                      href="mailto:info@toursandetours.com"
                      className="text-xl font-bold hover:text-amber-600 transition-colors"
                    >
                      info@toursandetours.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-600 group-hover:bg-pink-600 group-hover:text-white transition-all duration-300">
                    <Instagram className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 uppercase tracking-widest font-bold">
                      Instagram
                    </p>
                    <a
                      href={instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xl font-bold hover:text-amber-600 transition-colors"
                    >
                      @tours_and_detours_bcn
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">
                {t.contact.form_title}
              </h3>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t.contact.name}</Label>
                    <Input
                      id="name"
                      placeholder={t.contact.name_placeholder}
                      className="bg-white border-gray-200 focus:border-amber-600 h-12"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t.contact.email}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t.contact.email_placeholder}
                      className="bg-white border-gray-200 focus:border-amber-600 h-12"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="tour"
                    className="text-gray-700 font-semibold ml-1"
                  >
                    {t.contact.tour}
                  </Label>
                  <select
                    id="tour"
                    value={tour}
                    onChange={(e) => setTour(e.target.value)}
                    className="w-full h-14 px-5 rounded-2xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-base transition-all appearance-none cursor-pointer"
                  >
                    <option value="">{t.contact.select_tour}</option>
                    {t.tour_data.map((tourItem: Tour) => (
                      <option key={tourItem.id} value={tourItem.title}>
                        {tourItem.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="date"
                    className="text-gray-700 font-semibold ml-1"
                  >
                    {t.contact.date}
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    className="bg-white border-gray-200 focus:border-amber-600 h-12"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="message"
                    className="text-gray-700 font-semibold ml-1"
                  >
                    {t.contact.message}
                  </Label>
                  <Textarea
                    id="message"
                    rows={4}
                    className="bg-white border-gray-200 focus:border-amber-600 rounded-2xl p-5 text-base"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#c9a961] hover:bg-[#b8944e] text-white font-bold h-16 rounded-2xl shadow-xl shadow-[#c9a961]/30 transition-all active:scale-95 text-lg uppercase tracking-wide disabled:opacity-60"
                >
                  {isSubmitting ? t.contact.sending : t.contact.cta}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
