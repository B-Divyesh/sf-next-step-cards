# Demo sandbox

Open <https://next-step-cards.sociobot.in/demo/>. It loads an active
community-grant-outline card and two realistic workshop-brief history entries.
The older `?demo=1` entry immediately redirects there before app content
renders or later home-page metadata is parsed.

Demo state uses the IndexedDB database `demo:next-step-cards`. Real cards use
`next-step-cards`; demo mode never reads or writes that database. **Reset demo**
replaces only the sample state. **Start for real** clears the demo database and
opens `/`; it does not copy or change sample data in real storage.

The demo is available offline after its first connected visit. The claim suite
uses this route and a fresh browser context for every declared claim.
