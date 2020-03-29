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
  Suppliers(first: 1000) {
    nodes {
     name,
      number,
      messages_sent,
      messages_recv,
      workorders(first:100){
        nodes{
          description,
          date_due,
          date_completed,
          priority,
          report_provided
        }
      },
      services(first:100){
        nodes{
          name,
          description
        }
      }
    }
  },
}


{
  Suppliers(first: 1000) {
    nodes {
     name,
      number,
      messages_sent,
      messages_recv,
      workorders(first:100){
        nodes{
          description,
          date_due,
          date_completed,
          priority,
          report_provided
        }
    	}
    }
  },
}




{
  Suppliers(first: 1000) {
    nodes {
     name,
      number,
      messages_sent,
      messages_recv
    
    }
  },
  WorkOrders(first: 1000){
    nodes{
      description,
      date_due,
      date_completed,
      priority,
      report_provided
    }
  }
}


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