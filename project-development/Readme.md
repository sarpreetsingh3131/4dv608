# How to run
1. Run API server with following commands:
   - `cd statistics-calendar-api/`
   - `docker-compose build`
   - `docker-compose up` 

   Server will be running on http://localhost:3000

2. Run web app with following commands:
   - `cd statistics-calendar-web-app/`
   - `docker-compose build`
   - `docker-compose up` 

   Web app will be running on http://localhost:4000

---
## API

**Log In**
---
* **URL** `http://localhost:3000/api/login`
* **Method:** `GET`
* **Response:** 
```json
{
    "url": "google oAuth url"
}
```

---
**Log Out**
---
* **URL** `http://localhost:3000/api/logout`
* **Method:** `GET`
* **Headers:** `Authorization: <token>`
* **Response:** 
```json
{
    "message": "logged out"
}
```

---
**Get Token**
---
* **URL** `http://localhost:3000/api/token?code=<code_from_login_url>`
* **Method:** `GET`
* **Response:** 
```json
{
    "access_token": "token",
    "expires_in": 3600,
    "id_token": "token id",
    "refresh_token": "refresh token id",
    "token_type": "Bearer"
}
```

---
**Get User Info**
---
* **URL** `http://localhost:3000/api/user/info`
* **Method:** `GET`
* **Response:** 
```json
{
    "email": "user email",
    "email_verified": true,
    "family_name": "user family name",
    "given_name": "name given name",
    "locale": "user locale",
    "name": "user name",
    "picture": "user picture url",
    "profile": "user profile url",
    "sub": "user sub id"
}
```

---
**Get Calendars**
---
* **URL** `http://localhost:3000/api/calendars`
* **Method:** `GET`
* **Headers:** `Authorization: <token>`
* **Response:** 
```json
[
    {
        "id": "calendar id",
        "accessRole": "calendar access, i.e., owner, reader, or writer",
        "summary": "calendar name",
        "timeZone": "calendar time zone"
    },
    ...
]
```

---
**Get Calendar Events**
---
* **URL** `http://localhost:3000/api/calendars/<calendar_id>/events`
* **Method:** `GET`
* **Headers:** `Authorization: <token>`
* **Response:** 
```json
[
    {
        "id": "event id",
        "start": {
            "dateTime": "event start date time"
        },
        "end": {
            "dateTime": "event end date time"
        },
        "extendedProperties": {
            "private": {
                "budget": "event budget",
                "keyword": "event keyword"
            }
        },
        "summary": "event name",
    },
    ...
]
```

---
**Add Budget/Keyword to Event**
---
* **URL** `http://localhost:3000/api/calendars/<calendar_id>/events/<event_id>/properties`
* **Method:** `PATCH`
* **Headers:** `Content-Type: application/json, Authorization: <token>`
* **Body:** 
```json
{
    "budget": 10,
    "keyword": "study"
}
```
* **Response:**
```json
    {
        "id": "event id",
        "start": {
            "dateTime": "event start date time"
        },
        "end": {
            "dateTime": "event end date time"
        },
        "extendedProperties": {
            "private": {
                "budget": 10,
                "keyword": "study"
            }
        },
        "summary": "event name",
    },
```
* **Note:** In request body, it is not required to provide both `budget` and `keyword` properties. Only the one that is provided, will be updated/added. 

---
**Get Statistics (Time Spent on Events)**
---
* **URL** `http://localhost:3000/api/calendars/<calendar_id>/events/statistics/time-spent?timeMin=<min_date_time>&timeMax=<max_date_time>`
* **Method:** `GET`
* **Headers:** `Authorization: <token>`
* **Response:**

![](https://raw.githubusercontent.com/sarpreetsingh3131/4dv608/master/time-spent.png?token=ARdJ9rmxsKjQAx10NNkw_zL3ci-lveS2ks5co50bwA%3D%3D)

* **Note:** If `timeMin` and `timeMax` is not provided, the picture will show the statistics of all the events present in the given calendar. The time must be provided in this format: `YYYY-MM-DDTHH:MM:SS.ZONE`

---
**Get Statistics (Used and Remaining Budget)**
---
* **URL** `http://localhost:3000/api/calendars/<calendar_id>/events/statistics/used-remaining-budget?timeNow=<date_time_now>`
* **Method:** `GET`
* **Headers:** `Authorization: <token>`

* **Response:**

![](https://raw.githubusercontent.com/sarpreetsingh3131/4dv608/master/used-remaining-budget.png?token=ARdJ9iQAu8twexbRjcAE4DJEqxpOG80_ks5co50xwA%3D%3D)

* **Note:** `timeNow` should provide the current time of user. It must be provided in this format: `YYYY-MM-DDTHH:MM:SS.ZONE`