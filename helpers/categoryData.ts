


export const categories = [
  "Ubrania", "Buty", "Meble", "Akcesoria do domu", "Elektronika",
  "Książki", "Sport i rekreacja", "Kosmetyki", "Zabawki", "Biżuteria"
] as const;

export type Category = typeof categories[number];

export const subcategories: Record<Category, string[]> = {
  "Kosmetyki": ["Do włosów", "Do twarzy", "Do ciała", "Do makijażu", "Do paznokci"],
  "Ubrania": ["Koszulki", "Spodnie", "Sukienki", "Kurtki", "Bielizna"],
  "Buty": ["Sportowe", "Eleganckie", "Casualowe", "Zimowe", "Sandały"],
  "Meble": ["Do salonu", "Do sypialni", "Do kuchni", "Do biura", "Do ogrodu"],
  "Akcesoria do domu": ["Dekoracje", "Oświetlenie", "Tekstylia", "Przechowywanie", "Kuchenne"],
  "Elektronika": ["Smartfony", "Laptopy", "Telewizory", "Audio", "Akcesoria"],
  "Książki": ["Beletrystyka", "Kryminały", "Fantastyka", "Biografie", "Poradniki"],
  "Sport i rekreacja": ["Fitness", "Sporty zimowe", "Sporty wodne", "Turystyka", "Rowery"],
  "Zabawki": ["Klocki", "Lalki", "Gry planszowe", "Zabawki edukacyjne", "Zabawki elektroniczne"],
  "Biżuteria": ["Naszyjniki", "Pierścionki", "Bransoletki", "Kolczyki", "Zegarki"]
};

export const questionsBySubcategory = {
  "Do włosów": [
    { question: "Typ włosów:", options: ["Proste", "Kręcone", "Falowane"] },
    { question: "Kolor włosów:", options: ["Blond", "Czarne", "Brązowe", "Siwe"] },
    { question: "Cel:", options: ["Nawilżanie", "Czyszczenie", "Regeneracja", "Stylizacja"] },
    { question: "Długość włosów:", options: ["Krótkie", "Średnie", "Długie"] }
  ],
  "Do twarzy": [
    { question: "Typ skóry:", options: ["Sucha", "Tłusta", "Mieszana", "Wrażliwa"] },
    { question: "Cel:", options: ["Nawilżanie", "Oczyszczanie", "Przeciwzmarszczkowe", "Rozjaśnianie"] },
    { question: "Rodzaj produktu:", options: ["Krem", "Serum", "Maska", "Tonik"] }
  ],
  "Do ciała": [
    { question: "Typ skóry ciała:", options: ["Sucha", "Normalna", "Wrażliwa"] },
    { question: "Cel:", options: ["Nawilżanie", "Ujędrnianie", "Złuszczanie", "Odżywianie"] },
    { question: "Rodzaj produktu:", options: ["Balsam", "Peeling", "Olejek", "Żel pod prysznic"] }
  ],
  "Do makijażu": [
    { question: "Rodzaj produktu:", options: ["Podkład", "Cień do powiek", "Szminka", "Tusz do rzęs"] },
    { question: "Odcień skóry:", options: ["Jasny", "Średni", "Ciemny"] },
    { question: "Typ makijażu:", options: ["Naturalny", "Wieczorowy", "Glamour"] }
  ],
  "Do paznokci": [
    { question: "Rodzaj produktu:", options: ["Lakier", "Odżywka", "Zmywacz", "Żel"] },
    { question: "Kolor:", options: ["Czerwony", "Nude", "Pastelowy", "Ciemny"] },
    { question: "Efekt:", options: ["Błyszczący", "Matowy", "Holograficzny"] }
  ],
  "Koszulki": [
    { question: "Rozmiar:", options: ["S", "M", "L", "XL"] },
    { question: "Rodzaj:", options: ["T-shirt", "Polo", "Longsleeve", "Koszula"] },
    { question: "Styl:", options: ["Klasyczny", "Sportowy", "Elegancki", "Vintage"] }
  ],
  "Spodnie": [
    { question: "Rodzaj:", options: ["Jeansy", "Chinosy", "Dresowe", "Eleganckie"] },
    { question: "Krój:", options: ["Slim fit", "Regular", "Straight", "Skinny"] },
    { question: "Długość:", options: ["Pełna", "7/8", "Krótkie"] }
  ],
  "Sukienki": [
    { question: "Długość:", options: ["Mini", "Midi", "Maxi"] },
    { question: "Okazja:", options: ["Codzienna", "Wieczorowa", "Biznesowa", "Plażowa"] },
    { question: "Krój:", options: ["Dopasowana", "Trapezowa", "Rozkloszowana", "Prosta"] }
  ],
  "Kurtki": [
    { question: "Sezon:", options: ["Zimowa", "Przejściowa", "Letnia"] },
    { question: "Styl:", options: ["Sportowa", "Elegancka", "Casual", "Motocyklowa"] },
    { question: "Materiał:", options: ["Skóra", "Denim", "Puch", "Wodoodporna"] }
  ],
  "Bielizna": [
    { question: "Rodzaj:", options: ["Biustonosz", "Majtki", "Bielizna nocna", "Bielizna modelująca"] },
    { question: "Materiał:", options: ["Bawełna", "Koronka", "Satyna", "Mikrofibra"] },
    { question: "Styl:", options: ["Sportowy", "Seksowny", "Komfortowy", "Bezszwowy"] }
  ],
  "Sportowe": [
    { question: "Dyscyplina:", options: ["Bieganie", "Trening", "Tenis", "Piłka nożna"] },
    { question: "Rodzaj podeszwy:", options: ["Amortyzująca", "Stabilizująca", "Do biegów terenowych"] },
    { question: "Poziom wsparcia:", options: ["Niskie", "Średnie", "Wysokie"] }
  ],
  "Eleganckie": [
    { question: "Rodzaj:", options: ["Mokasyny", "Oxfordy", "Derby", "Szpilki"] },
    { question: "Materiał:", options: ["Skóra", "Zamsz", "Lakierowane"] },
    { question: "Okazja:", options: ["Do pracy", "Na wesele", "Na co dzień", "Wieczorowe"] }
  ],
  "Casualowe": [
    { question: "Styl:", options: ["Sneakersy", "Slip-ony", "Espadryle", "Loafersy"] },
    { question: "Sezon:", options: ["Wiosna/Lato", "Jesień/Zima", "Całoroczne"] },
    { question: "Kolor:", options: ["Czarny", "Biały", "Kolorowe", "Pastelowe"] }
  ],
  "Zimowe": [
    { question: "Rodzaj:", options: ["Śniegowce", "Trapery", "Kozaki", "Botki"] },
    { question: "Ocieplenie:", options: ["Futro", "Kożuch", "Membrana", "Bez ocieplenia"] },
    { question: "Wodoodporność:", options: ["Tak", "Nie", "Częściowo"] }
  ],
  "Sandały": [
    { question: "Styl:", options: ["Rzymianki", "Japonki", "Klapki", "Sandały sportowe"] },
    { question: "Wysokość obcasa:", options: ["Płaskie", "Niski obcas", "Wysoki obcas"] },
    { question: "Okazja:", options: ["Na plażę", "Na co dzień", "Eleganckie"] }
  ],
  "Do salonu": [
    { question: "Rodzaj mebla:", options: ["Sofa", "Fotel", "Stolik kawowy", "Regał"] },
    { question: "Styl:", options: ["Nowoczesny", "Klasyczny", "Skandynawski", "Industrialny"] },
    { question: "Materiał:", options: ["Drewno", "Metal", "Szkło", "Tkanina"] }
  ],
  "Do sypialni": [
    { question: "Rodzaj mebla:", options: ["Łóżko", "Szafa", "Komoda", "Stolik nocny"] },
    { question: "Rozmiar łóżka:", options: ["Pojedyncze", "Podwójne", "Król"] },
    { question: "Materiał:", options: ["Drewno", "Metal", "Tapicerowane"] }
  ],
  "Do kuchni": [
    { question: "Rodzaj mebla:", options: ["Stół", "Krzesła", "Szafki kuchenne", "Wyspa kuchenna"] },
    { question: "Materiał blatu:", options: ["Drewno", "Granit", "Laminat", "Stal nierdzewna"] },
    { question: "Styl:", options: ["Nowoczesny", "Rustykalny", "Minimalistyczny"] }
  ],
  "Do biura": [
    { question: "Rodzaj mebla:", options: ["Biurko", "Fotel biurowy", "Regał na dokumenty", "Kontener"] },
    { question: "Ergonomia:", options: ["Standardowa", "Ergonomiczna", "Regulowana wysokość"] },
    { question: "Materiał:", options: ["Drewno", "Metal", "Szkło", "Plastik"] }
  ],
  "Do ogrodu": [
    { question: "Rodzaj mebla:", options: ["Stół ogrodowy", "Krzesła ogrodowe", "Leżak", "Huśtawka"] },
    { question: "Materiał:", options: ["Drewno", "Technorattan", "Metal", "Plastik"] },
    { question: "Odporność na warunki atmosferyczne:", options: ["Tak", "Nie", "Częściowo"] }
  ],
  "Dekoracje": [
    { question: "Rodzaj:", options: ["Obrazy", "Wazony", "Świeczniki", "Figurki"] },
    { question: "Styl:", options: ["Nowoczesny", "Rustykalny", "Minimalistyczny", "Boho"] },
    { question: "Materiał:", options: ["Ceramika", "Szkło", "Metal", "Drewno"] }
  ],
  "Oświetlenie": [
    { question: "Rodzaj:", options: ["Lampa wisząca", "Lampa stojąca", "Kinkiet", "Lampka biurkowa"] },
    { question: "Styl:", options: ["Nowoczesny", "Industrialny", "Klasyczny", "Skandynawski"] },
    { question: "Typ żarówki:", options: ["LED", "Halogen", "Żarówka tradycyjna", "Energooszczędna"] }
  ],
  "Tekstylia": [
    { question: "Rodzaj:", options: ["Zasłony", "Poduszki dekoracyjne", "Dywany", "Narzuty"] },
    { question: "Materiał:", options: ["Bawełna", "Len", "Aksamit", "Poliester"] },
    { question: "Wzór:", options: ["Jednolity", "Geometryczny", "Kwiatowy", "Abstrakcyjny"] }
  ],
  "Przechowywanie": [
    { question: "Rodzaj:", options: ["Szafa", "Komoda", "Regał", "Pojemniki"] },
    { question: "Materiał:", options: ["Drewno", "Metal", "Plastik", "Rattan"] },
    { question: "Przeznaczenie:", options: ["Do ubrań", "Do dokumentów", "Do zabawek", "Uniwersalne"] }
  ],
  "Kuchenne": [
    { question: "Rodzaj:", options: ["Garnki", "Patelnie", "Sztućce", "Naczynia"] },
    { question: "Materiał:", options: ["Stal nierdzewna", "Ceramika", "Szkło", "Silikon"] },
    { question: "Przeznaczenie:", options: ["Do gotowania", "Do serwowania", "Do przechowywania", "Do pieczenia"] }
  ],
  "Smartfony": [
    { question: "System operacyjny:", options: ["Android", "iOS"] },
    { question: "Rozmiar ekranu:", options: ["Mały (< 5,5\")", "Średni (5,5\" - 6,5\")", "Duży (> 6,5\")"] },
    { question: "Główna funkcja:", options: ["Aparat", "Wydajność", "Bateria", "Multimedia"] }
  ],
  "Laptopy": [
    { question: "Przeznaczenie:", options: ["Do pracy", "Do gier", "Uniwersalny", "Ultrabook"] },
    { question: "Rozmiar ekranu:", options: ["13\"", "15\"", "17\""] },
    { question: "System operacyjny:", options: ["Windows", "macOS", "Chrome OS"] }
  ],
  "Telewizory": [
    { question: "Technologia ekranu:", options: ["LED", "OLED", "QLED"] },
    { question: "Rozmiar ekranu:", options: ["32-43\"", "50-55\"", "65\" i więcej"] },
    { question: "Rozdzielczość:", options: ["Full HD", "4K", "8K"] }
  ],
  "Audio": [
    { question: "Rodzaj:", options: ["Słuchawki", "Głośniki", "Soundbar", "Systemy Hi-Fi"] },
    { question: "Łączność:", options: ["Przewodowe", "Bluetooth", "Wi-Fi"] },
    { question: "Przeznaczenie:", options: ["Do muzyki", "Do filmów", "Do gier", "Przenośne"] }
  ],
  "Akcesoria": [
    { question: "Rodzaj:", options: ["Ładowarki", "Etui", "Kable", "Powerbanki"] },
    { question: "Kompatybilność:", options: ["iPhone", "Android", "Uniwersalne"] },
    { question: "Funkcja:", options: ["Ochrona", "Ładowanie", "Przechowywanie danych", "Ergonomia"] }
  ],
  "Beletrystyka": [
    { question: "Gatunek:", options: ["Romans", "Thriller", "Dramat", "Komedia"] },
    { question: "Okres:", options: ["Klasyka", "Współczesna", "XX wiek"] },
    { question: "Pochodzenie autora:", options: ["Polski", "Zagraniczny"] }
  ],
  "Kryminały": [
    { question: "Podgatunek:", options: ["Detektywistyczny", "Noir", "Legal thriller", "Szpiegowski"] },
    { question: "Okres:", options: ["Klasyka", "Współczesny", "Historyczny"] },
    { question: "Pochodzenie autora:", options: ["Polski", "Skandynawski", "Amerykański", "Brytyjski"] }
  ],
  "Fantastyka": [
    { question: "Podgatunek:", options: ["Science fiction", "Fantasy", "Urban fantasy", "Postapokaliptyczna"] },
    { question: "Grupa wiekowa:", options: ["Dla dorosłych", "Young Adult", "Dla dzieci"] },
    { question: "Pochodzenie autora:", options: ["Polski", "Anglojęzyczny", "Inny zagraniczny"] }
  ],
  "Biografie": [
    { question: "Dziedzina:", options: ["Polityka", "Nauka", "Sztuka", "Sport"] },
    { question: "Okres:", options: ["Współczesna", "Historyczna"] },
    { question: "Typ:", options: ["Autobiografia", "Biografia autoryzowana", "Biografia nieautoryzowana"] }
  ],
  "Poradniki": [
    { question: "Tematyka:", options: ["Rozwój osobisty", "Zdrowie", "Gotowanie", "Hobby"] },
    { question: "Poziom zaawansowania:", options: ["Dla początkujących", "Średniozaawansowany", "Zaawansowany"] },
    { question: "Format:", options: ["Tradycyjny", "Z ćwiczeniami", "Ilustrowany"] }
  ],
  "Fitness": [
    { question: "Rodzaj treningu:", options: ["Siłowy", "Cardio", "Joga", "Crossfit"] },
    { question: "Poziom zaawansowania:", options: ["Początkujący", "Średniozaawansowany", "Zaawansowany"] },
    { question: "Sprzęt:", options: ["Bez sprzętu", "Z hantlami", "Maszyny"] }
  ],
  "Sporty zimowe": [
    { question: "Dyscyplina:", options: ["Narciarstwo", "Snowboard", "Łyżwiarstwo", "Hokej"] },
    { question: "Poziom umiejętności:", options: ["Początkujący", "Średniozaawansowany", "Zaawansowany"] },
    { question: "Rodzaj sprzętu:", options: ["Sprzęt", "Odzież", "Akcesoria"] }
  ],
  "Sporty wodne": [
    { question: "Dyscyplina:", options: ["Pływanie", "Surfing", "Kajakarstwo", "Windsurfing"] },
    { question: "Rodzaj akwenu:", options: ["Basen", "Morze", "Jezioro", "Rzeka"] },
    { question: "Typ produktu:", options: ["Sprzęt", "Odzież", "Akcesoria bezpieczeństwa"] }
  ],
  "Turystyka": [
    { question: "Rodzaj:", options: ["Piesze wycieczki", "Camping", "Wspinaczka", "Survival"] },
    { question: "Długość wyprawy:", options: ["Jednodniowa", "Weekendowa", "Długoterminowa"] },
    { question: "Teren:", options: ["Góry", "Las", "Pustynia", "Miasto"] }
  ],
  "Rowery": [
    { question: "Typ roweru:", options: ["Górski", "Szosowy", "Miejski", "Elektryczny"] },
    { question: "Przeznaczenie:", options: ["Rekreacja", "Sport", "Transport", "Wyścigi"] },
    { question: "Akcesoria:", options: ["Kaski", "Oświetlenie", "Bagażniki", "Narzędzia"] }
  ],
  "Klocki": [
    { question: "Marka:", options: ["LEGO", "Playmobil", "Cobi", "Mega Bloks"] },
    { question: "Wiek dziecka:", options: ["1-3 lata", "4-7 lat", "8-12 lat", "12+ lat"] },
    { question: "Tematyka:", options: ["Miasto", "Kosmos", "Fantasy", "Technic"] }
  ],
  "Lalki": [
    { question: "Rodzaj:", options: ["Barbie", "Baby Born", "LOL Surprise", "Lalki edukacyjne"] },
    { question: "Wiek dziecka:", options: ["0-2 lata", "3-5 lat", "6-8 lat", "9+ lat"] },
    { question: "Akcesoria:", options: ["Ubranka", "Domki", "Pojazdy", "Mebelki"] }
  ],
  "Gry planszowe": [
    { question: "Rodzaj gry:", options: ["Strategiczna", "Imprezowa", "Edukacyjna", "Rodzinna"] },
    { question: "Liczba graczy:", options: ["2 graczy", "3-4 graczy", "5+ graczy", "Dla jednego gracza"] },
    { question: "Czas rozgrywki:", options: ["Do 30 minut", "30-60 minut", "60-120 minut", "Powyżej 2 godzin"] }
  ],
  "Zabawki edukacyjne": [
    { question: "Obszar edukacji:", options: ["Matematyka", "Język", "Nauki przyrodnicze", "Sztuka"] },
    { question: "Wiek dziecka:", options: ["0-2 lata", "3-5 lat", "6-8 lat", "9+ lat"] },
    { question: "Typ zabawki:", options: ["Puzzle", "Instrumenty", "Mikroskopy", "Zestawy eksperymentalne"] }
  ],
  "Zabawki elektroniczne": [
    { question: "Rodzaj:", options: ["Konsole", "Roboty", "Drony", "Interaktywne maskotki"] },
    { question: "Wiek dziecka:", options: ["3-5 lat", "6-8 lat", "9-12 lat", "13+ lat"] },
    { question: "Funkcje:", options: ["Edukacyjne", "Rozrywkowe", "Kreatywne", "Sportowe"] }
  ],
  "Naszyjniki": [
    { question: "Materiał:", options: ["Złoto", "Srebro", "Stal szlachetna", "Biżuteria sztuczna"] },
    { question: "Styl:", options: ["Klasyczny", "Nowoczesny", "Boho", "Minimalistyczny"] },
    { question: "Okazja:", options: ["Na co dzień", "Elegancki", "Ślubny", "Okolicznościowy"] }
  ],
  "Pierścionki": [
    { question: "Rodzaj:", options: ["Zaręczynowy", "Obrączka", "Ozdobny", "Sygnet"] },
    { question: "Kamień:", options: ["Diament", "Rubin", "Szmaragd", "Bez kamienia"] },
    { question: "Materiał:", options: ["Złoto", "Srebro", "Platyna", "Stal szlachetna"] }
  ],
  "Bransoletki": [
    { question: "Typ:", options: ["Łańcuszkowa", "Bangle", "Charm", "Plecionka"] },
    { question: "Materiał:", options: ["Złoto", "Srebro", "Skóra", "Sznurek"] },
    { question: "Styl:", options: ["Elegancki", "Sportowy", "Boho", "Minimalistyczny"] }
  ],
  "Kolczyki": [
    { question: "Typ:", options: ["Sztyfty", "Wiszące", "Kreole", "Nausznice"] },
    { question: "Materiał:", options: ["Złoto", "Srebro", "Stal chirurgiczna", "Biżuteria sztuczna"] },
    { question: "Okazja:", options: ["Na co dzień", "Wieczorowe", "Ślubne", "Do pracy"] }
  ],
  "Zegarki": [
    { question: "Mechanizm:", options: ["Kwarcowy", "Automatyczny", "Mechaniczny", "Smartwatch"] },
    { question: "Styl:", options: ["Klasyczny", "Sportowy", "Elegancki", "Casual"] },
    { question: "Materiał koperty:", options: ["Stal", "Złoto", "Tytan", "Plastik"] }
  ]
};
