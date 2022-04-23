# Sermon Cpanel

#### Control Panel for backend of https://delhicfc.com
#### hosted at https://sermon-cpanel.herokuapp.com

## Environment variables
```
MYSQL_HOST
MYSQL_USER
MYSQL_DB
MYSQL_PASSWORD
PASSWORD
```

## API documentation
### Main Page
GET /api/main/?perpage=(items per page)&?page=(page no)
```
{
    "videos": [
        {
            "_id": "(mongodb id)",
            "date": "UTC date formant",
            "category": "category",
            "speaker": "speaker",
            "title": "title",
            "link": "youtube link for msg"
        },...
    ]
}
```

### Sermon Page
GET /api/sermon/:id(mongodb id of sermon)
```
{
    "video": {
        "_id": "(mongodb id)",
            "date": "UTC date formant",
            "category": "category",
            "speaker": "speaker",
            "title": "title",
            "link": "youtube link for msg"
    }
}
```