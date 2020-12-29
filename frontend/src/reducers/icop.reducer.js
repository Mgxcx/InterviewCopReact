export default function (icop = "", action) {
    if (action.type == "saveIcop") {
      return action.icop;
    } else {
      return icop;
    }
  }
  