import React, { useRef, useState } from 'react'
import { ChevronRight, Compass, Heart, Layers3 } from 'lucide-react'
import { accounts, matchesFor } from './data'
import Discover, { PageHeader } from './Discover'
import SlideEditor from './SlideEditor'
import { readDemo, writeDemo } from './storage'

const tabs = [
  { id: 'discover', label: 'Entdecken', icon: Compass },
  { id: 'matches', label: 'Matches', icon: Heart },
  { id: 'slides', label: 'Meine Slides', icon: Layers3 },
]

function AccountMark({ account }) {
  const initial = account.id === 'hahn' ? 'H' : account.name[0]
  return <span className={`account-mark soft-${account.theme}`} aria-hidden="true">{initial}</span>
}

function Sidebar({ account, page, chooseAccount, choosePage, matchCount }) {
  return (
    <aside className="sidebar">
      <button className="brand" type="button" onClick={() => choosePage('discover')} aria-label="JobSwipe – Entdecken">
        <img src="/favicon.svg" alt="" width="48" height="48" />
        <span>jobswipe<span className="brand-dot">.</span></span>
      </button>
      <label className="mobile-account">
        <span className="sr-only">Testaccount wechseln</span>
        <select value={account.id} onChange={(event) => chooseAccount(event.target.value)}>
          <optgroup label="Recruiter">{accounts.slice(0, 2).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</optgroup>
          <optgroup label="Bewerber">{accounts.slice(2).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</optgroup>
        </select>
      </label>
      <nav className="navigation" aria-label="Hauptnavigation">
        {tabs.filter((tab) => tab.id !== 'slides' || !('job' in account)).map(({ id, label, icon: Icon }) => (
          <button key={id} type="button" aria-current={id === page ? 'page' : undefined} onClick={() => choosePage(id)}>
            <Icon size={26} aria-hidden="true" /><span>{label}</span>
            {id === 'matches' && matchCount ? <span className="match-count">{matchCount}</span> : null}
          </button>
        ))}
      </nav>
      <div className="account-section">
        <p>Testaccounts</p>
        {accounts.map((item) => (
          <button className="account-button" key={item.id} type="button" aria-pressed={item.id === account.id}
            onClick={() => chooseAccount(item.id)}>
            <AccountMark account={item} />
            <span className="account-info"><strong>{item.name}</strong><span>{item.role}</span></span>
            <ChevronRight size={21} className="account-arrow" aria-hidden="true" />
          </button>
        ))}
      </div>
      <p className="prototype"><span aria-hidden="true" />Lokaler Prototyp</p>
    </aside>
  )
}

function Matches({ account, matches, onDiscover }) {
  const isRecruiter = 'job' in account
  return (
    <>
      <PageHeader title="Matches" text="Hier findest du alle Profile, bei denen das Interesse gegenseitig ist." />
      {matches.length ? (
        <section className="matches-list" aria-label="Gegenseitige Matches">
          {matches.map((other) => (
            <article className="match-card" key={other.id}>
              <AccountMark account={other} />
              <div><h2>{isRecruiter ? other.name : other.title}</h2><p>{isRecruiter ? `${account.job} · ${other.subtitle}` : `${other.organization} · ${other.meta}`}</p></div>
              <span><Heart size={18} /> Match</span>
            </article>
          ))}
        </section>
      ) : (
        <section className="empty-state">
          <span className="empty-icon"><Heart size={32} /></span>
          <h2>Noch keine Matches</h2>
          <p>Ein Match erscheint hier, sobald ihr beide auf Interesse tippt.</p>
          <button className="button primary small" type="button" onClick={onDiscover}>Weiter entdecken</button>
        </section>
      )}
    </>
  )
}

export default function App() {
  const [demo, setDemo] = useState(readDemo)
  const currentDemo = useRef(demo)
  const [page, setPage] = useState('discover')
  const [notice, setNotice] = useState('')
  const [uploadedVideos, setUploadedVideos] = useState({})
  const [storageError, setStorageError] = useState(false)
  const account = accounts.find((item) => item.id === demo.accountId) || accounts[0]
  const matches = matchesFor(account, demo.votes)

  function commit(change) {
    const next = change(currentDemo.current)
    currentDemo.current = next
    setDemo(next)
    const success = writeDemo(next)
    setStorageError(!success)
    return success
  }

  function choosePage(next) {
    setNotice('')
    setPage(next)
  }

  function chooseAccount(id) {
    if (id === account.id) return
    commit((previous) => ({ ...previous, accountId: id }))
    choosePage('discover')
  }

  function chooseVote(profile, vote) {
    const { votes } = currentDemo.current
    if (votes[account.id]?.[profile.id]) return
    commit((previous) => ({
      ...previous,
      votes: { ...previous.votes, [account.id]: { ...previous.votes[account.id], [profile.id]: vote } },
    }))
    setNotice(vote === 'like' && votes[profile.id]?.[account.id] === 'like' ? profile.name : '')
  }

  function resetVotes() {
    commit((previous) => ({ ...previous, votes: { ...previous.votes, [account.id]: {} } }))
    setNotice('')
  }

  return (
    <div className="app-shell">
      <Sidebar account={account} page={page} chooseAccount={chooseAccount} choosePage={choosePage} matchCount={matches.length} />
      <main className="workspace">
        {storageError ? <p className="save-error" role="alert">Dein Browser lässt das dauerhafte Speichern der Demo-Daten gerade nicht zu.</p> : null}
        {page === 'matches' ? <Matches account={account} matches={matches} onDiscover={() => choosePage('discover')} /> : null}
        {page === 'slides' ? (
          <SlideEditor key={account.id} account={account} slides={demo.edits[account.id] || account.slides}
            uploadedVideos={uploadedVideos} onVideo={(id, file) => setUploadedVideos((existing) => ({ ...existing, [id]: file }))}
            replaceSlides={(slides) => commit((previous) => ({ ...previous, edits: { ...previous.edits, [account.id]: slides } }))} />
        ) : null}
        {page === 'discover' ? (
          <Discover key={account.id} account={account} votes={demo.votes} edits={demo.edits} uploadedVideos={uploadedVideos}
            notice={notice} onVote={chooseVote} onReset={resetVotes} openMatches={() => choosePage('matches')} />
        ) : null}
      </main>
    </div>
  )
}
