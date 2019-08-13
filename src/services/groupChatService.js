import _ from "lodash";
import chatGroupModel from "./../models/chatGroupModel";
import userModel from "./../models/userModel";
import contactModel from "./../models/contactModel";

let addNewGroupChat = (currentUserId, usersIdList, groupChatName) => {
    return new Promise(async(resolve, reject) => {
        try {
            usersIdList.unshift({ "userId": `${currentUserId}` });
            usersIdList = _.uniqBy(usersIdList, "userId");

            let newGroupItem = {
                name: groupChatName,
                userAmount: usersIdList.length,
                userId: currentUserId,
                members: usersIdList
            }

            let newGroup = await chatGroupModel.createNew(newGroupItem);

            resolve(newGroup);
        } catch (error) {
            reject(error);
        }
    })
}

let getMembersInGroup = (currentUserId, groupId) => {
    return new Promise(async(resolve, reject) => {
        try {
            currentUserId = currentUserId.toString();
            let getGroupInfor = await chatGroupModel.getChatGroupById(groupId);

            //let getMembers = await chatGroupModel.getMembersInGroup(groupId);

            let getIdMembers = getGroupInfor.members.map(user => {
                return user.userId;
            });

            let getMembersInfor = await userModel.findMembersByIdList(getIdMembers);
            //find currentUserId of idMembers and then take it into the first element;
            let myInfor;
            getMembersInfor.forEach((user, index) => {
                if (user._id == currentUserId) {
                    myInfor = getMembersInfor[index];
                }
            });
            let membersInfor = getMembersInfor.filter(user => user._id != currentUserId);
            //unshift method to take currentUserId to the first element  
            membersInfor.unshift(myInfor);

            //check members whether are friends or not

            let membersInforWithCheckContactPromise = membersInfor.map(async member => {
                member = member.toObject();
                let checkContact = await contactModel.checkIsFriend(currentUserId, member._id);
                member.isFriend = false;
                if (checkContact.length) {
                    member.isFriend = true;
                }
                return member;
            })

            let membersInforWithCheckContact = await Promise.all(membersInforWithCheckContactPromise);

            resolve({
                group: getGroupInfor,
                members: membersInforWithCheckContact
            });
        } catch (error) {
            reject(error);
        }
    })
}

let getGroupInforAndAllMembers = (currentUserId) => {
    return new Promise ( async (resolve , reject ) => {
        try {
            currentUserId = currentUserId.toString();
            let getGroupsInfor = await chatGroupModel.getGroupsHaveCurrentUserId(currentUserId);
           
            let groupWithAllMembesInfo = getGroupsInfor.map( async group => {
                group = group.toObject();
                let idMembers = group.members.map( member => {
                    return member.userId ;
                })
                
                let membersInforInGroup = await userModel.findMembersByIdList(idMembers);
                let myInfor = "" ; 
                membersInforInGroup.forEach( (member,index) => {
                    if(member._id == currentUserId && index != 0){
                        myInfor = member ; 
                        membersInforInGroup.splice(index,1);
                        membersInforInGroup.unshift(myInfor);
                    }
                })
                let membersInforWithCheckContactPromise = membersInforInGroup.map(async member => {
                    member = member.toObject();
                    let checkContact = await contactModel.checkIsFriend(currentUserId, member._id);
                    member.isFriend = false;
                    if (checkContact.length) {
                        member.isFriend = true;
                    }
                    return member;
                })
                
                let membersInforWithCheckContact = await Promise.all(membersInforWithCheckContactPromise);
                //check Members are friend or not 

                group.membersInfor = membersInforWithCheckContact ;
                
                return group;       
            })
            
            resolve( await Promise.all(groupWithAllMembesInfo) );
        } catch (error) {
            reject(error);
        }
    })
}
module.exports = {
    addNewGroupChat: addNewGroupChat,
    getMembersInGroup: getMembersInGroup,
    getGroupInforAndAllMembers : getGroupInforAndAllMembers
}