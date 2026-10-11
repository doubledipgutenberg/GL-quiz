# CourseCard

Step 1 of the welcome wizard (*Was übst du?*): one big card per course with the city scene, a handwritten kicker over a display word, and the subject + grade pills.

- French (`lang: 'fr'`) → `data-course="fr"`, `paris-scene`, *Vivre à* / **PARIS**. English (`lang: 'en'`) → `data-course="en"`, `london-scene`, *Living in* / **LONDON**. Englisch 5 uses the same London card with *Klasse 5*.
- The whole card is the button; pressing it sinks into its shadow.
- A course with no content yet gets the dashed, shadowless treatment of a disabled Choice and the line *Inhalte kommen bald*.
- From here on, set `data-course` on the app's root so every screen draws in that pen.
