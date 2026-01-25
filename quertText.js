// db.students.insertMany([
//     {_id : 1,age: 24,name : 'Pragnesh',dob:'2001-03-19',phone: '1234567890',address:'12 Lily Street'
//     },
//     {_id: 2,age: 25,name: 'Rahul',dob: '1996-09-20',phone: '987-654-3210', address:'15 Lotus Lane'
//     },
//     {_id: 3,age: 26, name:'Priya', dob:'1999-04-12', phone:'555-123-4567', address:'42 Tulip Road'
//     },
//     {_id: 4,age: 27, name:'Amit', dob:'1997-07-05', phone:'789-456-1230', address:'88 Rose Street'
//     }
// ]
// )

// var myCursor = db.students.find({_id: 3
// }).pretty()

// var myCursor2 = db.students.find({_id: {$gt: 1
//     }
// });
// while(myCursor2.hasNext()){
//     print(myCursor2.next());
// }

// var myCursor2 = db.students.find({_id: {$gt: 1
//     }
// });
// myCursor2.forEach(printjson);


db.students.updateOne({
    _id: 1
},
    {
        $set: {
            "grades.$[elem].score": 85
        }
    },
    {
        arrayFilters:
            [
                {
                    "elem.subject": {
                        $eq: "Maths"
                    }
                }
            ]
    })

db.students.find({
    arrayFilters:
        [
            {
                "elem.score": {
                    $ne: 85
                }
            }

        ]

})

db.students.find({ "grades.score": { $ne: 85 } }); //HR //Testing

db.Employees.insertMany([
    {
        _id: 1, name: 'Rohit', department: "Development", age: 24, firstSalary: 25000, secondSalary: 28000
    },
    {
        _id: 2, name: 'Amu', department: "Development", age: 27, firstSalary: 30000, secondSalary: 35000
    },
    {
        _id: 3, name: 'Sumit', department: "HR", age: 20, salary: { firstMonth: 40000, secondMonth: 40000, thirdMonth: 40000 }
    },
    {
        _id: 4, name: 'Priya', department: "Testing", age: 27, projectStartDate:new Date(),projectEndDate:Date()

    }
]
)

db.Employees.insertOne({
        _id: 6, name: 'Priya', department: "Testing", age: 27, projectStartDate:new Date(),projectEndDate:Date()

})

db.Employees.aggregate([
    {$match:{department:"Development"}},
    {$project:{_id:1,name:1,
        totalSalary:{$add:["$firstSalary","$secondSalary"]}}
    }
])

db.Employees.aggregate([
    {$match:{department:"HR"}},
    {$project:{_id:1,department:1,
        quaterlySalary:{$add:["$salary.firstMonth","$salary.secondMonth","$salary.thirdMonth"]}}
    }
])

db.Employees.aggregate([
    {$match:{age:27}},
    {$project:{_id:1,name:1,department:1,
        salarySum:{$add:["$firstSalary","$secondSalary"]}
    }}
])

db.Employees.aggregate([
    {$match:{department:"Development"}},
    {$project:{_id:1, name:1,
        newSalary:{$multiply:["$firstSalary",2]}}}
])


