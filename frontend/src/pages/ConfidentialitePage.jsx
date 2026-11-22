import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import useEntreprise, { v, nomEI } from '../hooks/useEntreprise'
import { setMeta } from '../utils/seo'
import './LegalPages.css'

export default function ConfidentialitePage() {
  const e = useEntreprise()
  useEffect(() => {
    setMeta('Politique de confidentialité · Éduc & Vous', "Comment Éduc & Vous protège les données des familles et des enfants : finalités, durées de conservation, droits RGPD.")
  }, [])
  const contact = v(e.email || 'delfosseremi33@gmail.com')

  return (
    <div className="ev">
      <Navbar />
      <main className="ev-legal">
        <div className="ev-legal__head">
          <span className="ev-kicker">RGPD</span>
          <h1>Politique de confidentialité</h1>
          <p>Confier son enfant, c'est aussi confier des informations personnelles, parfois médicales. Voici exactement ce qui est collecté, pourquoi, et combien de temps.</p>
        </div>

        <section>
          <h2>1. Responsable du traitement</h2>
          <p>{nomEI(e)}{e.nom_commercial ? ` (« ${e.nom_commercial} »)` : ''}, accompagnant éducatif, Haute-Savoie. Contact pour toute question sur vos données : <b>{contact}</b>.</p>
        </section>

        <section>
          <h2>2. Données collectées</h2>
          <h3>Formulaire de contact</h3>
          <p>Prénom, e-mail, téléphone (facultatif), lieu de résidence (France ou Suisse) et votre message.</p>
          <h3>Réservation d'un appel</h3>
          <p>Prénom, téléphone, e-mail, lieu de résidence et commune (facultatifs), votre message éventuel, et le créneau choisi.</p>
          <h3>Assistant du site</h3>
          <p>
            Les questions que vous tapez dans l'assistant sont transmises au service d'intelligence artificielle d'Anthropic pour générer la réponse.
            Éduc & Vous ne les enregistre pas : la conversation reste seulement dans l'onglet de votre navigateur et s'efface à sa fermeture.
            N'y indiquez pas d'informations médicales ni de données sur votre enfant.
          </p>
          <h3>Espace famille et suivi des gardes</h3>
          <ul>
            <li>Identité et coordonnées des parents, adresse de facturation.</li>
            <li>Enfants : prénom, nom, date de naissance, habitudes, besoins, et le cas échéant des <b>données de santé</b> (handicap, traitements, allergies, protocole d'urgence).</li>
            <li>Documents que vous déposez, photos (uniquement avec votre autorisation), messages, contrats signés, comptes-rendus.</li>
          </ul>
          <h3>Gestion et comptabilité</h3>
          <p>Devis, factures, paiements, attestations fiscales.</p>
        </section>

        <section>
          <h2>3. Finalités et bases légales</h2>
          <ul>
            <li>Répondre à vos demandes, organiser l'appel que vous réservez et préparer un devis : mesures précontractuelles prises à votre demande (RGPD, art. 6.1.b).</li>
            <li>Répondre à vos questions avec l'assistant du site : intérêt légitime à informer les visiteurs (art. 6.1.f). Vous pouvez toujours écrire ou appeler directement.</li>
            <li>Réaliser les gardes, assurer la sécurité de l'enfant, tenir l'espace famille : exécution du contrat (art. 6.1.b).</li>
            <li>Données de santé de l'enfant : votre consentement explicite, que vous pouvez retirer à tout moment (art. 9.2.a), et la sauvegarde des intérêts vitaux de l'enfant en cas d'urgence (art. 9.2.c).</li>
            <li>Factures, comptabilité, attestations fiscales, avance immédiate du crédit d'impôt : obligations légales (art. 6.1.c).</li>
          </ul>
          <p>Aucune donnée n'est vendue, louée ni utilisée à des fins publicitaires. Aucun profilage n'est réalisé.</p>
        </section>

        <section>
          <h2>4. Durées de conservation</h2>
          <ul>
            <li>Demande de contact ou appel réservé sans suite : 3 ans après le dernier échange.</li>
            <li>Questions posées à l'assistant : non conservées par Éduc & Vous ; Anthropic les conserve pour une durée limitée selon ses conditions et ne les utilise pas pour entraîner ses modèles.</li>
            <li>Espace famille et données de l'enfant : pendant la durée de l'accompagnement, puis supprimées au plus tard 1 an après la dernière garde (ou plus tôt à votre demande).</li>
            <li>Factures et pièces comptables : 10 ans (obligation légale).</li>
            <li>Devis : au moins 1 an.</li>
          </ul>
        </section>

        <section>
          <h2>5. Qui a accès à vos données</h2>
          <ul>
            <li>Rémi uniquement. Les informations sur votre enfant ne sont jamais transmises à un tiers sans votre accord, sauf aux secours en cas d'urgence.</li>
            <li>Sous-traitants techniques : l'hébergeur du site ({v(e.hebergeur, 'hébergeur')}), le service d'envoi des e-mails du site, et Anthropic PBC (États-Unis) pour l'assistant du site uniquement. Ce transfert hors de l'Union européenne est encadré par les clauses contractuelles types de la Commission européenne.</li>
            <li>Administrations, dans le cadre légal : URSSAF (avance immédiate du crédit d'impôt) et administration fiscale.</li>
          </ul>
          <p>
            Les photos d'illustration du site sont chargées depuis Unsplash (États-Unis), qui reçoit à cette occasion votre adresse IP ; ce transfert est encadré
            par le cadre de protection des données UE / États-Unis. Les polices de caractères sont hébergées sur le site lui-même.
          </p>
        </section>

        <section>
          <h2>6. Cookies</h2>
          <p>
            Le site n'utilise aucun cookie publicitaire ni de mesure d'audience. Seuls des cookies strictement nécessaires sont déposés quand vous vous connectez
            à l'espace famille (maintien de la connexion sécurisée). Ils ne demandent pas de consentement.
          </p>
        </section>

        <section>
          <h2>7. Sécurité</h2>
          <p>Connexion chiffrée (HTTPS), mots de passe chiffrés, accès à l'espace famille protégé, accès administrateur réservé à Rémi, sauvegardes régulières.</p>
        </section>

        <section>
          <h2>8. Vos droits</h2>
          <p>
            Vous pouvez accéder à vos données, les rectifier, les effacer, en limiter l'utilisation, vous y opposer, les récupérer (portabilité), retirer votre
            consentement et définir des directives sur leur sort après votre décès. Écrivez à <b>{contact}</b> : réponse sous un mois.
          </p>
          <p>
            Si vous estimez que vos droits ne sont pas respectés, vous pouvez saisir la CNIL :{' '}
            <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener noreferrer">cnil.fr/fr/plaintes</a>.
          </p>
        </section>

        <section>
          <h2>Voir aussi</h2>
          <ul>
            <li><Link to="/mentions-legales">Mentions légales</Link></li>
            <li><Link to="/cgv">Conditions générales de prestation</Link></li>
          </ul>
        </section>

        <p className="ev-legal__maj">Dernière mise à jour : novembre 2026.</p>
      </main>
      <Footer />
    </div>
  )
}
