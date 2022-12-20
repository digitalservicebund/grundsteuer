import { createDeclarationSentMail } from "./declarationSent";

describe("createDeclarationSentMail", () => {
  it("creates mail", () => {
    expect(
      createDeclarationSentMail({
        to: "chewbacca@examle.com",
        transferticket: "transferticket",
      })
    ).toMatchInlineSnapshot(`
      Object {
        "htmlContent": "<!DOCTYPE html>
      <html lang=\\"de\\">
        <head>
          <meta http-equiv=\\"Content-Type\\" content=\\"text/html charset=UTF-8\\" />
          <title>Grundsteuererklärung erfolgreich übermittelt</title>
          <meta name=\\"viewport\\" content=\\"width=device-width, initial-scale=1.0\\" />
        </head>
        <body>
          <p>Guten Tag!</p>

          

      <p>
        Sie haben Ihre Grundsteuererklärung erfolgreich an das Finanzamt übermittelt.
      </p>

      <p>
        Als Bestätigung bekommen Sie ein sogenanntes Transferticket. Dieses wird von
        ELSTER bei der erfolgreichen Übermittlung automatisch erzeugt.
      </p>

      <p>
        <strong>Ihr Transferticket: transferticket</strong>
      </p>


      <p>
        Ein PDF mit der Zusammenfassung Ihrer Grundsteuererklärung können Sie noch 24
        Stunden in ihrem Konto runterladen. Wenn Sie eine neue Erklärung anfangen,
        löschen wir das PDF der letzten Erklärung. Ihre Daten sind natürlich trotzdem
        an das Finanzamt übermittelt worden.
      </p>


      <p>
        Sollten Sie Ihre Grundsteuererklärung korrigieren wollen, finden Sie in
        <a href=\\"\\">unserem Hilfebereich</a> eine Anleitung.
      </p>

      <p><strong>Wie geht es jetzt weiter?</strong></p>

      <ol>
        <li>Ihre Erklärung wird nun von Ihrem Finanzamt bearbeitet.</li>
        <li>
          In der Zeit bis 2024 bekommen Sie drei Briefe: den Grundsteuerwertbescheid,
          den Grundsteuermessbescheid und den neuen Grundsteuerbescheid.
        </li>
        <li>
          Bis zum Jahr 2025 zahlen Sie die alte Grundsteuer. Ab 2025 zahlen Sie die
          neue Grundsteuer.
        </li>
      </ol>

      <p><strong>Haben Sie Fragen?</strong></p>
      <p>Wenden Sie sich bitte an das für Ihr Grundstück zuständige Finanzamt.</p>



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
        "subject": "Grundsteuererklärung erfolgreich übermittelt",
        "textContent": "Guten Tag!

      Sie haben Ihre Grundsteuererklärung erfolgreich an das Finanzamt übermittelt.

      Als Bestätigung bekommen Sie ein sogenanntes Transferticket. Dieses wird von
      ELSTER bei der erfolgreichen Übermittlung automatisch erzeugt.

      Ihr Transferticket: transferticket

      Ein PDF mit der Zusammenfassung Ihrer Grundsteuererklärung können Sie noch 24
      Stunden in ihrem Konto runterladen. Wenn Sie eine neue Erklärung anfangen,
      löschen wir das PDF der letzten Erklärung. Ihre Daten sind natürlich trotzdem an
      das Finanzamt übermittelt worden.

      Sollten Sie Ihre Grundsteuererklärung korrigieren wollen, finden Sie in unserem
      Hilfebereich eine Anleitung.

      Wie geht es jetzt weiter?

       1. Ihre Erklärung wird nun von Ihrem Finanzamt bearbeitet.
       2. In der Zeit bis 2024 bekommen Sie drei Briefe: den Grundsteuerwertbescheid,
          den Grundsteuermessbescheid und den neuen Grundsteuerbescheid.
       3. Bis zum Jahr 2025 zahlen Sie die alte Grundsteuer. Ab 2025 zahlen Sie die
          neue Grundsteuer.

      Haben Sie Fragen?

      Wenden Sie sich bitte an das für Ihr Grundstück zuständige Finanzamt.

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

  describe("with pdf attached", () => {
    it("creates mail", () => {
      expect(
        createDeclarationSentMail({
          to: "chewbacca@examle.com",
          transferticket: "transferticket",
          pdf: "abcdef==",
        })
      ).toMatchInlineSnapshot(`
        Object {
          "attachments": Array [
            Object {
              "content": "abcdef==",
              "name": "Grundsteuererklaerung.pdf",
            },
          ],
          "htmlContent": "<!DOCTYPE html>
        <html lang=\\"de\\">
          <head>
            <meta http-equiv=\\"Content-Type\\" content=\\"text/html charset=UTF-8\\" />
            <title>Grundsteuererklärung erfolgreich übermittelt</title>
            <meta name=\\"viewport\\" content=\\"width=device-width, initial-scale=1.0\\" />
          </head>
          <body>
            <p>Guten Tag!</p>

            

        <p>
          Sie haben Ihre Grundsteuererklärung erfolgreich an das Finanzamt übermittelt.
        </p>

        <p>
          Als Bestätigung bekommen Sie ein sogenanntes Transferticket. Dieses wird von
          ELSTER bei der erfolgreichen Übermittlung automatisch erzeugt.
        </p>

        <p>
          <strong>Ihr Transferticket: transferticket</strong>
        </p>


        <p>
          Im Anhang finden Sie eine PDF-Datei mit der Zusammenfassung Ihrer
          Grundsteuererklärung.
        </p>


        <p>
          Sollten Sie Ihre Grundsteuererklärung korrigieren wollen, finden Sie in
          <a href=\\"\\">unserem Hilfebereich</a> eine Anleitung.
        </p>

        <p><strong>Wie geht es jetzt weiter?</strong></p>

        <ol>
          <li>Ihre Erklärung wird nun von Ihrem Finanzamt bearbeitet.</li>
          <li>
            In der Zeit bis 2024 bekommen Sie drei Briefe: den Grundsteuerwertbescheid,
            den Grundsteuermessbescheid und den neuen Grundsteuerbescheid.
          </li>
          <li>
            Bis zum Jahr 2025 zahlen Sie die alte Grundsteuer. Ab 2025 zahlen Sie die
            neue Grundsteuer.
          </li>
        </ol>

        <p><strong>Haben Sie Fragen?</strong></p>
        <p>Wenden Sie sich bitte an das für Ihr Grundstück zuständige Finanzamt.</p>



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
          "subject": "Grundsteuererklärung erfolgreich übermittelt",
          "textContent": "Guten Tag!

        Sie haben Ihre Grundsteuererklärung erfolgreich an das Finanzamt übermittelt.

        Als Bestätigung bekommen Sie ein sogenanntes Transferticket. Dieses wird von
        ELSTER bei der erfolgreichen Übermittlung automatisch erzeugt.

        Ihr Transferticket: transferticket

        Im Anhang finden Sie eine PDF-Datei mit der Zusammenfassung Ihrer
        Grundsteuererklärung.

        Sollten Sie Ihre Grundsteuererklärung korrigieren wollen, finden Sie in unserem
        Hilfebereich eine Anleitung.

        Wie geht es jetzt weiter?

         1. Ihre Erklärung wird nun von Ihrem Finanzamt bearbeitet.
         2. In der Zeit bis 2024 bekommen Sie drei Briefe: den Grundsteuerwertbescheid,
            den Grundsteuermessbescheid und den neuen Grundsteuerbescheid.
         3. Bis zum Jahr 2025 zahlen Sie die alte Grundsteuer. Ab 2025 zahlen Sie die
            neue Grundsteuer.

        Haben Sie Fragen?

        Wenden Sie sich bitte an das für Ihr Grundstück zuständige Finanzamt.

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
});
