import PageTransition from '../components/PageTransition/PageTransition'
import SEO, { SITE }  from '../components/SEO/SEO'
import { useLanguage } from '../i18n/LanguageContext'
import './LegalPage.css'

export default function LegalPage() {
  const { t, lang } = useLanguage()
  const year = new Date().getFullYear()

  return (
    <PageTransition>
      <SEO
        title={t('legal_title')}
        description={t('legal_meta_desc')}
        url="/legal"
        lang={lang}
      />
      <div className="legal-page">
        <div className="legal-inner container">

          {/* ── En-tête ─────────────────────────────────────── */}
          <header className="legal-header">
            <p className="legal-eyebrow">— {t('legal_eyebrow')}</p>
            <h1 className="legal-h1">{t('legal_title')}</h1>
            <p className="legal-updated">{t('legal_updated')} {year}</p>
          </header>

          {/* ── Corps ───────────────────────────────────────── */}
          <article className="legal-body">

            <section className="legal-section">
              <h2 className="legal-h2">{t('legal_s1_title')}</h2>
              <p>{t('legal_s1_name')} <strong>Valentin Bedague</strong></p>
              <p>{t('legal_s1_status')}</p>
              <p>{t('legal_s1_siret')}</p>
              <p>{t('legal_s1_address')}</p>
              <p>
                {t('legal_s1_email')}{' '}
                <a href="mailto:contact@valentinbedague.com" className="legal-link">
                  contact@valentinbedague.com
                </a>
              </p>
              <p>
                {t('legal_s1_site')}{' '}
                <a href={SITE} target="_blank" rel="noopener noreferrer" className="legal-link">
                  valentinbedague.com
                </a>
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-h2">{t('legal_s2_title')}</h2>
              <p><strong>{t('legal_s2_host')}</strong></p>
              <p>{t('legal_s2_address')}</p>
              <p>
                <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="legal-link">
                  vercel.com
                </a>
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-h2">{t('legal_s3_title')}</h2>
              <p>{t('legal_s3_p1')}</p>
              <p>{t('legal_s3_p2')}</p>
            </section>

            <section className="legal-section">
              <h2 className="legal-h2">{t('legal_s4_title')}</h2>
              <p>{t('legal_s4_p1')}</p>
              <p>{t('legal_s4_p2')}</p>
              <p>
                {t('legal_s4_contact')}{' '}
                <a href="mailto:contact@valentinbedague.com" className="legal-link">
                  contact@valentinbedague.com
                </a>
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-h2">{t('legal_s5_title')}</h2>
              <p>{t('legal_s5_p1')}</p>
            </section>

            <section className="legal-section">
              <h2 className="legal-h2">{t('legal_s6_title')}</h2>
              <p>{t('legal_s6_p1')}</p>
            </section>

          </article>

        </div>
      </div>
    </PageTransition>
  )
}
