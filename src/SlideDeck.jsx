import React, { useEffect, useRef, useState } from 'react'
import { AlignLeft, BarChart3, BriefcaseBusiness, ChevronLeft, ChevronRight, GraduationCap, Play, Video } from 'lucide-react'
import { readVideo } from './storage'

export const icons = {
  text: AlignLeft,
  chart: BarChart3,
  study: GraduationCap,
  video: Video,
  work: BriefcaseBusiness,
}

export function useSlideVideo(profile, uploadedVideos) {
  const saved = uploadedVideos[profile.id]
  const [stored, setStored] = useState(undefined)
  const [objectUrl, setObjectUrl] = useState('')

  useEffect(() => {
    if ('job' in profile || saved !== undefined) return
    let active = true
    readVideo(profile.id).then((file) => {
      if (active) setStored(file)
    }).catch(() => {})
    return () => { active = false }
  }, [profile, saved])

  const file = saved === undefined ? stored : saved
  useEffect(() => {
    if (!file) return
    const url = URL.createObjectURL(file)
    setObjectUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  if (file === undefined) return profile.demoVideo
  return file ? objectUrl : undefined
}

function Orbit() {
  return (
    <svg className="orbit" viewBox="0 0 286 250" fill="none" aria-hidden="true">
      <g transform="rotate(-23 143 125)" stroke="currentColor" strokeWidth="1.3">
        <ellipse cx="143" cy="125" rx="115" ry="83" />
        <ellipse cx="143" cy="125" rx="81" ry="55" />
        <circle cx="225" cy="67" r="5.8" fill="currentColor" />
        <circle cx="91" cy="82" r="5.8" fill="currentColor" />
        <circle cx="161" cy="207" r="5.8" fill="currentColor" />
      </g>
      <path d="M12 28h24M24 16v24M250 33h22m-11-11v22M42 218h20m-10-10v20" stroke="currentColor" strokeWidth="1" />
      <path d="M24 20l1.2 6.8L32 28l-6.8 1.2L24 36l-1.2-6.8L16 28l6.8-1.2zM261 26l1 6 6 1-6 1-1 6-1-6-6-1 6-1zM52 211l1 6 6 1-6 1-1 6-1-6-6-1 6-1z" fill="currentColor" />
    </svg>
  )
}

function Slide({ slide, video }) {
  const [playing, setPlaying] = useState(false)
  const hasVideo = Boolean(video)
  const tags = slide.tags.filter((tag) => tag.trim())

  return (
    <div className={`slide theme-${slide.theme}${hasVideo ? ' has-video' : ''}`}>
      {playing && hasVideo ? (
        <video aria-label="Introvideo" src={video} controls autoPlay playsInline onError={() => setPlaying(false)} />
      ) : (
        <>
          <Orbit />
          <div className="slide-copy">
            {slide.eyebrow ? <p className="slide-eyebrow">{slide.eyebrow}</p> : null}
            <h2 className={slide.title.length > 24 ? 'long-title' : ''}>{slide.title || 'Deine Überschrift'}</h2>
            {slide.text ? <p className="slide-text">{slide.text}</p> : null}
            {tags.length ? <ul className="slide-tags">{tags.map((tag, index) => <li key={index}>{tag}</li>)}</ul> : null}
            {hasVideo ? <button className="video-play" type="button" onClick={() => setPlaying(true)}><Play size={16} /> Intro abspielen</button> : null}
          </div>
        </>
      )}
    </div>
  )
}

export function SlideDeck({ slides, index, select, video, identity, onSwipe }) {
  const slide = slides[index]
  const pointer = useRef(null)
  const [offset, setOffset] = useState(0)

  function pointerDown(event) {
    if (!onSwipe || !event.isPrimary || event.button !== 0 || event.target.closest('button, video')) return
    pointer.current = { id: event.pointerId, x: event.clientX, y: event.clientY }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function pointerMove(event) {
    const start = pointer.current
    if (start?.id !== event.pointerId) return
    const distance = event.clientX - start.x
    if (Math.abs(distance) > Math.abs(event.clientY - start.y)) setOffset(distance)
  }

  function pointerEnd(event) {
    const start = pointer.current
    if (start?.id !== event.pointerId) return
    pointer.current = null
    setOffset(0)
    const distance = event.clientX - start.x
    if (event.type === 'pointerup' && Math.abs(distance) > 75 && Math.abs(distance) > Math.abs(event.clientY - start.y)) {
      onSwipe(distance > 0 ? 'like' : 'pass')
    }
  }

  return (
    <div className="deck-card">
      <div className="progress" aria-label="Slide-Navigation">
        {slides.map((item, position) => (
          <button key={position} type="button" className={position === index ? 'current' : position < index ? 'seen' : ''}
            aria-label={`Slide ${position + 1} anzeigen`} aria-current={position === index ? 'true' : undefined}
            onClick={() => select(position)} />
        ))}
      </div>
      <div className={`slide-frame${onSwipe ? ' swipeable' : ''}`}
        onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerEnd}
        onPointerCancel={pointerEnd} onLostPointerCapture={pointerEnd}
        style={offset ? { transform: `translateX(${offset * .32}px) rotate(${offset * .045}deg)` } : undefined}>
        <Slide key={index} slide={slide} video={index === 0 ? video : undefined} />
        <button className="slide-arrow previous" type="button" aria-label="Vorherige Slide" disabled={index === 0} onClick={() => select(index - 1)}><ChevronLeft size={25} /></button>
        <button className="slide-arrow next" type="button" aria-label="Nächste Slide" disabled={index === slides.length - 1} onClick={() => select(index + 1)}><ChevronRight size={25} /></button>
      </div>
      {identity ? (
        <div className="deck-identity">
          <div><h2>{identity.name}</h2><p>{identity.subtitle}</p></div>
          <span>Slide {index + 1} / {slides.length}</span>
        </div>
      ) : null}
    </div>
  )
}

export function SlideList({ slides, index, select, video, arrows = false }) {
  return (
    <div className="slide-list">
      {slides.map((slide, position) => {
        const Icon = position === 0 && video ? Video : icons[slide.icon] || AlignLeft
        return (
          <button key={position} className="slide-list-button" type="button" aria-pressed={index === position} onClick={() => select(position)}>
            <span className={`thumbnail soft-${slide.theme}`}><Icon size={30} strokeWidth={2.2} /></span>
            <span>{slide.label || `Slide ${position + 1}`}</span>
            {arrows ? <ChevronRight className="list-arrow" size={22} aria-hidden="true" /> : null}
          </button>
        )
      })}
    </div>
  )
}
