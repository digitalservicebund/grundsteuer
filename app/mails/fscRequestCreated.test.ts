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
          <title>Freischaltcode erfolgreich angefordert</title>
          <meta name=\\"viewport\\" content=\\"width=device-width, initial-scale=1.0\\" />
        </head>
        <body>
          <p>Guten Tag!</p>

          

      <p>
        Dies ist die Bestätigung, dass Sie am 08.12.1922 einen
        Freischaltcode bei <strong>„Grundsteuererklärung für Privateigentum“</strong> angefordert
        haben. Innerhalb von ungefähr 3 Wochen wird Ihnen ein Brief vom Finanzamt mit
        dem 12-stelligem Freischaltcode zugesendet. Sie finden den Code auf der
        letzten Seite des Briefes über der Zeile mit der Bezeichnung „Antragsteller:in Digitalservice GmbH des Bundes“.
      </p>

      <p>
        <strong> Warten Sie bis der Brief eintrifft </strong>
        <br />

        Sie müssen erstmal nichts weiter tun. Warten Sie auf die Zusendung des
        Freischaltcodes per Brief. Nach Erhalt des Briefes melden Sie sich wieder mit
        Ihrer E-Mail-Adresse an und geben Ihren Freischaltcode ein um sich zu
        identifizieren und Ihre Grundsteuererklärung an das Finanzamt übermitteln zu
        können.
      </p>

      <p>
        <strong> Das sind die nächsten Schritte: </strong>
      </p>
      <ol>
        <li>
          Ihren Freischaltcode haben Sie nun beantragt. Warten Sie, bis dieser per
          Post zugestellt wird.
        </li>
        <li>
          Der Freischaltcode sollte innerhalb von 3 Wochen bei Ihnen zugestellt
          werden. Aktuell kann es zu Verzögerungen durch die Feiertage kommen.
        </li>
        <li>
          Wenn Ihr Brief bei Ihnen angekommen ist, geben Sie ihn in Ihrem Konto ein um
          sich abschließend zu identifizieren. Sie können dann Ihr vollständig
          ausgefülltes Formular an das Finanzamt übermitteln.
          <br />
          Sie haben den Freischaltcode-Brief schon erhalten? <a href=undefined/fsc/eingeben>Jetzt anmelden und Freischaltcode eingeben.
        </li>
      </ol>

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
        "subject": "Freischaltcode erfolgreich angefordert",
        "textContent": "Guten Tag!

      Dies ist die Bestätigung, dass Sie am 08.12.1922 einen Freischaltcode bei
      „Grundsteuererklärung für Privateigentum“ angefordert haben. Innerhalb von
      ungefähr 3 Wochen wird Ihnen ein Brief vom Finanzamt mit dem 12-stelligem
      Freischaltcode zugesendet. Sie finden den Code auf der letzten Seite des Briefes
      über der Zeile mit der Bezeichnung „Antragsteller:in Digitalservice GmbH des
      Bundes“.

      Warten Sie bis der Brief eintrifft
      Sie müssen erstmal nichts weiter tun. Warten Sie auf die Zusendung des
      Freischaltcodes per Brief. Nach Erhalt des Briefes melden Sie sich wieder mit
      Ihrer E-Mail-Adresse an und geben Ihren Freischaltcode ein um sich zu
      identifizieren und Ihre Grundsteuererklärung an das Finanzamt übermitteln zu
      können.

      Das sind die nächsten Schritte:

       1. Ihren Freischaltcode haben Sie nun beantragt. Warten Sie, bis dieser per
          Post zugestellt wird.
       2. Der Freischaltcode sollte innerhalb von 3 Wochen bei Ihnen zugestellt
          werden. Aktuell kann es zu Verzögerungen durch die Feiertage kommen.
       3. Wenn Ihr Brief bei Ihnen angekommen ist, geben Sie ihn in Ihrem Konto ein um
          sich abschließend zu identifizieren. Sie können dann Ihr vollständig
          ausgefülltes Formular an das Finanzamt übermitteln.
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
