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
          <title>Erfolgreiche Übermittlung Ihrer Grundsteuererklärung</title>
          <meta name=\\"viewport\\" content=\\"width=device-width, initial-scale=1.0\\" />
        </head>
        <body>
          

      <p>
        <strong>Erfolgreiche Übermittlung</strong>
      </p>

      <p>
        Ihre Grundsteuererklärung wurde an das Finanzamt gesendet. Mit Ihrem
        Transferticket können Sie dort bei Bedarf den Status Ihrer Erklärung
        nachfragen.
      </p>

      <p>
        <strong>Ihr persönliches Transferticket: transferticket</strong>
      </p>


      <p>
        Ein PDF mit der Zusammenfassung Ihrer Grundsteuererklärung können Sie
        <a href=\\"https://grundsteuererklaerung-fuer-privateigentum.de/formular/erfolg\\"
          >hier</a
        >
        noch 24 Stunden in Ihrem Konto herunterladen (wenn Sie keine weitere Erklärung
        abgegeben haben).
      </p>


      <p>
        Sollten Sie Ihre Grundsteuererklärung korrigieren wollen, finden Sie in
        <a
          href=\\"https://grundsteuererklaerung-fuer-privateigentum.zammad.com/help/de-de/48\\"
          >unserem Hilfebereich</a
        >
        eine Anleitung.
      </p>

      <p><strong>Wie geht es jetzt weiter?</strong></p>

      <ol>
        <li>Ihre Erklärung wird nun von Ihrem Finanzamt bearbeitet.</li>
        <li>
          In der Zeit bis 2024 bekommen Sie drei Briefe:
          <ul>
            <li>Grundsteuerwertbescheid</li>
            <li>Grundsteuermessbescheid</li>
            <li>den neuen Grundsteuerbescheid</li>
          </ul>
        </li>
        <li>
          Bis zum Jahr 2025 zahlen Sie die alte Grundsteuer. Ab 2025 zahlen Sie die
          neue Grundsteuer.
        </li>
      </ol>



          <hr style=\\"margin-top: 3rem\\" />
          <p>
            <strong>Grundsteuererklärung für Privateigentum</strong><br />
            Support-Team |
            <a href=\\"https://digitalservice.bund.de\\">DigitalService</a><br />
            <a href=\\"https://twitter.com/DigitalServBund\\">Twitter</a> |
            <a href=\\"https://www.linkedin.com/company/digitalservicebund\\">LinkedIn</a
            ><br />
            DigitalService GmbH des Bundes<br />
            Prinzessinnenstraße 8-14, 10969 Berlin<br />
            Ust-IdNr.: DE327075535 | Geschäftsführung: Christina Lang<br />
            Handelsregisternummer: HRB 212879 B | Registergericht: Berlin Charlottenburg
          </p>
        </body>
      </html>
      ",
        "subject": "Erfolgreiche Übermittlung Ihrer Grundsteuererklärung",
        "textContent": "Erfolgreiche Übermittlung

      Ihre Grundsteuererklärung wurde an das Finanzamt gesendet. Mit Ihrem
      Transferticket können Sie dort bei Bedarf den Status Ihrer Erklärung nachfragen.

      Ihr persönliches Transferticket: transferticket

      Ein PDF mit der Zusammenfassung Ihrer Grundsteuererklärung können Sie hier
      [https://grundsteuererklaerung-fuer-privateigentum.de/formular/erfolg] noch 24
      Stunden in Ihrem Konto herunterladen (wenn Sie keine weitere Erklärung abgegeben
      haben).

      Sollten Sie Ihre Grundsteuererklärung korrigieren wollen, finden Sie in unserem
      Hilfebereich
      [https://grundsteuererklaerung-fuer-privateigentum.zammad.com/help/de-de/48]
      eine Anleitung.

      Wie geht es jetzt weiter?

       1. Ihre Erklärung wird nun von Ihrem Finanzamt bearbeitet.
       2. In der Zeit bis 2024 bekommen Sie drei Briefe:
          * Grundsteuerwertbescheid
          * Grundsteuermessbescheid
          * den neuen Grundsteuerbescheid
       3. Bis zum Jahr 2025 zahlen Sie die alte Grundsteuer. Ab 2025 zahlen Sie die
          neue Grundsteuer.

      --------------------------------------------------------------------------------

      Grundsteuererklärung für Privateigentum
      Support-Team | DigitalService [https://digitalservice.bund.de]
      Twitter [https://twitter.com/DigitalServBund] | LinkedIn
      [https://www.linkedin.com/company/digitalservicebund]
      DigitalService GmbH des Bundes
      Prinzessinnenstraße 8-14, 10969 Berlin
      Ust-IdNr.: DE327075535 | Geschäftsführung: Christina Lang
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
            <title>Erfolgreiche Übermittlung Ihrer Grundsteuererklärung</title>
            <meta name=\\"viewport\\" content=\\"width=device-width, initial-scale=1.0\\" />
          </head>
          <body>
            

        <p>
          <strong>Erfolgreiche Übermittlung</strong>
        </p>

        <p>
          Ihre Grundsteuererklärung wurde an das Finanzamt gesendet. Mit Ihrem
          Transferticket können Sie dort bei Bedarf den Status Ihrer Erklärung
          nachfragen.
        </p>

        <p>
          <strong>Ihr persönliches Transferticket: transferticket</strong>
        </p>


        <p>
          Im Anhang finden Sie das PDF mit der Zusammenfassung Ihrer
          Grundsteuererklärung. Bitte überprüfen Sie die Angaben.
        </p>


        <p>
          Sollten Sie Ihre Grundsteuererklärung korrigieren wollen, finden Sie in
          <a
            href=\\"https://grundsteuererklaerung-fuer-privateigentum.zammad.com/help/de-de/48\\"
            >unserem Hilfebereich</a
          >
          eine Anleitung.
        </p>

        <p><strong>Wie geht es jetzt weiter?</strong></p>

        <ol>
          <li>Ihre Erklärung wird nun von Ihrem Finanzamt bearbeitet.</li>
          <li>
            In der Zeit bis 2024 bekommen Sie drei Briefe:
            <ul>
              <li>Grundsteuerwertbescheid</li>
              <li>Grundsteuermessbescheid</li>
              <li>den neuen Grundsteuerbescheid</li>
            </ul>
          </li>
          <li>
            Bis zum Jahr 2025 zahlen Sie die alte Grundsteuer. Ab 2025 zahlen Sie die
            neue Grundsteuer.
          </li>
        </ol>



            <hr style=\\"margin-top: 3rem\\" />
            <p>
              <strong>Grundsteuererklärung für Privateigentum</strong><br />
              Support-Team |
              <a href=\\"https://digitalservice.bund.de\\">DigitalService</a><br />
              <a href=\\"https://twitter.com/DigitalServBund\\">Twitter</a> |
              <a href=\\"https://www.linkedin.com/company/digitalservicebund\\">LinkedIn</a
              ><br />
              DigitalService GmbH des Bundes<br />
              Prinzessinnenstraße 8-14, 10969 Berlin<br />
              Ust-IdNr.: DE327075535 | Geschäftsführung: Christina Lang<br />
              Handelsregisternummer: HRB 212879 B | Registergericht: Berlin Charlottenburg
            </p>
          </body>
        </html>
        ",
          "subject": "Erfolgreiche Übermittlung Ihrer Grundsteuererklärung",
          "textContent": "Erfolgreiche Übermittlung

        Ihre Grundsteuererklärung wurde an das Finanzamt gesendet. Mit Ihrem
        Transferticket können Sie dort bei Bedarf den Status Ihrer Erklärung nachfragen.

        Ihr persönliches Transferticket: transferticket

        Im Anhang finden Sie das PDF mit der Zusammenfassung Ihrer Grundsteuererklärung.
        Bitte überprüfen Sie die Angaben.

        Sollten Sie Ihre Grundsteuererklärung korrigieren wollen, finden Sie in unserem
        Hilfebereich
        [https://grundsteuererklaerung-fuer-privateigentum.zammad.com/help/de-de/48]
        eine Anleitung.

        Wie geht es jetzt weiter?

         1. Ihre Erklärung wird nun von Ihrem Finanzamt bearbeitet.
         2. In der Zeit bis 2024 bekommen Sie drei Briefe:
            * Grundsteuerwertbescheid
            * Grundsteuermessbescheid
            * den neuen Grundsteuerbescheid
         3. Bis zum Jahr 2025 zahlen Sie die alte Grundsteuer. Ab 2025 zahlen Sie die
            neue Grundsteuer.

        --------------------------------------------------------------------------------

        Grundsteuererklärung für Privateigentum
        Support-Team | DigitalService [https://digitalservice.bund.de]
        Twitter [https://twitter.com/DigitalServBund] | LinkedIn
        [https://www.linkedin.com/company/digitalservicebund]
        DigitalService GmbH des Bundes
        Prinzessinnenstraße 8-14, 10969 Berlin
        Ust-IdNr.: DE327075535 | Geschäftsführung: Christina Lang
        Handelsregisternummer: HRB 212879 B | Registergericht: Berlin Charlottenburg",
          "to": "chewbacca@examle.com",
        }
      `);
    });
  });
});
