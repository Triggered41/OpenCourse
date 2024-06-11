import mongoose from 'mongoose'
const ObjectId = mongoose.Types.ObjectId;

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

const courseSchema = new mongoose.Schema({
    Name: {type: String, unique: false},
    Intro: String,
    Author: {type: ObjectId, ref: 'users', required: true},
    Chapters: [{type: ObjectId, ref: 'chapters'}]
})
courseSchema.index({Name: 1, Author: 1}, {unique: true});

const chapterSchema = new mongoose.Schema({
    Name: String,
    Sections: [{type: ObjectId, ref: 'sections'}]
})

const sectionSchema = new mongoose.Schema({
    Name: String,
    Content: String
})

var userModel = null;
var courseModel = null;
var chapterModel = null;
var sectionModel = null;

mongoose.connect('mongodb://127.0.0.1:27017/opencourse')
.then(()=>{
    console.log("Successfully connected");
    userModel = mongoose.model("users", userSchema);
    courseModel = mongoose.model("courses", courseSchema);
    chapterModel = mongoose.model('chapters', chapterSchema);
    sectionModel = mongoose.model("sections", sectionSchema);
}
)

export async function register({Name, UserName, Password, Email}) {
    console.log("rec: ", Name, Password, Email);
    if (mongoose.connection){
        
        const user = new userModel({Name: Name, UserName: UserName, Password: Password, Email: Email});
        const status = await user.save()
        return status;
    }
}

export async function login({User, Password}){
    if(mongoose.connection == null) return;    
    if (User.includes('@')){
        return await userModel.findOne({Email: User, Password: Password}, {_id: 0, UserName: 1})
    }else{
        return await userModel.findOne({UserName: User, Password: Password}, {_id: 0, UserName: 1})
    }
}

export async function createCourse(name, intro, userID) {
    const course = await new courseModel({
        Name: name,
        Intro: intro,
        Author: userID
    })
    const status = await course.save()
    if (status.code == 11000){
        console.error(status)
    }else{
        return status;
    }
}

export async function saveCourse(Name) {
    if (mongoose.connection){
        
        const course = new courseModel({Name: Name});
        course.save().then(()=>{
            console.log("saved ", course)
        })
        const result = await course.id
        return result;
    }
}

export async function loadCourse(id) {
    if (mongoose.connection){
        const course = await courseModel.findById(id);
        return course;
    }
}

export function addChapter(Id, Name) {
    if (mongoose.connection == null) return;
    
    
    const chapter = new chapterModel({Name: Name})
    chapter.save()
    .then(()=>{
        
        courseModel.findByIdAndUpdate(Id, {$push: {Sections: chapter._id}})
        .then((e)=>{
            console.log("E: ", e, typeof(e));
        });
    })
}

export async function getCourse(authorName, courseName, projections={Name: 1}) {
    const baseCourse = await userModel.aggregate([
        {$match: {UserName: authorName}},
        {$lookup: {from: 'courses', localField: 'Courses', foreignField: '_id', as: 'cs'}},
        {"$unwind": "$cs"},
        {"$match": {"cs.Name": courseName}}
    ])
    if (baseCourse.length == 0) return false;
    const fullCourse = await courseModel.findOne(baseCourse[0].cs).populate({path: 'Chapters', populate: {path: 'Sections', select: projections}});
    return fullCourse;
}

export async function getUser(userName, projection={}, selection='') {
    const user = await userModel
    .findOne({UserName: userName}, projection)
    .populate({path: 'Courses', select: selection});
    return user;
}

export async function getChapters(ChapterIds) {
    
    const chapters = await chapterModel.find({"_id":ChapterIds})
    return chapters
}

export async function getChapter(id){
    
    const chapter =  await chapterModel.findById(id);
    return chapter;
}

export async function getSections(sectionIds, projection){
    
    const sections = await sectionModel.find({"_id": sectionIds}, projection);
    return sections;
}

export async function getSection(id) {
    
    const section = await sectionModel.findById(id)
    return section;
}

export async function updateUser(userID, courseID){
    const updatedUser = await userModel.updateOne({_id: userID}, {"$push": {Courses: courseID}})
    return updatedUser;
}

// module.exports = {
//     register,
//     login,
//     saveCourse,
//     loadCourse,
//     addChapter,
//     getChapter,
//     getChapters,
//     getSections
// }