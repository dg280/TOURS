import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface LegalModalProps {
  type: "legal" | "privacy" | null;
  onClose: () => void;
}

export const LegalModal = ({ type, onClose }: LegalModalProps) => {
  return (
    <Dialog open={type !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            {type === "legal" ? "Mentions légales" : "Politique de confidentialité"}
          </DialogTitle>
        </DialogHeader>

        {type === "legal" && (
          <div className="prose prose-sm text-gray-600 space-y-6 pt-2">
            <section>
              <h3 className="text-base font-bold text-gray-800 mb-2">Éditeur du site</h3>
              <p>
                Le site <strong>toursandetours.com</strong> est édité par :<br />
                <strong>Tours & Détours</strong><br />
                Guide indépendant — Barcelone, Espagne<br />
                Email : <a href="mailto:info@toursandetours.com" className="text-amber-600 hover:underline">info@toursandetours.com</a>
              </p>
            </section>

            <section>
              <h3 className="text-base font-bold text-gray-800 mb-2">Hébergement</h3>
              <p>
                Ce site est hébergé par :<br />
                <strong>Vercel Inc.</strong><br />
                440 N Barranca Ave #4133, Covina, CA 91723, États-Unis<br />
                <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline">vercel.com</a>
              </p>
            </section>

            <section>
              <h3 className="text-base font-bold text-gray-800 mb-2">Propriété intellectuelle</h3>
              <p>
                L'ensemble des contenus présents sur ce site (textes, images, photographies, vidéos, logos) sont la propriété exclusive de Tours & Détours ou de leurs auteurs respectifs, et sont protégés par les lois françaises et internationales relatives à la propriété intellectuelle.
              </p>
              <p>
                Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des éléments du site est interdite sans autorisation écrite préalable.
              </p>
            </section>

            <section>
              <h3 className="text-base font-bold text-gray-800 mb-2">Limitation de responsabilité</h3>
              <p>
                Tours & Détours ne pourra être tenu responsable des dommages directs ou indirects résultant de l'accès au site ou de l'utilisation de ses contenus. Les informations disponibles sur ce site sont fournies à titre indicatif et peuvent être modifiées à tout moment.
              </p>
            </section>

            <section>
              <h3 className="text-base font-bold text-gray-800 mb-2">Droit applicable</h3>
              <p>
                Les présentes mentions légales sont soumises au droit espagnol. En cas de litige, et à défaut de résolution amiable, les tribunaux compétents de Barcelone seront seuls compétents.
              </p>
            </section>
          </div>
        )}

        {type === "privacy" && (
          <div className="prose prose-sm text-gray-600 space-y-6 pt-2">
            <section>
              <h3 className="text-base font-bold text-gray-800 mb-2">Responsable du traitement</h3>
              <p>
                <strong>Tours & Détours</strong> — Barcelone, Espagne<br />
                Contact : <a href="mailto:info@toursandetours.com" className="text-amber-600 hover:underline">info@toursandetours.com</a>
              </p>
            </section>

            <section>
              <h3 className="text-base font-bold text-gray-800 mb-2">Données collectées</h3>
              <p>Lors de l'utilisation de notre site, nous collectons les données suivantes :</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Formulaire de contact</strong> : nom, adresse e-mail, message</li>
                <li><strong>Réservation</strong> : nom, e-mail, téléphone, date de visite, nombre de participants, adresse de facturation, heure et adresse de prise en charge</li>
                <li><strong>Paiement</strong> : traité directement par Stripe — nous ne stockons pas vos coordonnées bancaires</li>
              </ul>
            </section>

            <section>
              <h3 className="text-base font-bold text-gray-800 mb-2">Finalités du traitement</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Gestion et confirmation des réservations</li>
                <li>Communication liée à votre tour (informations pratiques, rappels)</li>
                <li>Réponse à vos demandes de contact</li>
                <li>Amélioration de nos services</li>
              </ul>
            </section>

            <section>
              <h3 className="text-base font-bold text-gray-800 mb-2">Base légale</h3>
              <p>
                Le traitement de vos données est fondé sur l'exécution d'un contrat (réservation de tour) et votre consentement (formulaire de contact).
              </p>
            </section>

            <section>
              <h3 className="text-base font-bold text-gray-800 mb-2">Durée de conservation</h3>
              <p>
                Vos données de réservation sont conservées pendant une durée de <strong>3 ans</strong> à compter de votre dernière interaction, conformément aux obligations légales comptables. Les données de contact sont supprimées après <strong>1 an</strong> sans réponse.
              </p>
            </section>

            <section>
              <h3 className="text-base font-bold text-gray-800 mb-2">Vos droits (RGPD)</h3>
              <p>Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Droit d'accès à vos données</li>
                <li>Droit de rectification</li>
                <li>Droit à l'effacement (« droit à l'oubli »)</li>
                <li>Droit à la portabilité</li>
                <li>Droit d'opposition au traitement</li>
              </ul>
              <p className="mt-2">
                Pour exercer ces droits, contactez-nous à : <a href="mailto:info@toursandetours.com" className="text-amber-600 hover:underline">info@toursandetours.com</a>
              </p>
            </section>

            <section>
              <h3 className="text-base font-bold text-gray-800 mb-2">Cookies</h3>
              <p>
                Ce site utilise uniquement des cookies fonctionnels nécessaires à son bon fonctionnement (préférences de langue, consentement cookies). Aucun cookie publicitaire ou de tracking tiers n'est utilisé sans votre consentement explicite.
              </p>
            </section>

            <section>
              <h3 className="text-base font-bold text-gray-800 mb-2">Sous-traitants</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Supabase</strong> (base de données) — USA/UE</li>
                <li><strong>Stripe</strong> (paiement sécurisé) — USA</li>
                <li><strong>Resend</strong> (e-mails transactionnels) — USA</li>
                <li><strong>Vercel</strong> (hébergement) — USA</li>
              </ul>
              <p className="mt-2">Ces prestataires sont soumis à des obligations de confidentialité strictes et, le cas échéant, aux clauses contractuelles types de la Commission européenne.</p>
            </section>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
