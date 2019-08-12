import mongoose from "mongoose";
import { app } from "./../config/app"
let Schema = mongoose.Schema;

let chatGroupSchema = new Schema({
    name: String,
    userAmount: { type: Number, min: 3, max: 199 },
    messageAmount: { type: Number, default: 0 },
    userId: String,
    members: [
        { userId: String }
    ],
    avatar: { type: String, default: app.group_chat_avatar_default },
    createdAt: { type: Number, default: Date.now },
    updatedAt: { type: Number, default: Date.now },
    deletedAt: { type: Number, default: null }
})

chatGroupSchema.statics = {
    createNew(item) {
        return this.create(item)
    },
    /**
     * get chat group items by userId and Limit
     * @param {string} userId current userId
     * @param {number} limit 
     */
    getChatGroups(userId, limit) {
        return this.find({
            "members": { $elemMatch: { "userId": userId } }
        }).sort({ "updatedAt": -1 }).limit(limit).exec();
    },
    getChatGroupById(groupId) {
        return this.findById(groupId).exec();
    },
    updateWhenHasNewMessage(id, newMessageAmount) {
        return this.findByIdAndUpdate(id, {
            "messageAmount": newMessageAmount,
            "updatedAt": Date.now()
        }).exec();
    },
    getChatGroupIdsByUser(userId) {
        return this.find({
            "members": { $elemMatch: { "userId": userId } }
        }, { _id: 1 }).exec();
    },
    readMoreChatsGroup(userId, skipGroup, limit) {
        return this.find({
            "members": { $elemMatch: { "userId": userId } }
        }).sort({ "updatedAt": -1 }).skip(skipGroup).limit(limit).exec();
    },
    getMembersInGroup(groupId) {
        return this.findById(groupId, { "members.userId": 1, _id: 0 }).exec();
    }
}
module.exports = mongoose.model("chat-group", chatGroupSchema)