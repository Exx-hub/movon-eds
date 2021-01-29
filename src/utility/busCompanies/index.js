import { UserProfile } from '..';
import Dltb from './dltb'
import FiveStar from './fivestar'

const getBusPartner = () =>{
    let busCompany = undefined
    let tag = UserProfile.getBusCompanyTag();
    switch (tag) {
        case 'dltb':
            busCompany = new Dltb()
            break;

        case 'five-star':
            busCompany = new FiveStar()
            break
    
        default:
            break;
    }
    return busCompany
}

export { getBusPartner }