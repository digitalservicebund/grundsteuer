import { ContentContainer, EmailStatus } from "~/components";

export default function KitchenSinkEmailStatus() {
  const defaultProps = {
    email: "foobar@example.com",
    actionPath: "/registrieren",
    actionLabel: "Zurück zur Registrierung",
  };
  return (
    <ContentContainer>
      <EmailStatus {...defaultProps} currentStatus="request" />
      <EmailStatus {...defaultProps} currentStatus="delivered" />
      <EmailStatus {...defaultProps} currentStatus="deferred" />
      <EmailStatus {...defaultProps} currentStatus="address_problem" />
      <EmailStatus {...defaultProps} currentStatus="mailbox_full" />
      <EmailStatus {...defaultProps} currentStatus="spam_blocker" />
      <EmailStatus {...defaultProps} currentStatus="generic_error" />
    </ContentContainer>
  );
}
