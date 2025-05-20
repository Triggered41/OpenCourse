import mongoose, { ObjectId } from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

interface IUser{
    _id: ObjectId,
    Name: String,
    UserName: String,
    Email: String,
    Password: String,
    Course: [ICourse]
}

export interface ICourse{
    _id: ObjectId,
    Name: String,
    Intro: String,
    Tags: [String],
    Author: IUser,
    Chapters: [IChapter]
}

export interface IChapter{
    _id: ObjectId,
    Name: String,
    Order: Number,
    Sections: [ISection]
}

interface ISection{
    _id: ObjectId,
    Name: String,
    Order: String,
    Content: String
}

const userSchema = new mongoose.Schema({
    // User Credentials
    Name: {type: String, required: true},
    UserName: {type: String, unique: true, required: true},
    Email: {type: String, unique: true, required: true, collation: {strength: 1}},
    Password: {type: String, required: true, select: false},

    // User Data
    Courses: [{type: ObjectId, ref: 'courses'}]
    
})
// userSchema.index({UserName: 1, Courses: 1}, {unique: true});

const courseSchema = new mongoose.Schema<ICourse>({
    Name: {type: String, unique: false},
    Intro: String,
    Tags: [String],
    Author: {type: ObjectId, ref: 'users', required: true},
    Chapters: [{type: ObjectId, ref: 'chapters'}]
})
courseSchema.index({Name: 1, Author: 1}, {unique: true});

const chapterSchema = new mongoose.Schema({
    Name: String,
    Order: Number,
    Sections: [{type: ObjectId, ref: 'sections'}]
})

const sectionSchema = new mongoose.Schema({
    Name: String,
    Order: Number,
    Content: String
})

export const userModel = mongoose.model("users", userSchema);
export const courseModel = mongoose.model("courses", courseSchema);
export const chapterModel = mongoose.model('chapters', chapterSchema);
export const sectionModel = mongoose.model("sections", sectionSchema);