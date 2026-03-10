# Book Management System

A Role-Based Book Management System is an automated software platform designed to manage library operations—cataloging, borrowing, returning, and inventory—by assigning specific access permissions to different user roles (e.g., Admin, Librarian, Member). This structure ensures security and operational efficiency by restricting functionality based on job responsibilitie

- Admin / Librarian :
  Possesses full control to manage the library inventory, add/remove/update book details

  ```
  "email": "librarian@admin.com"
  "password": "Admin@1234"
  ```

- Members (Students/Users): view book availability, and request or renew books, but cannot modify the database.

### Start with the Project

- Install :

```
npm install
```

- Start :

```
npm run dev
```

- Server Listen on :

```
http://localhost:5173/
```

### About the Project Tech (Frontend)

- Reactjs , typescript , tanstackQuery
