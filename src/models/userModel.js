import mongoose from "mongoose";
import bcrypt from "bcrypt";
let Schema = mongoose.Schema;

let userSchema = new Schema({
    username: String,
    gender: { type: String, default: "Male" },
    phone: { type: String, default: null },
    address: { type: String, default: null },
    avatar: { type: String, default: "avatar-default.jpg" },
    role: { type: String, default: "user" },
    local: {
        email: { type: String, trim: true },
        password: String,
        isActive: { type: Boolean, default: false },
        verifyToken: String
    },
    facebook: {
        uid: String,
        token: String,
        email: { type: String, trim: true }
    },
    google: {
        uid: String,
        token: String,
        email: { type: String, trim: true }
    },
    createdAt: { type: Number, default: Date.now },
    updatedAt: { type: Number, default: null },
    deletedAt: { type: Number, default: null }
})

userSchema.statics = {
    createNew(item) {
        return this.create(item);
    },
    findEmail(email) {
        return this.findOne({ "local.email": email }).exec()
    },

    removeById(id) {
        return this.findByIdAndRemove(id).exec();
    },

    findByToken(token) {
        return this.findOne({ "local.verifyToken": token }).exec()
    },

    verify(token) {
        return this.findOneAndUpdate({ "local.verifyToken": token }, { "local.isActive": true, "local.verifyToken": null }).exec();
    },

    findUserByIdToUpdatePassword(id) {
        return this.findById(id).exec();
    },

    findUserByIdForSessionToUse(id) {
        return this.findById(id, { "local.password": 0 }).exec();
    },
    findByFacebookUid(uid) {
        return this.findOne({ "facebook.uid": uid }).exec();
    },
    findByGoogleUid(uid) {
        return this.findOne({ "google.uid": uid }).exec();
    },
    updateUser(id, item) {
        return this.findByIdAndUpdate(id, item).exec(); //return old item after update
    },
    updatePassword(id, hashedPassword) {
        return this.findByIdAndUpdate(id, { "local.password": hashedPassword }).exec();
    },
    /**
     * 
     * @param {array: deprecated Userid} deprecatedUserIds 
     * @param {String: keyword Search } keyword 
     */
    findAllForAddContact(deprecatedUserIds, keyword) {
        return this.find({
            $and: [
                { "_id": { $nin: deprecatedUserIds } },
                { "local.isActive": true },
                {
                    $or: [
                        { "username": { "$regex": new RegExp(keyword, "i") } },
                        { "local.email": { "$regex": new RegExp(keyword, "i") } },
                        { "facebook.email": { "$regex": new RegExp(keyword, "i") } },
                        { "google.email": { "$regex": new RegExp(keyword, "i") } }
                    ]
                }
            ]
        }, { _id: 1, username: 1, address: 1, avatar: 1 }).exec();
    },
    getNormalUserDataById(id) {
        return this.findById(id, { username: 1, avatar: 1, address: 1, _id: 1 }).exec();
    },
    findAllFriendsById(id) {
        return this.findById(id, { "local.password": 0 }).exec();
    },
    seachFriends(listId, keyword) {
        return this.find({
            $and: [
                { "_id": { $in: listId } },
                { "local.isActive": true },
                {
                    $or: [
                        { "username": { "$regex": new RegExp(keyword, "i") } },
                        { "local.email": { "$regex": new RegExp(keyword, "i") } },
                        { "facebook.email": { "$regex": new RegExp(keyword, "i") } },
                        { "google.email": { "$regex": new RegExp(keyword, "i") } }
                    ]
                }
            ]
        }, { username: 1, _id: 1, address: 1, avatar: 1 }).exec();
    },
    findUserContactAtNavbar(listId, keyword) {
        return this.find({
            $and: [
                { "_id": { $in: listId } },
                { "local.isActive": true },
                {
                    $or: [
                        { "username": { "$regex": new RegExp(keyword, "i") } },
                        { "local.email": { "$regex": new RegExp(keyword, "i") } },
                        { "facebook.email": { "$regex": new RegExp(keyword, "i") } },
                        { "google.email": { "$regex": new RegExp(keyword, "i") } }
                    ]
                }
            ]
        }, { "local.password": 0, "local.verifyToken": 0 }).exec();
    },
    findMembersByIdList(listId) {
        return this.find({
            "_id": { $in: listId }
        }, { username: 1, avatar: 1, address: 1, gender: 1, phone: 1, "local.email": 1 }).exec();
    }
};

userSchema.methods = {
    ComparePassword(password) {
        return bcrypt.compare(password, this.local.password);
    }
};

module.exports = mongoose.model("user", userSchema)