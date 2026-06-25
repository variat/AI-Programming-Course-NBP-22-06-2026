# Polityka reklamacji — rękojmia / niezgodność towaru z umową

> Dokument przykładowy (seed) na potrzeby MVP. Nie stanowi porady prawnej.
> Jest wstrzykiwany do promptu agenta decyzyjnego dla zgłoszeń typu **Reklamacja**.
> Podstawa: ustawa o prawach konsumenta (odpowiedzialność za brak zgodności towaru z umową / rękojmia) + warunki firmy.

---

## 1. Czego dotyczy reklamacja

Reklamacja dotyczy sytuacji, w której sprzęt jest **wadliwy lub niezgodny z umową** (np. nie działa prawidłowo, ma wadę fabryczną, zepsuł się w trakcie normalnego użytkowania). Klient ma prawo żądać naprawy, wymiany, a w określonych przypadkach obniżenia ceny lub zwrotu pieniędzy.

## 2. Termin odpowiedzialności

- **C1.** Sprzedawca odpowiada za brak zgodności towaru z umową przez **2 lata** od dnia wydania towaru.
- **C2.** Jeżeli od daty zakupu minęło **więcej niż 2 lata**, reklamacja z tytułu rękojmi **nie kwalifikuje się** (Klient może sprawdzić ewentualną gwarancję producenta — poza zakresem tej polityki).
- **C3.** Domniemywa się, że wada istniała w chwili wydania towaru, jeżeli ujawniła się w okresie objętym odpowiedzialnością — ciężar dowodu po stronie sprzedawcy.

## 3. Co jest objęte, a co nie

- **C4.** Objęte: wady fabryczne, usterki ujawniające się przy normalnym użytkowaniu, niezgodność ze specyfikacją/opisem.
- **C5.** Nieobjęte rękojmią: **uszkodzenia mechaniczne z winy użytkownika** (upadek, zalanie, zgniecenie), naturalne zużycie eksploatacyjne, uszkodzenia wynikające z niewłaściwego użytkowania lub samodzielnej nieautoryzowanej naprawy.
- **C6.** Uszkodzenie pasujące do przyczyny zewnętrznej (np. pęknięty ekran po upadku, ślady zalania) zwykle **nie kwalifikuje się** do reklamacji z rękojmi — należy to wyraźnie uzasadnić.

## 4. Rola analizy zdjęcia

- **C7.** Analiza zdjęcia ocenia, **czy** i **jak** sprzęt jest uszkodzony oraz **jaka jest prawdopodobna przyczyna** (wada wewnętrzna vs. uszkodzenie mechaniczne/zewnętrzne).
- **C8.** Jeżeli przyczyna wskazuje na wadę fabryczną/wewnętrzną i opis Klienta jest spójny — przemawia to za kwalifikacją.
- **C9.** Jeżeli przyczyna wskazuje na uszkodzenie z winy użytkownika (C5/C6) — przemawia to przeciw kwalifikacji.

## 5. Jak agent ma podejmować decyzję (Reklamacja)

Na podstawie analizy zdjęcia, opisu przyczyny oraz danych z formularza:

- **Kwalifikuje się** — jeżeli: (a) zgłoszenie mieści się w 2-letnim terminie (C1) **oraz** (b) wada wygląda na fabryczną/wewnętrzną lub powstałą w normalnym użytkowaniu (C4, C8), a opis Klienta jest spójny ze zdjęciem.
- **Nie kwalifikuje się** — jeżeli: przekroczono termin (C2) **lub** uszkodzenie wyraźnie wskazuje na winę użytkownika / przyczynę zewnętrzną (C5–C6, C9).
- **Wymaga weryfikacji przez pracownika** — jeżeli przyczyna uszkodzenia jest niejednoznaczna, zdjęcie jest niewyraźne/nieadekwatne, opis Klienta jest sprzeczny ze zdjęciem, albo sprawa wymaga ekspertyzy serwisowej.

## 6. Następne kroki dla Klienta (przykładowe)

1. Opisać dokładnie objawy wady oraz okoliczności jej powstania.
2. Dostarczyć dowód zakupu.
3. Przekazać sprzęt do serwisu/punktu reklamacyjnego w celu oceny.
4. Sprzedawca ustosunkowuje się do reklamacji w ustawowym terminie (14 dni dla żądań konsumenta).

---

*Decyzja agenta ma charakter doradczy i nie jest wiążąca. Ostateczną decyzję podejmuje firma / pracownik po ocenie sprzętu.*
