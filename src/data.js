export const themes = {
  violet: 'Violett',
  mint: 'Mint',
  sand: 'Sand',
  sky: 'Blau',
  rose: 'Rosa',
}

function slide(label, eyebrow, title, text, theme, icon, tags = []) {
  return { label, eyebrow, title, text, theme, icon, tags }
}

export const candidates = [
  {
    id: 'mila', name: 'Mila Weber', short: 'Mila', role: 'Tutorin Statistik',
    subtitle: 'Psychologie · 5. Semester', theme: 'violet',
    slides: [
      slide('Über mich', 'HI, ICH BIN', 'Mila Weber.', 'Ich mache Statistik verständlich.', 'violet', 'text', ['B.Sc. Psychologie', 'Tutorien & Didaktik']),
      slide('Meine Arbeitsprobe', 'ARBEITSPROBE', 'Was zeigt die Streuung?', 'Zwei Datensätze, gleicher Mittelwert. Ein interaktives Diagramm macht den Unterschied sichtbar.', 'mint', 'chart', ['R · ggplot2', 'Daten erklären']),
      slide('Mein erstes Tutorium', 'UNTERRICHTSIDEE', 'Hypothesen testen.', 'Wir schätzen zuerst selbst und prüfen dann gemeinsam an Beispieldaten, was ein p-Wert aussagt.', 'sand', 'study', ['Kleingruppen', 'Statistik I']),
    ],
  },
  {
    id: 'jonas', name: 'Jonas Kaya', short: 'Jonas', role: 'Werkstudent Data',
    subtitle: 'Wirtschaftsinformatik · 4. Semester', theme: 'sand',
    demoVideo: '/media/jonas-intro.mp4',
    slides: [
      slide('Über mich', 'HI, ICH BIN', 'Jonas Kaya.', 'Ich mache aus Rohdaten Entscheidungen.', 'sand', 'text', ['Python & SQL', 'Datenanalyse']),
      slide('Mein Datenprojekt', 'ARBEITSPROBE', 'Wann wird es voll?', 'Mein Dashboard zeigt aus offenen Verkehrsdaten, wann sich Auslastungsspitzen an drei Haltestellen bilden.', 'sky', 'chart', ['Pandas', 'Datenvisualisierung']),
      slide('So arbeite ich', 'ZUSAMMENARBEIT', 'Fragen vor Filtern.', 'Ich kläre zuerst, welche Entscheidung ansteht, und gehe dann mit einem kleinen Prototyp ins Feedback.', 'mint', 'text', ['Teamarbeit', '12–16 Std. / Woche']),
    ],
  },
  {
    id: 'lea', name: 'Lea Fischer', short: 'Lea', role: 'Stud. Mitarbeiterin',
    subtitle: 'Medieninformatik · 3. Semester', theme: 'sky',
    slides: [
      slide('Über mich', 'HI, ICH BIN', 'Lea Fischer.', 'Ich gestalte digitale Lernmomente.', 'sky', 'text', ['Medieninformatik', 'UX & Lehre']),
      slide('Mein Prototyp', 'ARBEITSPROBE', 'Lernen in kleinen Schritten.', 'Für ein Lernquiz im Uni-Seminar habe ich Aufgaben mit direktem Feedback und kurzen Erklärungen entworfen.', 'rose', 'chart', ['Interaktionsdesign', 'Figma']),
      slide('Was ich mitbringe', 'ZUSAMMENARBEIT', 'Feedback in die nächste Runde.', 'Vier Testpersonen fanden die Navigation unklar. Ich habe die Rücksprünge neu gestaltet und erneut getestet.', 'mint', 'study', ['Usability-Tests', 'Prototyping']),
    ],
  },
]

export const recruiters = [
  {
    id: 'hahn', name: 'Prof. Dr. Hahn', short: 'Hahn', role: 'Lehrstuhl Statistik',
    theme: 'violet', job: 'Tutor:in · Statistik', title: 'Tutor:in für Statistik',
    organization: 'Universität Lindenstadt', meta: '6 Std. / Woche · Am Campus', icon: 'study',
    slides: [
      slide('Die Stelle', 'LEHRSTUHL STATISTIK', 'Statistik weitergeben.', 'Begleite Erstsemester dabei, statistische Fragen selbstständig zu lösen.', 'violet', 'study', ['Statistik I', '6 Std. / Woche']),
      slide('Deine Aufgaben', 'IM TUTORIUM', 'Üben, erklären, begleiten.', 'Du leitest eine Übungsgruppe, bereitest Beispiele vor und besprichst typische Denkfehler im Team.', 'mint', 'text', ['Wöchentlich', 'Kleingruppen']),
      slide('Das bringst du mit', 'DEIN PROFIL', 'Didaktik trifft Daten.', 'Du hast Statistik I abgeschlossen und erklärst gern anhand konkreter Beispiele. Erste Erfahrung mit R hilft.', 'sand', 'chart', ['Statistik I', 'R willkommen']),
    ],
  },
  {
    id: 'studio', name: 'Studio Nord', short: 'Studio Nord', role: 'HR & Recruiting',
    theme: 'mint', job: 'Werkstudent:in · Data', title: 'Werkstudent:in Data & Research',
    organization: 'Studio Nord', meta: '12–16 Std. / Woche · Hybrid', icon: 'work',
    slides: [
      slide('Die Stelle', 'STUDIO NORD', 'Daten für bessere Produkte.', 'Unterstütze unser Research-Team dabei, aus Nutzungsdaten konkrete Ideen fürs Produkt abzuleiten.', 'mint', 'work', ['12–16 Std. / Woche', 'Hybrid']),
      slide('Deine Aufgaben', 'IM TEAM', 'Vom Signal zur Frage.', 'Du verknüpfst Umfragedaten mit Produktkennzahlen und bereitest Ergebnisse für unser Designteam auf.', 'sky', 'chart', ['SQL', 'Research']),
      slide('Das bringst du mit', 'DEIN PROFIL', 'Neugier & ein gutes Auge.', 'Du hast erste Erfahrung mit SQL oder Python, kannst deine Analysen erklären und hast Lust auf kleine Experimente.', 'rose', 'text', ['Python oder SQL', 'Teamarbeit']),
    ],
  },
]

export const accounts = [...recruiters, ...candidates]

export function matchesFor(account, votes) {
  const recruiter = 'job' in account
  const options = recruiter ? candidates : recruiters
  return options.filter((other) => votes[account.id]?.[other.id] === 'like' && votes[other.id]?.[account.id] === 'like')
}

export function emptySlide() {
  return slide('Neue Slide', '', '', '', 'violet', 'text')
}
