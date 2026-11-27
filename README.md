# JobSwipe

JobSwipe ist ein lokaler Prototyp für die Jobsuche per Swipe. Bewerber:innen zeigen, wie sie arbeiten, in drei oder vier selbst gestalteten Slides. Recruiter:innen sichten diese Slides. Bewerber:innen bewerten auf dieselbe Weise die offenen Stellen. Bei gegenseitigem Interesse entsteht ein Match.

## Lokal starten

Voraussetzung ist Node.js 24 LTS mit npm.

```sh
git clone https://github.com/DmsTomyris/jobswipe.git
cd jobswipe
npm ci
npm run dev
```

Öffne [http://localhost:5173](http://localhost:5173). Der Produktionsbuild lässt sich mit `npm run build` prüfen und mit `npm run preview` lokal ansehen.

## Demo ausprobieren

| Testaccount | Rolle |
| --- | --- |
| Prof. Dr. Hahn | Sucht Tutor:innen für Statistik an der Universität Lindenstadt. |
| Studio Nord | Sucht Werkstudierende für Data & Research. |
| Mila Weber | Zeigt eine Statistik-Arbeitsprobe und eine Tutoriumsidee. |
| Jonas Kaya | Zeigt ein Datenprojekt und ein achtsekündiges Introvideo. |
| Lea Fischer | Stellt einen Prototyp aus der digitalen Lehre vor. |

1. Im Startaccount **Prof. Dr. Hahn** Milas Slides ansehen und **Interesse** wählen.
2. Zu **Mila Weber** wechseln und auf der Stelle **Tutor:in für Statistik** ebenfalls **Interesse** wählen. Das Match erscheint unter **Matches** in beiden Accounts.
3. Als Bewerber:in **Meine Slides** öffnen. Texte, Stichworte und Design ändern oder eine vierte Slide hinzufügen. Auf der ersten Slide lässt sich optional ein MP4- oder WebM-Video bis 25 MB einbinden.

Die Pfeile an der Slide wechseln die Folie. Zum Bewerten auf der Slide nach links oder rechts wischen, die Pfeiltasten verwenden oder **Weiter** beziehungsweise **Interesse** wählen. Sind alle Profile bewertet, lassen sich die Bewertungen des aktiven Testaccounts zurücksetzen.

Alle Personen, Stellen und Organisationen der Demo sind fiktiv. Testaccounts sind ohne Anmeldung auswählbar. Bewertungen und Slide-Texte werden lokal im Browser gespeichert, hochgeladene Videos liegen in IndexedDB. Andere Browser und Geräte starten mit einer eigenen Demo.

## Zusammenarbeiten

Das [private GitHub-Repository](https://github.com/DmsTomyris/jobswipe) kann über die [Zugriffsverwaltung](https://github.com/DmsTomyris/jobswipe/settings/access) für weitere GitHub-Konten freigegeben werden. Eingeladene Mitglieder können nach Annahme der Einladung klonen.

Für Änderungen einen Branch von `main` erstellen, `npm run build` ausführen und einen Pull Request zu `main` öffnen. Die GitHub-Aktion prüft den Build bei Pull Requests und Pushes auf `main`. Beispiele und Stellen stehen in `src/data.js`, der Prototypzustand in `src/storage.js`. In Testprofilen und Commits nur fiktive Daten verwenden.
