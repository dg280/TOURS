import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Language } from "@/lib/types";

interface LegalModalProps {
  type: "legal" | "privacy" | null;
  onClose: () => void;
  lang: Language;
}

const legalContent = {
  fr: {
    legal: {
      title: "Mentions légales",
      editor_title: "Éditeur du site",
      editor_body_prefix: "Le site",
      editor_body_suffix: "est édité par :",
      editor_info: "Guide indépendant — Barcelone, Espagne",
      hosting_title: "Hébergement",
      hosting_body: "Ce site est hébergé par :",
      hosting_address: "440 N Barranca Ave #4133, Covina, CA 91723, États-Unis",
      ip_title: "Propriété intellectuelle",
      ip_body: "L'ensemble des contenus présents sur ce site (textes, images, photographies, vidéos, logos) sont la propriété exclusive de Tours & Détours ou de leurs auteurs respectifs, et sont protégés par les lois françaises et internationales relatives à la propriété intellectuelle.",
      ip_body2: "Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des éléments du site est interdite sans autorisation écrite préalable.",
      liability_title: "Limitation de responsabilité",
      liability_body: "Tours & Détours ne pourra être tenu responsable des dommages directs ou indirects résultant de l'accès au site ou de l'utilisation de ses contenus. Les informations disponibles sur ce site sont fournies à titre indicatif et peuvent être modifiées à tout moment.",
      law_title: "Droit applicable",
      law_body: "Les présentes mentions légales sont soumises au droit espagnol. En cas de litige, et à défaut de résolution amiable, les tribunaux compétents de Barcelone seront seuls compétents.",
    },
    privacy: {
      title: "Politique de confidentialité",
      controller_title: "Responsable du traitement",
      collected_title: "Données collectées",
      collected_intro: "Lors de l'utilisation de notre site, nous collectons les données suivantes :",
      collected_contact: "Formulaire de contact",
      collected_contact_detail: "nom, adresse e-mail, message",
      collected_booking: "Réservation",
      collected_booking_detail: "nom, e-mail, téléphone, date de visite, nombre de participants, adresse de facturation, heure et adresse de prise en charge",
      collected_payment: "Paiement",
      collected_payment_detail: "traité directement par Stripe — nous ne stockons pas vos coordonnées bancaires",
      purposes_title: "Finalités du traitement",
      purposes: [
        "Gestion et confirmation des réservations",
        "Communication liée à votre tour (informations pratiques, rappels)",
        "Réponse à vos demandes de contact",
        "Amélioration de nos services",
      ],
      basis_title: "Base légale",
      basis_body: "Le traitement de vos données est fondé sur l'exécution d'un contrat (réservation de tour) et votre consentement (formulaire de contact).",
      retention_title: "Durée de conservation",
      retention_body_prefix: "Vos données de réservation sont conservées pendant une durée de",
      retention_booking_period: "3 ans",
      retention_body_middle: "à compter de votre dernière interaction, conformément aux obligations légales comptables. Les données de contact sont supprimées après",
      retention_contact_period: "1 an",
      retention_body_suffix: "sans réponse.",
      gdpr_title: "Vos droits (RGPD)",
      gdpr_intro: "Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :",
      gdpr_rights: [
        "Droit d'accès à vos données",
        "Droit de rectification",
        "Droit à l'effacement (« droit à l'oubli »)",
        "Droit à la portabilité",
        "Droit d'opposition au traitement",
      ],
      gdpr_contact: "Pour exercer ces droits, contactez-nous à :",
      cookies_title: "Cookies",
      cookies_body: "Ce site utilise uniquement des cookies fonctionnels nécessaires à son bon fonctionnement (préférences de langue, consentement cookies). Aucun cookie publicitaire ou de tracking tiers n'est utilisé sans votre consentement explicite.",
      subprocessors_title: "Sous-traitants",
      subprocessors_note: "Ces prestataires sont soumis à des obligations de confidentialité strictes et, le cas échéant, aux clauses contractuelles types de la Commission européenne.",
    },
  },
  en: {
    legal: {
      title: "Legal Notice",
      editor_title: "Website Editor",
      editor_body_prefix: "The website",
      editor_body_suffix: "is published by:",
      editor_info: "Independent guide — Barcelona, Spain",
      hosting_title: "Hosting",
      hosting_body: "This website is hosted by:",
      hosting_address: "440 N Barranca Ave #4133, Covina, CA 91723, United States",
      ip_title: "Intellectual Property",
      ip_body: "All content on this website (text, images, photographs, videos, logos) is the exclusive property of Tours & Detours or their respective authors, and is protected by French and international intellectual property laws.",
      ip_body2: "Any reproduction, representation, modification, publication or adaptation of all or part of the website content is prohibited without prior written authorization.",
      liability_title: "Limitation of Liability",
      liability_body: "Tours & Detours shall not be held liable for any direct or indirect damages resulting from access to or use of this website. Information available on this site is provided for informational purposes only and may be modified at any time.",
      law_title: "Applicable Law",
      law_body: "These legal notices are governed by Spanish law. In the event of a dispute, and failing an amicable resolution, the competent courts of Barcelona shall have sole jurisdiction.",
    },
    privacy: {
      title: "Privacy Policy",
      controller_title: "Data Controller",
      collected_title: "Collected Data",
      collected_intro: "When using our website, we collect the following data:",
      collected_contact: "Contact form",
      collected_contact_detail: "name, email address, message",
      collected_booking: "Booking",
      collected_booking_detail: "name, email, phone number, visit date, number of participants, billing address, pickup time and address",
      collected_payment: "Payment",
      collected_payment_detail: "processed directly by Stripe — we do not store your bank details",
      purposes_title: "Processing Purposes",
      purposes: [
        "Managing and confirming bookings",
        "Tour-related communication (practical information, reminders)",
        "Responding to your contact requests",
        "Improving our services",
      ],
      basis_title: "Legal Basis",
      basis_body: "The processing of your data is based on the performance of a contract (tour booking) and your consent (contact form).",
      retention_title: "Data Retention Period",
      retention_body_prefix: "Your booking data is retained for a period of",
      retention_booking_period: "3 years",
      retention_body_middle: "from your last interaction, in compliance with legal accounting obligations. Contact data is deleted after",
      retention_contact_period: "1 year",
      retention_body_suffix: "without a response.",
      gdpr_title: "Your Rights (GDPR)",
      gdpr_intro: "In accordance with the General Data Protection Regulation (GDPR), you have the following rights:",
      gdpr_rights: [
        "Right to access your data",
        "Right to rectification",
        "Right to erasure ('right to be forgotten')",
        "Right to data portability",
        "Right to object to processing",
      ],
      gdpr_contact: "To exercise these rights, contact us at:",
      cookies_title: "Cookies",
      cookies_body: "This website only uses functional cookies necessary for its proper operation (language preferences, cookie consent). No advertising or third-party tracking cookies are used without your explicit consent.",
      subprocessors_title: "Sub-processors",
      subprocessors_note: "These providers are subject to strict confidentiality obligations and, where applicable, to the European Commission's standard contractual clauses.",
    },
  },
  es: {
    legal: {
      title: "Aviso Legal",
      editor_title: "Editor del sitio web",
      editor_body_prefix: "El sitio web",
      editor_body_suffix: "es publicado por:",
      editor_info: "Guía independiente — Barcelona, España",
      hosting_title: "Alojamiento web",
      hosting_body: "Este sitio web está alojado por:",
      hosting_address: "440 N Barranca Ave #4133, Covina, CA 91723, Estados Unidos",
      ip_title: "Propiedad intelectual",
      ip_body: "Todo el contenido de este sitio web (textos, imágenes, fotografías, vídeos, logotipos) es propiedad exclusiva de Tours & Detours o de sus respectivos autores, y está protegido por las leyes francesas e internacionales de propiedad intelectual.",
      ip_body2: "Queda prohibida toda reproducción, representación, modificación, publicación o adaptación total o parcial de los elementos del sitio sin autorización escrita previa.",
      liability_title: "Limitación de responsabilidad",
      liability_body: "Tours & Detours no será responsable de los daños directos o indirectos derivados del acceso al sitio o del uso de sus contenidos. La información disponible en este sitio se proporciona a título informativo y puede ser modificada en cualquier momento.",
      law_title: "Legislación aplicable",
      law_body: "El presente aviso legal se rige por el derecho español. En caso de litigio, y a falta de resolución amistosa, serán competentes exclusivamente los tribunales de Barcelona.",
    },
    privacy: {
      title: "Política de Privacidad",
      controller_title: "Responsable del tratamiento",
      collected_title: "Datos recogidos",
      collected_intro: "Al utilizar nuestro sitio web, recogemos los siguientes datos:",
      collected_contact: "Formulario de contacto",
      collected_contact_detail: "nombre, dirección de correo electrónico, mensaje",
      collected_booking: "Reserva",
      collected_booking_detail: "nombre, correo electrónico, teléfono, fecha de visita, número de participantes, dirección de facturación, hora y dirección de recogida",
      collected_payment: "Pago",
      collected_payment_detail: "procesado directamente por Stripe — no almacenamos sus datos bancarios",
      purposes_title: "Finalidades del tratamiento",
      purposes: [
        "Gestión y confirmación de reservas",
        "Comunicación relacionada con su tour (información práctica, recordatorios)",
        "Respuesta a sus solicitudes de contacto",
        "Mejora de nuestros servicios",
      ],
      basis_title: "Base legal",
      basis_body: "El tratamiento de sus datos se basa en la ejecución de un contrato (reserva de tour) y su consentimiento (formulario de contacto).",
      retention_title: "Período de conservación",
      retention_body_prefix: "Sus datos de reserva se conservan durante un período de",
      retention_booking_period: "3 años",
      retention_body_middle: "a partir de su última interacción, conforme a las obligaciones legales contables. Los datos de contacto se eliminan tras",
      retention_contact_period: "1 año",
      retention_body_suffix: "sin respuesta.",
      gdpr_title: "Sus derechos (RGPD)",
      gdpr_intro: "De acuerdo con el Reglamento General de Protección de Datos (RGPD), usted dispone de los siguientes derechos:",
      gdpr_rights: [
        "Derecho de acceso a sus datos",
        "Derecho de rectificación",
        "Derecho de supresión ('derecho al olvido')",
        "Derecho a la portabilidad de los datos",
        "Derecho de oposición al tratamiento",
      ],
      gdpr_contact: "Para ejercer estos derechos, contáctenos en:",
      cookies_title: "Cookies",
      cookies_body: "Este sitio web utiliza únicamente cookies funcionales necesarias para su correcto funcionamiento (preferencias de idioma, consentimiento de cookies). No se utilizan cookies publicitarias ni de seguimiento de terceros sin su consentimiento explícito.",
      subprocessors_title: "Subencargados",
      subprocessors_note: "Estos proveedores están sujetos a estrictas obligaciones de confidencialidad y, en su caso, a las cláusulas contractuales tipo de la Comisión Europea.",
    },
  },
};

const subprocessors = [
  { name: "Supabase", desc: { fr: "base de données", en: "database", es: "base de datos" }, region: { fr: "USA/UE", en: "USA/EU", es: "EE.UU./UE" } },
  { name: "Stripe", desc: { fr: "paiement sécurisé", en: "secure payment", es: "pago seguro" }, region: { fr: "USA", en: "USA", es: "EE.UU." } },
  { name: "Resend", desc: { fr: "e-mails transactionnels", en: "transactional emails", es: "correos transaccionales" }, region: { fr: "USA", en: "USA", es: "EE.UU." } },
  { name: "Vercel", desc: { fr: "hébergement", en: "hosting", es: "alojamiento" }, region: { fr: "USA", en: "USA", es: "EE.UU." } },
];

export const LegalModal = ({ type, onClose, lang }: LegalModalProps) => {
  const c = legalContent[lang];

  return (
    <Dialog open={type !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            {type === "legal" ? c.legal.title : c.privacy.title}
          </DialogTitle>
        </DialogHeader>

        {type === "legal" && (
          <div className="prose prose-sm text-gray-600 space-y-6 pt-2">
            <section>
              <h3 className="text-base font-bold text-gray-800 mb-2">{c.legal.editor_title}</h3>
              <p>
                {c.legal.editor_body_prefix} <strong>toursandetours.com</strong> {c.legal.editor_body_suffix}<br />
                <strong>Tours & Détours</strong><br />
                {c.legal.editor_info}<br />
                Email : <a href="mailto:info@toursandetours.com" className="text-amber-600 hover:underline">info@toursandetours.com</a>
              </p>
            </section>

            <section>
              <h3 className="text-base font-bold text-gray-800 mb-2">{c.legal.hosting_title}</h3>
              <p>
                {c.legal.hosting_body}<br />
                <strong>Vercel Inc.</strong><br />
                {c.legal.hosting_address}<br />
                <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline">vercel.com</a>
              </p>
            </section>

            <section>
              <h3 className="text-base font-bold text-gray-800 mb-2">{c.legal.ip_title}</h3>
              <p>{c.legal.ip_body}</p>
              <p>{c.legal.ip_body2}</p>
            </section>

            <section>
              <h3 className="text-base font-bold text-gray-800 mb-2">{c.legal.liability_title}</h3>
              <p>{c.legal.liability_body}</p>
            </section>

            <section>
              <h3 className="text-base font-bold text-gray-800 mb-2">{c.legal.law_title}</h3>
              <p>{c.legal.law_body}</p>
            </section>
          </div>
        )}

        {type === "privacy" && (
          <div className="prose prose-sm text-gray-600 space-y-6 pt-2">
            <section>
              <h3 className="text-base font-bold text-gray-800 mb-2">{c.privacy.controller_title}</h3>
              <p>
                <strong>Tours & Détours</strong> — Barcelona, {lang === "fr" ? "Espagne" : lang === "en" ? "Spain" : "España"}<br />
                Contact : <a href="mailto:info@toursandetours.com" className="text-amber-600 hover:underline">info@toursandetours.com</a>
              </p>
            </section>

            <section>
              <h3 className="text-base font-bold text-gray-800 mb-2">{c.privacy.collected_title}</h3>
              <p>{c.privacy.collected_intro}</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>{c.privacy.collected_contact}</strong> : {c.privacy.collected_contact_detail}</li>
                <li><strong>{c.privacy.collected_booking}</strong> : {c.privacy.collected_booking_detail}</li>
                <li><strong>{c.privacy.collected_payment}</strong> : {c.privacy.collected_payment_detail}</li>
              </ul>
            </section>

            <section>
              <h3 className="text-base font-bold text-gray-800 mb-2">{c.privacy.purposes_title}</h3>
              <ul className="list-disc pl-5 space-y-1">
                {c.privacy.purposes.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </section>

            <section>
              <h3 className="text-base font-bold text-gray-800 mb-2">{c.privacy.basis_title}</h3>
              <p>{c.privacy.basis_body}</p>
            </section>

            <section>
              <h3 className="text-base font-bold text-gray-800 mb-2">{c.privacy.retention_title}</h3>
              <p>
                {c.privacy.retention_body_prefix} <strong>{c.privacy.retention_booking_period}</strong> {c.privacy.retention_body_middle} <strong>{c.privacy.retention_contact_period}</strong> {c.privacy.retention_body_suffix}
              </p>
            </section>

            <section>
              <h3 className="text-base font-bold text-gray-800 mb-2">{c.privacy.gdpr_title}</h3>
              <p>{c.privacy.gdpr_intro}</p>
              <ul className="list-disc pl-5 space-y-1">
                {c.privacy.gdpr_rights.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
              <p className="mt-2">
                {c.privacy.gdpr_contact} <a href="mailto:info@toursandetours.com" className="text-amber-600 hover:underline">info@toursandetours.com</a>
              </p>
            </section>

            <section>
              <h3 className="text-base font-bold text-gray-800 mb-2">{c.privacy.cookies_title}</h3>
              <p>{c.privacy.cookies_body}</p>
            </section>

            <section>
              <h3 className="text-base font-bold text-gray-800 mb-2">{c.privacy.subprocessors_title}</h3>
              <ul className="list-disc pl-5 space-y-1">
                {subprocessors.map((sp) => (
                  <li key={sp.name}><strong>{sp.name}</strong> ({sp.desc[lang]}) — {sp.region[lang]}</li>
                ))}
              </ul>
              <p className="mt-2">{c.privacy.subprocessors_note}</p>
            </section>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
