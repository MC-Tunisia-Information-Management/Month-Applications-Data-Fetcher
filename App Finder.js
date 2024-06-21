function fetchApril() {
  var url = "https://gis-api.aiesec.org/graphql";
  var headers = {
    "Content-Type": "application/json",
    authorization: "",
  };
  var data = {
    query:
      'query MyQuery { allOpportunityApplication( filters: {created_at: {from: "2023-04-01", to: "2023-04-31"}, person_committee: 1559} per_page: 10000) { data { current_status opportunity { host_lc { full_name email } location project_name programme { short_name_display } description id logistics_info { accommodation_covered accommodation_provided food_covered food_provided transportation_covered transportation_provided } managers { email full_name phone } project_fee project_duration } home_mc {country} person { id created_at email full_name gender has_opportunity_applications interviewed phone status} } paging { total_items } } }',
  };
  var options = {
    method: "post",
    headers: headers,
    payload: JSON.stringify(data),
  };
  var response = UrlFetchApp.fetch(url, options);
  var json = response.getContentText();
  var data = JSON.parse(json).data.allOpportunityApplication.data;

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("April");
  sheet.clearContents();

  var headers = [
    "EP ID",
    "Person Full Name",
    "Person Email",
    "Person Gender",
    "Person Created At",
    "Person Phone",
    "Person Status",
    "Current Status",
    "Project Name",
    "Programme Short Name",
    "Host LC Full Name",
    "Location",
    "Opp Link",
    "Description",
    "Host LC Email",
    "Manager Email",
    "Manager Full Name",
    "Manager Phone",
    "Project Fee",
    "Country",
    "Interviewed",
    "Has Opportunity Applications",
    "Accommodation Covered",
    "Accommodation Provided",
    "Food Covered",
    "Food Provided",
    "Transportation Covered",
    "Transportation Provided",
  ];
  sheet.appendRow(headers);

  data.forEach(function (row) {
    var opportunity = row.opportunity;
    var hostLc = opportunity.host_lc;
    var logisticsInfo = opportunity.logistics_info;
    var managers = opportunity.managers;
    var person = row.person;
    var emailLink =
      '=HYPERLINK("mailto:' + person.email + '"' + ',"' + person.email + '")';
    var projectFee =
      opportunity.project_fee.fee + " " + opportunity.project_fee.currency;
    var opplink =
      '=hyperlink("https://aiesec.org/opportunity/' +
      opportunity.id +
      '","Link")';
    var hostEmail =
      '=HYPERLINK("mailto:' + hostLc.email + '"' + ',"Email Host")';
    var home_mc = row.home_mc;
    var country = home_mc.country;

    var values = [
      person.id,
      person.full_name,
      emailLink,
      person.gender,
      person.created_at,
      person.phone,
      person.status,
      row.current_status,
      opportunity.project_name,
      opportunity.programme.short_name_display,
      hostLc.full_name,
      opportunity.location,
      opplink,
      opportunity.description,
      hostEmail,
      managers.email,
      managers.full_name,
      managers.phone,
      projectFee,
      country,
      person.interviewed,
      person.has_opportunity_applications,
      logisticsInfo.accommodation_covered,
      logisticsInfo.accommodation_provided,
      logisticsInfo.food_covered,
      logisticsInfo.food_provided,
      logisticsInfo.transportation_covered,
      logisticsInfo.transportation_provided,
    ];

    sheet.appendRow(values);
  });
}
