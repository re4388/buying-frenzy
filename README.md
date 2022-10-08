

## Local development

```bash

## env
node.js 14.x

# install project dependencies
$ npm install

# use the local .env
cp .local.docker.env .env

# spin up a docker compose with a sql in docker (need to have Docker installed)
npm run start:dev:db

# run up the project
$ npm run start


# Visit API page to try out!
http://localhost:3001/api


```

##  API Documentation

### App is deployed in aws ec2

```bash
https://buyingfrenzy-app.herokuapp.com/api
```



### 1. Health check.

```http
GET /api/healthCheck
```



---

### 2.List all the restaurants which are open in the given time

```http
GET /all?opens_at=2022-07-23%2020%3A00%3A00
```

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `opens_at` | `Date` | **Required**. Datetime |



---


### 3.List top y restaurants that have more or less than x number of dishes within a price range, ranked alphabetically. More or less (than x) is a parameter that the API allows the consumer to enter.

```http
GET /api/restaurant/filter-by-price?from_price=15&to_price=25&dishes=3&operation=min
```

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `from_price` | `number` | **Required**. |
| `to_price` | `number` | **Required**. |
| `dishes` | `number` | **Required**. |
| `operation` | `string` | **Required**. Either "min" or "max" |



---

### 4.Search restaurant or dishes by name, rank

```http
GET /api/restaurant/search-by-keyword?keyword=La&type=restaurant
```


| Parameter | Type | Description |
| :--- | :--- | :--- |
| `keyword` | `string` | **Required**. |
| `type` | `string` | **Required**. Either "restaurant" or "dish" |




---



### 5.Process a user purchasing a dish from a restaurant, handling all relevant data changes in an atomic transaction. 



```http
POST /api/purchase-order/place-order
```

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `user_id` | `string` | **Required**. |
| `dish_id` | `string` | **Required** |



