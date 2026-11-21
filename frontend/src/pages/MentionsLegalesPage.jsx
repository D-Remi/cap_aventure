import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import useEntreprise, { v, nomEI, fmtDate } from '../hooks/useEntreprise'
import { setMeta } from '../utils/seo'
import './LegalPages.css'

export default function MentionsLegalesPage() {
  const e = useEntreprise()
  useEffect(() => {
    setMeta('Mentions légales · Éduc & Vous', "Mentions légales du site Éduc & Vous : éditeur, hébergeur, déclaration de services à la personne, médiation.")
  }, [])

  const adresse = [e.adresse, [e.code_postal, e.ville].filter(Boolean).join(' ')].filter(Boolean).join(', ')

  return (
    <div className="ev">
      <Navbar />
      <main className="ev-legal">
        <div className="ev-legal__head">
          <span className="ev-kicker">Informations légales</span>
          <h1>Mentions légales</h1>
          <p>Informations prévues par l'article 6 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique.</p>
        </div>

        <section>
          <h2>Éditeur du site</h2>
          <dl>
            <dt>Entreprise</dt><dd>{nomEI(e)}{e.nom_commercial ? `, nom commercial « ${e.nom_commercial} »` : ''} (entrepreneur individuel, micro-entreprise)</dd>
            <dt>Adresse</dt><dd>{v(adresse, 'adresse à compléter')}</dd>
            <dt>Téléphone</dt><dd>{v(e.telephone)}</dd>
            <dt>E-mail</dt><dd>{v(e.email)}</dd>
            <dt>SIRET</dt><dd>{v(e.siret)}</dd>
            {e.code_ape && <><dt>Code APE</dt><dd>{e.code_ape}</dd></>}
            <dt>Immatriculation</dt><dd>{v(e.immatriculation)}</dd>
            <dt>TVA</dt><dd>{(e.tva_regime || 'franchise') === 'franchise' ? 'TVA non applicable, article 293 B du CGI' : `Assujetti à la TVA (${e.tva_taux} %)`}</dd>
            <dt>Directeur de la publication</dt><dd>{[e.prenom, e.nom].filter(Boolean).join(' ') || '[Prénom Nom]'}</dd>
          </dl>
        </section>

        <section>
          <h2>Activité réglementée : services à la personne</h2>
          <dl>
            <dt>Déclaration</dt><dd>{e.sap_numero ? `Organisme déclaré sous le n° ${e.sap_numero}${e.sap_date ? ` le ${fmtDate(e.sap_date)}` : ''}` : '[n° de déclaration SAP à compléter]'}</dd>
            {e.agrement_numero && <><dt>Agrément</dt><dd>n° {e.agrement_numero}{e.agrement_date ? ` délivré le ${fmtDate(e.agrement_date)}` : ''}</dd></>}
            <dt>Prestations</dt><dd>Garde d'enfants à domicile et accompagnement des enfants dans leurs déplacements</dd>
            <dt>Mode d'intervention</dt><dd>Prestataire</dd>
            <dt>Assurance</dt><dd>Responsabilité civile professionnelle : {v(e.assureur, 'assureur à compléter')}{e.police_rc ? `, contrat n° ${e.police_rc}` : ''}</dd>
          </dl>
        </section>

        <section>
          <h2>Hébergement</h2>
          <p>{v(e.hebergeur, "nom, adresse et téléphone de l'hébergeur à compléter")}</p>
        </section>

        <section>
          <h2>Médiation de la consommation</h2>
          <p>
            En cas de litige, et après une réclamation écrite restée sans solution, vous pouvez recourir gratuitement au médiateur de la consommation
            (articles L611-1 et suivants du Code de la consommation) :
          </p>
          <div className="ev-legal__box">
            <p><b>{v(e.mediateur_nom, 'nom du médiateur à compléter')}</b></p>
            {e.mediateur_adresse && <p>{e.mediateur_adresse}</p>}
            {e.mediateur_site && <p><a href={e.mediateur_site} target="_blank" rel="noopener noreferrer">{e.mediateur_site}</a></p>}
          </div>
        </section>

        <section>
          <h2>Propriété intellectuelle et crédits</h2>
          <p>Les textes, le logo et la mise en page du site sont la propriété de l'éditeur. Toute reproduction sans autorisation est interdite.</p>
          <p>Photographies d'illustration : <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer">Unsplash</a> (licence Unsplash). Elles ne représentent pas les enfants accompagnés. Portrait : Rémi.</p>
        </section>

        <section>
          <h2>Voir aussi</h2>
          <ul>
            <li><Link to="/cgv">Conditions générales de prestation</Link></li>
            <li><Link to="/confidentialite">Politique de confidentialité</Link></li>
            <li><Link to="/tarifs">Tarifs</Link></li>
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  )
}
