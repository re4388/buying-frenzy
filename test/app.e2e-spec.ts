import * as request from 'supertest';

describe('App (e2e)', () => {
  const APP_URL = `http://localhost:${process.env.APP_PORT}`;

  it('GET /api/healthCheck', async function () {
    const response = await request(APP_URL)
      .get('/api/healthCheck')
    expect(response.status).toEqual(200);
    expect(response.text).toEqual("Hello World!");
  });

  it('GET /api/v1/restaurant/all', async function () {
    const response = await request(APP_URL)
      .get('/api/v1/restaurant/all?opens_at=2022-07-23%204%3A00%3A00')
    expect(response.status).toEqual(200);
    expect(JSON.parse(response.text)[0].name).toEqual("Naan 'N' Curry");
  });

  it('GET /api/v1/restaurant/filter-by-price', async function () {
    const response = await request(APP_URL)
      .get('/api/v1/restaurant/filter-by-price?from_price=10&to_price=10.8&dishes=10&operation=min')

    const restaurant0 = "Bramble & Hare"
    const restaurant1 = "Three's Bar & Grill"

    expect(response.status).toEqual(200);
    expect(JSON.parse(response.text)[0].name).toEqual(restaurant0);
    expect(JSON.parse(response.text)[1].name).toEqual(restaurant1);
  });

  it('GET /api/v1/restaurant/search-by-keyword when type=dish', async function () {
    const response = await request(APP_URL)
      .get('/api/v1/restaurant/search-by-keyword?keyword=apple%20pie&type=dish')

    const dishName0 = "Apple Pie"

    expect(response.status).toEqual(200);
    expect(JSON.parse(response.text)[0].Dish_name).toEqual(expect.stringContaining(dishName0));
    expect(JSON.parse(response.text).length).toEqual(14);
  });

  it('GET /api/v1/restaurant/search-by-keyword when type=restaurant', async function () {
    const response = await request(APP_URL)
      .get('/api/v1/restaurant/search-by-keyword?keyword=apple&type=restaurant')

    const restaurantName0 = "Pineapple Grill at Kapalua"
    const restaurantName1 = "The Pineapple Room by Alan Wong"

    expect(response.status).toEqual(200);
    expect(JSON.parse(response.text)[0].Restaurant_name).toEqual(restaurantName0);
    expect(JSON.parse(response.text)[1].Restaurant_name).toEqual(restaurantName1);
    expect(JSON.parse(response.text).length).toEqual(2);
  });


  it('POST /api/v1/purchase-order', async function () {
    const responseDish = await request(APP_URL)
      .get('/api/internal/dish/search-by-keyword?keyword=Apple%20Pie%20Ala%20Mode')

    const dishName = "Apple Pie Ala Mode"
    const personName = "Ben Peterson"

    expect(responseDish.status).toEqual(200);
    expect(JSON.parse(responseDish.text)[0].Dish_name).toEqual(dishName);

    const responseUser = await request(APP_URL)
      .get('/api/internal/user/search-by-keyword?keyword=Ben%20Peterson')
    expect(responseUser.status).toEqual(200);
    expect(JSON.parse(responseUser.text)[0].User_name).toEqual(personName);

    let userID = JSON.parse(responseUser.text)[0].User_id
    let dishID = JSON.parse(responseDish.text)[0].Dish_id

    const responsePurchasingOrder = await request(APP_URL)
      .post('/api/v1/purchase-order')
      .send({ user_id: userID, dish_id: dishID })
      .expect(200)

    expect(JSON.parse(responsePurchasingOrder.text).dish_name).toEqual(dishName);
  });
});



