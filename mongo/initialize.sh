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
 Users(first:1000){
    nodes{
      username,
      email,
      posts(first:10) {
         nodes{
          title
        }
      }
    }
  }
}

{
 Users(first:1000){
  nodes{
    username
  }
}
}

{
  Users{
    nodes {
      _id
      username
      email
    }
  }
}