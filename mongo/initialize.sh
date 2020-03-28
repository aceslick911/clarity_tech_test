 use testdb
 show tables
 db.getCollection("users").find()
 db.people.save({firstname: "angelo", lastname: "perera"})
 db.people.save({firstname: "debbie", lastname: "govorcin"})
 db.people.find({ firstname:"angelo"})
 


 Graphql:

Return first:   
{
  User {
    username
    email
  }
}

Return all:
{
  Users{
    nodes {
      _id
      username
      email
    }
  }
}