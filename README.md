# JobSwipe

Öffentliche, für Smartphones gestaltete Hochformat-Webapp mit drei fiktiven Bewerber:innen und zwei Recruiter-Testaccounts. Selbst gestaltete Slides zeigen, wie Bewerber:innen arbeiten. Gegenseitiges Interesse erzeugt ein Match.

## Webapp öffnen

**[JobSwipe öffnen](https://dmstomyris.github.io/jobswipe/)**

Die Webapp wird nach Änderungen am Branch `main` automatisch auf GitHub Pages veröffentlicht.

## Demo ausprobieren

| Testaccount | Rolle |
| --- | --- |
| Prof. Dr. Hahn | Sucht Tutor:innen für Statistik an der Universität Lindenstadt. |
| Studio Nord | Sucht Werkstudierende für Data & Research. |
| Mila Weber | Zeigt eine Statistik-Arbeitsprobe und eine Tutoriumsidee. |
| Jonas Kaya | Zeigt ein Datenprojekt und ein achtsekündiges Introvideo. |
| Lea Fischer | Stellt einen Prototyp für digitale Lehre vor. |

1. Im Account **Prof. Dr. Hahn** Mila ansehen und **Interesse** wählen.
2. Zu **Mila Weber** wechseln und bei der Stelle **Tutor:in für Statistik** ebenfalls **Interesse** wählen. Das Match erscheint unter **Matches** in beiden Accounts.
3. Als Bewerber:in unter **Meine Slides** Texte, Stichworte und Design ändern oder eine vierte Slide ergänzen. Auf der ersten Slide ist optional ein eigenes MP4- oder WebM-Video bis 25 MB möglich.

Auf Smartphones wechselst du mit einem Wisch nach links oder rechts zwischen Profilen und Slides. Am Computer funktionieren die Pfeiltasten sowie die Schaltflächen **Weiter** und **Interesse**. Sind alle Profile bewertet, lassen sich die Bewertungen für den Testaccount zurücksetzen.

Personen, Stellen und Organisationen sind frei erfundene Demodaten. Bewertungen und geänderte Slide-Texte werden im jeweiligen Browser gespeichert. Hochgeladene Videos bleiben lokal in IndexedDB und werden nicht veröffentlicht.

## App lokal starten

Voraussetzung ist Node.js 24 oder neuer mit npm.

```sh
git clone https://github.com/DmsTomyris/jobswipe.git
cd jobswipe
npm ci
npm run dev
```

Öffne `http://localhost:5173`. Die Entwicklungsserver-Adresse aus dem Terminal lässt sich auch auf einem Smartphone im selben WLAN öffnen.

Mit `npm run build` wird der Produktionsbuild erzeugt. Mit `npm run preview` kannst du ihn lokal ansehen.

## Mitarbeit am öffentlichen Repository

Das [GitHub-Repository](https://github.com/DmsTomyris/jobswipe) ist öffentlich. Jede Person kann den Code ansehen und klonen. GitHub-Schreibrechte sind nicht erforderlich, um einen Fork anzulegen und Änderungen vorzuschlagen.

Für Änderungen zuerst **Fork** wählen und anschließend einen Branch erstellen. Nach der lokalen Prüfung mit `npm run build` einen Pull Request zum Branch `main` dieses Repositories öffnen. GitHub Actions prüft den Build automatisch. Eine Änderung wird nach dem Review und dem Zusammenführen über Pages veröffentlicht.

Beispiele und Demo-Stellen stehen in `src/data.js`. Der Demo-Zustand wird in `src/storage.js` verwaltet. Committe bitte keine echten Personen- oder Zugangsdaten.
