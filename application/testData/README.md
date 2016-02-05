Execute the following to showcase some of the functionality of this service.

```
curl -X POST -H "Content-Type: application/json" http://localhost:3000/slide/new -d @insert.json
curl -X POST -H "Content-Type: application/json" http://localhost:3000/slide/new -d @insert.json
curl -X POST -H "Content-Type: application/json" http://localhost:3000/slide/new -d @insert.json
# will be successfull
curl -X POST -H "Content-Type: application/json" http://localhost:3000/slide/new -d @update.json
# will fail

curl -X GET -H "Accept: application/json" http://localhost:3000/slide/1
# will be successfull (remember output)

curl -X PUT -H "Content-Type: application/json" http://localhost:3000/slide/1 -d @update.json
# will be successfull

curl -X GET -H "Accept: application/json" http://localhost:3000/slide/:id
# will be successfull (compare output to the remembered one)

```
