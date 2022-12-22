import { createFscRequestCreatedMail } from "./fscRequestCreated";

describe("createFscRequestCreatedMail", () => {
  it("creates mail", () => {
    expect(
      createFscRequestCreatedMail({
        to: "chewbacca@examle.com",
        createdAt: new Date(Date.UTC(22, 11, 7, 23, 59, 59)),
      })
    ).toMatchInlineSnapshot(`
      Object {
        "htmlContent": "<!DOCTYPE html>
      <html lang=\\"de\\">
        <head>
          <meta http-equiv=\\"Content-Type\\" content=\\"text/html charset=UTF-8\\" />
          <title>Bestellung Freischaltcode</title>
          <meta name=\\"viewport\\" content=\\"width=device-width, initial-scale=1.0\\" />
        </head>
        <body>
          

      <p>
        <strong>Bestätigung</strong>
      </p>

      <p>
        Erfolgreiche Anforderung eines Freischaltcodes bei
        <strong>Grundsteuererklärung für Privateigentum</strong> am 08.12.1922.
      </p>

      <p>
        <strong>Was passiert jetzt?</strong>
      </p>

      <ol>
        <li>
          Nur Geduld! Der Freischaltcode wird jetzt per Post an Ihre Meldeadresse
          gesendet. Das kann bis zu 3 Wochen dauern.
        </li>
        <li>
          Wenn Ihr Brief bei Ihnen angekommen ist, melden Sie sich in Ihrem Konto an.
        </li>
        <li>
          Der Code steht auf der letzten Seite über der Zeile „Antragsteller:in
          Digitalservice GmbH des Bundes“. Geben Sie den Code ein.
        </li>
      </ol>

      <p>
        Sie haben den Freischaltcode-Brief schon erhalten? <a href=undefined/fsc/eingeben>Jetzt anmelden und Freischaltcode eingeben.
      </p>

      <p>
        Weitere Informationen finden Sie in unserem
        <a
          href=\\"https://grundsteuererklaerung-fuer-privateigentum.zammad.com/help/de-de/7\\"
          >Hilfebereich</a
        >.
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
        "subject": "Bestellung Freischaltcode",
        "textContent": "Bestätigung

      Erfolgreiche Anforderung eines Freischaltcodes bei Grundsteuererklärung für
      Privateigentum am 08.12.1922.

      Was passiert jetzt?

       1. Nur Geduld! Der Freischaltcode wird jetzt per Post an Ihre Meldeadresse
          gesendet. Das kann bis zu 3 Wochen dauern.
       2. Wenn Ihr Brief bei Ihnen angekommen ist, melden Sie sich in Ihrem Konto an.
       3. Der Code steht auf der letzten Seite über der Zeile „Antragsteller:in
          Digitalservice GmbH des Bundes“. Geben Sie den Code ein.

      Sie haben den Freischaltcode-Brief schon erhalten? Jetzt anmelden und
      Freischaltcode eingeben. [undefined/fsc/eingeben]

      Weitere Informationen finden Sie in unserem Hilfebereich
      [https://grundsteuererklaerung-fuer-privateigentum.zammad.com/help/de-de/7].

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
