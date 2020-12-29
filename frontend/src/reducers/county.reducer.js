export default function (county = "", action) {
    if (action.type == "saveCounty") {
      return action.county;
    } else {
      return county;
    }
  }
  