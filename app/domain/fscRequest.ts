import { Prisma } from "@prisma/client";

export class FscRequest {
  private readonly antragDate: Date;

  constructor(
    prismaFscRequest: Prisma.FscRequestGetPayload<{
      select: { requestId: true; userId: true; createdAt: true };
    }>
  ) {
    this.antragDate = prismaFscRequest.createdAt;
  }

  public creationDate(): string {
    return FscRequest.format(this.antragDate);
  }

  public remainingValidityInDays(): number {
    const expirationDate = new Date(
      new Date().setTime(this.antragDate.getTime() + 90 * 24 * 60 * 60 * 1000)
    );

    return Math.ceil(
      (expirationDate.getTime() - new Date().getTime()) / (24 * 60 * 60 * 1000)
    );
  }

  public isValid(): boolean {
    return this.remainingValidityInDays() >= 0;
  }

  // 21 days after request
  public estLatestArrivalDate(): string {
    return FscRequest.format(
      new Date(this.antragDate.getTime() + 21 * 24 * 60 * 60 * 1000)
    );
  }

  private static format(date: Date) {
    return date.toLocaleDateString("de-DE");
  }
}
