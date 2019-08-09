import _ from "lodash";
import chatGroupModel from "./../models/chatGroupModel"
let addNewGroupChat = (currentUserId , usersIdList , groupChatName) => {
  return new Promise ( async (resolve , reject ) => {
    try {
      usersIdList.unshift({"userId" : `${currentUserId}`});
      usersIdList = _.uniqBy(usersIdList , "userId");

      let newGroupItem = {
        name : groupChatName , 
        userAmount : usersIdList.length , 
        userId : currentUserId , 
        members : usersIdList
      }

      let newGroup = await chatGroupModel.createNew(newGroupItem) ;
     
      resolve(newGroup);
    } catch (error) {
      reject(error); 
    }
  })
}

module.exports = {
  addNewGroupChat : addNewGroupChat 
}