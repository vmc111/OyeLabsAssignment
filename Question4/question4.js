// 4. Create a new object which have all the properties of object person and student

const person = {
  id: 2,
  gender: "mail",
};

const student = {
  name: "ravi",
  email: "ravi11@yopmail.com",
};

const newObject = {
  ...person,
  ...student,
};

console.log(newObject);
