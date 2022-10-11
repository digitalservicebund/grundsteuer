// DataGroups as defined by TR-03110 part 4, section 2.2.3
// https://www.bsi.bund.de/SharedDocs/Downloads/EN/BSI/Publications/TechGuidelines/TR03110/BSI_TR-03110_Part-4_V2-2.pdf

export enum DataGroup {
  DocumentType = "documentType",
  IssuingEntity = "issuingEntity",
  DateOfExpiry = "dateOfExpiry",
  GivenNames = "givenNames",
  FamilyNames = "familyNames",
  NomDePlume = "nomDePlume",
  AcademicTitle = "academicTitle",
  DateOfBirth = "dateOfBirth",
  PlaceOfBirth = "placeOfBirth",
  Nationality = "nationality",
  Sex = "sex",
  OptionalData = "optionalData",
  BirthName = "birthName",
  WrittenSignature = "writtenSignature",
  DateOfIssuance = "dateOfIssuance",
  PlaceOfResidence = "placeOfResidence",
  MunicipalID = "municipalID",
  ResidencePermitI = "residencePermitI",
  ResidencePermitII = "residencePermitII",
  PhoneNumber = "phoneNumber",
  EMailAddress = "eMailAddress",
}
