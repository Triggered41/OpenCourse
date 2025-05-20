import mongoose from 'mongoose'
import { courseModel, userModel, chapterModel, sectionModel, IChapter, ICourse } from './Models/models';

mongoose.connect('mongodb://127.0.0.1:27017/opencourse')


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
    const status: any = await course.save()
    if (status.code == 11000){
        console.error(status)
    }else{
        return status;
    }
}

export async function deleteCourse(UserName, CourseName) {
    const user = await getUser(UserName);
    const course = await courseModel.findOne({Author: user._id, Name: CourseName}, {_id: 1})
    const courseStatus = await courseModel.deleteOne({Author: user._id, Name: CourseName})
    const userStatus = await userModel.updateOne({_id: user._id}, { $pull: { Courses:  course._id}})
    return courseStatus && userStatus;
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

export async function getCourse(authorName, courseName, projections:{Name?: number, _id: number, Order?: number}={Name: 1, _id: 1}): Promise<ICourse>{
    const baseCourse = await userModel.aggregate([
        {$match: {UserName: authorName}},
        {$lookup: {from: 'courses', localField: 'Courses', foreignField: '_id', as: 'cs'}},
        {"$unwind": "$cs"},
        {"$match": {"cs.Name": courseName}}
    ])
    if (baseCourse.length == 0) return;
    const fullCourse = await courseModel.findOne(baseCourse[0].cs).populate({path: 'Chapters', options: { sort: {Order: 1} }, populate: {path: 'Sections', options: { sort: {Order: 1}}, select: projections}});
    console.log(fullCourse)
    return fullCourse;
}

export async function searchCourse(search_words:Array<String>) {
    const result = await courseModel.find({"$or": [{"Tags": {"$in": search_words}}, {"Name": {"$regex": search_words.join('|'), "$options": "i"}}]})
    return result
}

export async function updateCourse(userName, original, courseName, intro, chapters) {
    var newChapters = []
    const loopPromise = new Promise((res, rej)=>{
        Object.values(chapters).forEach(async (val: IChapter, i)=>{
        // Check if Chapter Exists
        if (val._id !== undefined){
            var temp = []
            val.Sections.forEach( (val, i)=>{
            console.log("Section:", val.Name, '=', i+1)
            temp.push(
                // Add or update section
                val._id !== undefined ?
                {
                    updateOne: {
                        filter: {_id: val._id},
                        update: { '$set': {Name: val.Name, Order: i+1}}
                    }
                }
                :
                {
                    insertOne: {
                        "document": {
                            Name: val.Name,
                            Order: i+1,
                            Content: '',
                        }
                    }
                }
            )
        })
        const status = await sectionModel.bulkWrite(temp)
        if (status.insertedCount !== 0){
            var sections_id = []
            for (let i = 1; i <= status.insertedCount; i++) {
                const id = status.insertedIds[i];
                sections_id.push(id)
            }
            console.log('Ids:', sections_id)
            await chapterModel.updateOne({ _id: val._id }, { "$push": { "Sections": { "$each": sections_id } } })
        }
    }else{
        // If Chapter Does not exist create new Chapter and new sections
        
        const sectionsOps = val.Sections.map((section, i)=>{
            console.log("Section:", section)
            return {
                insertOne: {
                    "document": {
                        Name: section.Name,
                        Order: i+1,
                        Content: ''
                    }
                }
            }

        })
        const secStatus = await sectionModel.bulkWrite(sectionsOps)
        var sectionsID = []
        for(let i = 0; i<secStatus.insertedCount; i++){
            const id = secStatus.insertedIds[i]
            sectionsID.push(id)
        }

        const newChapter = new chapterModel({ Name: val.Name, Order: i+1, Sections: sectionsID })
        newChapters.push(newChapter._id)
        await newChapter.save()
    }
    })
    })
    loopPromise.then(async ()=>{
        console.log("New Chap:", newChapters)
        const user = await userModel.findOne({UserName: userName});
        await courseModel.updateOne({Name: original, Author: user._id},
            {
                "$set": { Name: courseName, Intro: intro },
                "$push": { "Chapters": { "$each": newChapters } }
            }
        )
    })
    

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

export async function updateSection(id, Content){
    const status = await sectionModel.updateOne({_id: id}, {
        Content: Content
    })
    return status;
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