import bmfLogoImage from "~/assets/images/bmf-logo.svg";

export default function BmfLogo() {
  return (
    <>
      <div className="ml-8 text-10 leading-13 md:ml-0 md:text-16 md:leading-26 lg:mt-16">
        Im Auftrag des
      </div>
      <img
        src={bmfLogoImage}
        alt="Logo des Bundesministeriums der Finanzen"
        className="relative -left-16 w-[160px] md:-left-24 md:w-[200px] lg:-left-36 lg:w-[250px]"
        width={168}
        height={104}
      />
    </>
  );
}
