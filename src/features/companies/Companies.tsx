import React from "react";
import CompaniesTitle from "./CompaniesTitle";
import CompaniesImages from "./CompaniesImages";

export default function Companies() {
  return (
    <div className="bg-bg-primary-fade dark:bg-bg-plain container my-20 rounded-[1.25rem] py-10">
      <CompaniesTitle />
      <CompaniesImages />
    </div>
  );
}
