

class UserProfileClass{

  user = undefined
  credential = undefined;
  token = undefined
  busCompany = undefined

  constructor(data){
    if(data){
      localStorage.setItem('credential',JSON.stringify(data)) 
      this.credential = JSON.parse(localStorage.getItem('credential'));
    }
    else{
      const cred = localStorage.getItem('credential',undefined)
      this.credential = cred ? JSON.parse(cred) : undefined;
    }

    if(this.credential){
      console.log(this.credential)
      this.token = this.credential.token;
      this.user = this.credential.user;
    }  
  }

  getCredential(){
    return this.credential;
  }

  logout(User){
    User.logout(this.token)
    .then(this.clearData())
    .catch(this.clearData());
  }

  clearData(){
    localStorage.setItem('credential',null)
    this.token = null;
    this.user = null;
    this.credential = null
  }

  getToken(){
    return this.token
  }

  getUser(){
    return this.user
  }

  getAssignedStation(){
    if(this.user){
      return this.user.assignedStation || undefined
    }
    return undefined;
  }

  getAssignedStationId(){
    if(this.getAssignedStation()){
      return this.getAssignedStation()._id || undefined
    }
    return undefined;
  }


  getBusCompany(){
    if(this.user){
      return this.user.busCompanyId
    }
    return undefined;
  }

  getBusCompanyId(){
    if(this.getBusCompany()){
      return this.getBusCompany()._id || undefined
    }
    return undefined;
  }

  getBusCompanyTag(){
    if(this.getBusCompany()){
      let tag = this.getBusCompany().tag || ((this.getBusCompany().config.parcel && this.getBusCompany().config.parcel.tag) || undefined  )
      return tag ? tag.toLowerCase() : undefined
    }
    return undefined;
  }

  getPersonalInfo(){
    const defaultValue = undefined
    if(this.user){
      return this.user.personalInfo || defaultValue
    }
    return defaultValue;
  }

  getPersonFullName(){
    const defaultValue = undefined
    if(this.getPersonalInfo()){
      return this.user.personalInfo.fullName || defaultValue
    }
    return defaultValue;
  }

  getBusCompanyName(){
    if(this.getBusCompany()){
      let name = this.getBusCompany().name || undefined;
      return name
    }
    return undefined;
  }

  disableCargoSystemFee(){
    if(this.getBusCompany()){
      return this.getBusCompany().cargoStatus === 0; 
    }
    return false;
  }

  getDiscount(){
    if(this.getBusCompany()){
      return (this.getBusCompany().config && this.getBusCompany().config.discount) || []
    }
    return [];
  }

  isIsarogLiners(){
    if(this.getBusCompanyTag()){
      return "isarog-liner" === this.getBusCompanyTag().toLowerCase();
    }
    return false;
  }

  isFiveStar(){
    if(this.getBusCompanyTag()){
      return "five-star" === this.getBusCompanyTag().toLowerCase();
    }
    return false;
  }

  getStickerCount(){
    if(this.getBusCompany()){
      const count = (this.getBusCompany().config && this.getBusCompany().config.noOfStickerCopy) || 1;
      console.log('====>>count',count)
      console.log('====>>count',count)
      console.log('====>>count',count)
      return count;
    }
    return 1;
  }
}

module.exports = UserProfileClass;
