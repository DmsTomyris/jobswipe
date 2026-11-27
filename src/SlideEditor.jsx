import React, { useState } from 'react'
import { Check, Plus, Trash2, Video } from 'lucide-react'
import { PageHeader } from './Discover'
import { emptySlide, themes } from './data'
import { SlideDeck, SlideList, useSlideVideo } from './SlideDeck'
import { writeVideo } from './storage'

export default function SlideEditor({ account, slides, replaceSlides, uploadedVideos, onVideo }) {
  const [index, setIndex] = useState(0)
  const [videoBusy, setVideoBusy] = useState(false)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const video = useSlideVideo(account, uploadedVideos)
  const slide = slides[index]

  function save(nextSlides) {
    const success = replaceSlides(nextSlides)
    setError(success ? '' : 'Der Browser konnte die Änderungen nicht dauerhaft speichern.')
    setStatus(success ? 'Änderungen gespeichert' : '')
  }

  function update(field, value) {
    save(slides.map((item, position) => position === index ? { ...item, [field]: value } : item))
  }

  function add() {
    save([...slides, emptySlide()])
    setIndex(slides.length)
  }

  function remove() {
    save(slides.filter((item, position) => position !== index))
    setIndex(Math.min(index, slides.length - 2))
  }

  async function saveVideo(file) {
    if (file && (!['video/mp4', 'video/webm'].includes(file.type) || !file.size || file.size > 25 * 1024 * 1024)) {
      setStatus('')
      setError('Wähle ein MP4- oder WebM-Video bis 25 MB.')
      return
    }
    setVideoBusy(true)
    setError('')
    setStatus('')
    try {
      await writeVideo(account.id, file)
      onVideo(account.id, file)
      setStatus(file ? 'Video gespeichert' : 'Video entfernt')
    } catch {
      setError('Das Video konnte im Browser nicht gespeichert werden.')
    } finally {
      setVideoBusy(false)
    }
  }

  return (
    <>
      <PageHeader title="Meine Slides" text="Gestalte dein Profil so, wie Recruiter es sehen." />
      <div className="editor-grid">
        <div className="editor-preview">
          <div className="section-label"><span>Slide-Vorschau</span><span>Slide {index + 1} / {slides.length}</span></div>
          <SlideDeck slides={slides} index={index} select={setIndex} video={video} />
          <section className="editor-slides" aria-label="Meine Slides">
            <p className="section-label">Meine Slides</p>
            <SlideList slides={slides} index={index} select={setIndex} video={video} arrows />
            {slides.length < 4 ? <button className="button add-slide" type="button" onClick={add}><Plus />Slide hinzufügen</button> : null}
          </section>
        </div>
        <section className="editor-panel">
          <h2>Slide bearbeiten</h2>
          <label>Name der Slide<input value={slide.label} maxLength={36} onChange={(event) => update('label', event.target.value)} /></label>
          <label>Überschrift<input value={slide.title} maxLength={52} onChange={(event) => update('title', event.target.value)} /></label>
          <label>Text<textarea value={slide.text} maxLength={160} rows={3} onChange={(event) => update('text', event.target.value)} /></label>
          <fieldset>
            <legend>Design</legend>
            <div className="swatches">
              {Object.entries(themes).map(([theme, name]) => (
                <button key={theme} type="button" className={`swatch theme-${theme}`} aria-label={name}
                  aria-pressed={slide.theme === theme} onClick={() => update('theme', theme)} />
              ))}
            </div>
          </fieldset>
          {index === 0 ? (
            <div className="editor-video">
              <span>Introvideo <span className="optional">(optional)</span></span>
              <label className={`button upload-button${videoBusy ? ' busy' : ''}`}>
                <Video size={20} />{videoBusy ? 'Video wird gespeichert …' : video ? 'Video ersetzen' : 'Video hinzufügen'}
                <input type="file" accept="video/mp4,video/webm" disabled={videoBusy}
                  onChange={(event) => {
                    const file = event.target.files[0]
                    event.target.value = ''
                    if (file) void saveVideo(file)
                  }} />
              </label>
              {video ? <button type="button" className="text-button" disabled={videoBusy} onClick={() => saveVideo(null)}>Video entfernen</button> : null}
              <p>MP4 oder WebM · bis 25 MB</p>
            </div>
          ) : null}
          <details className="extra-fields">
            <summary>Vorspann und Stichworte</summary>
            <div className="compact-fields">
              <label>Vorspann<input value={slide.eyebrow} maxLength={32} onChange={(event) => update('eyebrow', event.target.value)} /></label>
              <div className="tag-fields" role="group" aria-label="Stichworte">
                {[0, 1].map((position) => (
                  <label key={position}>Stichwort {position + 1}<input value={slide.tags[position] || ''} maxLength={24} onChange={(event) => {
                    const tags = [slide.tags[0] || '', slide.tags[1] || '']
                    tags[position] = event.target.value
                    update('tags', tags)
                  }} /></label>
                ))}
              </div>
            </div>
          </details>
          {index > 0 && slides.length > 3 ? <button className="text-button remove-slide" type="button" onClick={remove}><Trash2 size={17} />Slide entfernen</button> : null}
          {error ? <p className="save-error" role="alert">{error}</p> : null}
          <div className={`save-status${status ? ' saved' : ''}`} role="status">{status ? <><Check size={20} />{status}</> : 'Änderungen werden automatisch gespeichert.'}</div>
        </section>
      </div>
    </>
  )
}
