export default function (score = 0, action) {
  if (action.type == "saveLastScore") {
    return action.score;
  } else {
    return score;
  }
}
