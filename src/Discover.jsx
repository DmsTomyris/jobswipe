import React, { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, ChevronRight, Compass, Heart, RotateCcw, X } from 'lucide-react'
import { candidates, recruiters } from './data'
import { icons, SlideDeck, SlideList, useSlideVideo } from './SlideDeck'

export function PageHeader({ title, text, children }) {
  return (
    <header className="page-header">
      <div><h1>{title}</h1><p>{text}</p></div>
      {children}
    </header>
  )
}

function ReviewCard({ profile, isRecruiter, slides, mark, uploadedVideos }) {
  const [index, setIndex] = useState(0)
  const video = useSlideVideo(profile, uploadedVideos)
  const identity = isRecruiter ? profile : { name: profile.title, subtitle: `${profile.organization} · ${profile.meta}` }
  return (
    <>
      <SlideDeck slides={slides} index={index} select={setIndex} video={video} identity={identity} onSwipe={mark} />
      <aside className="slide-panel">
        <h2>Slides</h2>
        <p>{isRecruiter ? `Von ${profile.short} selbst gestaltet` : `Über die Stelle bei ${profile.organization}`}</p>
        <SlideList slides={slides} index={index} select={setIndex} video={video} />
      </aside>
    </>
  )
}

export default function Discover({ account, votes, edits, uploadedVideos, onVote, onReset, openMatches, notice }) {
  const isRecruiter = 'job' in account
  const pool = isRecruiter ? candidates : recruiters
  const remaining = pool.filter((profile) => !votes[account.id]?.[profile.id])
  const profile = remaining[0]
  const JobIcon = icons[account.icon]

  useEffect(() => {
    if (!profile) return
    function handleKey(event) {
      if (event.defaultPrevented || event.repeat || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
      if (event.target.closest?.('input, textarea, select, video, [contenteditable]')) return
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
      event.preventDefault()
      onVote(profile, event.key === 'ArrowRight' ? 'like' : 'pass')
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [profile, onVote])

  return (
    <>
      <PageHeader
        title={isRecruiter ? 'Bewerber entdecken' : 'Stellen entdecken'}
        text={isRecruiter ? 'Sieh dir die Slides an und entscheide, wen du kennenlernen möchtest.' : 'Entdecke offene Stellen und zeig Interesse, wenn eine zu dir passt.'}>
        {JobIcon ? <span className="role-pill"><JobIcon size={28} />{account.job}</span> : null}
      </PageHeader>
      <div className="discovery">
        {notice ? (
          <div className="match-notice" role="status">
            <Heart size={20} aria-hidden="true" />
            <strong>Ein Match mit {notice}!</strong>
            <button type="button" onClick={openMatches}>Matches ansehen <ChevronRight size={17} /></button>
          </div>
        ) : null}
        {profile ? (
          <>
            <div className="review-grid">
              <div className="section-label review-label">
                <span>{isRecruiter ? 'Bewerberprofil' : 'Stellenprofil'}</span>
                <span>{pool.length - remaining.length + 1} von {pool.length}</span>
              </div>
              <ReviewCard key={profile.id} profile={profile} isRecruiter={isRecruiter}
                slides={edits[profile.id] || profile.slides} uploadedVideos={uploadedVideos}
                mark={(vote) => onVote(profile, vote)} />
              <div className="review-actions">
                <div className="action-buttons">
                  <button type="button" className="button secondary" onClick={() => onVote(profile, 'pass')}><X />Weiter</button>
                  <button type="button" className="button primary" onClick={() => onVote(profile, 'like')}><Heart />Interesse</button>
                </div>
                <p className="keyboard"><kbd><ArrowLeft size={16} /></kbd><span>/</span><kbd><ArrowRight size={16} /></kbd>{isRecruiter ? 'Bewerber bewerten' : 'Stellen bewerten'}</p>
              </div>
            </div>
          </>
        ) : (
          <section className="empty-state">
            <span className="empty-icon"><Compass size={32} /></span>
            <h2>Alles angesehen</h2>
            <p>Du hast alle {isRecruiter ? 'Bewerberprofile' : 'Stellen'} für diesen Testaccount bewertet.</p>
            <button type="button" className="button secondary small" onClick={onReset}><RotateCcw size={18} />Eigene Bewertungen zurücksetzen</button>
          </section>
        )}
      </div>
    </>
  )
}
