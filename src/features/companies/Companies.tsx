import React from "react";
import CompaniesTitle from "./CompaniesTitle";
import CompaniesImages from "./CompaniesImages";

export default function Companies() {
  return (
    <div className="bg-bg-primary-fade dark:bg-bg-plain my-20 py-10">
      <CompaniesTitle />
      <CompaniesImages />
    </div>
  );
}
