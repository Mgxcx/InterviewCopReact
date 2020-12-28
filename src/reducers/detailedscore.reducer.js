export default function (detailedScore = {}, action) {
    if (action.type == "saveDetailedScore") {
      return action.detailedScore;
    } else {
      return detailedScore;
    }
  }
  