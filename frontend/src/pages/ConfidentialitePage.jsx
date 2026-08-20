import { useEffect } from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import './LegalPage.css'

export default function ConfidentialitePage() {
  useEffect(() => {
    document.title = "Politique de confidentialité — Éduc & Vous"
  }, [])

  return (
    <>
      <Navbar />
      <main className="legal">
        <div className="container">
          <h1>Politique de confidentialité</h1>
          <p className="legal-date">Dernière mise à jour : {new Date().getFullYear()}</p>

          <h2>1. Qui traite vos données</h2>
          <p>
            Le site educetvous74.fr est édité par Rémi Delfosse, accompagnant éducatif
            exerçant en Haute-Savoie (74). Pour toute question relative à vos données personnelles,
            vous pouvez écrire à : delfosseremi33@gmail.com.
          </p>

          <h2>2. Quelles données sont collectées</h2>
          <p>
            Lorsque vous utilisez le formulaire de contact, les informations suivantes sont
            recueillies : prénom, adresse email, numéro de téléphone (facultatif), et le contenu
            de votre message. Ces données sont fournies volontairement par vous.
          </p>
          <p>
            Si vous créez un espace famille, votre nom, prénom, email et les informations liées
            à l'accompagnement sont également enregistrés.
          </p>

          <h2>3. Pourquoi ces données sont collectées</h2>
          <p>
            Vos données servent uniquement à répondre à votre demande, à assurer le suivi de
            l'accompagnement, et à vous recontacter. Elles ne sont jamais vendues, louées, ni
            transmises à des tiers à des fins commerciales.
          </p>

          <h2>4. Combien de temps sont-elles conservées</h2>
          <p>
            Les demandes de contact sont conservées le temps nécessaire au traitement de votre
            demande, puis archivées ou supprimées. Les données liées à un accompagnement en cours
            sont conservées pendant la durée de la relation, puis supprimées sur demande.
          </p>

          <h2>5. Vos droits</h2>
          <p>
            Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez
            d'un droit d'accès, de rectification, de suppression et d'opposition sur vos données.
            Pour exercer ces droits, écrivez à delfosseremi33@gmail.com. Une réponse vous sera
            apportée dans les meilleurs délais.
          </p>

          <h2>6. Cookies</h2>
          <p>
            Ce site utilise le strict nécessaire à son fonctionnement. Si des outils de mesure
            d'audience (comme Google Analytics) sont activés, ils servent uniquement à comprendre
            la fréquentation du site de façon anonyme, et jamais à vous identifier personnellement.
          </p>

          <h2>7. Sécurité</h2>
          <p>
            Vos données sont stockées de façon sécurisée. Les échanges avec le site sont chiffrés
            (HTTPS). Toutes les précautions raisonnables sont prises pour protéger vos informations.
          </p>

          <p className="legal-note">
            Cette politique peut être mise à jour. La date en haut de page indique la dernière
            version en vigueur.
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
