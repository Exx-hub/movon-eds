import User from "../service/User";

class UserProfile{

    user = undefined
    credential = undefined;
    token = undefined
    busCompany = undefined
  
    constructor(){
      if(localStorage.getItem('credential')){
        this.credential = JSON.parse(localStorage.getItem('credential'));
      }
      if(this.credential){
        this.token = this.credential.token;
        this.user = this.credential.user;
      }  
    }
  
    getToken(){
      return this.token
    }
  
    getAssignedStation(){
      if(this.user){
        const {_id, name}=this.user.assignedStation
        return { _id, name }
      }
      return undefined;
    }
  
    getBusCompany(){
      if(this.user){
        return this.user.busCompanyId
      }
      return undefined;
    }
  
    getBusCompanyTag(){
      if(this.user){
        const{tag}=this.getBusCompany();
        return tag ? tag.toLowerCase() : undefined
      }
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
  
  }

module.exports = UserProfile;