// const BASE_URL: string = import.meta.env.VITE_BASE_URL;
const BASE_URL: string = "https://thedemonstrate.com";
console.log(BASE_URL);

export const city_endpoints = {

  //login
  COUNTRY_LIST_API:BASE_URL + "/ticketcore-api/api/v1/countries/paged?mode=all",
  CREATE_COUNTRY_API:BASE_URL + "/ticketcore-api/api/v1/countries",

}

