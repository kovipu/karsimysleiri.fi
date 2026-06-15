export const site = {
  hero: {
    title: "Kärsimysleiri",
    dates: "7.–9.8.2026",
    location: "Rusko, Suomi",
    tagline: "Omavarainen gravel-ultra Vahdon metsästä.",
  },

  about: [
    "Kärsimysleiri on omavarainen pitkän matkan gravel-tapahtuma elokuun ensimmäisenä viikonloppuna. Lähtö ja maali sijaitsevat Vahdon metsästysmajalla Ruskolla.",
    "Tapahtuma ei ole kilpailu. Se on yhteinen viikonloppu pitkien hiekkateiden, pohjoismaisen kesäyön ja sen valossa testattujen rajojen äärellä. Jokainen ajaa omaa matkaansa, omaan tahtiinsa.",
  ],

  routes: [
    {
      id: "iso",
      name: "Iso kärsimys",
      km: 450,
      ascent: "TBA",
      description:
        "Kolmesta reitistä raskain. Kahden vuorokauden urakka, joka kiertää laajasti Varsinais-Suomen ja Satakunnan sorateiden parhaat osuudet.",
    },
    {
      id: "keski",
      name: "Keskimmäinen",
      km: 300,
      ascent: "TBA",
      description:
        "Klassinen ultramatka. Kovavauhtisille yhden vuorokauden suoritus, rauhallisemmille kaksi päivää maisemia ja metsää.",
    },
    {
      id: "pikku",
      name: "Pikku kärsimys",
      km: 200,
      ascent: "TBA",
      description:
        "Lyhyin vaihtoehto — silti pitkä päivä satulassa. Hyvä sisäänajo ultratapahtumiin tai täysipäiväinen kärsimys omaan tahtiin.",
    },
  ],

  included: {
    yes: [
      "Kisakeskus Vahdon metsästysmajalla",
      "Hiilarivoittoinen ateria maalissa",
      "Juomat",
      "Sauna",
      "Nukkumamahdollisuus maalissa",
    ],
    no: [
      "Kuljetus paikalle",
      "Reitin huolto tai tarkistuspisteet",
      "Ruoka ja juoma matkalla",
      "Varaosat ja varusteet",
    ],
  },

  practical: [
    {
      title: "Lähtö",
      body: "Lähtöajat ja tarkat porrastukset reittikohtaisesti ilmoitetaan lähempänä tapahtumaa. Kaikki lähdöt Vahdon metsästysmajalta.",
    },
    {
      title: "Mitä mukaan",
      body: "Toimiva polkupyörä, riittävä valaistus, navigointiin sopiva laite, omat huoltotarvikkeet ja varusteet vaihteleviin keliolosuhteisiin. Yön yli kestävillä reiteillä myös valaisin ja heijastimet ovat pakolliset.",
    },
    {
      title: "Reitit ja navigointi",
      body: "GPX-tiedostot toimitetaan ilmoittautuneille hyvissä ajoin ennen tapahtumaa. Reitit kulkevat pääosin sora- ja metsäautoteillä, paikoin myös vähäliikenteisillä päällystetyillä osuuksilla.",
    },
    {
      title: "Pysäköinti",
      body: "Vahdon metsästysmajalla on pysäköintimahdollisuus tapahtuman ajaksi.",
    },
    {
      title: "Sää",
      body: "Elokuun alku Lounais-Suomessa: päivisin yleensä lämmin, öisin viileä. Sade on aina mahdollinen — varustaudu sen mukaisesti.",
    },
  ],

  faq: [
    {
      q: "Kenelle Kärsimysleiri on?",
      a: "Aikuisille pyöräilijöille, jotka tietävät mihin ryhtyvät. Tapahtuma on omavarainen ja matkat ovat pitkiä — itsenäinen huolto ja kohtuullinen kokemus pitkistä ajoista ovat välttämättömyyksiä.",
    },
    {
      q: "Millainen pyörä reiteille tarvitaan?",
      a: "Gravel- tai cyclocross-pyörä on luontevin valinta. Maastopyörä toimii. Maantiepyörä ei sovellu — alustana on pääosin soraa.",
    },
    {
      q: "Voiko reitin keskeyttää?",
      a: "Voi. Tapahtuma ei ole kilpailu eikä keskeyttämisestä seuraa mitään. Ilmoita keskeytyksestä järjestäjälle, jotta tiedämme sinun olevan turvassa.",
    },
    {
      q: "Onko aikarajaa?",
      a: "Maali sulkeutuu sunnuntai-iltana. Tarkat aikarajat reittikohtaisesti ilmoitetaan lähempänä tapahtumaa.",
    },
    {
      q: "Voiko tulla katsomaan tai kannustamaan?",
      a: "Maalialueella Vahdon metsästysmajalla saa toki käydä. Reitin varrella ei ole virallisia katsomopaikkoja.",
    },
  ],

  registration: {
    status: "tulossa",
    note: "Ilmoittautuminen avautuu myöhemmin. Tiedot päivittyvät tänne.",
  },

  organizer: {
    name: "Kärsimysleirin järjestäjä",
    contact: "Yhteystiedot päivittyvät pian.",
  },
} as const;

export type SiteContent = typeof site;
