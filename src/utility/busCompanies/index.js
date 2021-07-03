import { UserProfile } from "..";
import Dltb from "./dltb";
import FiveStar from "./fivestar";
import BicolIsarog from "./bicolisarog";

const getBusPartner = () => {
  let busCompany = undefined;
  let tag = UserProfile.getBusCompanyTag();
  switch (tag) {
    case "dltb":
      busCompany = new Dltb();
      break;

    case "five-star":
      busCompany = new FiveStar();
      break;

    case "tst":
      busCompany = new Dltb();
      break;

    default:
      busCompany = new BicolIsarog();
      break;
  }
  return busCompany;
};

export { getBusPartner };
