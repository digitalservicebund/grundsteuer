import { createLoginMail } from "./login";

describe("createLoginMail", () => {
  it("creates login mail with given magic link", () => {
    expect(
      createLoginMail({
        to: "chewbacca@examle.com",
        magicLink:
          "https://www.grundsteuererklaerung-fuer-privateigentum.de/anmelden/bestaetigen?token=foobar",
      })
    ).toMatchInlineSnapshot(`
      Object {
        "htmlContent": "<!DOCTYPE html>
      <html lang=\\"de\\">
        <head>
          <meta http-equiv=\\"Content-Type\\" content=\\"text/html charset=UTF-8\\" />
          <title>Anmelden bei „Grundsteuererklärung für Privateigentum“</title>
          <meta name=\\"viewport\\" content=\\"width=device-width, initial-scale=1.0\\" />
        </head>
        <body>
          <p>Guten Tag!</p>

          

      <p>
        <strong>
          <a href=\\"https://www.grundsteuererklaerung-fuer-privateigentum.de/anmelden/bestaetigen?token=foobar\\">
            Hier klicken und bei „Grundsteuererklärung für Privateigentum“ anmelden
          </a>
        </strong>
      </p>

      <p>
      Der Link läuft in 24 Stunden ab.

      Öffnen Sie den Link mit demselben Browser und Gerät, mit dem Sie ihn bestellt haben.

      Wenn Sie den Link nicht angefordert haben, können Sie diese E-Mail ignorieren.

      Bei Problemen mit der Anmeldung, finden Sie weitere Informationen im <a href=\\"https://grundsteuererklaerung-fuer-privateigentum.zammad.com/help/de-de/34-anmeldung/22-der-link-funktioniert-nicht-was-soll-ich-tun\\">Hilfebereich</a>.
      </p>



          <hr style=\\"margin-top: 3rem\\" />
          <p>
            <strong>Grundsteuererklärung für Privateigentum</strong><br />
            Support-Team |
            <a href=\\"https://digitalservice.bund.de\\">DigitalService</a><br />
            <a href=\\"https://twitter.com/DigitalServBund\\">Twitter</a> |
            <a href=\\"https://www.linkedin.com/company/digitalservicebund\\">LinkedIn</a
            ><br />
            DigitalService GmbH des Bundes<br />
            Prinzessinenstraße 8-14, 10969 Berlin<br />
            Ust-IdNr.: DE327075535 | Geschäftsführung: Christina Lang & Philipp Möser<br />
            Handelsregisternummer: HRB 212879 B | Registergericht: Berlin Charlottenburg
          </p>
        </body>
      </html>
      ",
        "subject": "Anmelden bei „Grundsteuererklärung für Privateigentum“",
        "textContent": "Guten Tag!

      Hier klicken und bei „Grundsteuererklärung für Privateigentum“ anmelden
      [https://www.grundsteuererklaerung-fuer-privateigentum.de/anmelden/bestaetigen?token=foobar]

      Der Link läuft in 24 Stunden ab. Öffnen Sie den Link mit demselben Browser und
      Gerät, mit dem Sie ihn bestellt haben. Wenn Sie den Link nicht angefordert
      haben, können Sie diese E-Mail ignorieren. Bei Problemen mit der Anmeldung,
      finden Sie weitere Informationen im Hilfebereich
      [https://grundsteuererklaerung-fuer-privateigentum.zammad.com/help/de-de/34-anmeldung/22-der-link-funktioniert-nicht-was-soll-ich-tun].

      --------------------------------------------------------------------------------

      Grundsteuererklärung für Privateigentum
      Support-Team | DigitalService [https://digitalservice.bund.de]
      Twitter [https://twitter.com/DigitalServBund] | LinkedIn
      [https://www.linkedin.com/company/digitalservicebund]
      DigitalService GmbH des Bundes
      Prinzessinenstraße 8-14, 10969 Berlin
      Ust-IdNr.: DE327075535 | Geschäftsführung: Christina Lang & Philipp Möser
      Handelsregisternummer: HRB 212879 B | Registergericht: Berlin Charlottenburg",
        "to": "chewbacca@examle.com",
      }
    `);
  });
});
