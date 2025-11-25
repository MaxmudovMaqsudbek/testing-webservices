import axios from "axios"
import { expect } from "chai"

const BASE_URL = "https://restful-booker.herokuapp.com";
axios.defaults.validateStatus = () => true;

describe("restful-booker API tests", () => {
    let token = "";
    let bookingId = "";

    it("should create an auth token", async()=>{
        const response = await axios.post(`${BASE_URL}/auth`, {
            username: "admin",
            password: "password123"
        },
          {
            headers: {
                "Content-Type": "application/json"
            }
      });

        expect(response.status).to.equal(200);
        expect(response.headers["content-type"]).to.include("application/json");
        expect(response.data).to.have.property("token");

        token = response.data.token;
    })

    it("should create a new booking", async()=>{
        const response = await axios.post(`${BASE_URL}/booking`,
         {
            firstname: "Jim",
            lastname: "Brown",
            totalprice: 111,
            depositpaid: true,
            bookingdates: {
                checkin: "2018-01-01",
                checkout: "2019-01-01"
            },
            additionalneeds: "Breakfast"
         },
        { 
            headers: { 
                "Content-Type": "application/json",
                 Accept: "application/json"
            }
        }
        );


        expect(response.status).to.equal(200);
        expect(response.headers["content-type"]).to.include("application/json");
        expect(response.data).to.have.property("bookingid");
        bookingId = response.data.bookingid;
    })

    it("should get the created booking", async()=>{
        const response = await axios.get(`${BASE_URL}/booking/${bookingId}`,
            {headers: { Accept: "application/json" }}
        );

        expect(response.status).to.equal(200);
        expect(response.headers["content-type"]).to.include("application/json");

        expect(response.data.firstname).to.equal("Jim");
        expect(response.data.lastname).to.equal("Brown");
    })

    it("should update the booking", async () => {
        const response = await axios.put(
        `${BASE_URL}/booking/${bookingId}`,
        {
            firstname: "James",
            lastname: "Bond",
            totalprice: 222,
            depositpaid: false,
            bookingdates: {
                checkin: "2020-01-01",
                checkout: "2021-01-01"
            },
            additionalneeds: "Dinner"
        },
        {
           headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Cookie: `token=${token}`
            }
        }
        );

        expect(response.status).to.equal(200);
        expect(response.data.firstname).to.equal("James");
        expect(response.data.lastname).to.equal("Bond");
  });

  it("should delete the booking", async () => {
        const response = await axios.delete(`${BASE_URL}/booking/${bookingId}`, {
        headers: {
            Cookie: `token=${token}`
        }
        });
        expect(response.status).to.be.oneOf([201, 200]);
  });   

  it("should return 404 when fetching deleted booking", async () => {
        const response = await axios.get(`${BASE_URL}/booking/${bookingId}`);

        expect(response.status).to.equal(404);
  });

})