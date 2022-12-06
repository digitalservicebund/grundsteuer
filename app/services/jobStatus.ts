export const jobStatus = (job: {
  name?: string;
  failedReason?: string;
  returnvalue?: string;
}) => {
  if (!job.name) return "NOT_FOUND";
  if (typeof job.returnvalue !== "undefined") return "DONE";
  if (typeof job.failedReason !== "undefined") return "FAIL";
  return "ACTIVE";
};
